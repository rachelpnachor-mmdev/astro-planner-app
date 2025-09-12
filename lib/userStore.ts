import AsyncStorage from '@react-native-async-storage/async-storage';

export type DevUser = { id: string; email: string; password: string };
const KEY = 'lunaria.users';

// internal
async function loadUsers(): Promise<DevUser[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as DevUser[]; } catch { return []; }
}
async function saveUsers(users: DevUser[]): Promise<void> {
  // Guard: never write undefined/null
  await AsyncStorage.setItem(KEY, JSON.stringify(Array.isArray(users) ? users : []));
}

// public
export async function findUserByEmail(email: string): Promise<DevUser | undefined> {
  const users = await loadUsers();
  const e = email.trim().toLowerCase();
  return users.find(u => u.email.trim().toLowerCase() === e);
}
export async function addUser(email: string, password: string): Promise<DevUser> {
  const users = await loadUsers();
  const e = email.trim().toLowerCase();
  if (users.some(u => u.email.trim().toLowerCase() === e)) throw new Error('E_EXISTS');
  const user: DevUser = { id: `u_${Date.now()}`, email, password };
  users.push(user);
  await saveUsers(users);
  if (__DEV__) console.log('[STORE] addUser saved count=', users.length);
  return user;
}

// DEBUG helpers
export async function getAllUsers(): Promise<DevUser[]> { return loadUsers(); }
export async function resetUsers(): Promise<void> { await AsyncStorage.removeItem(KEY); }
