interface FilterBlockProps {
    filters: {
        id: string
        label: string
        value: string
        tailWindClasses?: string;
    }[]
    onFilterClick: (id: string) => void
}

export default function FilterBlock({ filters, onFilterClick }: FilterBlockProps) {
    return (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-2 w-full">
            <div className="flex gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterClick(filter.id)}
                        className={`bg-[#34175B] rounded-2xl pl-8 pr-8 pt-2 pb-2 text-white text-[14px] text-center ${filter.tailWindClasses}`}
                    >
                        <span className="opacity-70">{filter.label}</span>
                        <div>{filter.value}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}
