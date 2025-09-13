import * as FileSystem from 'expo-file-system';
import { INDEX_DIR, MEM_ROOT, SUMMARIES_DIR, TOPICS_DIR } from './paths';

export async function ensureDirs() {
  for (const dir of [MEM_ROOT, TOPICS_DIR, INDEX_DIR, SUMMARIES_DIR]) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}
