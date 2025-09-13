export type ChatMessage = { role: 'system'|'user'|'context'; content: string };
export async function mockComplete(messages: ChatMessage[]): Promise<string> {
  // deterministic, short “completion”
  const ctx = messages.find(m => m.role === 'context')?.content ?? '';
  const hint = ctx.split('\n').find(l => l.includes('[')) ?? '';
  return `Here’s a crisp next step. ${hint ? 'Pulled note: ' + hint.replace('- ','') : ''}`.slice(0, 280);
}
