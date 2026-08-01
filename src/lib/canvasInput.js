// Canvas 交互管理（工厂函数）
// 接受 canvas 元素，返回事件绑定/解绑与画笔控制接口。
export function createCanvasInput(canvas, brushHandler) {
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;

    const setBrush = (x, y) => {
        if (brushHandler) brushHandler(x, y);
    };

    const handleMouseMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        if (isMouseDown) setBrush(mouseX, mouseY);
    };

    const handleMouseDown = () => {
        isMouseDown = true;
        setBrush(mouseX, mouseY);
    };

    const handleMouseUp = () => {
        isMouseDown = false;
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        handleMouseDown();
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        if (isMouseDown) setBrush(mouseX, mouseY);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        handleMouseUp();
    };

    const handleContextMenu = (e) => e.preventDefault();

    const bind = () => {
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('contextmenu', handleContextMenu);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    };

    const unbind = () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('contextmenu', handleContextMenu);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
    };

    return { bind, unbind };
}
