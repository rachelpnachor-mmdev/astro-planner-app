export type BirthProfile = {
  fullName: string;
  dateISO: string;          // YYYY-MM-DD
  time24?: string | null;   // HH:mm | null when timeUnknown
  timeUnknown: boolean;
  timezone: string;         // IANA tz
  locationText: string;
  createdAt: number;
  updatedAt: number;
};
