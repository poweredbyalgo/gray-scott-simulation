import ColorControls from './ColorControls.jsx';
import PresetSelect from './PresetSelect.jsx';
import { InfoIcon, ChevronRightIcon, ResetIcon, ResetColorsIcon } from './icons.jsx';
import { PRESETS } from '../constants.js';

export default function Sidebar({
    feed,
    kill,
    speed,
    presetIndex,
    colors,
    onFeedChange,
    onKillChange,
    onSpeedChange,
    onPresetChange,
    onColorChange,
    onReset,
    onResetColors,
    onInfoClick,
    onClose
}) {
    return (
        <div className="h-full flex flex-col overflow-hidden panel-bg shadow-[ -20px_0_60px_-20px_rgba(0,0,0,0.8) ] border-l border-[var(--md-outline-variant)]">
            {/* 面板头部 — Material 3 top app bar style */}
            <header className="relative px-5 pt-5 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-google text-[22px] font-medium text-[var(--md-on-surface)] leading-tight">Gray-Scott</h2>
                        <p className="text-[12px] text-[var(--md-on-surface-variant)] mt-0.5">Reaction-Diffusion Lab</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="status-dot w-2 h-2 rounded-full bg-[var(--google-green)]"></span>
                        <span className="text-[11px] font-medium text-[var(--md-on-surface-variant)] ml-1 mr-2">LIVE</span>
                        <button className="icon-btn" title="关于" aria-label="关于 Gray-Scott" onClick={onInfoClick}>
                            <InfoIcon />
                        </button>
                        <button className="panel-toggle" title="收起面板" aria-label="收起面板" onClick={onClose}>
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
            </header>

            <div className="md-divider mx-5"></div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-5 custom-scrollbar">
                {/* 1. 操作按钮组 */}
                <section>
                    <div className="section-label mb-3">Actions</div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onReset}
                            className="btn-tonal px-3 py-3.5 flex flex-col items-center justify-center gap-1.5 text-[12px] font-medium group"
                        >
                            <ResetIcon />
                            重置模拟
                        </button>
                        <button
                            onClick={onResetColors}
                            className="btn-tonal px-3 py-3.5 flex flex-col items-center justify-center gap-1.5 text-[12px] font-medium group"
                        >
                            <ResetColorsIcon />
                            重置颜色
                        </button>
                    </div>
                </section>

                {/* 2. 参数设置 */}
                <section className="space-y-3">
                    <div className="section-label mb-3">Parameters</div>

                    {/* 预设选择 */}
                    <div className="md-card p-4">
                        <label className="block text-[12px] font-medium text-[var(--md-on-surface-variant)] mb-2">参数预设</label>
                        <PresetSelect value={presetIndex} onChange={onPresetChange} />
                    </div>

                    {/* Feed 参数 */}
                    <div className="md-card p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[13px] font-medium text-[var(--md-on-surface)]">
                                Feed
                                <span className="text-[var(--md-on-surface-variant)] font-normal ml-1">· f</span>
                            </label>
                            <span className="md-chip chip-blue">{feed.toFixed(3)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.01"
                            max="0.1"
                            step="0.001"
                            value={feed}
                            onChange={(e) => onFeedChange(parseFloat(e.target.value))}
                            className="slider-blue"
                        />
                    </div>

                    {/* Kill 参数 */}
                    <div className="md-card p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[13px] font-medium text-[var(--md-on-surface)]">
                                Kill
                                <span className="text-[var(--md-on-surface-variant)] font-normal ml-1">· k</span>
                            </label>
                            <span className="md-chip chip-red">{kill.toFixed(3)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.04"
                            max="0.07"
                            step="0.001"
                            value={kill}
                            onChange={(e) => onKillChange(parseFloat(e.target.value))}
                            className="slider-red"
                        />
                    </div>

                    {/* 速度倍率 */}
                    <div className="md-card p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[13px] font-medium text-[var(--md-on-surface)]">
                                Speed
                                <span className="text-[var(--md-on-surface-variant)] font-normal ml-1">· ×</span>
                            </label>
                            <span className={`md-chip ${speed <= 0 ? 'chip-paused' : 'chip-amber'}`}>
                                {speed <= 0 ? 'Paused' : `${speed.toFixed(1)}×`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.1"
                            value={speed}
                            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                            className="slider-amber"
                        />
                        <div className="flex justify-between text-[10px] text-[var(--md-on-surface-variant)] font-medium">
                            <span>0×</span>
                            <span>3×</span>
                        </div>
                    </div>
                </section>

                {/* 3. 颜色控制 */}
                <section className="flex-1 flex flex-col min-h-0">
                    <div className="section-label mb-3">Color Map</div>
                    <ColorControls colors={colors} onChange={onColorChange} />
                </section>
            </div>

            {/* 底部状态栏 */}
            <footer className="px-5 py-3 border-t border-[var(--md-outline-variant)] bg-[var(--md-surface-container)] flex items-center justify-between text-[11px] text-[var(--md-on-surface-variant)] font-medium">
                <span className="font-google">Gray-Scott</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--google-blue)]"></span>
                    Reaction-Diffusion
                </span>
            </footer>
        </div>
    );
}
