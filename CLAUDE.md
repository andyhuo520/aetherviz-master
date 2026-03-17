# CLAUDE.md — AetherViz Master

This file provides guidance for AI assistants working in this repository.

---

## Project Overview

**AetherViz Master** (v5.0) is a **Claude Code Skill** — a prompt specification that guides an AI to generate complete, self-contained interactive 3D educational visualization web pages from a single topic input. There is no traditional source code; the output is always a single-file HTML document delivered directly to the user.

- **Repository type**: Claude Skill specification + documentation only
- **No build system, no package manager, no test suite**
- **License**: MIT
- **Author**: andyhuo520

---

## Repository Structure

```
aetherviz-master/
├── CLAUDE.md        # This file
├── README.md        # User-facing documentation (Chinese)
├── SKILL.md         # Authoritative skill specification (Claude reads this when invoked)
└── LICENSE          # MIT License
```

There are intentionally **no source files, no `node_modules`, no `package.json`**, and no compiled assets. The project is a generative specification, not a traditional codebase.

---

## How the Skill Works

When a user invokes `/aetherviz-master` (or types a topic) in Claude Code, Claude:

1. Reads `SKILL.md` as the authoritative specification
2. Auto-detects the subject domain and render mode from the topic keywords
3. Generates a **complete, runnable, single-file HTML document** — nothing else
4. Outputs the raw HTML directly (no markdown fences, no explanation)

### Output Contract (strict)

- Output starts with `<!DOCTYPE html>` and ends with `</html>`
- Zero external file dependencies (all libraries via CDN)
- Must run by saving as `.html` and opening in any modern browser
- Must support mobile touch (rotate, pinch-zoom)
- Must include the footer credit: `由 AetherViz Master 为你生成 ❤️`

---

## Auto-Detection Logic

### Subject → Color Theme

| Subject | Color Gradient |
|---------|---------------|
| Physics | Blue `#3B82F6 → #0EA5E9` |
| Chemistry | Orange-Red `#F59E0B → #EF4444` |
| Biology | Emerald `#10B981 → #22D3EE` |
| Math | Golden `#F59E0B → #EAB308` |
| Astronomy | Deep Blue `#1E40AF → #3B82F6` |
| Programming | Green-Teal `#22C55E → #14B8A6` |

### Topic → Render Mode

```javascript
// Three.js 3D keywords: 运动, 粒子, 碰撞, 旋转, 天体, 分子, 机械, 力, 磁场, 电场
// SVG 2D keywords:      函数, 图像, 曲线, 图表, 统计, 证明, 几何, 坐标
// Hybrid keywords:      牛顿, 运动定律, 波动, 振动, 电磁, 能量

// Render mode resolution:
// hybrid → if hasHybrid || (hasThree && hasSVG)
// svg    → if only hasSVG
// three  → default (3D only)
```

---

## Required CDN Dependencies (Generated HTML)

Every generated HTML file must load these via CDN — never from local files:

| Library | CDN URL |
|---------|---------|
| Three.js r134 | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js` |
| Tailwind CSS v3.4+ | `https://cdn.tailwindcss.com` |
| KaTeX 0.16.11 CSS | `https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css` |
| KaTeX 0.16.11 JS | `https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js` |
| KaTeX auto-render | `https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js` |
| D3.js v7 (optional) | `https://d3js.org/d3.v7.min.js` |

**OrbitControls**: Must be inlined as a simplified self-contained implementation (no CDN available for this). It must support `enableDamping`, touch input, and zoom limits.

---

## Generated HTML Structure

Every generated page must follow this layout:

```
┌─────────────────────────────────────────────────────────────┐
│ NAV BAR: Title (topic name) | Reset | Random | Fullscreen | About │
├───────────────────┬─────────────────────────────────────────┤
│ LEFT SIDEBAR      │  MAIN CANVAS (Three.js / SVG / Hybrid)  │
│ (30%, collapsible)│  (70%, gradient background)             │
│ - Learning goals  │                                         │
│   (checkboxes)    │                                         │
│ - KaTeX formulas  │                                         │
│ - Principles      │                                         │
│ - Applications    │                                         │
├───────────────────┴─────────────────────────────────────────┤
│ CONTROL PANEL: Sliders + KaTeX results + Play/Pause/Step    │
├─────────────────────────────────────────────────────────────┤
│ QUIZ PANEL (collapsible, 360px wide, right-side):           │
│  - Hide button (✕) → collapses to floating button (bottom-right) │
│  - Smooth transition (0.3s ease)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Three.js Scene Requirements

When using the 3D renderer, the scene must include:

- `PerspectiveCamera(fov: 60, near: 0.1, far: 1000)`
- `WebGLRenderer({ antialias: true, shadowMap.enabled: true })`
- `HemisphereLight` (ambient) + `DirectionalLight` (castShadow: true)
- `MeshStandardMaterial` or `MeshPhongMaterial` with adjustable metalness/roughness
- `THREE.ArrowHelper` for vectors: Force=red `#EF4444`, Velocity=blue `#3B82F6`, Acceleration=green `#22C55E`
- `THREE.Points + BufferGeometry` for particle systems
- `THREE.Line + BufferAttribute` with fixed-length ring buffer for trails
- Physics via Verlet or Euler integration using `THREE.Clock.getDelta()`
- `THREE.Raycaster` for click-to-highlight interactions
- Sprite-based labels synced via `vector.project(camera)`

---

## Hybrid Rendering (Three.js + SVG)

When render mode is `hybrid`:

```javascript
// SVG overlay sits above the Three.js canvas
const svgContainer = document.createElement('div');
svgContainer.style.cssText =
  'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';

// 3D → 2D coordinate projection
function syncSVGto3D(x, y, z) {
    const vector = new THREE.Vector3(x, y, z);
    vector.project(camera);
    return {
        x: (vector.x * 0.5 + 0.5) * width,
        y: (-(vector.y * 0.5) + 0.5) * height
    };
}
```

Slider changes must update both Three.js object properties and SVG path `d` attributes simultaneously.

---

## Design System

### Core Color Palette

```css
/* Backgrounds */
--bg-gradient: linear-gradient(180deg, #0F172A 0%, #164E63 50%, #155E75 100%);

/* Primary brand */
--primary-gradient: linear-gradient(135deg, #14B8A6 0%, #06B6D4 50%, #22D3EE 100%);

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.08);
--glass-border: rgba(255, 255, 255, 0.15);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

/* Text */
--text-primary: #F8FAFC;
--text-secondary: #CBD5E1;
--text-muted: #94A3B8;
```

### Style Conventions

- **Glassmorphism** on all panels and cards
- **Neon accent colors** on interactive elements
- **60fps animations** with spring easing
- Font: `Inter, system-ui, sans-serif`
- All UI panels use `backdrop-filter: blur(...)` and semi-transparent backgrounds

---

## Language Detection

- If the topic is Chinese → output the entire page in Chinese
- If the topic is English → output the entire page in English
- The skill supports bilingual input/output automatically

---

## Development Conventions

Since this repo is documentation-only, "development" means editing the specification files.

### When modifying `SKILL.md`

- Keep the YAML frontmatter (`name`, `description`) intact at the top
- The skill is invoked by Claude Code as `/aetherviz-master`
- Preserve all numbered sections and their headings — Claude parses them structurally
- CDN versions are pinned (Three.js r134, KaTeX 0.16.11) — do not upgrade without testing

### When modifying `README.md`

- README is primarily Chinese; maintain that convention
- Screenshots/GIFs go in `docs/` or are linked from GitHub issue uploads
- Keep the changelog section (`## 📝 更新日志`) up to date

### Commit message conventions

Use concise imperative messages, e.g.:
- `Add hybrid SVG+3D render mode to SKILL.md`
- `Update CDN URLs for KaTeX 0.16.12`
- `Fix quiz panel collapse animation spec`

### Branch naming

Feature branches follow: `feature/<description>` or `claude/<description>-<id>`

---

## Testing

There is no automated test suite. Manual testing process:

1. Invoke the skill with a topic (e.g., `牛顿第二定律`, `Sine function`, `DNA replication`)
2. Save the generated HTML output as `test.html`
3. Open in Chrome/Edge/Firefox and verify:
   - 3D scene renders without errors
   - Sliders update the scene in real time
   - KaTeX formulas render correctly
   - Quiz panel collapses/expands with animation
   - Mobile touch controls work (use browser DevTools device emulation)

---

## Running Generated Output Locally

The generated HTML files are self-contained. Serve them with any static file server:

```bash
python -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080
```

Then open `http://localhost:8080/your-file.html` in a WebGL-capable browser.

---

## Key Constraints for AI Assistants

1. **Never add source code files** — this repo is spec-only
2. **Never add a build system or package manager** — not applicable
3. **Output is always raw HTML** — no markdown code fences, no preamble
4. **CDN versions are pinned** — Three.js r134, not latest
5. **OrbitControls must be inlined** — no CDN exists for this module
6. **Both Chinese and English topics are valid** — handle both gracefully
7. **Single file output only** — no multi-file projects, no imports
