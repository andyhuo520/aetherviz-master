# AetherViz Master

<p align="center">
 <img src="https://img.shields.io/badge/version-5.0-blue.svg" alt="Version">
 <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
 <img src="https://img.shields.io/badge/Three.js-r134-orange.svg" alt="Three.js">
 <img src="https://img.shields.io/badge/Tailwind-v3.4+-cyan.svg" alt="Tailwind">
 <img src="https://img.shields.io/badge/SVG-Enabled-purple.svg" alt="SVG">
 <img src="https://img.shields.io/badge/AI-Powered-red.svg" alt="AI Powered">
</p>

<p align="center">
 <img width="800" alt="AetherViz Master Demo" src="https://github.com/user-attachments/assets/763cc0d4-3dc3-4b0b-8109-016e89d51ff2" />
</p>

<p align="center">
 <strong>Interactive Educational Visualization Architect</strong><br>
 Instantly transform any teaching topic into immersive 3D interactive educational web pages
</p>

---

## 📖 Project Overview

AetherViz Master is an AI-powered interactive educational visualization tool that transforms abstract teaching concepts into vivid, intuitive 3D interactive web pages. Whether you're a teacher, student, or educational content creator, simply input a topic and it generates a complete, interactive teaching page for you.

### Core Capabilities

- **One-Click Generation**: Input a topic → auto-generate a 3D interactive web page
- **Smart Adaptation**: Automatically identifies the subject domain and matches the best color scheme and visualization approach
- **Zero Barrier**: No programming required — generated HTML files work out of the box
- **Professional Quality**: Three.js + SVG hybrid rendering at 60fps

---

## ✨ Key Features

### 1. 3D Visualization Engine
- Professional-grade 3D scenes based on Three.js r134
- Supports physics simulation, particle systems, vector arrows
- Built-in OrbitControls with mouse drag rotation and scroll zoom
- Touch device support: touch rotation, pinch-to-zoom

### 2. SVG Enhanced Rendering
- Overlay SVG 2D charts on top of 3D scenes
- Function graphs, coordinate systems, flowcharts
- D3.js data-driven charts (optional)
- Real-time 3D-2D coordinate synchronization

### 3. Smart Auto-Detection

| Detection Dimension | Description |
|---------------------|-------------|
| **Subject Recognition** | Physics / Chemistry / Biology / Math / Astronomy / Programming — auto-switches color theme |
| **Rendering Scheme** | Auto-selects Three.js / SVG / Hybrid mode based on keywords |
| **Language Adaptation** | Auto-detects Chinese / English and outputs in the corresponding language |

### 4. Modern UI Design
- Glassmorphism style
- Cyber-education aesthetic + neon accent colors
- Responsive layout for desktop / tablet / mobile
- Sidebar + control panel + HUD data display

### 5. Complete Teaching Features
- Learning objectives (checkable tracking)
- KaTeX math formula real-time rendering
- Principle explanations (vivid analogies, high school to university level)
- Collapsible quiz panel
- Play / Pause / Step / Speed controls

---

## 🚀 Quick Start

### Requirements

- Modern browser (Chrome / Edge / Firefox / Safari)
- WebGL support

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/andyhuo520/aetherviz-master.git
cd aetherviz-master

# 2. Start a local server (choose one)
python -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080

# 3. Visit http://localhost:8080
```

### Using with Claude Code

```bash
# 1. Start Claude Code
claude

# 2. Enter a topic
/aetherviz-master
# Or directly enter:
Newton's Second Law
# Or:
Uniform Motion
# Or:
Photosynthesis
```

The system will automatically generate a complete HTML file.

---

## 📚 Supported Topic Domains

### Physics
- Newton's Second Law
- Uniform Motion / Uniformly Accelerated Motion
- Electromagnetic Induction
- Relativistic Time Dilation
- Quantum Tunneling Effect

### Chemistry
- Photosynthesis
- Acid-Base Neutralization
- Redox Reactions
- Molecular Structure

### Biology
- DNA Replication
- Cellular Respiration
- Mitosis
- Genetic Inheritance

### Mathematics
- Pythagorean Theorem
- Trigonometric Functions
- Sine Function Graph
- Probability Distribution

### Astronomy
- Planetary Motion Laws
- Cosmic Expansion
- Black Holes
- Solar and Lunar Eclipses

### Programming
- Algorithm Complexity
- Data Structures
- Sorting Algorithms
- Design Patterns

---

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|--------|
| Three.js | 3D Rendering Engine | r134 |
| Tailwind CSS | UI Styling Framework | v3.4+ |
| KaTeX | Math Formula Rendering | 0.16.11 |
| D3.js | Data Visualization (optional) | v7 |
| OrbitControls | 3D Scene Controls | Inline simplified version |

### Rendering Mode Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Topic Input Analysis                                        │
├─────────────────────────────────────────────────────────────┤
│ Keyword Detection                                           │
│ ├── Motion/Particle/Molecule/Mechanics/Celestial → Pure Three.js 3D │
│ ├── Function/Graph/Curve/Geometry → SVG 2D Chart           │
│ └── Newton/Wave/Energy/Electromagnetic → Three.js + SVG Hybrid │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
aetherviz-master/
├── README.md        # Project documentation (Chinese)
├── README_EN.md     # Project documentation (English)
├── LICENSE          # MIT License
├── SKILL.md         # Claude Skill definition file
└── docs/
    └── skill.md     # Detailed skill documentation
```

---

## 💡 Usage Examples

### Example 1: Uniform Motion

After entering the topic, the system automatically:
1. Identifies as "Physics" → Blue gradient theme
2. Detects "motion" keyword → Three.js pure 3D mode
3. Generates: ball motion simulation + velocity slider + displacement trajectory

### Example 2: Trigonometric Functions

After entering the topic, the system automatically:
1. Identifies as "Mathematics" → Golden gradient theme
2. Detects "function / graph" keywords → SVG mode
3. Generates: function waveform SVG chart + parameter sliders + real-time drawing

### Example 3: Waves and Oscillations

After entering the topic, the system automatically:
1. Identifies as "Physics"
2. Detects "wave" keyword → Hybrid mode
3. Generates: 3D spring oscillator + SVG waveform overlay

---

## 🤝 Contributing

Contributions, issues, and suggestions are welcome!

```bash
# 1. Fork this repository
# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Commit changes
git commit -m 'Add amazing feature'

# 4. Push the branch
git push origin feature/your-feature

# 5. Open a Pull Request
```

### Contributors

<a href="https://github.com/andyhuo520/aetherviz-master/graphs/contributors">
 <img src="https://contrib.rocks/image?repo=andyhuo520/aetherviz-master" />
</a>

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🔗 Related Links

- [Three.js Documentation](https://threejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [KaTeX Math Formulas](https://katex.org/)
- [D3.js Data Visualization](https://d3js.org/)

---

## 📝 Changelog

### v5.0 (2026-02-22)
- ✅ Added SVG + Three.js hybrid rendering
- ✅ Added automatic rendering scheme detection
- ✅ Added D3.js support
- ✅ Optimized coordinate synchronization mechanism

### v4.0 (2026-02-22)
- ✅ Optimized panel layout
- ✅ Collapsible quiz panel
- ✅ Added floating action button in bottom-right corner

---

<p align="center">
 Built with ❤️ | Every piece of knowledge deserves to be visualized<br>
 Generated by AetherViz Master ❤️
</p>
