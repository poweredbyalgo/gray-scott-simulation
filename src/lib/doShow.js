// 颜色显示管理（工厂函数）
import * as THREE from 'three';
import { standardVertexShader, screenFragmentShader } from './loadShaders.js';
import { DEFAULT_COLORS } from '../constants.js';

export function createShow() {
    let screenMaterial = null;
    let renderFunction = null;

    // 默认颜色配置
    const DEFAULT_COLORS_MAP = {
        color1: DEFAULT_COLORS[0],
        color2: DEFAULT_COLORS[1],
        color3: DEFAULT_COLORS[2],
        color4: DEFAULT_COLORS[3],
        color5: DEFAULT_COLORS[4]
    };

    // 着色器统一变量
    const shaderUniforms = {
        tSource: undefined,
        color1: { type: "v4", value: new THREE.Vector4(0, 0, 0, 0) },
        color2: { type: "v4", value: new THREE.Vector4(0, 1, 0, 0.2) },
        color3: { type: "v4", value: new THREE.Vector4(1, 1, 0, 0.21) },
        color4: { type: "v4", value: new THREE.Vector4(1, 0, 0, 0.4) },
        color5: { type: "v4", value: new THREE.Vector4(1, 1, 1, 0.6) }
    };

    // 应用颜色配置到着色器
    const applyColorToShader = (colorName, color) => {
        if (shaderUniforms[colorName]) {
            shaderUniforms[colorName].value.set(color.r, color.g, color.b, color.threshold);
        }
    };

    // 设置单个颜色
    const setColor = (index, r, g, b, threshold) => {
        const colorKey = `color${index}`;
        if (shaderUniforms[colorKey]) {
            shaderUniforms[colorKey].value.set(r, g, b, threshold);
        }
    };

    // 设置所有颜色
    const setColors = (colors) => {
        colors.forEach((color, index) => {
            if (index < 5) { // 最多5个颜色
                setColor(index + 1, color.r, color.g, color.b, color.threshold);
            }
        });
    };

    // 重置为默认颜色
    const resetColors = () => {
        Object.keys(DEFAULT_COLORS_MAP).forEach(colorKey => {
            applyColorToShader(colorKey, DEFAULT_COLORS_MAP[colorKey]);
        });
    };

    // 初始化
    const init = (sharedTextureUniform, renderFunc) => {
        renderFunction = renderFunc;
        shaderUniforms.tSource = sharedTextureUniform;

        // 创建着色器材质
        screenMaterial = new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader: standardVertexShader,
            fragmentShader: screenFragmentShader,
        });

        // 应用默认颜色
        resetColors();
    };

    // 渲染到屏幕
    const render = () => {
        if (renderFunction) {
            renderFunction(screenMaterial, undefined);
        }
    };

    return {
        render,
        init,
        setColor,
        setColors,
        resetColors,
        get screenMaterial() { return screenMaterial; },
        get shaderUniforms() { return shaderUniforms; }
    };
}
