// 1. 强制高精度，避免颜色断层
precision highp float;

// --- 输入变量 (只保留有用的) ---
varying vec2 vUv;
uniform sampler2D tSource; // 数据源纹理

// --- 调色板 (RGBA: RGB=颜色, A=位置阈值) ---
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 color4;
uniform vec4 color5;

// 线性映射函数 (如果你想要绝对的直线过渡，用这个)
float linearstep(float edge0, float edge1, float x) {
    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}
    

void main() {
    // 1. 读取数据 (V物质的浓度)
    float v = texture2D(tSource, vUv).g;

    // 2. 计算颜色

    vec3 col = color1.rgb;
    col = mix(col, color2.rgb, linearstep(color1.a, color2.a, v));
    col = mix(col, color3.rgb, linearstep(color2.a, color3.a, v));
    col = mix(col, color4.rgb, linearstep(color3.a, color4.a, v));
    col = mix(col, color5.rgb, linearstep(color4.a, color5.a, v));

    // 3. 输出
    gl_FragColor = vec4(col, 1.0);
}