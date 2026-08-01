import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createThree } from '../lib/useThree.js';
import { createCal } from '../lib/doCal.js';
import { createShow } from '../lib/doShow.js';
import { createCanvasInput } from '../lib/canvasInput.js';
import { PRESETS } from '../constants.js';

/**
 * 把原 index.js 的命令式模拟逻辑封装为 React hook。
 * 返回 canvasRef（挂在 <canvas> 上）以及一组稳定的命令式 API。
 */
export function useGrayScott() {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const rafRef = useRef(0);

    // 渲染循环
    const render = useCallback((time) => {
        const eng = engineRef.current;
        if (!eng) return;
        eng.cal.render(time);
        eng.show.render();
        rafRef.current = requestAnimationFrame(render);
    }, []);

    // 调整尺寸（保留当前模拟状态，仅迁移到新尺寸的渲染目标）
    const resize = useCallback((width, height) => {
        const eng = engineRef.current;
        if (!eng || !width || !height) return;
        eng.canvas.width = width;
        eng.canvas.height = height;
        eng.three.setScreenSize(width, height);
        eng.cal.setScreenSize(width, height);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // 注意：Three.js 的 setSize 会给 canvas 写入内联 px 样式，导致 canvas 自身的
        // clientWidth 被固定。因此尺寸应取自父容器（与原实现一致），ResizeObserver
        // 也观察父容器，窗口缩放才能正确触发。
        const container = canvas.parentElement;

        const three = createThree();
        const cal = createCal();
        const show = createShow();

        // 共享的纹理统一变量
        const sharedTextureUniform = { type: 't', value: undefined };

        three.init(canvas);
        show.init(sharedTextureUniform, three.doRender);

        // 初始尺寸（取自容器）
        const width = (container && container.clientWidth) || canvas.clientWidth || window.innerWidth;
        const height = (container && container.clientHeight) || canvas.clientHeight || window.innerHeight;

        cal.init(width, height, sharedTextureUniform, three.doRender);

        // 应用默认参数（预设 0）
        cal.setFeed(PRESETS[0].feed);
        cal.setKill(PRESETS[0].kill);

        // 画布交互
        const input = createCanvasInput(canvas, cal.setBrush);
        input.bind();

        engineRef.current = { three, cal, show, input, canvas, sharedTextureUniform };

        // 启动渲染循环
        rafRef.current = requestAnimationFrame(render);

        // 监听容器尺寸变化（窗口缩放）
        const ro = new ResizeObserver(() => {
            if (!container) return;
            resize(container.clientWidth, container.clientHeight);
        });
        if (container) ro.observe(container);

        // 初始触发一次尺寸归正
        if (container) resize(container.clientWidth, container.clientHeight);

        return () => {
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
            input.unbind();
            // 释放渲染目标
            try {
                cal.calcUniforms.tSource = undefined;
            } catch (e) { /* noop */ }
            three.dispose();
            engineRef.current = null;
        };
    }, [render, resize]);

    const setFeed = useCallback((f) => {
        engineRef.current?.cal.setFeed(f);
    }, []);

    const setKill = useCallback((k) => {
        engineRef.current?.cal.setKill(k);
    }, []);

    const setSpeed = useCallback((s) => {
        engineRef.current?.cal.setSpeed(s);
    }, []);

    // 返回选中的预设对象，方便 UI 更新滑块
    const setPreset = useCallback((index) => {
        const eng = engineRef.current;
        if (!eng || index < 0 || index >= PRESETS.length) return null;
        const preset = PRESETS[index];
        eng.cal.setFeed(preset.feed);
        eng.cal.setKill(preset.kill);
        return preset;
    }, []);

    const setColor = useCallback((index, r, g, b, threshold) => {
        engineRef.current?.show.setColor(index, r, g, b, threshold);
    }, []);

    const setColors = useCallback((colors) => {
        engineRef.current?.show.setColors(colors);
    }, []);

    const resetColors = useCallback(() => {
        engineRef.current?.show.resetColors();
    }, []);

    const reset = useCallback(() => {
        const eng = engineRef.current;
        if (!eng) return;
        eng.cal.setFeed(PRESETS[0].feed);
        eng.cal.setKill(PRESETS[0].kill);
        eng.cal.reset();
        const parent = eng.canvas.parentElement;
        if (parent) {
            resize(parent.clientWidth, parent.clientHeight);
        }
    }, [resize]);

    return {
        canvasRef,
        resize,
        setFeed,
        setKill,
        setSpeed,
        setPreset,
        setColor,
        setColors,
        resetColors,
        reset
    };
}
