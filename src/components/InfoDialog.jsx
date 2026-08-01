import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons.jsx';

export default function InfoDialog({ open, onClose }) {
    const scrimRef = useRef(null);
    const dialogRef = useRef(null);
    const contentRef = useRef(null);
    const headerRef = useRef(null);

    // 触摸下滑关闭手势状态
    const touchState = useRef({ startY: 0, deltaY: 0, swiping: false });

    // ESC 关闭 + 锁定 body 滚动
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    // 重置滚动位置（关闭动画后）
    useEffect(() => {
        if (!open && contentRef.current) {
            const t = setTimeout(() => {
                if (contentRef.current) contentRef.current.scrollTop = 0;
            }, 300);
            return () => clearTimeout(t);
        }
    }, [open]);

    const handleScrimClick = (e) => {
        if (e.target === scrimRef.current) onClose();
    };

    const onTouchStart = (e) => {
        if (!open) return;
        const touch = e.touches[0];
        touchState.current.startY = touch.clientY;
        touchState.current.deltaY = 0;
        touchState.current.swiping = false;
    };

    const onTouchMove = (e) => {
        if (!open) return;
        const touch = e.touches[0];
        const dy = touch.clientY - touchState.current.startY;
        const el = dialogRef.current;
        if (!el) return;
        // 仅下拉且在内容顶部时才接管
        if (dy > 0 && (headerRef.current?.contains(e.target) || contentRef.current.scrollTop === 0)) {
            touchState.current.swiping = true;
            touchState.current.deltaY = dy;
            el.style.transition = 'none';
            el.style.transform = `translateY(${dy}px)`;
        }
    };

    const onTouchEnd = () => {
        const el = dialogRef.current;
        if (!el || !touchState.current.swiping) return;
        el.style.transition = '';
        el.style.transform = '';
        if (touchState.current.deltaY > 120) onClose();
        touchState.current.swiping = false;
        touchState.current.deltaY = 0;
    };

    return (
        <div
            ref={scrimRef}
            className={`md-dialog-scrim ${open ? 'open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="infoDialogTitle"
            onClick={handleScrimClick}
        >
            <div ref={dialogRef} className="md-dialog">
                <div ref={headerRef} className="md-dialog-header">
                    <div className="md-dialog-grabber" aria-hidden="true" />
                    <div className="md-dialog-header-row">
                        <div>
                            <h2 id="infoDialogTitle" className="font-google text-[22px] font-medium text-[var(--md-on-surface)] leading-tight">
                                关于 Gray-Scott
                            </h2>
                            <p className="text-[12px] text-[var(--md-on-surface-variant)] mt-0.5">Reaction-Diffusion Lab · 使用指南</p>
                        </div>
                        <button className="icon-btn" title="关闭" aria-label="关闭" onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div
                    ref={contentRef}
                    className="md-dialog-content"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="md-dialog-body">
                        <section className="mb-5">
                            <h3 className="info-h3">什么是 Gray-Scott 模型？</h3>
                            <p className="info-p">
                                Gray-Scott 模型是一种<strong>反应-扩散方程</strong>，描述两种化学物质（U 和 V）在空间中的相互作用：
                            </p>
                            <pre className="info-formula">{'∂U/∂t = D_u·∇²U − UV² + F(1−U)\n∂V/∂t = D_v·∇²V + UV² − (F+K)V'}</pre>
                            <p className="info-p">
                                其中 U 不断被供给、V 不断被消耗，二者通过非线性项 UV² 耦合。简单规则下，会自发涌现出斑点、条纹、迷宫、孤子等复杂图案 —— 这正是<strong>图灵图案</strong>的典型例子，被广泛用于模拟生物形态发生、化学反应动力学等。
                            </p>
                        </section>

                        <section className="mb-5">
                            <h3 className="info-h3">核心参数</h3>
                            <div className="info-row"><span className="info-tag">Feed (F)</span><span className="info-text">U 的补充速率。值越大，系统更活跃、易形成斑点。</span></div>
                            <div className="info-row"><span className="info-tag">Kill (K)</span><span className="info-text">V 的消耗速率。值越大，图案更稀疏、趋于消失。</span></div>
                            <div className="info-row"><span className="info-tag">预设</span><span className="info-text">精选的 (F, K) 组合，对应已知形态（孤子、虫子、迷宫等）。</span></div>
                            <p className="info-p info-tip">调节 F/K 滑块时会自动取消预设，进入自由探索模式。</p>
                        </section>

                        <section className="mb-5">
                            <h3 className="info-h3">颜色映射 (Color Map)</h3>
                            <p className="info-p">
                                颜色按 V 物质的浓度映射。共 5 个 Stage，每个 Stage 包含 R/G/B 颜色通道和 T 阈值：
                            </p>
                            <div className="info-row"><span className="info-tag">R / G / B</span><span className="info-text">该 Stage 的颜色（0~1）。</span></div>
                            <div className="info-row"><span className="info-tag">T (Threshold)</span><span className="info-text">该颜色开始生效的浓度阈值，需按 Stage 顺序递增。</span></div>
                            <p className="info-p info-tip">相邻 Stage 之间会平滑过渡，可创建渐变调色板。</p>
                        </section>

                        <section className="mb-3">
                            <h3 className="info-h3">交互操作</h3>
                            <div className="info-row"><span className="info-tag">画布</span><span className="info-text">按住鼠标/手指拖动，可在画布上"绘制" V 物质，触发新的反应图案。</span></div>
                            <div className="info-row"><span className="info-tag">重置模拟</span><span className="info-text">恢复到初始状态并清除所有绘制痕迹。</span></div>
                            <div className="info-row"><span className="info-tag">重置颜色</span><span className="info-text">恢复默认的 5 段调色板。</span></div>
                            <div className="info-row"><span className="info-tag">收起面板</span><span className="info-text">点击头部蓝色按钮收起；收起后触摸屏幕右侧边缘可重新展开。</span></div>
                        </section>
                    </div>
                </div>
                <div className="md-dialog-actions">
                    <button className="md-text-btn" onClick={onClose}>明白了</button>
                </div>
            </div>
        </div>
    );
}
