import { useEffect, useId, useRef, useState } from 'react';
import { PRESETS } from '../constants.js';
import { ChevronDownIcon } from './icons.jsx';

/**
 * 自定义预设下拉框（替代原生 <select>，以获得完全的样式控制）。
 * 每个选项展示预设名 + feed/kill 数值，支持高亮选中、外部点击/ESC 关闭、键盘导航。
 */
export default function PresetSelect({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // 键盘高亮项
    const rootRef = useRef(null);
    const listRef = useRef(null);
    const labelId = useId();

    const selectedIndex = value >= 0 && value < PRESETS.length ? value : -1;
    const currentName = selectedIndex >= 0 ? PRESETS[selectedIndex].name : '自由探索模式';

    // 外部点击 / ESC 关闭
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    // 打开时把高亮项对齐到当前选中项，并滚动到可视区
    useEffect(() => {
        if (!open) return;
        const start = selectedIndex >= 0 ? selectedIndex : 0;
        setActiveIndex(start);
        const t = requestAnimationFrame(() => {
            const el = listRef.current?.querySelector(`[data-idx="${start}"]`);
            el?.scrollIntoView({ block: 'nearest' });
        });
        return () => cancelAnimationFrame(t);
    }, [open, selectedIndex]);

    const selectIndex = (i) => {
        onChange(i);
        setOpen(false);
    };

    const onKeyDown = (e) => {
        if (!open) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        const n = PRESETS.length;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((a) => (a + 1) % n);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((a) => (a - 1 + n) % n);
                break;
            case 'Enter':
                e.preventDefault();
                selectIndex(activeIndex);
                break;
            case 'Tab':
                setOpen(false);
                break;
            default:
                break;
        }
    };

    // 同步键盘高亮项滚动入视
    useEffect(() => {
        if (!open) return;
        const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, open]);

    return (
        <div ref={rootRef} className="relative">
            {/* 触发器 */}
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={labelId}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={onKeyDown}
                className="md-select w-full px-3 py-2 text-[13px] font-medium cursor-pointer flex items-center justify-between text-left"
            >
                <span id={labelId} className={selectedIndex < 0 ? 'text-[var(--md-on-surface-variant)]' : ''}>
                    {currentName}
                </span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* 下拉面板 */}
            {open && (
                <div
                    ref={listRef}
                    role="listbox"
                    aria-labelledby={labelId}
                    className="absolute z-50 left-0 right-0 mt-2 max-h-[280px] overflow-y-auto custom-scrollbar rounded-2xl border border-[var(--md-outline-variant)] bg-[var(--md-surface-container-high)] shadow-[0_8px_28px_rgba(0,0,0,0.55),0_24px_48px_rgba(0,0,0,0.35)] py-1.5"
                >
                    {selectedIndex < 0 && (
                        <div className="px-3 py-2 mb-1 mx-1.5 rounded-lg bg-[var(--md-surface-container-highest)]">
                            <div className="text-[11px] text-[var(--md-on-surface-variant)] font-medium">
                                当前为自由探索模式
                            </div>
                        </div>
                    )}
                    {PRESETS.map((p, i) => {
                        const isSelected = i === selectedIndex;
                        const isActive = i === activeIndex;
                        return (
                            <div
                                key={i}
                                data-idx={i}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => selectIndex(i)}
                                onMouseEnter={() => setActiveIndex(i)}
                                className={[
                                    'group mx-1.5 px-2.5 py-2 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors',
                                    isSelected
                                        ? 'bg-[var(--md-primary-container)]'
                                        : isActive
                                        ? 'bg-[var(--md-surface-container-highest)]'
                                        : 'hover:bg-[var(--md-surface-container-highest)]'
                                ].join(' ')}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    {/* 选中标记 */}
                                    <span
                                        className={[
                                            'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors',
                                            isSelected ? 'bg-[var(--md-primary)]' : 'bg-transparent'
                                        ].join(' ')}
                                    />
                                    <span
                                        className={[
                                            'text-[13px] font-medium truncate',
                                            isSelected
                                                ? 'text-[var(--md-on-primary-container)]'
                                                : 'text-[var(--md-on-surface)]'
                                        ].join(' ')}
                                    >
                                        {p.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded-md bg-[var(--md-surface-container)] text-[var(--google-blue)]">
                                        f {p.feed.toFixed(3)}
                                    </span>
                                    <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded-md bg-[var(--md-surface-container)] text-[var(--google-red)]">
                                        k {p.kill.toFixed(3)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
