import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import InfoDialog from './components/InfoDialog.jsx';
import { ChevronLeftIcon } from './components/icons.jsx';
import { useGrayScott } from './hooks/useGrayScott.js';
import { PRESETS, DEFAULT_COLORS, DEFAULT_SPEED } from './constants.js';

const RIGHT_EDGE_THRESHOLD = 80; // 距右边 80px 内触发
const SWIPE_THRESHOLD = 80;      // 左滑超过 80px 触发关闭
const AUTO_HIDE_MS = 5000;       // 收起后 5 秒自动隐藏重新展开按钮

export default function App() {
    const gs = useGrayScott();

    // 参数 / 颜色状态
    const [feed, setFeed] = useState(PRESETS[0].feed);
    const [kill, setKill] = useState(PRESETS[0].kill);
    const [speed, setSpeed] = useState(DEFAULT_SPEED);
    const [presetIndex, setPresetIndex] = useState(0);
    const [colors, setColors] = useState(() => DEFAULT_COLORS.map(c => ({ ...c })));

    // 面板 / 对话框状态
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    // 重新展开按钮的自动隐藏
    const [reopenAutoHidden, setReopenAutoHidden] = useState(false);
    const autoHideTimer = useRef(null);

    // 手势 / DOM 引用
    const sidebarRef = useRef(null);
    const overlayRef = useRef(null);
    const swipeRef = useRef({ startX: 0, startY: 0, deltaX: 0, swiping: false });

    const panelCollapsed = isMobile ? !mobileOpen : desktopCollapsed;

    // === 自动隐藏计时器 ===
    const startAutoHide = useCallback(() => {
        clearTimeout(autoHideTimer.current);
        autoHideTimer.current = setTimeout(() => setReopenAutoHidden(true), AUTO_HIDE_MS);
    }, []);

    const cancelAutoHide = useCallback(() => {
        clearTimeout(autoHideTimer.current);
        setReopenAutoHidden(false);
    }, []);

    useEffect(() => {
        if (panelCollapsed) {
            startAutoHide();
        } else {
            cancelAutoHide();
        }
        return () => clearTimeout(autoHideTimer.current);
    }, [panelCollapsed, startAutoHide, cancelAutoHide]);

    // === 窗口尺寸变化 ===
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setMobileOpen(false);
                setDesktopCollapsed(false);
            }
            // 画布尺寸由 hook 内的 ResizeObserver 自动处理
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // === 鼠标/触摸靠近右侧边缘时重新显示展开按钮 ===
    useEffect(() => {
        if (!panelCollapsed) return;

        const reveal = () => {
            if (reopenAutoHidden) {
                cancelAutoHide();
                startAutoHide();
            }
        };

        const onMouseMove = (e) => {
            if (window.innerWidth - e.clientX <= RIGHT_EDGE_THRESHOLD) reveal();
        };
        const onTouch = (e) => {
            const t = e.touches[0];
            if (!t) return;
            if (window.innerWidth - t.clientX <= RIGHT_EDGE_THRESHOLD) reveal();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouch, { passive: true });
        window.addEventListener('touchstart', onTouch, { passive: true });
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouch);
            window.removeEventListener('touchstart', onTouch);
        };
    }, [panelCollapsed, reopenAutoHidden, cancelAutoHide, startAutoHide]);

    // === 面板开/关 ===
    const toggleSidebar = useCallback(() => {
        if (isMobile) {
            setMobileOpen(o => !o);
        } else {
            setDesktopCollapsed(c => !c);
        }
    }, [isMobile]);

    const openSidebar = useCallback(() => {
        cancelAutoHide();
        if (isMobile) setMobileOpen(true);
        else setDesktopCollapsed(false);
    }, [isMobile, cancelAutoHide]);

    // 画布点击：若按钮被自动隐藏则重新显示
    const onCanvasAreaClick = () => {
        if (panelCollapsed && reopenAutoHidden) {
            cancelAutoHide();
            startAutoHide();
        }
    };

    // === 移动端侧边栏左滑关闭手势 ===
    const onSidebarTouchStart = (e) => {
        if (!isMobile || !mobileOpen) return;
        const t = e.touches[0];
        swipeRef.current = { startX: t.clientX, startY: t.clientY, deltaX: 0, swiping: false };
    };

    const onSidebarTouchMove = (e) => {
        if (!isMobile || !mobileOpen) return;
        const t = e.touches[0];
        const dx = t.clientX - swipeRef.current.startX;
        const dy = t.clientY - swipeRef.current.startY;
        if (dx < 0 && Math.abs(dx) > Math.abs(dy)) {
            swipeRef.current.swiping = true;
            swipeRef.current.deltaX = dx;
            const el = sidebarRef.current;
            if (el) {
                el.style.transition = 'none';
                el.style.transform = `translateX(${dx}px)`;
            }
            if (overlayRef.current) {
                const progress = Math.min(Math.abs(dx) / window.innerWidth, 1);
                overlayRef.current.style.opacity = String(1 - progress * 0.5);
            }
        }
    };

    const onSidebarTouchEnd = () => {
        const s = swipeRef.current;
        if (!s.swiping) return;
        const el = sidebarRef.current;
        if (el) {
            el.style.transition = '';
            el.style.transform = '';
        }
        if (overlayRef.current) overlayRef.current.style.opacity = '';
        if (s.deltaX < -SWIPE_THRESHOLD) setMobileOpen(false);
        s.swiping = false;
        s.deltaX = 0;
    };

    // === 参数 / 颜色回调 ===
    const handlePresetChange = (i) => {
        const preset = gs.setPreset(i);
        if (preset) {
            setFeed(preset.feed);
            setKill(preset.kill);
            setPresetIndex(i);
        }
    };

    const handleFeedChange = (v) => {
        setFeed(v);
        gs.setFeed(v);
        setPresetIndex(-1);
    };

    const handleKillChange = (v) => {
        setKill(v);
        gs.setKill(v);
        setPresetIndex(-1);
    };

    const handleSpeedChange = (v) => {
        setSpeed(v);
        gs.setSpeed(v);
    };

    const handleColorChange = (index, color) => {
        setColors(prev => prev.map((c, i) => (i === index ? color : c)));
        gs.setColor(index + 1, color.r, color.g, color.b, color.threshold);
    };

    const handleReset = () => {
        gs.reset();
        setFeed(PRESETS[0].feed);
        setKill(PRESETS[0].kill);
        setSpeed(DEFAULT_SPEED);
        gs.setSpeed(DEFAULT_SPEED);
        setPresetIndex(0);
    };

    const handleResetColors = () => {
        gs.resetColors();
        setColors(DEFAULT_COLORS.map(c => ({ ...c })));
    };

    // 侧边栏 className
    const sidebarClass = [
        'absolute top-0 right-0 bottom-0 w-[30%] min-w-[340px] max-w-[420px] transition-all duration-300 ease-in-out mobile-sidebar z-40',
        isMobile ? (mobileOpen ? '' : 'translate-x-full') : (desktopCollapsed ? 'sidebar-hidden' : ''),
        'md:translate-x-0'
    ].join(' ');

    const reopenClass = `reopen-btn ${panelCollapsed ? 'visible' : ''} ${reopenAutoHidden ? 'auto-hidden' : ''}`;

    return (
        <div className="relative h-full">
            {/* 全屏画布区域 */}
            <div
                className="absolute inset-0 h-full overflow-hidden bg-black"
                onClick={onCanvasAreaClick}
            >
                <canvas
                    ref={gs.canvasRef}
                    className="block w-full h-full cursor-crosshair outline-none gs-canvas"
                ></canvas>
            </div>

            {/* 移动端遮罩 */}
            <div
                ref={overlayRef}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity md:hidden ${isMobile && mobileOpen ? '' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            {/* 右侧控制面板 */}
            <div
                ref={sidebarRef}
                className={sidebarClass}
                onTouchStart={onSidebarTouchStart}
                onTouchMove={onSidebarTouchMove}
                onTouchEnd={onSidebarTouchEnd}
            >
                <Sidebar
                    feed={feed}
                    kill={kill}
                    speed={speed}
                    presetIndex={presetIndex}
                    colors={colors}
                    onFeedChange={handleFeedChange}
                    onKillChange={handleKillChange}
                    onSpeedChange={handleSpeedChange}
                    onPresetChange={handlePresetChange}
                    onColorChange={handleColorChange}
                    onReset={handleReset}
                    onResetColors={handleResetColors}
                    onInfoClick={() => setInfoOpen(true)}
                    onClose={toggleSidebar}
                />
            </div>

            {/* 面板收起时的重新展开按钮 */}
            <button
                className={reopenClass}
                title="展开面板"
                aria-label="展开面板"
                onClick={openSidebar}
                onMouseEnter={cancelAutoHide}
                onMouseLeave={() => { if (panelCollapsed) startAutoHide(); }}
            >
                <ChevronLeftIcon />
            </button>

            {/* 关于对话框 */}
            <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
        </div>
    );
}
