import { memo } from 'react';

const SLIDER_CONFIG = [
    { key: 'r', label: 'R', labelClass: 'label-r', sliderClass: 'slider-r', max: 1 },
    { key: 'g', label: 'G', labelClass: 'label-g', sliderClass: 'slider-g', max: 1 },
    { key: 'b', label: 'B', labelClass: 'label-b', sliderClass: 'slider-b', max: 1 },
    { key: 'threshold', label: 'T', labelClass: 'label-t', sliderClass: 'slider-amber', max: 1 }
];

function ColorStageCard({ index, color, onChange }) {
    const rgbStr = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;

    const handleField = (key, value) => {
        onChange(index, { ...color, [key]: value });
    };

    return (
        <div className="md-card p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2.5">
                <div className="color-swatch w-5 h-5" style={{ backgroundColor: rgbStr }} />
                <span className="text-[12px] font-medium text-[var(--md-on-surface)]">
                    Stage {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {SLIDER_CONFIG.map(({ key, label, labelClass, sliderClass, max }) => (
                    <div key={key} className="flex items-center gap-2">
                        <span className={`slider-label ${labelClass}`}>{label}</span>
                        <input
                            type="range"
                            min="0"
                            max={max}
                            step="0.01"
                            value={color[key]}
                            className={`flex-1 ${sliderClass}`}
                            onChange={(e) => handleField(key, parseFloat(e.target.value))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ColorControls({ colors, onChange }) {
    return (
        <div id="colorControls" className="flex-1 flex flex-col min-h-0 gap-2 overflow-y-auto custom-scrollbar pr-1">
            {colors.map((color, index) => (
                <ColorStageCard key={index} index={index} color={color} onChange={onChange} />
            ))}
        </div>
    );
}

export default memo(ColorControls);
