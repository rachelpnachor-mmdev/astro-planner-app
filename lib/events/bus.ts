// lib/events/bus.ts
type Listener<T = unknown> = (payload: T) => void;

class EventBus {
  private map = new Map<string, Set<Listener>>();

  on<T = unknown>(evt: string, fn: Listener<T>) {
    if (!this.map.has(evt)) this.map.set(evt, new Set());
    (this.map.get(evt) as Set<Listener<T>>).add(fn);
    return () => this.off(evt, fn);
  }
  off<T = unknown>(evt: string, fn: Listener<T>) {
    this.map.get(evt)?.delete(fn as Listener);
  }
  emit<T = unknown>(evt: string, payload: T) {
    this.map.get(evt)?.forEach(fn => fn(payload));
  }
}

export const bus = new EventBus();
export const EVENTS = {
  SETTINGS_CHANGED: 'settings/changed',
  BIRTH_PROFILE_CHANGED: 'birth/changed',
} as const;

export type SettingsChangedPayload = {
  settings: import('../types/settings').Settings;
};
