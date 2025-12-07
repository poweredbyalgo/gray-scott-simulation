// Canvas 交互管理
let isMouseDown = false;
let mouseX = 0, mouseY = 0;
let brushHandler = null;

const canvas = document.getElementById('myCanvas');
const container = document.getElementById('container');

// 设置画笔位置
const setBrush = (x, y) => {
    if (brushHandler) {
        brushHandler(x, y);
    }
};

// 处理鼠标移动
const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    
    if (isMouseDown) {
        setBrush(mouseX, mouseY);
    }
};

// 处理鼠标按下
const handleMouseDown = () => {
    isMouseDown = true;
    setBrush(mouseX, mouseY);
};

// 处理鼠标释放
const handleMouseUp = () => {
    isMouseDown = false;
};

// 初始化
const init = (brushHandlerFunc) => {
    brushHandler = brushHandlerFunc;
    
    // 绑定事件
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // 阻止右键菜单
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // 触摸支持（移动设备）
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        handleMouseDown();
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        if (isMouseDown) {
            setBrush(mouseX, mouseY);
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleMouseUp();
    });
};

export default { 
    canvas, 
    container, 
    init,
    setBrush
};