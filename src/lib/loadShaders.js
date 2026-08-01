// 使用 Vite 的 ?raw 导入，把 .glsl 文件作为字符串加载。
// 这样着色器修改时也能享受 HMR，无需同步 XHR。
import standardVertexShader from '../shaders/standardVertexShader.glsl?raw';
import gsFragmentShader from '../shaders/gsFragmentShader.glsl?raw';
import screenFragmentShader from '../shaders/screenFragmentShader.glsl?raw';

export {
    standardVertexShader,
    gsFragmentShader,
    screenFragmentShader
};
