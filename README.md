# Gray-Scott Reaction-Diffusion Simulation

A real-time GPU-accelerated simulation of the Gray-Scott reaction-diffusion model, built with React, Vite, Three.js, and Tailwind CSS.

## Introduction

The Gray-Scott model is a mathematical model used to simulate reaction-diffusion systems, capable of generating rich and diverse self-organizing patterns such as spiral waves, spots, mazes, and worm-like structures. This project uses GPU acceleration to simulate this process in real-time and provides an interactive control interface.

## Features

- **Real-time GPU-accelerated simulation**: High-performance computation and rendering using WebGL and Three.js
- **Multiple preset modes**: Built-in 12 different parameter combinations producing diverse patterns
- **Interactive drawing**: Draw on the canvas with mouse or touch to real-time influence the simulation
- **Parameter adjustment**: Modify feed, kill, and speed parameters to observe pattern changes under different conditions
- **Color customization**: Support for custom color mapping to create unique visual effects
- **Responsive design**: Adapts to different screen sizes with a collapsible sidebar (desktop) and swipe-to-close drawer (mobile)
- **Info dialog**: In-app documentation explaining the model and controls

## Preset Modes

1. **Default** - Classic Gray-Scott pattern
2. **Solitons** - Stable wave-like structures
3. **Pulsating solitons** - Periodically changing wave structures
4. **Worms** - Worm-like elongated moving patterns
5. **Mazes** - Complex branching maze patterns
6. **Holes** - Regularly arranged holes
7. **Chaos** - Disordered but structured patterns
8. **Chaos and holes** - Mixed chaos and hole patterns
9. **Moving spots** - Randomly moving spots
10. **Spots and loops** - Mixed spot and loop patterns
11. **Waves** - Regular wave structures
12. **The U-Skate World** - Special U-shaped skateboard world patterns

## Technical Implementation

### Core Algorithm

The program implements the Gray-Scott reaction-diffusion equations:

```
∂u/∂t = D_u ∇²u - uv² + f(1-u)
∂v/∂t = D_v ∇²v + uv² - (f+k)v
```

Where:
- `u` and `v` are concentrations of two chemical substances
- `D_u` and `D_v` are their diffusion coefficients
- `f` is the feed rate
- `k` is the kill rate
- `∇²` is the Laplacian operator

### Project Structure

```
gray-scott/
├── index.html                   # HTML entry, loads /src/main.jsx
├── package.json                 # Scripts and dependencies (Vite + React + Three.js)
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── src/
    ├── main.jsx                 # React application entry
    ├── App.jsx                  # Top-level layout, panel state, gestures
    ├── constants.js             # PRESETS, DEFAULT_COLORS, DEFAULT_SPEED
    ├── styles.css               # Global styles and Tailwind directives
    ├── components/              # React UI components
    │   ├── Sidebar.jsx          # Right-side control panel
    │   ├── PresetSelect.jsx     # Preset mode selector
    │   ├── ColorControls.jsx    # Color mapping editors
    │   ├── InfoDialog.jsx       # About / info dialog
    │   └── icons.jsx            # Inline SVG icons
    ├── hooks/
    │   └── useGrayScott.js      # React hook wiring UI to the simulation engine
    ├── lib/                     # Simulation and rendering core
    │   ├── doCal.js             # Gray-Scott computation step (ping-pong render)
    │   ├── doShow.js            # Color mapping and screen display
    │   ├── loadShaders.js       # GLSL shader loader
    │   ├── canvasInput.js       # Mouse/touch drawing input
    │   └── useThree.js          # Three.js renderer / scene helpers
    └── shaders/                 # GLSL shaders
        ├── gsFragmentShader.glsl    # Gray-Scott computation shader
        ├── screenFragmentShader.glsl # Screen display shader
        └── standardVertexShader.glsl # Standard vertex shader
```

## Installation and Running

### Prerequisites

- Node.js 18+ and npm

### Getting Started

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the URL printed by Vite (default `http://localhost:5173`) in your browser

### Production Build

```bash
npm run build      # Output to dist/
npm run preview    # Preview the production build locally
```

## Usage Guide

### Basic Operations

- **Drawing**: Press and drag the left mouse button on the canvas, or slide on a touchscreen
- **Select preset**: Click on a preset mode in the list to switch between different simulation effects
- **Adjust parameters**: Use sliders to adjust feed, kill, and speed parameters
- **Reset**: Click the reset button to restart the simulation with default settings
- **Reset colors**: Restore the default color mapping
- **Collapse panel**: On desktop, toggle the sidebar with the collapse button (it auto-hides the reopen button after a few seconds; move the cursor to the right edge to reveal it again). On mobile, swipe the drawer left to close it.
- **Info**: Open the info dialog for an in-app explanation of the model and controls

### Parameter Explanation

- **feed (feed rate)**: Controls the supply rate of substance u, affecting pattern growth and stability
- **kill (kill rate)**: Controls the removal rate of substance v, affecting pattern decay and change
- **speed**: Multiplier for simulation iterations per frame (`1.0` = 20 iterations/frame, `0` = paused)

Different parameter combinations produce completely different patterns.

## Technical Details

### GPU Acceleration

The program uses WebGL shaders to execute reaction-diffusion equation calculations on the GPU, achieving high-performance real-time simulation. Key technologies include:

- **Double buffering**: Uses two textures alternately as input and output to improve computational efficiency
- **Multiple iterations**: Performs multiple iteration calculations per frame to ensure simulation stability
- **Laplacian operator**: Calculates the Laplacian operator using five-point difference method
- **Euler integration**: Uses explicit Euler method for time integration

### Interaction Design

- **Brush tool**: Drawing on the canvas increases the concentration of substance v, affecting the local reaction-diffusion process
- **Responsive layout**: Adapts to different screen sizes while maintaining good display effects
- **Touch support**: Compatible with touch operations on mobile devices

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Requires a modern browser with WebGL 2.0 support.

## Extension and Customization

### Adding New Preset Modes

In the `src/constants.js` file, modify the `PRESETS` array to add new parameter combinations:

```javascript
export const PRESETS = [
    // Existing presets...
    { feed: 0.03, kill: 0.065, name: 'My Custom Pattern' },  // New preset
];
```

### Customizing Color Mapping

In the `src/constants.js` file, modify the `DEFAULT_COLORS` array to adjust colors and thresholds (five segments used by `src/lib/doShow.js`):

```javascript
export const DEFAULT_COLORS = [
    { r: 0, g: 0, b: 0, threshold: 0.0 },    // Black
    { r: 0, g: 1, b: 0, threshold: 0.2 },     // Green
    { r: 1, g: 1, b: 0, threshold: 0.21 },    // Yellow
    { r: 1, g: 0, b: 0, threshold: 0.4 },     // Red
    { r: 1, g: 1, b: 1, threshold: 0.6 }      // White
];
```

## License

MIT License

## References

- [Gray-Scott Model](https://en.wikipedia.org/wiki/Gray%E2%80%93Scott_model)
- [Reaction-diffusion systems](https://en.wikipedia.org/wiki/Reaction%E2%80%93diffusion_system)
- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

## Acknowledgments

Thanks to all developers who contributed to the WebGL and Three.js communities, as well as researchers of the Gray-Scott model.