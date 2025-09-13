import { saveMemory } from '../memory';
import { provider } from './providers';
import { prepareAssistantMessages } from './runtime';

export type ChatReply = {
  reply: string;
  system: string;
  context: string;
  meta: { topics: string[]; hits: number };
};

// Single entrypoint the app can call later
export async function chatReply(userInput: string): Promise<ChatReply> {
  const prep = await prepareAssistantMessages(userInput);
  const reply = await provider.complete([
    { role: 'system', content: prep.system },
    { role: 'context', content: prep.context },
    { role: 'user', content: prep.user },
  ]);

  // persist the exchange as lightweight memory
  await saveMemory({ topic: 'journal', content: `Q: ${userInput}` });
  await saveMemory({ topic: 'journal', content: `A: ${reply}` });

  return { reply, system: prep.system, context: prep.context, meta: prep.meta };
}
