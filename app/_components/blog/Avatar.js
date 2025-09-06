export default function Avatar({ src, name }) {
    return (
        <div className="flex items-center justify-center overflow-hidden text-sm rounded-full w-9 h-9 bg-neutral-200">
            {src ? (
                <img src={src} alt={name || 'avatar'} />
            ) : (
                (name || '?').slice(0, 1).toUpperCase()
            )}
        </div>
    )
}
