// Gray-Scott 方程计算核心（工厂函数）
import * as THREE from 'three';
import { standardVertexShader, gsFragmentShader } from './loadShaders.js';

// 纹理拷贝着色器：resize 时把旧模拟状态转移到新尺寸的渲染目标上
const copyFragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tSource;
    void main() {
        gl_FragColor = texture2D(tSource, vUv);
    }
`;

export function createCal() {
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
    let copyMaterial = null;
    let canvasWidth = 0, canvasHeight = 0;
    let renderFunction = null;
    let sharedTextureUniformRef = null;
    let isToggled = false;
    let lastTime = 0;

    // 速度倍率：每帧迭代次数 = BASE_ITERATIONS * speed（0 表示暂停）
    const BASE_ITERATIONS = 20;
    let iterationsPerFrame = BASE_ITERATIONS;

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
        sharedTextureUniformRef = sharedTextureUniform;
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

        // 纹理拷贝材质（resize 时保留模拟状态用）
        copyMaterial = new THREE.ShaderMaterial({
            uniforms: { tSource: { value: null } },
            vertexShader: standardVertexShader,
            fragmentShader: copyFragmentShader,
        });

        calcUniforms.screenWidth.value = screenWidth;
        calcUniforms.screenHeight.value = screenHeight;

        // 种子初始状态 (U=1, V=0)，使模拟从有效状态启动
        // 重置分支不读取 tSource，给个有效值避免 WebGL 警告即可
        calcUniforms.brush.value = INIT_BRUSH;
        calcUniforms.tSource.value = texture2.texture;
        renderFunction(material, texture1);
        calcUniforms.brush.value = HIDE_BRUSH;
        calcUniforms.tSource.value = texture1.texture;
    };

    // 渲染循环
    const render = (time) => {
        // 计算时间差
        let deltaTime = (time - lastTime) / 20.0;
        if (deltaTime > 0.8 || deltaTime <= 0) deltaTime = 0.8;
        lastTime = time;
        calcUniforms.delta.value = deltaTime;

        // 执行多次迭代以获得稳定的图案（次数由速度倍率控制）
        for (let i = 0; i < iterationsPerFrame; ++i) {
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

    // 调整屏幕尺寸（保留当前模拟状态，F11/窗口缩放不清空）
    const setScreenSize = (width, height) => {
        canvasWidth = width;
        canvasHeight = height;
        calcUniforms.screenWidth.value = width;
        calcUniforms.screenHeight.value = height;

        // 保存当前模拟状态（最近一次写入的纹理）
        const oldCurrent = !isToggled ? texture1 : texture2;

        // 创建新渲染目标
        texture1 = new THREE.WebGLRenderTarget(width, height, textureOptions);
        texture2 = new THREE.WebGLRenderTarget(width, height, textureOptions);

        // 把旧状态复制到新纹理，保持动画连续
        const newCurrent = !isToggled ? texture1 : texture2;
        copyMaterial.uniforms.tSource.value = oldCurrent.texture;
        renderFunction(copyMaterial, newCurrent);
        copyMaterial.uniforms.tSource.value = null;

        // 更新共享纹理指针，确保 show 阶段读到新纹理
        if (sharedTextureUniformRef) {
            sharedTextureUniformRef.value = newCurrent.texture;
            calcUniforms.tSource = sharedTextureUniformRef;
        }
    };

    // 设置 Feed 参数
    const setFeed = (feed) => {
        calcUniforms.feed.value = feed;
    };

    // 设置 Kill 参数
    const setKill = (kill) => {
        calcUniforms.kill.value = kill;
    };

    // 设置速度倍率（0 = 暂停，1 = 默认 20 次/帧，n = n×20 次/帧）
    const setSpeed = (speed) => {
        const s = Math.max(0, Number(speed) || 0);
        iterationsPerFrame = Math.round(BASE_ITERATIONS * s);
    };

    return {
        init,
        render,
        setBrush,
        reset,
        setScreenSize,
        setFeed,
        setKill,
        setSpeed,
        get calcUniforms() { return calcUniforms; }
    };
}
