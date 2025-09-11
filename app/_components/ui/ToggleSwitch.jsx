export default function ToggleSwitch({
    checked,
    onChange,
    disabled = false,
    onLabel = 'On',
    offLabel = 'Off',
}) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={!!checked}
                onChange={(e) => onChange?.(e.target.checked)}
                disabled={disabled}
            />
            <div
                className={`w-10 h-5 rounded-full relative transition-colors
        ${checked ? 'bg-green-500' : 'bg-gray-300'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform
          ${checked ? 'translate-x-5' : ''}
        `}
                />
            </div>
            <span className="ml-3 text-sm">{checked ? onLabel : offLabel}</span>
        </label>
    )
}
