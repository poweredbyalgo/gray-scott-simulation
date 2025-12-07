// Gray-Scott 方程计算核心
import { standardVertexShader, gsFragmentShader } from './loadShaders.js';

// WebGL 纹理选项
const textureOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping
};



// 变量
let texture1 = null, texture2 = null;
let material = null;
let canvasWidth = 0, canvasHeight = 0;
let renderFunction = null;
let isToggled = false;
let lastTime = 0;

// 画笔控制
const HIDE_BRUSH = new THREE.Vector2(-1, -1);   // 隐藏画笔
const INIT_BRUSH = new THREE.Vector2(-10, -10); // 重置画笔

const ratio = 2; // 渲染比例

// 计算着色器统一变量
const calcUniforms = {
    tSource: undefined,
    screenWidth: { type: "f", value: undefined },
    screenHeight: { type: "f", value: undefined },
    delta: { type: "f", value: 1.0 },
    feed: { type: "f", value: undefined },
    kill: { type: "f", value: undefined },
    brush: { type: "v2", value: INIT_BRUSH }
};

// 初始化
const init = (width, height, sharedTextureUniform, renderFunc) => {
    renderFunction = renderFunc;
    canvasWidth = width;
    canvasHeight = height;
    
    const screenWidth = width / ratio;
    const screenHeight = height / ratio;
    
    // 创建渲染目标
    texture1 = new THREE.WebGLRenderTarget(screenWidth, screenHeight, textureOptions);
    texture2 = new THREE.WebGLRenderTarget(screenWidth, screenHeight, textureOptions);
    
    // 初始化共享纹理
    sharedTextureUniform.value = texture1.texture;
    calcUniforms.tSource = sharedTextureUniform;
    
    // 创建计算着色器材质
    material = new THREE.ShaderMaterial({
        uniforms: calcUniforms,
        vertexShader: standardVertexShader,
        fragmentShader: gsFragmentShader,
    });
    
    calcUniforms.screenWidth.value = screenWidth;
    calcUniforms.screenHeight.value = screenHeight;
};

// 渲染循环
const render = (time) => {
    // 计算时间差
    let deltaTime = (time - lastTime) / 20.0;
    if (deltaTime > 0.8 || deltaTime <= 0) deltaTime = 0.8;
    lastTime = time;
    calcUniforms.delta.value = deltaTime;

    // 执行多次迭代以获得稳定的图案
    for (let i = 0; i < 20; ++i) {
        const source = !isToggled ? texture1 : texture2;
        const target = !isToggled ? texture2 : texture1;
        
        calcUniforms.tSource.value = source.texture;
        renderFunction(material, target);
        calcUniforms.tSource.value = target.texture;
        
        isToggled = !isToggled;
        calcUniforms.brush.value = HIDE_BRUSH;
    }
};

// 设置画笔位置
const setBrush = (x, y) => {
    calcUniforms.brush.value = new THREE.Vector2(x / canvasWidth, 1 - y / canvasHeight);
};

// 重置计算
const reset = () => {
    calcUniforms.brush.value = INIT_BRUSH;
};

// 调整屏幕尺寸
const setScreenSize = (width, height) => {
    canvasWidth = width;
    canvasHeight = height;
    calcUniforms.screenWidth.value = width;
    calcUniforms.screenHeight.value = height;

    // 重新创建渲染目标
    texture1 = new THREE.WebGLRenderTarget(width, height, textureOptions);
    texture2 = new THREE.WebGLRenderTarget(width, height, textureOptions);
};

// 设置 Feed 参数
const setFeed = (feed) => {
    calcUniforms.feed.value = feed;
};

// 设置 Kill 参数
const setKill = (kill) => {
    calcUniforms.kill.value = kill;
};

export default {
    init,
    render,
    setBrush,
    reset,
    setScreenSize,
    setFeed,
    setKill,
    get calcUniforms() { return calcUniforms; }
};