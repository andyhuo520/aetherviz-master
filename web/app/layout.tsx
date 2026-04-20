import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AetherViz Video — 教学主题 → 3D 动画视频',
  description: '输入任意教学主题，生成可交互 3D 预览，一键导出教学视频',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
