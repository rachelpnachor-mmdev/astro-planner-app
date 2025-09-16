import type { AstrologySystem, HouseSystem } from '../constants/astrology';
export type { AstrologySystem, HouseSystem } from '../constants/astrology';

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