# Gray-Scott Reaction-Diffusion Simulation

A real-time GPU-accelerated simulation of the Gray-Scott reaction-diffusion model, implemented using WebGL and Three.js.

## Introduction

The Gray-Scott model is a mathematical model used to simulate reaction-diffusion systems, capable of generating rich and diverse self-organizing patterns such as spiral waves, spots, mazes, and worm-like structures. This project uses GPU acceleration to simulate this process in real-time and provides an interactive control interface.

## Features

- **Real-time GPU-accelerated simulation**: High-performance computation and rendering using WebGL and Three.js
- **Multiple preset modes**: Built-in 12 different parameter combinations producing diverse patterns
- **Interactive drawing**: Draw on the canvas with mouse or touch to real-time influence the simulation
- **Parameter adjustment**: Modify feed and kill parameters to observe pattern changes under different conditions
- **Color customization**: Support for custom color mapping to create unique visual effects
- **Fullscreen display**: Immersive fullscreen mode support
- **Responsive design**: Adapts to different screen sizes

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
Gray-Scott/
├── index.html          # Main page
├── index.js            # Main program entry
├── shaders/            # GLSL shaders
│   ├── gsFragmentShader.glsl    # Gray-Scott computation shader
│   ├── screenFragmentShader.glsl # Screen display shader
│   └── standardVertexShader.glsl # Standard vertex shader
└── utils/              # Utility functions
    ├── doCal.js        # Computation core
    ├── doShow.js       # Color display management
    ├── loadShaders.js  # Shader loading
    ├── useCanvas.js    # Canvas interaction management
    └── useThree.js     # Three.js utilities
```

## Installation and Running

### Method 1: Local Server

1. Clone or download the project files
2. Start a local server in the project directory:
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser

### Method 2: Direct Opening

Some browsers may allow direct opening of the `index.html` file, but due to cross-origin restrictions, shader files may not load correctly. The local server method is recommended.

## Usage Guide

### Basic Operations

- **Drawing**: Press and drag the left mouse button on the canvas, or slide on a touchscreen
- **Select preset**: Click on a preset mode in the list to switch between different simulation effects
- **Adjust parameters**: Use sliders to adjust feed and kill parameters
- **Reset**: Click the reset button to restart the simulation
- **Fullscreen**: Click the fullscreen button to enter/exit fullscreen mode

### Parameter Explanation

- **feed (feed rate)**: Controls the supply rate of substance u, affecting pattern growth and stability
- **kill (kill rate)**: Controls the removal rate of substance v, affecting pattern decay and change

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

In the `index.js` file, modify the `PRESETS` array to add new parameter combinations:

```javascript
const PRESETS = [
    // Existing presets...
    { feed: 0.03, kill: 0.065, name: 'My Custom Pattern' },  // New preset
];
```

### Customizing Color Mapping

In the `utils/doShow.js` file, modify the `DEFAULT_COLORS` object to adjust colors and thresholds:

```javascript
const DEFAULT_COLORS = {
    color1: { r: 0, g: 0, b: 0, threshold: 0.0 },      // Black
    color2: { r: 0, g: 1, b: 0, threshold: 0.2 },        // Green
    color3: { r: 1, g: 1, b: 0, threshold: 0.21 },       // Yellow
    color4: { r: 1, g: 0, b: 0, threshold: 0.4 },        // Red
    color5: { r: 1, g: 1, b: 1, threshold: 0.6 }         // White
};
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