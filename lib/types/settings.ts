export type AstrologySystem = 'western' | 'vedic';
export type HouseSystem = 'whole_sign' | 'placidus';

export type Settings = {
  features: {
    dailyCore: boolean;
    aiAssistant: boolean;
  };
  astrology: {
    system: AstrologySystem;
    houseSystem: HouseSystem;
  };
  notifications: {
    dailyCoreReminder: boolean;
  };
  updatedAt: number;
};