'use client';

import { useState, useRef, useCallback } from 'react';

type AppState = 'input' | 'generating' | 'preview' | 'rendering' | 'done';

const EXAMPLE_TOPICS = ['牛顿第二定律', '光合作用', '三角函数', 'DNA复制', '行星运动', 'Sorting Algorithms'];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [state, setState] = useState<AppState>('input');
  const [previewHtml, setPreviewHtml] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const htmlAccumRef = useRef('');

  const generate = useCallback(async (t: string) => {
    if (!t.trim()) return;
    setError('');
    setState('generating');
    htmlAccumRef.current = '';

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      });

      if (!res.ok) throw new Error('生成失败');
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        htmlAccumRef.current += decoder.decode(value, { stream: true });
      }

      setPreviewHtml(htmlAccumRef.current);
      setState('preview');
    } catch (e) {
      setError(String(e));
      setState('input');
    }
  }, []);

  const renderVideo = useCallback(async () => {
    setState('rendering');
    setError('');
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, previewHtml }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || '渲染失败');
      }

      const blob = await res.blob();
      setVideoUrl(URL.createObjectURL(blob));
      setState('done');
    } catch (e) {
      setError(String(e));
      setState('preview');
    }
  }, [topic, previewHtml]);

  const reset = () => {
    setState('input');
    setPreviewHtml('');
    setVideoUrl('');
    setError('');
    setTopic('');
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'linear-gradient(180deg,#0F172A,#0F2540)' }}>
      {/* Nav */}
      <nav className="glass flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg,#14B8A6,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AetherViz Video
          </span>
          <span className="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">beta</span>
        </div>
        {state !== 'input' && (
          <button onClick={reset} className="text-sm text-slate-400 hover:text-white transition-colors">
            ← 重新开始
          </button>
        )}
      </nav>

      <main className="flex flex-1 flex-col">
        {/* INPUT STATE */}
        {(state === 'input' || state === 'generating') && (
          <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">
                输入主题，生成{' '}
                <span style={{ background: 'linear-gradient(135deg,#14B8A6,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  3D 教学视频
                </span>
              </h1>
              <p className="text-slate-400 text-lg">物理 · 化学 · 生物 · 数学 · 天文 · 编程</p>
            </div>

            <div className="w-full max-w-2xl glass rounded-2xl p-6 flex flex-col gap-4">
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate(topic)}
                placeholder="例：牛顿第二定律、光合作用、三角函数..."
                disabled={state === 'generating'}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-5 py-4 text-lg text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => generate(topic)}
                disabled={!topic.trim() || state === 'generating'}
                className="btn-primary py-4 text-lg"
              >
                {state === 'generating' ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    正在生成交互预览...
                  </span>
                ) : '✨ 生成交互预览'}
              </button>

              <div className="flex flex-wrap gap-2 mt-1">
                {EXAMPLE_TOPICS.map(t => (
                  <button key={t} onClick={() => { setTopic(t); generate(t); }}
                    className="text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-full transition-all">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        )}

        {/* PREVIEW STATE */}
        {(state === 'preview' || state === 'rendering') && (
          <div className="flex flex-1 flex-col">
            {/* Toolbar */}
            <div className="glass border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-200">{topic}</span>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">交互预览</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">满意后渲染为 3-4 分钟视频（约需 8-12 分钟）</span>
                <button
                  onClick={renderVideo}
                  disabled={state === 'rendering'}
                  className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
                >
                  {state === 'rendering' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      渲染中...
                    </>
                  ) : '🎬 渲染为视频'}
                </button>
              </div>
            </div>

            {/* Preview iframe */}
            <div className="flex-1 relative">
              <iframe
                srcDoc={previewHtml}
                sandbox="allow-scripts"
                className="absolute inset-0 w-full h-full border-0"
                title="interactive preview"
              />
            </div>

            {error && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-900/80 border border-red-500/50 text-red-200 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {/* DONE STATE */}
        {state === 'done' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">视频渲染完成</h2>
              <p className="text-slate-400">{topic}</p>
            </div>

            <video
              src={videoUrl}
              controls
              className="rounded-2xl w-full max-w-4xl shadow-2xl border border-white/10"
              style={{ maxHeight: '60vh' }}
            />

            <div className="flex gap-4">
              <a
                href={videoUrl}
                download={`${topic}.mp4`}
                className="btn-primary px-8 py-3 text-base"
              >
                ⬇️ 下载 MP4
              </a>
              <button
                onClick={() => setState('preview')}
                className="border border-white/20 hover:border-white/40 px-8 py-3 rounded-xl text-sm text-slate-300 hover:text-white transition-all"
              >
                返回预览
              </button>
              <button
                onClick={reset}
                className="border border-white/20 hover:border-white/40 px-8 py-3 rounded-xl text-sm text-slate-300 hover:text-white transition-all"
              >
                生成新主题
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
