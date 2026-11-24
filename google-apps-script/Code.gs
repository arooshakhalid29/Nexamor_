/**
 * Nexamor Website Booking & Project Brief Backend (Google Apps Script)
 *
 * Connected to:
 *   - Google Calendar (via built-in CalendarApp — no Advanced Service needed)
 *   - Gmail / MailApp
 *
 * Deployment settings:
 *   Deploy -> New deployment -> Web app
 *   - Execute as: Me (the Google account that owns the calendar)
 *   - Who has access: Anyone
 */

var CONFIG = {
  // Both addresses receive every booking notification and project brief
  RECIPIENTS: ['arooshakhalid6@gmail.com', 'nexamor1@gmail.com'],

  // Email address used as reply-to on visitor confirmation emails
  PUBLIC_REPLY_EMAIL: 'nexamor1@gmail.com',

  // Business timezone used to store bookings and define working hours.
  // Use 'Australia/Sydney' for Sydney/Melbourne time (AEST/AEDT),
  // or 'Australia/Brisbane' for fixed AEST year-round.
  BUSINESS_TIMEZONE: 'Australia/Sydney',

  // Availability rules (24-hour clock in BUSINESS_TIMEZONE)
  // 9 am to 6 pm => last 30-minute slot starts at 17:30
  WORK_START_HOUR: 9,
  WORK_START_MINUTE: 0,
  WORK_END_HOUR: 18,
  WORK_END_MINUTE: 0,
  SLOT_MINUTES: 30,

  // Days open: 0 = Sunday, 1 = Monday, ..., 6 = Saturday (7 days a week)
  AVAILABLE_DAYS: [0, 1, 2, 3, 4, 5, 6],

  // Minimum notice required before a call can be booked (hours)
  MIN_NOTICE_HOURS: 2,

  // Calendar to check and book into ('primary' = owner's main Google Calendar)
  CALENDAR_ID: 'primary',

  // Spam protection: max submissions per email/IP window in seconds
  RATE_LIMIT_WINDOW_SECONDS: 60,
  MAX_FIELD_LENGTH: 2000,
};

/**
 * Handles GET requests:
 *   - ?action=slots&date=YYYY-MM-DD[&tz=IANA_TZ]
 *   - ?action=month&month=YYYY-MM[&tz=IANA_TZ]
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = String(params.action || 'slots').trim();

    if (action === 'slots') {
      var dateStr = String(params.date || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return jsonResponse({
          ok: false,
          error: 'Invalid or missing date parameter (expected YYYY-MM-DD).',
        });
      }
      var visitorTz = normalizeTimezone(params.tz || CONFIG.BUSINESS_TIMEZONE);
      var slots = getAvailableSlotsForVisitorDate(dateStr, visitorTz);
      return jsonResponse({
        ok: true,
        date: dateStr,
        timezone: visitorTz,
        businessTimezone: CONFIG.BUSINESS_TIMEZONE,
        slots: slots,
      });
    }

    if (action === 'month') {
      var monthStr = String(params.month || '').trim();
      if (!/^\d{4}-\d{2}$/.test(monthStr)) {
        return jsonResponse({
          ok: false,
          error: 'Invalid or missing month parameter (expected YYYY-MM).',
        });
      }
      var monthTz = normalizeTimezone(params.tz || CONFIG.BUSINESS_TIMEZONE);
      var availableDates = getAvailableDatesForMonth(monthStr, monthTz);
      return jsonResponse({
        ok: true,
        month: monthStr,
        timezone: monthTz,
        availableDates: availableDates,
      });
    }

    if (action === 'ping') {
      var hasCal = Boolean(getTargetCalendar());
      return jsonResponse({
        ok: true,
        service: 'Nexamor Booking API',
        version: '2.0',
        calendarConnected: hasCal,
      });
    }

    return jsonResponse({ ok: false, error: 'Unsupported action.' });
  } catch (err) {
    Logger.log('doGet error: ' + (err && err.stack ? err.stack : err));
    return jsonResponse({
      ok: false,
      error: 'Could not load availability. Please try again shortly.',
    });
  }
}

/**
 * Handles POST requests (sent with Content-Type: text/plain to avoid CORS preflight):
 *   - action=book
 *   - action=brief
 */
function doPost(e) {
  var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '';
  var payload = {};

  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch (parseErr) {
    Logger.log('doPost JSON parse error: ' + parseErr);
    return jsonResponse({ ok: false, error: 'Invalid request payload.' });
  }

  // Honeypot check: bots often fill hidden fields
  if (payload.honeypot && String(payload.honeypot).trim() !== '') {
    Logger.log('Honeypot triggered; ignoring submission.');
    return jsonResponse({ ok: false, error: 'Submission rejected.' });
  }

  var action = String(payload.action || '').trim();

  if (action === 'book') {
    return handleBookCall(payload);
  }

  if (action === 'brief') {
    return handleProjectBrief(payload);
  }

  return jsonResponse({ ok: false, error: 'Unsupported action.' });
}

/**
 * Handles a 30-minute call booking with LockService double-booking protection.
 */
function handleBookCall(payload) {
  var lock = LockService.getScriptLock();

  try {
    var name = cleanSingleLine(payload.name, 120);
    var email = cleanSingleLine(payload.email, 160).toLowerCase();
    var phone = cleanSingleLine(payload.phone, 40);
    var location = String(payload.location || 'google-meet').trim();
    var notes = cleanMultiLine(payload.notes, CONFIG.MAX_FIELD_LENGTH);
    var startIso = String(payload.startTime || payload.startIso || '').trim();
    var visitorTz = normalizeTimezone(payload.timezone || CONFIG.BUSINESS_TIMEZONE);

    // Basic validation
    if (!name || name.length < 2) {
      return jsonResponse({ ok: false, error: 'Please enter your name.' });
    }
    if (!isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (location !== 'google-meet' && location !== 'phone') {
      return jsonResponse({ ok: false, error: 'Please choose Google Meet or phone call.' });
    }
    if (location === 'phone' && !phone) {
      return jsonResponse({ ok: false, error: 'Please enter a phone number for the call.' });
    }
    if (!startIso) {
      return jsonResponse({ ok: false, error: 'Please select a time slot.' });
    }

    var slotStart = new Date(startIso);
    if (isNaN(slotStart.getTime())) {
      return jsonResponse({ ok: false, error: 'Invalid start time.' });
    }
    var slotEnd = new Date(slotStart.getTime() + CONFIG.SLOT_MINUTES * 60000);

    // Rate limit check per email
    if (isRateLimited('book:' + email)) {
      return jsonResponse({
        ok: false,
        error: 'Please wait a minute before submitting another booking.',
      });
    }

    // Verify slot falls within business hours, open days, and 2-hour minimum notice
    if (!isValidBusinessSlot(slotStart)) {
      return jsonResponse({
        ok: false,
        error: 'That slot is outside available hours or within the 2-hour notice window.',
      });
    }

    // Acquire lock to prevent race-condition double bookings
    lock.waitLock(15000);

    var busyIntervals = getBusyIntervals(
      new Date(slotStart.getTime() - 60000),
      new Date(slotEnd.getTime() + 60000)
    );
    if (hasOverlap(slotStart.getTime(), slotEnd.getTime(), busyIntervals)) {
      return jsonResponse({
        ok: false,
        error: 'That time was just taken, please pick another.',
      });
    }

    // Build event description
    var descriptionLines = [
      'Booked via Nexamor website',
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (phone || 'Not provided'),
      'Location preference: ' + (location === 'google-meet' ? 'Google Meet' : 'Phone call'),
      'Visitor timezone: ' + visitorTz,
    ];
    if (notes) {
      descriptionLines.push('', 'Additional notes:', notes);
    }

    var calendar = getTargetCalendar();
    if (!calendar) {
      throw new Error('Could not access Google Calendar.');
    }

    var eventTitle = '30-minute call: ' + name + ' (Nexamor)';
    var eventLocation =
      location === 'google-meet' ? 'Google Meet' : 'Phone call: ' + phone;

    var createdEvent = calendar.createEvent(eventTitle, slotStart, slotEnd, {
      description: descriptionLines.join('\n'),
      location: eventLocation,
      guests: email,
      sendInvites: true,
    });

    var auYear = Utilities.formatDate(slotStart, CONFIG.BUSINESS_TIMEZONE, 'yyyy');
    var auMonth = Utilities.formatDate(slotStart, CONFIG.BUSINESS_TIMEZONE, 'M');
    var auDay = Utilities.formatDate(slotStart, CONFIG.BUSINESS_TIMEZONE, 'd');
    var eventLink =
      'https://calendar.google.com/calendar/r/day/' + auYear + '/' + auMonth + '/' + auDay;

    // Format date & time in both visitor timezone and Australian time
    var visitorDateStr = Utilities.formatDate(slotStart, visitorTz, 'EEEE, d MMMM yyyy');
    var visitorTimeStr =
      Utilities.formatDate(slotStart, visitorTz, 'h:mm a') +
      ' - ' +
      Utilities.formatDate(slotEnd, visitorTz, 'h:mm a');
    var auDateTimeStr =
      Utilities.formatDate(slotStart, CONFIG.BUSINESS_TIMEZONE, 'EEE d MMM yyyy, h:mm a') +
      ' (' +
      CONFIG.BUSINESS_TIMEZONE +
      ')';

    // 1. Send confirmation email to visitor
    var visitorSubject = 'Confirmed: 30-minute call with Nexamor on ' + visitorDateStr;
    var visitorLocationLine =
      location === 'google-meet'
        ? "Location: Google Meet (we'll meet you at that time and send joining details if needed)"
        : "Location: Phone call — we'll call you on " + phone;

    var visitorBody = [
      'Hi ' + name + ',',
      '',
      "Your 30-minute call with Danesh at Nexamor is confirmed. We'll meet you at that time.",
      '',
      'Date: ' + visitorDateStr,
      'Time: ' + visitorTimeStr + ' (' + visitorTz + ')',
      visitorLocationLine,
      notes ? 'Your notes: ' + notes : '',
      '',
      'Need to reschedule or add anything beforehand? Just reply directly to this email.',
      '',
      'Talk soon,',
      'Danesh',
      'Nexamor · nexamor1@gmail.com · 0435 758 455',
    ]
      .filter(function (line) {
        return line !== '';
      })
      .join('\n');

    MailApp.sendEmail({
      to: email,
      subject: visitorSubject,
      body: visitorBody,
      replyTo: CONFIG.PUBLIC_REPLY_EMAIL,
      name: 'Nexamor',
    });

    // 2. Send notification email to BOTH recipients
    var adminSubject = 'New call booked: ' + name + ', ' + auDateTimeStr;
    var adminBody = [
      'A new 30-minute call has been booked on Nexamor.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (phone || 'Not provided'),
      'Australian time: ' + auDateTimeStr,
      'Visitor time: ' + visitorDateStr + ', ' + visitorTimeStr + ' (' + visitorTz + ')',
      'Location: ' + (location === 'google-meet' ? 'Google Meet' : 'Phone call (' + phone + ')'),
      'Google Calendar: ' + eventLink + ' (Event ID: ' + createdEvent.getId() + ')',
      notes ? '\nNotes:\n' + notes : '\nNotes: None',
    ]
      .filter(function (line) {
        return line !== '';
      })
      .join('\n');

    MailApp.sendEmail({
      to: CONFIG.RECIPIENTS.join(','),
      subject: adminSubject,
      body: adminBody,
      replyTo: email,
      name: 'Nexamor Website Bookings',
    });

    return jsonResponse({
      ok: true,
      message: "You're booked. A confirmation is on its way to your email.",
      eventLink: eventLink,
      visitorDate: visitorDateStr,
      visitorTime: visitorTimeStr,
      auTime: auDateTimeStr,
    });
  } catch (err) {
    Logger.log('handleBookCall error: ' + (err && err.stack ? err.stack : err));
    notifyBookingError(err, payload);
    return jsonResponse({
      ok: false,
      error: 'Something went wrong while booking your call. Please try again or email nexamor1@gmail.com.',
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

/**
 * Handles the Project Brief form submission.
 */
function handleProjectBrief(payload) {
  try {
    var name = cleanSingleLine(payload.name, 120);
    var businessName = cleanSingleLine(payload.businessName, 160);
    var email = cleanSingleLine(payload.email, 160).toLowerCase();
    var phone = cleanSingleLine(payload.phone, 40);
    var websiteType = cleanSingleLine(payload.websiteType, 160);
    var message = cleanMultiLine(payload.message, CONFIG.MAX_FIELD_LENGTH);

    if (!name || name.length < 2) {
      return jsonResponse({ ok: false, error: 'Please enter your name.' });
    }
    if (!isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (!message) {
      return jsonResponse({ ok: false, error: 'Please tell us briefly what you need.' });
    }

    if (isRateLimited('brief:' + email)) {
      return jsonResponse({
        ok: false,
        error: 'Please wait a minute before sending another brief.',
      });
    }

    var subjectTitle = businessName || name;
    var subject = 'New project brief: ' + subjectTitle;
    var body = [
      'New project brief submitted on Nexamor:',
      '',
      'Name: ' + name,
      'Business name: ' + (businessName || 'Not provided'),
      'Email: ' + email,
      'Phone: ' + (phone || 'Not provided'),
      'Website chosen: ' + (websiteType || 'Not specified'),
      '',
      'Message:',
      message,
    ].join('\n');

    MailApp.sendEmail({
      to: CONFIG.RECIPIENTS.join(','),
      subject: subject,
      body: body,
      replyTo: email,
      name: 'Nexamor Project Briefs',
    });

    return jsonResponse({
      ok: true,
      message: "Thanks. We've got your brief and will reply same day, usually within 90 minutes.",
    });
  } catch (err) {
    Logger.log('handleProjectBrief error: ' + (err && err.stack ? err.stack : err));
    return jsonResponse({
      ok: false,
      error: 'Something went wrong. Email nexamor1@gmail.com or call 0435 758 455.',
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Availability & Timezone Helpers                                            */
/* -------------------------------------------------------------------------- */

function getAvailableSlotsForVisitorDate(visitorDateStr, visitorTz) {
  var visitorDayStart = zonedWallTimeToDate(visitorDateStr, 0, 0, visitorTz);
  var visitorDayEnd = new Date(
    zonedWallTimeToDate(visitorDateStr, 23, 59, visitorTz).getTime() + 59999
  );

  // Determine overlapping Australian business dates
  var bizDates = getOverlappingBusinessDates(visitorDayStart, visitorDayEnd);
  var candidateSlots = generateBusinessSlotsForDates(bizDates);

  var nowMs = Date.now();
  var minStartMs = nowMs + CONFIG.MIN_NOTICE_HOURS * 3600000;

  // Filter to slots that start on the visitor's selected date and satisfy 2-hour notice
  var filtered = candidateSlots.filter(function (slot) {
    var startMs = slot.start.getTime();
    return (
      startMs >= visitorDayStart.getTime() &&
      startMs <= visitorDayEnd.getTime() &&
      startMs >= minStartMs
    );
  });

  if (filtered.length === 0) {
    return [];
  }

  var windowStart = filtered[0].start;
  var windowEnd = filtered[filtered.length - 1].end;
  var busyIntervals = getBusyIntervals(windowStart, windowEnd);

  var openSlots = [];
  for (var i = 0; i < filtered.length; i++) {
    var s = filtered[i];
    if (!hasOverlap(s.start.getTime(), s.end.getTime(), busyIntervals)) {
      openSlots.push({
        startIso: s.start.toISOString(),
        endIso: s.end.toISOString(),
        auDate: Utilities.formatDate(s.start, CONFIG.BUSINESS_TIMEZONE, 'yyyy-MM-dd'),
        auTime: Utilities.formatDate(s.start, CONFIG.BUSINESS_TIMEZONE, 'HH:mm'),
      });
    }
  }

  return openSlots;
}

function getAvailableDatesForMonth(monthStr, visitorTz) {
  var parts = monthStr.split('-');
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  var firstDateStr = monthStr + '-01';
  var lastDateStr = monthStr + '-' + pad2(daysInMonth);

  var monthStart = zonedWallTimeToDate(firstDateStr, 0, 0, visitorTz);
  var monthEnd = new Date(
    zonedWallTimeToDate(lastDateStr, 23, 59, visitorTz).getTime() + 59999
  );

  var nowMs = Date.now();
  var minStartMs = nowMs + CONFIG.MIN_NOTICE_HOURS * 3600000;

  if (monthEnd.getTime() < minStartMs) {
    return [];
  }

  var queryStart = new Date(Math.max(monthStart.getTime(), minStartMs));
  var bizDates = getOverlappingBusinessDates(queryStart, monthEnd);
  var candidateSlots = generateBusinessSlotsForDates(bizDates);

  var filtered = candidateSlots.filter(function (slot) {
    var startMs = slot.start.getTime();
    return (
      startMs >= monthStart.getTime() &&
      startMs <= monthEnd.getTime() &&
      startMs >= minStartMs
    );
  });

  if (filtered.length === 0) {
    return [];
  }

  var busyIntervals = getBusyIntervals(filtered[0].start, filtered[filtered.length - 1].end);
  var availableDateSet = {};

  for (var i = 0; i < filtered.length; i++) {
    var s = filtered[i];
    if (!hasOverlap(s.start.getTime(), s.end.getTime(), busyIntervals)) {
      var visitorDateKey = Utilities.formatDate(s.start, visitorTz, 'yyyy-MM-dd');
      if (visitorDateKey.indexOf(monthStr + '-') === 0) {
        availableDateSet[visitorDateKey] = true;
      }
    }
  }

  return Object.keys(availableDateSet).sort();
}

function getOverlappingBusinessDates(rangeStart, rangeEnd) {
  var dates = [];
  var seen = {};
  var cursor = new Date(rangeStart.getTime() - 24 * 3600000);
  var limit = rangeEnd.getTime() + 24 * 3600000;

  while (cursor.getTime() <= limit) {
    var ymd = Utilities.formatDate(cursor, CONFIG.BUSINESS_TIMEZONE, 'yyyy-MM-dd');
    if (!seen[ymd]) {
      seen[ymd] = true;
      dates.push(ymd);
    }
    cursor = new Date(cursor.getTime() + 12 * 3600000);
  }
  return dates;
}

function generateBusinessSlotsForDates(bizDates) {
  var slots = [];
  var startMinutes = CONFIG.WORK_START_HOUR * 60 + CONFIG.WORK_START_MINUTE;
  var endMinutes = CONFIG.WORK_END_HOUR * 60 + CONFIG.WORK_END_MINUTE;

  for (var d = 0; d < bizDates.length; d++) {
    var ymd = bizDates[d];
    var parts = ymd.split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    var dow = new Date(Date.UTC(y, m - 1, day)).getUTCDay();

    if (CONFIG.AVAILABLE_DAYS.indexOf(dow) === -1) {
      continue;
    }

    for (var mins = startMinutes; mins + CONFIG.SLOT_MINUTES <= endMinutes; mins += CONFIG.SLOT_MINUTES) {
      var hour = Math.floor(mins / 60);
      var minute = mins % 60;
      var slotStart = zonedWallTimeToDate(ymd, hour, minute, CONFIG.BUSINESS_TIMEZONE);
      var slotEnd = new Date(slotStart.getTime() + CONFIG.SLOT_MINUTES * 60000);
      slots.push({ start: slotStart, end: slotEnd });
    }
  }
  return slots;
}

function isValidBusinessSlot(slotStart) {
  var minStartMs = Date.now() + CONFIG.MIN_NOTICE_HOURS * 3600000;
  if (slotStart.getTime() < minStartMs) {
    return false;
  }

  var bizYmd = Utilities.formatDate(slotStart, CONFIG.BUSINESS_TIMEZONE, 'yyyy-MM-dd');
  var bizHm = Utilities.formatDate(slotStart, CONFIG.BUSINESS_TIMEZONE, 'HH:mm');
  var bizSlots = generateBusinessSlotsForDates([bizYmd]);

  for (var i = 0; i < bizSlots.length; i++) {
    var candidateHm = Utilities.formatDate(bizSlots[i].start, CONFIG.BUSINESS_TIMEZONE, 'HH:mm');
    if (
      candidateHm === bizHm &&
      Math.abs(bizSlots[i].start.getTime() - slotStart.getTime()) < 60000
    ) {
      return true;
    }
  }
  return false;
}

function getTargetCalendar() {
  return CONFIG.CALENDAR_ID === 'primary'
    ? CalendarApp.getDefaultCalendar()
    : CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
}

function getBusyIntervals(windowStart, windowEnd) {
  var intervals = [];
  var cal = getTargetCalendar();
  if (!cal) return intervals;

  var events = cal.getEvents(windowStart, windowEnd);
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    if (ev.getMyStatus() === CalendarApp.GuestStatus.NO) continue;
    var startMs = ev.getStartTime().getTime();
    var endMs = ev.getEndTime().getTime();
    if (endMs > startMs) {
      intervals.push({ start: startMs, end: endMs });
    }
  }

  return intervals;
}

function hasOverlap(startMs, endMs, intervals) {
  for (var i = 0; i < intervals.length; i++) {
    if (startMs < intervals[i].end && endMs > intervals[i].start) {
      return true;
    }
  }
  return false;
}

/**
 * Converts a YYYY-MM-DD + HH:MM in an IANA timezone to a UTC Date object.
 */
function zonedWallTimeToDate(ymd, hour, minute, timeZone) {
  var utcGuess = new Date(ymd + 'T' + pad2(hour) + ':' + pad2(minute) + ':00Z');
  var offset1 = getTimezoneOffsetMs(utcGuess, timeZone);
  var candidate = new Date(utcGuess.getTime() - offset1);
  var offset2 = getTimezoneOffsetMs(candidate, timeZone);
  if (offset2 !== offset1) {
    candidate = new Date(utcGuess.getTime() - offset2);
  }
  return candidate;
}

function getTimezoneOffsetMs(date, timeZone) {
  var str = Utilities.formatDate(date, timeZone, 'Z'); // e.g. "+1000" or "-0500"
  var sign = str.charAt(0) === '-' ? -1 : 1;
  var hours = parseInt(str.slice(1, 3), 10);
  var mins = parseInt(str.slice(3, 5), 10);
  return sign * (hours * 60 + mins) * 60000;
}

function normalizeTimezone(tz) {
  var candidate = String(tz || '').trim();
  if (!candidate) return CONFIG.BUSINESS_TIMEZONE;
  try {
    Utilities.formatDate(new Date(), candidate, 'yyyy');
    return candidate;
  } catch (e) {
    return CONFIG.BUSINESS_TIMEZONE;
  }
}
/* -------------------------------------------------------------------------- */
/* Validation, Security & Utility Helpers                                     */
/* -------------------------------------------------------------------------- */

function cleanSingleLine(val, maxLen) {
  var str = String(val || '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim();
  return maxLen && str.length > maxLen ? str.slice(0, maxLen) : str;
}

function cleanMultiLine(val, maxLen) {
  var str = String(val || '')
    .replace(/\r\n/g, '\n')
    .trim();
  return maxLen && str.length > maxLen ? str.slice(0, maxLen) : str;
}

function isValidEmail(email) {
  if (!email || email.length > 160) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRateLimited(key) {
  try {
    var cache = CacheService.getScriptCache();
    if (cache.get(key)) {
      return true;
    }
    cache.put(key, '1', CONFIG.RATE_LIMIT_WINDOW_SECONDS);
    return false;
  } catch (e) {
    return false;
  }
}

function notifyBookingError(err, payload) {
  try {
    MailApp.sendEmail({
      to: CONFIG.RECIPIENTS.join(','),
      subject: 'Nexamor Booking Error Alert',
      body: [
        'A booking attempt failed on the Nexamor website.',
        '',
        'Error: ' + (err && err.message ? err.message : String(err)),
        'Stack: ' + (err && err.stack ? err.stack : 'N/A'),
        '',
        'Submitted details:',
        'Name: ' + (payload && payload.name ? payload.name : ''),
        'Email: ' + (payload && payload.email ? payload.email : ''),
        'Phone: ' + (payload && payload.phone ? payload.phone : ''),
        'Start time: ' + (payload && payload.startTime ? payload.startTime : ''),
        'Timezone: ' + (payload && payload.timezone ? payload.timezone : ''),
      ].join('\n'),
    });
  } catch (mailErr) {
    Logger.log('Failed to send error alert email: ' + mailErr);
  }
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
