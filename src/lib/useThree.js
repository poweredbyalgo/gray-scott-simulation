// Three.js 渲染基础设施（工厂函数，便于在 React 中按挂载实例化）
import * as THREE from 'three';

export function createThree() {
    let mScene, mCamera, mRenderer, mScreenQuad;

    const init = (canvas) => {
        mRenderer = new THREE.WebGLRenderer({ canvas: canvas, preserveDrawingBuffer: true });
        mRenderer.setSize(canvas.clientWidth, canvas.clientHeight);

        mCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000);
        mCamera.position.z = 100;

        const plane = new THREE.PlaneGeometry(1.0, 1.0);
        mScreenQuad = new THREE.Mesh(plane, new THREE.MeshBasicMaterial());

        mScene = new THREE.Scene();
        mScene.add(mScreenQuad);
        mScene.add(mCamera);
    };

    const doRender = (material, target) => {
        mScreenQuad.material = material;

        if (target) {
            mRenderer.setRenderTarget(target);
            mRenderer.clear();
            mRenderer.render(mScene, mCamera);
            mRenderer.setRenderTarget(null);
        } else {
            mRenderer.clear();
            mRenderer.render(mScene, mCamera);
        }
    };

    const setScreenSize = (width, height) => {
        mRenderer.setSize(width, height);
    };

    const dispose = () => {
        if (mRenderer) {
            mRenderer.dispose();
        }
    };

    return { init, doRender, setScreenSize, dispose };
}
