/**
 * Google Apps Script Web App URL for Nexamor bookings & project briefs.
 *
 * After deploying google-apps-script/Code.gs as a Web App:
 *   1. Paste your Web App URL inside the quotes below (or set VITE_APPS_SCRIPT_URL in .env).
 *   Example: 'https://script.google.com/macros/s/AKfycb.../exec'
 */
export const APPS_SCRIPT_URL: string =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbx4vX6PJKNn2k649cZLqnrdtDR0MYVUsuVJoCQEO0oRWb-v9foY-6npTQb5LltUFJw/exec';
