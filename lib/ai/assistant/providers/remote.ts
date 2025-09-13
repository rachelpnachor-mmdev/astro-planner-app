import { ChatMessage, LlmProvider } from './types';
const URL = process.env.EXPO_PUBLIC_AI_API_URL; // e.g., https://your-backend/complete
export const remoteProvider: LlmProvider = {
  async complete(messages: ChatMessage[]) {
    if (!URL) throw new Error('AI API URL not set');
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    // expected shape: { reply: string }
    return data.reply ?? '';
  }
};
