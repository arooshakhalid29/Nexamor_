import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  Phone,
  Video,
} from 'lucide-react';
import { APPS_SCRIPT_URL } from '../config/appsScript';

export const BUSINESS_TIMEZONE = 'Australia/Sydney';

export const CALL_EVENT_DESCRIPTION =
  'Thirty minutes, no prep, no pitch. We will cover scope, timeline, and price for your project, and if we are not the right fit we will say so on the call and point you somewhere better. Booking confirms instantly.';

const BASE_TIMEZONES = [
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Adelaide',
  'Australia/Perth',
  'Australia/Hobart',
  'Australia/Darwin',
  'Pacific/Auckland',
  'Asia/Singapore',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface TimeSlot {
  startIso: string;
  endIso: string;
  auDate?: string;
  auTime?: string;
}

interface BookingResult {
  message: string;
  eventLink?: string;
  visitorDate?: string;
  visitorTime?: string;
  auTime?: string;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function detectVisitorTimezone(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) return detected;
  } catch {
    // Fallback below
  }
  return BUSINESS_TIMEZONE;
}

function getTzOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = Number(part.value);
    }
  }
  const hour = map.hour === 24 ? 0 : map.hour;
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

function zonedWallTimeToDate(
  ymd: string,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const utcGuess = new Date(`${ymd}T${pad2(hour)}:${pad2(minute)}:00Z`);
  const offset1 = getTzOffsetMs(utcGuess, timeZone);
  let candidate = new Date(utcGuess.getTime() - offset1);
  const offset2 = getTzOffsetMs(candidate, timeZone);
  if (offset2 !== offset1) {
    candidate = new Date(utcGuess.getTime() - offset2);
  }
  return candidate;
}

function formatYmdInTz(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  }
  return `${map.year}-${map.month}-${map.day}`;
}

function formatTimeInTz(iso: string, timeZone: string, use24h: boolean): string {
  const d = new Date(iso);
  if (use24h) {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  }
  return new Intl.DateTimeFormat('en-AU', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(d)
    .replace(/\s+/g, '')
    .toLowerCase();
}

function formatLongDateFromYmd(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const utcDate = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(utcDate);
}

function formatShortDateFromYmd(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const utcDate = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
  }).format(utcDate);
}

function formatAuTimeSummary(iso: string): string {
  const d = new Date(iso);
  const datePart = new Intl.DateTimeFormat('en-AU', {
    timeZone: BUSINESS_TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('en-AU', {
    timeZone: BUSINESS_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(d);
  return `${datePart}, ${timePart}`;
}

/**
 * Computes default 9:00am - 6:00pm Australian slots with 2-hour minimum notice
 * for previewing before the Google Apps Script Web App URL is configured.
 */
function computeLocalFallbackSlots(visitorYmd: string, visitorTz: string): TimeSlot[] {
  const dayStart = zonedWallTimeToDate(visitorYmd, 0, 0, visitorTz);
  const dayEnd = new Date(zonedWallTimeToDate(visitorYmd, 23, 59, visitorTz).getTime() + 59999);
  const minStartMs = Date.now() + 2 * 3600 * 1000;

  const bizDates = new Set<string>();
  for (
    let t = dayStart.getTime() - 24 * 3600 * 1000;
    t <= dayEnd.getTime() + 24 * 3600 * 1000;
    t += 12 * 3600 * 1000
  ) {
    bizDates.add(formatYmdInTz(new Date(t), BUSINESS_TIMEZONE));
  }

  const slots: TimeSlot[] = [];
  for (const bizYmd of Array.from(bizDates).sort()) {
    for (let mins = 9 * 60; mins <= 17 * 60 + 30; mins += 30) {
      const hour = Math.floor(mins / 60);
      const minute = mins % 60;
      const slotStart = zonedWallTimeToDate(bizYmd, hour, minute, BUSINESS_TIMEZONE);
      const startMs = slotStart.getTime();
      if (
        startMs >= dayStart.getTime() &&
        startMs <= dayEnd.getTime() &&
        startMs >= minStartMs
      ) {
        const slotEnd = new Date(startMs + 30 * 60 * 1000);
        slots.push({
          startIso: slotStart.toISOString(),
          endIso: slotEnd.toISOString(),
          auDate: bizYmd,
          auTime: `${pad2(hour)}:${pad2(minute)}`,
        });
      }
    }
  }
  return slots;
}

export default function BookCallEmbed() {
  const [timezone, setTimezone] = useState<string>(() => detectVisitorTimezone());
  const todayYmd = useMemo(() => formatYmdInTz(new Date(), timezone), [timezone]);

  const [viewYearMonth, setViewYearMonth] = useState<{ year: number; month: number }>(() => {
    const [y, m] = formatYmdInTz(new Date(), detectVisitorTimezone()).split('-').map(Number);
    return { year: y, month: m - 1 };
  });
  const [selectedYmd, setSelectedYmd] = useState<string>(() =>
    formatYmdInTz(new Date(), detectVisitorTimezone())
  );
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  // Availability state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string>('');
  const [monthAvailableDates, setMonthAvailableDates] = useState<Set<string> | null>(null);

  const slotsCacheRef = useRef<Map<string, TimeSlot[]>>(new Map());
  const monthCacheRef = useRef<Map<string, string[]>>(new Map());
  const hasUserPickedDateRef = useRef<boolean>(false);

  // Step 2 confirm form state
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [locationType, setLocationType] = useState<'google-meet' | 'phone'>('google-meet');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const timezoneOptions = useMemo(() => {
    if (BASE_TIMEZONES.includes(timezone)) return BASE_TIMEZONES;
    return [timezone, ...BASE_TIMEZONES];
  }, [timezone]);

  // Keep selectedYmd >= todayYmd when timezone shifts
  useEffect(() => {
    if (selectedYmd < todayYmd) {
      setSelectedYmd(todayYmd);
      const [y, m] = todayYmd.split('-').map(Number);
      setViewYearMonth({ year: y, month: m - 1 });
    }
  }, [todayYmd, selectedYmd]);

  const loadSlotsForDate = useCallback(
    async (ymd: string, tz: string, skipCache = false) => {
      const endpoint = APPS_SCRIPT_URL.trim();
      if (!endpoint) {
        setSlotsError('');
        setSlotsLoading(false);
        setSlots(computeLocalFallbackSlots(ymd, tz));
        return;
      }

      const cacheKey = `${ymd}|${tz}`;
      if (!skipCache && slotsCacheRef.current.has(cacheKey)) {
        setSlots(slotsCacheRef.current.get(cacheKey) || []);
        setSlotsError('');
        setSlotsLoading(false);
        return;
      }

      setSlotsLoading(true);
      setSlotsError('');

      try {
        const url = `${endpoint}?action=slots&date=${encodeURIComponent(ymd)}&tz=${encodeURIComponent(tz)}`;
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        if (!data || data.ok === false) {
          throw new Error(data?.error || 'Could not load available times.');
        }
        const loadedSlots: TimeSlot[] = Array.isArray(data.slots) ? data.slots : [];
        slotsCacheRef.current.set(cacheKey, loadedSlots);
        setSlots(loadedSlots);
      } catch (err) {
        setSlots([]);
        setSlotsError(
          err instanceof Error
            ? err.message
            : 'Unable to check live availability right now.'
        );
      } finally {
        setSlotsLoading(false);
      }
    },
    []
  );

  // Fetch slots when date or timezone changes
  useEffect(() => {
    loadSlotsForDate(selectedYmd, timezone);
  }, [selectedYmd, timezone, loadSlotsForDate]);

  // Fetch month availability so fully booked / past days are greyed out
  useEffect(() => {
    const endpoint = APPS_SCRIPT_URL.trim();
    const ym = `${viewYearMonth.year}-${pad2(viewYearMonth.month + 1)}`;

    if (!endpoint) {
      // Locally determine which days in this month have >= 1 fallback slot
      const daysInMonth = new Date(viewYearMonth.year, viewYearMonth.month + 1, 0).getDate();
      const avail: string[] = [];
      for (let day = 1; day <= daysInMonth; day += 1) {
        const dStr = `${ym}-${pad2(day)}`;
        if (dStr >= todayYmd && computeLocalFallbackSlots(dStr, timezone).length > 0) {
          avail.push(dStr);
        }
      }
      setMonthAvailableDates(new Set(avail));
      return;
    }

    const cacheKey = `${ym}|${timezone}`;
    if (monthCacheRef.current.has(cacheKey)) {
      setMonthAvailableDates(new Set(monthCacheRef.current.get(cacheKey)));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const url = `${endpoint}?action=month&month=${encodeURIComponent(ym)}&tz=${encodeURIComponent(timezone)}`;
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.availableDates)) {
          monthCacheRef.current.set(cacheKey, data.availableDates);
          setMonthAvailableDates(new Set(data.availableDates));
        }
      } catch {
        // Non-blocking: day-level fetch still works
        if (!cancelled) setMonthAvailableDates(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [viewYearMonth, timezone, todayYmd]);

  useEffect(() => {
    if (
      !hasUserPickedDateRef.current &&
      monthAvailableDates &&
      monthAvailableDates.size > 0 &&
      !monthAvailableDates.has(selectedYmd)
    ) {
      const sorted = Array.from(monthAvailableDates).sort();
      const firstUpcoming = sorted.find((d) => d >= todayYmd);
      if (firstUpcoming) {
        setSelectedYmd(firstUpcoming);
      }
    }
  }, [monthAvailableDates, selectedYmd, todayYmd]);

  const calendarCells = useMemo(() => {
    const { year, month } = viewYearMonth;
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (string | null)[] = [];
    for (let i = 0; i < firstDayIndex; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(`${year}-${pad2(month + 1)}-${pad2(day)}`);
    }
    return cells;
  }, [viewYearMonth]);

  const [todayYear, todayMonth] = todayYmd.split('-').map(Number);
  const canGoPrevMonth =
    viewYearMonth.year > todayYear ||
    (viewYearMonth.year === todayYear && viewYearMonth.month > todayMonth - 1);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    setViewYearMonth((prev) =>
      prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 }
    );
  };

  const handleNextMonth = () => {
    setViewYearMonth((prev) =>
      prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 }
    );
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlot || isBooking) return;

    const trimmedName = attendeeName.trim();
    const trimmedEmail = attendeeEmail.trim();
    const trimmedPhone = attendeePhone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setBookingError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setBookingError('Please enter a valid email address.');
      return;
    }
    if (locationType === 'phone' && !trimmedPhone) {
      setBookingError('Please enter your phone number so we can call you.');
      return;
    }

    const endpoint = APPS_SCRIPT_URL.trim();
    if (!endpoint) {
      setBookingError(
        'Booking endpoint is not configured yet. Add your Google Apps Script Web App URL in src/config/appsScript.ts or email nexamor1@gmail.com.'
      );
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'book',
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          location: locationType,
          notes: notes.trim(),
          startTime: selectedSlot.startIso,
          timezone,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        // Invalidate cache for this day in case slot was just taken
        slotsCacheRef.current.delete(`${selectedYmd}|${timezone}`);
        monthCacheRef.current.clear();
        setBookingError(
          data?.error || 'Could not complete your booking. Please try again or pick another time.'
        );
        return;
      }

      slotsCacheRef.current.clear();
      monthCacheRef.current.clear();

      setBookingResult({
        message:
          data.message ||
          "You're booked. A confirmation is on its way to your email.",
        eventLink: data.eventLink || '',
        visitorDate: data.visitorDate,
        visitorTime: data.visitorTime,
        auTime: data.auTime,
      });
    } catch {
      setBookingError(
        'Network error while confirming your booking. Please try again or email nexamor1@gmail.com.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  const use24h = timeFormat === '24h';
  const formattedSelectedShort = formatShortDateFromYmd(selectedYmd);
  const formattedSelectedLong = formatLongDateFromYmd(selectedYmd);
  const startLabel = selectedSlot ? formatTimeInTz(selectedSlot.startIso, timezone, use24h) : '';
  const endLabel = selectedSlot ? formatTimeInTz(selectedSlot.endIso, timezone, use24h) : '';
  const auSummaryLabel = selectedSlot ? formatAuTimeSummary(selectedSlot.startIso) : '';
  const showAuNote = timezone !== BUSINESS_TIMEZONE;

  const locationSummary =
    locationType === 'google-meet'
      ? 'Google Meet'
      : `Phone call (${attendeePhone.trim() || 'Phone number provided'})`;

  return (
    <div className="mx-auto w-full max-w-[960px]">
      <div className="overflow-hidden rounded-[12px] border border-[#262626] bg-[#111111] text-[#FAFAFA] shadow-highlight">
        {bookingResult && selectedSlot ? (
          /* SUCCESS STATE */
          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                <Check aria-hidden="true" className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-[#FAFAFA] sm:text-2xl">
                {bookingResult.message}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A3A3A3]">
                We&apos;ll meet you on{' '}
                <strong className="font-medium text-[#FAFAFA]">
                  {formattedSelectedLong}, {startLabel} – {endLabel}
                </strong>{' '}
                ({timezone}) and we&apos;ll send a confirmation email to{' '}
                <span className="text-[#E5E5E5]">{attendeeEmail.trim()}</span>.
              </p>

              <div className="mt-6 rounded-[10px] border border-[#262626] bg-[#171717] p-5 text-left text-sm">
                <dl className="space-y-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-[#A3A3A3]">What</dt>
                    <dd className="font-medium text-[#FAFAFA]">30-minute call · Nexamor</dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-[#A3A3A3]">When</dt>
                    <dd className="font-medium text-[#FAFAFA] tabular-nums">
                      {formattedSelectedLong}, {startLabel} – {endLabel}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-[#A3A3A3]">Timezone</dt>
                    <dd className="text-[#E5E5E5]">{timezone}</dd>
                  </div>
                  {showAuNote && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <dt className="text-[#A3A3A3]">Australian time</dt>
                      <dd className="text-[#E5E5E5] tabular-nums">{auSummaryLabel}</dd>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-[#A3A3A3]">Where</dt>
                    <dd className="text-[#E5E5E5]">{locationSummary}</dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-[#A3A3A3]">Who</dt>
                    <dd className="text-[#E5E5E5]">
                      {attendeeName.trim()} ({attendeeEmail.trim()})
                    </dd>
                  </div>
                  {notes.trim() && (
                    <div className="border-t border-[#262626] pt-3">
                      <dt className="text-[#A3A3A3]">Additional notes</dt>
                      <dd className="mt-1 text-[#E5E5E5]">{notes.trim()}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setBookingResult(null);
                    setSelectedSlot(null);
                    setBookingError('');
                    loadSlotsForDate(selectedYmd, timezone, true);
                  }}
                  className="inline-flex items-center justify-center rounded-[8px] border border-[#2E2E2E] bg-transparent px-5 py-2.5 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#1E1E1E] cursor-pointer"
                >
                  Book another call
                </button>
              </div>
            </div>
          </div>
        ) : selectedSlot === null ? (
          /* STEP 1: Left details + Month calendar + Available time slots */
          <div className="grid grid-cols-1 divide-y divide-[#262626] lg:grid-cols-[260px_minmax(0,1fr)_225px] lg:divide-x lg:divide-y-0">
            {/* Left panel */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#262626] text-xs font-bold text-[#FAFAFA]">
                  D
                </span>
                <span className="text-sm font-medium text-[#A3A3A3]">Danesh · Nexamor</span>
              </div>

              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-[#FAFAFA]">
                30-minute call
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-[#A3A3A3]">
                {CALL_EVENT_DESCRIPTION}
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-[#D4D4D4]">
                <div className="flex items-center gap-2.5">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  <span>30m</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Video aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  <span>2 location options</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  <label htmlFor="booking-timezone-select" className="sr-only">
                    Timezone
                  </label>
                  <select
                    id="booking-timezone-select"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-[6px] border border-transparent bg-transparent py-0.5 text-xs text-[#D4D4D4] hover:border-[#2E2E2E] focus:border-[#525252] focus:bg-[#1A1A1A] focus:outline-none cursor-pointer"
                  >
                    {timezoneOptions.map((tz) => (
                      <option key={tz} value={tz} className="bg-[#171717] text-[#FAFAFA]">
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Middle panel: Month calendar */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#FAFAFA]">
                  {MONTH_NAMES[viewYearMonth.month]}{' '}
                  <span className="font-normal text-[#A3A3A3]">{viewYearMonth.year}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={!canGoPrevMonth}
                    aria-label="Previous month"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#D4D4D4] transition-colors hover:bg-[#222222] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#D4D4D4] transition-colors hover:bg-[#222222] cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-1.5 text-[11px] font-medium tracking-wider text-[#A3A3A3]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-1 grid grid-cols-7 gap-1.5">
                {calendarCells.map((cellYmd, idx) => {
                  if (!cellYmd) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const isPast = cellYmd < todayYmd;
                  const isUnavailable =
                    monthAvailableDates !== null && !monthAvailableDates.has(cellYmd);
                  const isDisabled = isPast || isUnavailable;
                  const isSelected = cellYmd === selectedYmd;
                  const isToday = cellYmd === todayYmd;
                  const dayNum = Number(cellYmd.split('-')[2]);

                  return (
                    <button
                      key={cellYmd}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        hasUserPickedDateRef.current = true;
                        setSelectedYmd(cellYmd);
                      }}
                      aria-label={formatLongDateFromYmd(cellYmd)}
                      aria-pressed={isSelected}
                      className={`relative flex aspect-square items-center justify-center rounded-[8px] text-sm tabular-nums transition-colors ${
                        isSelected
                          ? 'bg-[#FAFAFA] font-semibold text-[#111111]'
                          : isDisabled
                            ? 'text-[#525252] cursor-not-allowed'
                            : 'bg-[#1D1D1D] font-medium text-[#FAFAFA] hover:border hover:border-[#FAFAFA]/40 cursor-pointer'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isToday && (
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-1.5 h-0.5 w-3 rounded-full ${
                            isSelected ? 'bg-[#111111]' : 'bg-[#A3A3A3]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right panel: Available times + 12h/24h toggle */}
            <div className="flex flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#FAFAFA]">{formattedSelectedShort}</p>
                <div
                  role="group"
                  aria-label="Time format"
                  className="inline-flex rounded-[6px] border border-[#2E2E2E] bg-[#181818] p-0.5 text-[11px] font-medium"
                >
                  <button
                    type="button"
                    onClick={() => setTimeFormat('12h')}
                    aria-pressed={timeFormat === '12h'}
                    className={`rounded-[4px] px-2 py-0.5 transition-colors cursor-pointer ${
                      timeFormat === '12h'
                        ? 'bg-[#2E2E2E] text-[#FAFAFA]'
                        : 'text-[#A3A3A3] hover:text-[#FAFAFA]'
                    }`}
                  >
                    12h
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFormat('24h')}
                    aria-pressed={timeFormat === '24h'}
                    className={`rounded-[4px] px-2 py-0.5 transition-colors cursor-pointer ${
                      timeFormat === '24h'
                        ? 'bg-[#2E2E2E] text-[#FAFAFA]'
                        : 'text-[#A3A3A3] hover:text-[#FAFAFA]'
                    }`}
                  >
                    24h
                  </button>
                </div>
              </div>

              <div className="mt-4 flex-1">
                {slotsLoading ? (
                  <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-xs text-[#A3A3A3]">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Checking availability...</span>
                  </div>
                ) : slotsError ? (
                  <div className="rounded-[8px] border border-[#2E2E2E] bg-[#181818] p-3 text-xs text-[#D4D4D4]">
                    <p>{slotsError}</p>
                    <button
                      type="button"
                      onClick={() => loadSlotsForDate(selectedYmd, timezone, true)}
                      className="mt-2 font-medium text-[#FAFAFA] underline underline-offset-2 cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="rounded-[8px] border border-[#262626] bg-[#161616] p-4 text-xs leading-relaxed text-[#A3A3A3]">
                    No open slots left on this day. Please choose another date on the calendar.
                  </div>
                ) : (
                  <div className="grid max-h-[340px] grid-cols-2 gap-2 overflow-y-auto pr-1 lg:grid-cols-1">
                    {slots.map((slot) => (
                      <button
                        key={slot.startIso}
                        type="button"
                        onClick={() => {
                          setBookingError('');
                          setSelectedSlot(slot);
                        }}
                        className="flex items-center justify-center rounded-[8px] border border-[#2E2E2E] bg-[#181818] px-3 py-2 text-xs font-medium text-[#FAFAFA] tabular-nums transition-colors hover:border-[#FAFAFA] hover:bg-[#222222] cursor-pointer"
                      >
                        {formatTimeInTz(slot.startIso, timezone, use24h)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: Confirm form */
          <div className="grid grid-cols-1 divide-y divide-[#262626] lg:grid-cols-[290px_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
            {/* Left summary column */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#262626] text-xs font-bold text-[#FAFAFA]">
                  D
                </span>
                <span className="text-sm font-medium text-[#A3A3A3]">Danesh · Nexamor</span>
              </div>

              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-[#FAFAFA]">
                30-minute call
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-[#A3A3A3]">
                {CALL_EVENT_DESCRIPTION}
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-[#D4D4D4]">
                <div className="flex items-start gap-2.5">
                  <CalendarIcon
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A3A3A3]"
                  />
                  <div>
                    <p className="font-medium text-[#FAFAFA]">{formattedSelectedLong}</p>
                    <p className="tabular-nums text-[#A3A3A3]">
                      {startLabel} – {endLabel}
                    </p>
                    {showAuNote && (
                      <p className="mt-0.5 tabular-nums text-[11px] text-[#8C8C8C]">
                        AU time: {auSummaryLabel}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  <span>30m</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {locationType === 'google-meet' ? (
                    <Video aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  ) : (
                    <Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  )}
                  <span>{locationType === 'google-meet' ? 'Google Meet' : 'Phone call'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#A3A3A3]" />
                  <span>{timezone}</span>
                </div>
              </div>
            </div>

            {/* Right confirm form column */}
            <form onSubmit={handleConfirm} className="space-y-4 p-5 sm:p-6">
              {/* Honeypot field for spam protection */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="booking-website">Website</label>
                <input
                  id="booking-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="booking-name"
                  className="mb-1.5 block text-xs font-medium text-[#FAFAFA]"
                >
                  Your name <span className="text-[#A3A3A3]">*</span>
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="Sarah Mitchell"
                  className="w-full rounded-[8px] border border-[#2E2E2E] bg-[#181818] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#737373] focus:border-[#FAFAFA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-email"
                    className="mb-1.5 block text-xs font-medium text-[#FAFAFA]"
                  >
                    Email address <span className="text-[#A3A3A3]">*</span>
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="sarah@yourbusiness.com.au"
                    className="w-full rounded-[8px] border border-[#2E2E2E] bg-[#181818] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#737373] focus:border-[#FAFAFA] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="mb-1.5 block text-xs font-medium text-[#FAFAFA]"
                  >
                    Phone{' '}
                    <span className="font-normal text-[#A3A3A3]">
                      {locationType === 'phone' ? '(required for phone call)' : '(optional)'}
                    </span>
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required={locationType === 'phone'}
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="04XX XXX XXX"
                    className="w-full rounded-[8px] border border-[#2E2E2E] bg-[#181818] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#737373] focus:border-[#FAFAFA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="mb-1.5 block text-xs font-medium text-[#FAFAFA]">
                  Location <span className="text-[#A3A3A3]">*</span>
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-2.5 rounded-[8px] border px-3 py-2.5 text-xs transition-colors ${
                      locationType === 'google-meet'
                        ? 'border-[#FAFAFA] bg-[#1E1E1E] text-[#FAFAFA]'
                        : 'border-[#2E2E2E] bg-[#181818] text-[#A3A3A3] hover:border-[#525252]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="booking-location"
                      value="google-meet"
                      checked={locationType === 'google-meet'}
                      onChange={() => setLocationType('google-meet')}
                      className="accent-[#FAFAFA]"
                    />
                    <Video aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium">Google Meet</span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-2.5 rounded-[8px] border px-3 py-2.5 text-xs transition-colors ${
                      locationType === 'phone'
                        ? 'border-[#FAFAFA] bg-[#1E1E1E] text-[#FAFAFA]'
                        : 'border-[#2E2E2E] bg-[#181818] text-[#A3A3A3] hover:border-[#525252]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="booking-location"
                      value="phone"
                      checked={locationType === 'phone'}
                      onChange={() => setLocationType('phone')}
                      className="accent-[#FAFAFA]"
                    />
                    <Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium">Phone call</span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="mb-1.5 block text-xs font-medium text-[#FAFAFA]"
                >
                  Additional notes <span className="font-normal text-[#A3A3A3]">(optional)</span>
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything that will help prepare for our call."
                  className="w-full resize-none rounded-[8px] border border-[#2E2E2E] bg-[#181818] px-3.5 py-2 text-sm text-[#FAFAFA] placeholder:text-[#737373] focus:border-[#FAFAFA] focus:outline-none"
                />
              </div>

              {bookingError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-[8px] border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200"
                >
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-[#262626] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-[#A3A3A3]">Booking confirms instantly.</p>
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isBooking}
                    onClick={() => {
                      setSelectedSlot(null);
                      setBookingError('');
                      loadSlotsForDate(selectedYmd, timezone, true);
                    }}
                    className="rounded-[8px] px-4 py-2 text-xs font-medium text-[#D4D4D4] transition-colors hover:bg-[#1E1E1E] hover:text-[#FAFAFA] disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#FAFAFA] px-5 py-2 text-xs font-semibold text-[#111111] transition-colors hover:bg-[#E5E5E5] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isBooking && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    <span>{isBooking ? 'Confirming...' : 'Confirm'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
