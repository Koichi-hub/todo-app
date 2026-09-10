interface ProjectCardProps {
    name: string
    description: string
    tags?: string[]
    createdAt: Date
}

export default function ProjectCard({ name, description, tags = [], createdAt }: ProjectCardProps) {
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `Создан ${day}.${month}.${year}`
    }

    return (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
            <h3 className="text-white text-[16px] font-bold">{name}</h3>
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
