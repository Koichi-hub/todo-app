import type { Tag } from '../../shared/services/schema'

type TagBadgeProps = {
    tag: Tag | null
}

export default function TagBadge({ tag }: TagBadgeProps) {
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
