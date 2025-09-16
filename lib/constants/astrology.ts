export const ASTROLOGY_SYSTEMS = [
  { label: 'Western (Tropical)', value: 'western_tropical' },
  { label: 'Vedic (Sidereal — Lahiri)', value: 'sidereal_lahiri' },
  { label: 'Sidereal (Fagan/Bradley)', value: 'sidereal_fagan_bradley' },
  { label: 'Sidereal (Krishnamurti)', value: 'sidereal_krishnamurti' },
] as const;

export const HOUSE_SYSTEMS = [
  { label: 'Whole Sign', value: 'whole_sign' },
  { label: 'Placidus', value: 'placidus' },
  { label: 'Equal', value: 'equal' },
  { label: 'Koch', value: 'koch' },
  { label: 'Porphyry', value: 'porphyry' },
  { label: 'Regiomontanus', value: 'regiomontanus' },
  { label: 'Campanus', value: 'campanus' },
  { label: 'Alcabitius', value: 'alcabitius' },
  { label: 'Topocentric', value: 'topocentric' },
  { label: 'Morinus', value: 'morinus' },
  { label: 'Vehlow', value: 'vehlow' },
  { label: 'Sripati (Vedic Equal)', value: 'sripati' },
] as const;

export type AstrologySystem = typeof ASTROLOGY_SYSTEMS[number]['value'];
export type HouseSystem = typeof HOUSE_SYSTEMS[number]['value'];