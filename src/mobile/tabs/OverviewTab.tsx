import { useState } from 'react'
import { Modal, AddItemInput, FilterBlock } from '../components'

export default function OverviewTab() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    const handleFilterClick = (id: string) => {
        setActiveFilter(id)
        setIsModalOpen(true)
    }

    const filters = [
        { id: 'period', label: '', value: 'dd.mm.yyyy - dd.mm.yyyy', tailWindClasses: 'flex-1' },
        { id: 'tags', label: '', value: '3' },
    ]

    return (
        <div className="flex flex-col items-center gap-2 h-full">
            <h1 className="text-white text-[20px] font-bold flex-shrink-0">Теги</h1>

            <AddItemInput placeholder="Введите название тега..." onAdd={() => {}} />

            <div className="bg-white/10 border border-white/20 rounded-2xl p-2 w-full">
                <div className="text-white/50 text-sm italic">Нет тегов</div>
            </div>

            <FilterBlock filters={filters} onFilterClick={handleFilterClick} />

            <div className="bg-white/10 border border-white/20 rounded-2xl p-12 w-full flex items-center justify-center">
                <span className="text-white text-[64px] font-bold">15 ч 30 м</span>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-white text-lg font-bold mb-4">
                    {activeFilter === 'period' ? 'Выбор периода' : 'Выбор тегов'}
                </h2>
            </Modal>
        </div>
    )
}
