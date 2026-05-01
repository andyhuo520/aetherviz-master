import { getClient } from '@/lib/claude';
import { VIDEO_SYSTEM_PROMPT } from '@/lib/prompts';
import { renderToMp4 } from '@/lib/renderer';

export async function POST(request: Request) {
  const { topic, previewHtml } = await request.json();

  if (!topic?.trim()) {
    return Response.json({ error: '缺少主题' }, { status: 400 });
  }

  // Step 1: Generate HyperFrames-compatible timeline HTML
  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16000,
    system: [
      {
        type: 'text',
        text: VIDEO_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: previewHtml
          ? `基于以下交互式预览，生成适合视频渲染的 HyperFrames HTML（主题：${topic}）。保留相同的视觉风格和教学内容，但改为全自动 GSAP timeline 驱动，4分钟结构。\n\n预览参考：\n${previewHtml.slice(0, 4000)}`
          : `生成主题：${topic}，视频版 HyperFrames HTML`,
      },
    ],
  });

  const videoHtml =
    message.content[0].type === 'text' ? message.content[0].text : '';

  if (!videoHtml.includes('<!DOCTYPE html')) {
    return Response.json({ error: 'HTML 生成失败，请重试' }, { status: 500 });
  }

  // Step 2: Render with HyperFrames
  let mp4Buffer: Buffer;
  try {
    mp4Buffer = await renderToMp4(videoHtml);
  } catch (err) {
    console.error('HyperFrames render error:', err);
    return Response.json({ error: '视频渲染失败，请重试' }, { status: 500 });
  }

  return new Response(mp4Buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(topic)}.mp4"`,
    },
  });
}
