interface ProjectCardProps {
    name: string
    description: string
    tags?: string[]
    createdAt: Date
    onEdit?: () => void
}

export default function ProjectCard({ name, description, tags = [], createdAt, onEdit }: ProjectCardProps) {
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `Создан ${day}.${month}.${year}`
    }

    return (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-2">
                <h3 className="flex-1 text-white text-[16px] font-bold">{name}</h3>
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit()
                        }}
                        className="text-white/50 hover:text-white/80 transition-colors duration-200 flex-shrink-0"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                )}
            </div>
            <p className="text-white text-[12px] mt-1">{description}</p>

            <div className="flex justify-between items-end mt-3">
                <div className="flex gap-2 flex-wrap">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <span key={index} className="text-white text-[10px]">
                                #{tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-white text-[10px]">#Работа #Учеба</span>
                    )}
                </div>
                <span className="text-white text-[10px]">{formatDate(createdAt)}</span>
            </div>
        </div>
    )
}
