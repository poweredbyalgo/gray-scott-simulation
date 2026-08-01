// 预设参数配置
export const PRESETS = [
    { feed: 0.037, kill: 0.06, name: 'Default' },
    { feed: 0.03, kill: 0.062, name: 'Solitons' },
    { feed: 0.025, kill: 0.06, name: 'Pulsating solitons' },
    { feed: 0.078, kill: 0.061, name: 'Worms' },
    { feed: 0.029, kill: 0.057, name: 'Mazes' },
    { feed: 0.039, kill: 0.058, name: 'Holes' },
    { feed: 0.026, kill: 0.051, name: 'Chaos' },
    { feed: 0.034, kill: 0.056, name: 'Chaos and holes' },
    { feed: 0.014, kill: 0.054, name: 'Moving spots' },
    { feed: 0.018, kill: 0.051, name: 'Spots and loops' },
    { feed: 0.014, kill: 0.045, name: 'Waves' },
    { feed: 0.062, kill: 0.06093, name: 'The U-Skate World' }
];

// 默认速度倍率（1.0 = 20 次/帧，0 = 暂停）
export const DEFAULT_SPEED = 1.0;

// 默认颜色配置（数组形式，与 doShow 的 5 段颜色对应）
export const DEFAULT_COLORS = [
    { r: 0, g: 0, b: 0, threshold: 0.0 },
    { r: 0, g: 1, b: 0, threshold: 0.2 },
    { r: 1, g: 1, b: 0, threshold: 0.21 },
    { r: 1, g: 0, b: 0, threshold: 0.4 },
    { r: 1, g: 1, b: 1, threshold: 0.6 }
];
