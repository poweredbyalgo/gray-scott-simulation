let mScene, mCamera, mRenderer, mScreenQuad;

const init = (canvas) => {
    // 创建WebGL渲染器，并设置preserveDrawingBuffer为true以便可以保存图像
    mRenderer = new THREE.WebGLRenderer({ canvas: canvas, preserveDrawingBuffer: true });
    mRenderer.setSize(canvas.clientWidth, canvas.clientHeight);

    mCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000);
    mCamera.position.z = 100;

    // 创建覆盖整个屏幕的四边形几何体
    const plane = new THREE.PlaneGeometry(1.0, 1.0);
    mScreenQuad = new THREE.Mesh(plane);

    mScene = new THREE.Scene();
    mScene.add(mScreenQuad);
    mScene.add(mCamera);
}

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
}

const setScreenSize = (width, height) => {
    mRenderer.setSize(width, height);
}

export default { init, doRender, setScreenSize };
