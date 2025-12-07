// --- 精度设置 ---
precision highp float;

// --- 输入变量 ---
varying vec2 vUv;
uniform float screenWidth;     // 兼容原 JS
uniform float screenHeight;
uniform sampler2D tSource;
uniform float delta;           // 时间步长 dt
uniform float feed;            // 补给率 f
uniform float kill;            // 去除率 k
uniform vec2 brush;            // 画笔位置

// --- 物理常数定义 (消除 Magic Numbers) ---
#define DIFFUSION_U 0.2097     // U 物质扩散系数
#define DIFFUSION_V 0.1050     // V 物质扩散系数
#define RESET_SIGNAL -5.0      // 重置信号阈值
#define BRUSH_RADIUS_SQ 5.0    // 画笔半径平方
#define BRUSH_VALUE 0.9        // 画笔留下的 V 浓度

// --- 纯净状态定义 ---
const vec4 INITIAL_STATE = vec4(1.0, 0.0, 0.0, 1.0); // 全红(U=1, V=0)

// ----------------------------------------------------------------
// 助手函数：获取像素尺寸
// ----------------------------------------------------------------
vec2 getTexelSize() {
    return vec2(1.0 / screenWidth, 1.0 / screenHeight);
}

// ----------------------------------------------------------------
// 核心算子：计算拉普拉斯 (Laplacian)
// 描述：计算当前点与周围邻居的浓度差
// ----------------------------------------------------------------
vec2 computeLaplacian(vec2 uv, vec2 currentVal) {
    vec2 texel = getTexelSize();
    
    // 冯·诺依曼邻域 (Von Neumann Neighborhood) 采样
    vec2 left   = texture2D(tSource, uv + vec2(-texel.x, 0.0)).rg;
    vec2 right  = texture2D(tSource, uv + vec2( texel.x, 0.0)).rg;
    vec2 top    = texture2D(tSource, uv + vec2(0.0,  texel.y)).rg;
    vec2 bottom = texture2D(tSource, uv + vec2(0.0, -texel.y)).rg;

    // 五点差分公式
    return (left + right + top + bottom) - 4.0 * currentVal;
}

// ----------------------------------------------------------------
// 物理模型：Gray-Scott 反应扩散方程
// ----------------------------------------------------------------
vec2 solveGrayScott(vec2 current, vec2 laplacian, float f, float k) {
    float u = current.r;
    float v = current.g;
    
    // 反应项：uv²
    float reaction = u * v * v;

    // 扩散项 + 反应项 + 补给/去除项
    float du = DIFFUSION_U * laplacian.r - reaction + f * (1.0 - u);
    float dv = DIFFUSION_V * laplacian.g + reaction - (f + k) * v;

    return vec2(du, dv);
}

// ----------------------------------------------------------------
// 交互逻辑：应用画笔
// ----------------------------------------------------------------
void applyBrush(inout vec2 state, vec2 coords, vec2 mousePos) {
    // 如果鼠标在屏幕外，不处理
    if (mousePos.x <= 0.0) return;

    vec2 texel = getTexelSize();
    vec2 diff = (coords - mousePos) / texel;
    
    // 使用点积计算距离平方 (比 distance() 开根号更快)
    if (dot(diff, diff) < BRUSH_RADIUS_SQ) {
        state.g = BRUSH_VALUE; // 强制注入 V 物质
    }
}

// ----------------------------------------------------------------
// 主函数
// ----------------------------------------------------------------
void main() {
    // 1. 检查是否需要重置世界
    if (brush.x < RESET_SIGNAL) {
        gl_FragColor = INITIAL_STATE;
        return;
    }

    // 2. 读取当前状态
    vec2 currentState = texture2D(tSource, vUv).rg;

    // 3. 计算拉普拉斯算子
    vec2 laplacian = computeLaplacian(vUv, currentState);

    // 4. 解微分方程，得到变化率 (du, dv)
    vec2 deltaState = solveGrayScott(currentState, laplacian, feed, kill);

    // 5. 时间积分 (欧拉法)：新状态 = 旧状态 + 变化率 * dt
    vec2 nextState = currentState + deltaState * delta;

    // 6. 处理用户交互
    applyBrush(nextState, vUv, brush);

    // 7. 输出最终颜色
    gl_FragColor = vec4(nextState, 0.0, 1.0);
}