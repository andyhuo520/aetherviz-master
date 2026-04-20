import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

const SERVER_ASSETS = path.join(process.cwd(), 'server-assets');

export async function renderToMp4(html: string): Promise<Buffer> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aetherviz-'));

  try {
    await fs.writeFile(path.join(tmpDir, 'index.html'), html, 'utf8');

    // Copy bundled scripts so Puppeteer can load them without network
    const assetsDir = path.join(tmpDir, 'assets');
    await fs.mkdir(assetsDir, { recursive: true });
    await fs.copyFile(path.join(SERVER_ASSETS, 'three.min.js'), path.join(assetsDir, 'three.min.js'));
    await fs.copyFile(path.join(SERVER_ASSETS, 'gsap.min.js'), path.join(assetsDir, 'gsap.min.js'));

    // Minimal hyperframes.json required by the CLI
    await fs.writeFile(
      path.join(tmpDir, 'hyperframes.json'),
      JSON.stringify({
        $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json',
        registry: 'https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry',
        paths: { blocks: 'compositions', components: 'compositions/components', assets: 'assets' },
      }),
      'utf8',
    );

    const outputPath = path.join(tmpDir, 'output.mp4');

    await execFileAsync(
      'npx',
      ['hyperframes', 'render', '--output', outputPath],
      { cwd: tmpDir, timeout: 10 * 60 * 1000 },
    );

    return await fs.readFile(outputPath);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
