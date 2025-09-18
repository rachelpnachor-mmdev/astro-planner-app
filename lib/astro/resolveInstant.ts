import { DateTime } from 'luxon';

export function resolveLocalToUTCISO(dateISO: string, timeHM: string, zoneId: string) {
  // dateISO: 'YYYY-MM-DD', timeHM: 'HH:mm'
  const [h, m] = (timeHM || '12:00').split(':').map(Number);
  const dt = DateTime.fromISO(`${dateISO}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`, { zone: zoneId || 'UTC' });
  // If invalid, throw to surface the error cleanly:
  if (!dt.isValid) throw new Error(`Invalid local datetime (${dateISO} ${timeHM}) in zone ${zoneId}: ${dt.invalidReason}`);
  const utc = dt.toUTC();
  return {
    localISO: dt.toISO(),
    utcISO: utc.toISO(),
    offsetMinutes: dt.offset, // minutes offset from UTC
  };
}
