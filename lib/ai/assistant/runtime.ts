import { buildMemoryContext } from './context';
import { buildToneDirectives } from './tone';

export type PreparedMessages = {
  system: string;
  context: string;
  user: string;
  meta: { topics: string[]; hits: number };
};

export async function prepareAssistantMessages(userInput: string): Promise<PreparedMessages> {
  const tone = await buildToneDirectives();
  const mem = await buildMemoryContext(userInput);

  const system =
    `${tone.directive}\n` +
    `Keep answers actionable and compassionate. If you are unsure, ask a brief clarifying question.`;

  return {
    system,
    context: mem.context,
    user: userInput,
    meta: { topics: mem.topics, hits: mem.hits.length }
  };
}
