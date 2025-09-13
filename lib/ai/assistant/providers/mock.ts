import { ChatMessage, LlmProvider } from './types';
export const mockProvider: LlmProvider = {
  async complete(messages: ChatMessage[]) {
    const ctx = messages.find(m => m.role === 'context')?.content ?? '';
    const hint = ctx.split('\n').find(l => l.includes('[')) ?? '';
    return `Here’s a crisp next step. ${hint ? 'Pulled note: ' + hint.replace('- ','') : ''}`.slice(0, 280);
  }
};
