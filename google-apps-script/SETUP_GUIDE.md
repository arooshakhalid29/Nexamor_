# Nexamor Booking & Project Brief Setup Guide (Google Apps Script)

## 1. Which Google account to use
Sign in to the **Google account that owns the Google Calendar** where calls should be booked (for example, `nexamor1@gmail.com` or `arooshakhalid6@gmail.com`). That account will be the calendar owner, host Google Meet links, and send confirmation emails.

## 2. Create the Apps Script project and paste `Code.gs`
1. Go to [script.google.com](https://script.google.com) while signed in to that Google account.
2. Click **New project**.
3. Click **Untitled project** at the top and rename it (e.g., `Nexamor Website Booking`).
4. In the left sidebar, click `Code.gs`, select everything inside it, and replace it with the full contents of `google-apps-script/Code.gs` from this repository.
5. Check the `CONFIG` block at the top of `Code.gs` (both `arooshakhalid6@gmail.com` and `nexamor1@gmail.com` are already set as recipients, and availability is set to 7 days a week, 9 am to 6 pm `Australia/Sydney` with 2 hours minimum notice).
6. Press **Ctrl+S** (or **Cmd+S**) to save.

## 3. Deploy as a Web App and authorize permissions
1. Click **Deploy** (top right) -> **New deployment**.
2. Click the gear icon next to **Select type** and choose **Web app**.
3. Set:
   - **Description**: `Nexamor Booking v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Click **Authorize access**, choose your Google account, and if Google shows *"Google hasn't verified this app"*, click **Advanced** -> **Go to Nexamor Website Booking (unsafe)** -> **Allow** (this only appears because it is your own private script).
6. Copy the **Web app URL** (it ends in `/exec`).

## 5. Paste the Web App URL into the website code
1. Open `src/config/appsScript.ts` and paste your `/exec` URL into `APPS_SCRIPT_URL` (or set `VITE_APPS_SCRIPT_URL` in your hosting environment variables).
2. Rebuild and publish the site.

## 6. How to redeploy after future edits to `Code.gs`
Important: saving `Code.gs` does **not** update the live Web App URL automatically. Whenever you edit `Code.gs`:
1. Click **Deploy** -> **Manage deployments**.
2. Click the pencil (Edit) icon next to your active Web app deployment.
3. Under **Version**, select **New version**.
4. Click **Deploy**. (The `/exec` URL stays the same, so you do not need to change the website code.)

## 7. Test checklist
1. **Test booking**:
   - Open your `/start` page -> scroll to **Book a 30-minute call**.
   - Confirm available 30-minute slots load for today/tomorrow and match your calendar free time.
   - Book a test call (try Google Meet first) and verify:
     - You see `"You're booked. A confirmation is on its way to your email."`
     - An event appears on your Google Calendar with a Google Meet link, the guest added, and notes/phone in the description.
     - Both `arooshakhalid6@gmail.com` and `nexamor1@gmail.com` receive `"New call booked: ..."` with `Reply-To` set to the visitor's email.
     - The booked slot no longer appears as available when you refresh the page.
2. **Test project brief**:
   - Fill out **The project brief** on `/start` and submit.
   - Verify the button disables while sending and then displays `"Thanks. We've got your brief and will reply same day, usually within 90 minutes."`
   - Verify both `arooshakhalid6@gmail.com` and `nexamor1@gmail.com` receive `"New project brief: ..."`.
3. **If emails land in spam**:
   - Check the Spam/Junk folder in both `arooshakhalid6@gmail.com` and `nexamor1@gmail.com`, mark as **Not spam**, and add the script owner's Gmail address to Contacts.
   - Also check `Executions` in the Apps Script sidebar if an email fails to send.

## 8. Daily email limits
- On a standard free `@gmail.com` account, Apps Script allows **100 email recipients per day** across `MailApp`/`GmailApp` (Google Workspace accounts allow 1,500/day).
- Each **project brief** uses **2 recipients** (`arooshakhalid6@gmail.com` + `nexamor1@gmail.com`).
- Each **call booking** uses **3 recipients** (1 visitor confirmation + 2 admin recipients).
- That allows roughly **33 bookings or 50 briefs per day** on a free Gmail account before hitting the daily quota.
