import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

interface HeroMockAsset {
  src: string;
  filename: string;
  width: number;
  height: number;
}

function readImageDimensions(filePath: string): { width: number; height: number } {
  try {
    const buf = fs.readFileSync(filePath);
    // PNG
    if (
      buf.length >= 24 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47
    ) {
      return {
        width: buf.readUInt32BE(16),
        height: buf.readUInt32BE(20),
      };
    }

    // JPEG
    if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buf.length) {
        if (buf[offset] !== 0xff) {
          offset += 1;
          continue;
        }
        const marker = buf[offset + 1];
        if (marker === 0xd9 || marker === 0xda) break;
        const segmentLength = buf.readUInt16BE(offset + 2);
        if (
          (marker >= 0xc0 && marker <= 0xc3) ||
          (marker >= 0xc5 && marker <= 0xc7) ||
          (marker >= 0xc9 && marker <= 0xcb) ||
          (marker >= 0xcd && marker <= 0xcf)
        ) {
          return {
            height: buf.readUInt16BE(offset + 5),
            width: buf.readUInt16BE(offset + 7),
          };
        }
        if (segmentLength < 2) break;
        offset += 2 + segmentLength;
      }
    }

    // WebP
    if (
      buf.length >= 30 &&
      buf.toString('ascii', 0, 4) === 'RIFF' &&
      buf.toString('ascii', 8, 12) === 'WEBP'
    ) {
      const chunk = buf.toString('ascii', 12, 16);
      if (chunk === 'VP8 ') {
        return {
          width: buf.readUInt16LE(26) & 0x3fff,
          height: buf.readUInt16LE(28) & 0x3fff,
        };
      }
      if (chunk === 'VP8L') {
        const bits = buf.readUInt32LE(21);
        return {
          width: (bits & 0x3fff) + 1,
          height: ((bits >> 14) & 0x3fff) + 1,
        };
      }
      if (chunk === 'VP8X') {
        return {
          width: buf.readUIntLE(24, 3) + 1,
          height: buf.readUIntLE(27, 3) + 1,
        };
      }
    }
  } catch {
    // Fallback below
  }

  return { width: 1200, height: 900 };
}

function collectHeroMocks(publicDir: string): HeroMockAsset[] {
  const assetsRoot = path.join(publicDir, 'assets');
  if (!fs.existsSync(assetsRoot)) return [];

  const results: HeroMockAsset[] = [];
  const prefixPattern = /^(screenshot|whatsapp[\s_]+image)/i;
  const extPattern = /\.(png|jpe?g|webp)$/i;

  const ignoredFiles = new Set([
    'Screenshot_2026-11-16_at_12.46.06_AM_c34d7e9e.png',
    'Screenshot_2026-11-20_at_10.44.45_AM_9a681e71.png',
    'Screenshot_2026-11-20_at_10.45.37_AM_0f61dd95.png',
    'Screenshot_2026-11-20_at_10.47.22_AM_73bd462f.png',
    'Screenshot_2026-11-20_at_10.50.14_AM_aa098fa4.png',
    'Screenshot_2026-11-20_at_11.01.50_AM_6de4bb54.png',
    'Screenshot_2026-11-20_at_11.07.01_AM_45769d62.png',
  ]);

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        !ignoredFiles.has(entry.name) &&
        prefixPattern.test(entry.name) &&
        extPattern.test(entry.name)
      ) {
        const relFromPublic = path.relative(publicDir, fullPath).split(path.sep).join('/');
        const { width, height } = readImageDimensions(fullPath);
        results.push({
          src: `/${relFromPublic}`,
          filename: entry.name,
          width,
          height,
        });
      }
    }
  };

  walk(assetsRoot);
  results.sort((a, b) => a.filename.localeCompare(b.filename));
  return results;
}

function heroMockManifestPlugin(): Plugin {
  const virtualId = 'virtual:hero-mocks';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'hero-mock-manifest',
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return;
      const publicDir = path.resolve(__dirname, 'public');
      const mocks = collectHeroMocks(publicDir);
      return `export const HERO_MOCK_IMAGES = ${JSON.stringify(mocks)};`;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), heroMockManifestPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
