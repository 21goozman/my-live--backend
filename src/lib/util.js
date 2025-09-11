import { DateTime } from "luxon";

export const TZ = process.env.TIMEZONE || "Africa/Nairobi";

/**
 * Combine a local date (YYYY-MM-DD) and time (HH:mm) in TZ,
 * return both local DateTime and UTC ISO.
 */
export function combineLocalDateTimeToUTC(dateStr, timeStr, tz = TZ) {
  const local = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: tz });
  if (!local.isValid) {
    throw new Error("Invalid date/time");
  }
  const utc = local.toUTC();
  return { local, utcISO: utc.toISO() };
}

/** Simple KE phone normalizer. Accepts 07xx… or +2547xx… */
export function normalizeKenyanPhone(phoneRaw) {
  const phone = phoneRaw.replace(/\s+/g, "");
  if (/^\+2547\d{8}$/.test(phone)) return phone;
  if (/^07\d{8}$/.test(phone)) return "+254" + phone.slice(1);
  return null;
}
