export type ChatMessage = { role: 'system'|'user'|'context'; content: string };
export interface LlmProvider {
  complete(messages: ChatMessage[]): Promise<string>;
}
