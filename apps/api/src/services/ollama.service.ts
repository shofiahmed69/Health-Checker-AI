/**
 * Ollama Integration Service
 * Connects to local Ollama at http://localhost:11434 with Llama 3.2
 */

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithOllama(
  messages: OllamaMessage[],
  options?: { temperature?: number; stream?: boolean }
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: options?.stream ?? false,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: 2048,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${err}`);
    }

    const data = (await response.json()) as { message?: { content?: string } };
    return data.message?.content || '';
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        throw new Error('Ollama is not running. Please start Ollama and pull the llama3.2 model.');
      }
      throw error;
    }
    throw new Error('Failed to connect to Ollama');
  }
}

export async function generateWithOllama(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const messages: OllamaMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });
  return chatWithOllama(messages);
}

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}
