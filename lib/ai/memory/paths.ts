import * as FileSystem from 'expo-file-system';

export const MEM_ROOT = `${FileSystem.documentDirectory}memory/`;
export const TOPICS_DIR = `${MEM_ROOT}topics/`;
export const INDEX_DIR = `${MEM_ROOT}index/`;
export const SUMMARIES_DIR = `${MEM_ROOT}summaries/`;
export const PROFILE_DIR = `${FileSystem.documentDirectory}profile/`;

export const TOPIC_SHARD = (topic: string) => `${TOPICS_DIR}${topic}.jsonl`;
export const TOPIC_INDEX = `${INDEX_DIR}topics.json`;
export const RECENCY_INDEX = `${INDEX_DIR}recency.json`;
export const ARCHETYPE_JSON = `${PROFILE_DIR}archetype.json`;
