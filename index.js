import doCal from './utils/doCal.js';
import doShow from './utils/doShow.js';
import useCanvas from './utils/useCanvas.js';
import useThree from './utils/useThree.js';

// 预设参数配置
const PRESETS = [
    { feed: 0.037, kill: 0.06, name: 'Default' },   // 预设1
    { feed: 0.03, kill: 0.062, name: 'Solitons' },   // 预设2
    { feed: 0.025, kill: 0.06, name: 'Pulsating solitons' },   // 预设3
    { feed: 0.078, kill: 0.061, name: 'Worms' },  // 预设4
    { feed: 0.029, kill: 0.057, name: 'Mazes' },  // 预设5
    { feed: 0.039, kill: 0.058, name: 'Holes' },  // 预设6
    { feed: 0.026, kill: 0.051, name: 'Chaos' },  // 预设7
    { feed: 0.034, kill: 0.056, name: 'Chaos and holes' },  // 预设8
    { feed: 0.014, kill: 0.054, name: 'Moving spots' },  // 预设9
    { feed: 0.018, kill: 0.051, name: 'Spots and loops' },  // 预设10
    { feed: 0.014, kill: 0.045, name: 'Waves' },  // 预设11
    { feed: 0.062, kill: 0.06093, name: 'The U-Skate World' } // 预设12
];

// 将预设配置暴露给全局作用域
window.PRESETS = PRESETS;

// 当前参数
let currentPreset;
let feed;
let kill;

// 共享的纹理统一变量
const sharedTextureUniform = { type: "t", value: undefined };

// 渲染循环
const render = (time) => {
    doCal.render(time);
    doShow.render();
    requestAnimationFrame(render);
};

// 工具函数：调整大小
// 导出此函数以便在 HTML 中根据容器大小变化调用
const resize = (width, height) => {
    if (!width || !height) return;
    useCanvas.canvas.width = width;
    useCanvas.canvas.height = height;
    useThree.setScreenSize(width, height);
    doCal.setScreenSize(width, height);
};

// 初始化应用
const init = () => {
    // 初始设置
    useCanvas.init(doCal.setBrush);
    useThree.init(useCanvas.canvas);
    doShow.init(sharedTextureUniform, useThree.doRender);
    
    // 初始化时获取当前容器尺寸
    const width = useCanvas.canvas.clientWidth || window.innerWidth;
    const height = useCanvas.canvas.clientHeight || window.innerHeight;
    
    doCal.init(width, height, sharedTextureUniform, useThree.doRender);
    
    // 设置默认参数
    doCal.setFeed(feed);
    doCal.setKill(kill);

    setPreset(0);
    
    // 启动渲染循环
    render(0);
    
    // 设置默认画笔位置
    doCal.calcUniforms.brush.value = new THREE.Vector2(0.5, 0.5);
};

const setPreset = (index) => {
    if (index >= 0 && index < PRESETS.length) {
        currentPreset = index;
        feed = PRESETS[index].feed;
        kill = PRESETS[index].kill;
        doCal.setFeed(feed);
        doCal.setKill(kill);
    }
};

// 参数设置函数
const setFeed = (f) => doCal.setFeed(f);
const setKill = (k) => doCal.setKill(k);

// 全屏功能
const fullScreen = () => {
    const elem = useCanvas.canvas;
    
    if (isFullscreen()) {
        exitFullscreen();
    } else {
        // 保存当前尺寸
        window.oldCanvSize = {
            width: elem.clientWidth,
            height: elem.clientHeight
        };
        
        // 调整为屏幕尺寸
        resize(screen.width, screen.height);
        
        // 请求全屏
        requestFullscreen(elem);
    }
};

const exitFullScreen = () => {
    if (window.oldCanvSize) {
        resize(window.oldCanvSize.width, window.oldCanvSize.height);
    }
    exitFullscreen();
};

const reset = () => {
    setPreset(0);
    doCal.reset();
    // 重新获取容器尺寸，因为可能在折叠侧边栏后重置
    if (useCanvas.canvas.parentElement) {
        const w = useCanvas.canvas.parentElement.clientWidth;
        const h = useCanvas.canvas.parentElement.clientHeight;
        resize(w, h);
    }
};

// 颜色控制
const setColor = (index, r, g, b, threshold) => doShow.setColor(index, r, g, b, threshold);
const setColors = (colors) => doShow.setColors(colors);
const resetColors = () => doShow.resetColors();

const isFullscreen = () => {
    return document.mozFullScreenElement ||
           document.webkitCurrentFullScreenElement ||
           document.fullscreenElement;
};

const requestFullscreen = (elem) => {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
};

const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
};

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
    if (!isFullscreen() && window.oldCanvSize) {
        resize(window.oldCanvSize.width, window.oldCanvSize.height);
    }
});

// 增加 resize 导出
export { 
    init, 
    reset, 
    fullScreen, 
    exitFullScreen, 
    setFeed, 
    setKill, 
    setColor, 
    setColors, 
    resetColors,
    setPreset,
    resize // 新增导出
};