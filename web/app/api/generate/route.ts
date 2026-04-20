import Anthropic from '@anthropic-ai/sdk';
import { INTERACTIVE_SYSTEM_PROMPT } from '@/lib/prompts';

const client = new Anthropic();

export async function POST(request: Request) {
  const { topic } = await request.json();

  if (!topic?.trim()) {
    return Response.json({ error: '请输入主题' }, { status: 400 });
  }

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16000,
    system: [
      {
        type: 'text',
        text: INTERACTIVE_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: `生成主题：${topic}` }],
    stream: true,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
