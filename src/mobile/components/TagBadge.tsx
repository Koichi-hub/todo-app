import type { Tag } from '../../shared/services/schema'

type TagBadgeProps = {
    tag: Tag | null
    label?: string
    variant?: 'default' | 'section'
}

export default function TagBadge({ tag, label, variant = 'default' }: TagBadgeProps) {
    if (variant === 'section') {
        return (
            <div className="border-t border-white/10 pt-2">
                <span className="text-white/50 text-xs italic">{label || 'Теги'}</span>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2 mt-1">
                    {tag ? (
                        <span className="text-white text-sm">{tag.name}</span>
                    ) : (
                        <span className="text-white/50 text-sm italic">Нет тегов</span>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-2">
            {tag ? (
                <span className="text-white text-sm">{tag.name}</span>
            ) : (
                <span className="text-white/50 text-sm italic">Нет тегов</span>
            )}
        </div>
    )
}
