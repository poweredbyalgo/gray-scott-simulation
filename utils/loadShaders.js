function loadShaderFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'shaders/' + url, false);
    xhr.send();
    return xhr.responseText;
}

const standardVertexShader = loadShaderFile('standardVertexShader.glsl');
const gsFragmentShader = loadShaderFile('gsFragmentShader.glsl');
const screenFragmentShader = loadShaderFile('screenFragmentShader.glsl');

export {
    standardVertexShader,
    gsFragmentShader,
    screenFragmentShader
};