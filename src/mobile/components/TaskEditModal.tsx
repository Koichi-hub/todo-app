import { Modal } from '../components'
import LinkButton from './LinkButton'
import type { Todo } from '../../shared/types'
import { formatDateWithDay, formatDateFull } from '../../shared/misc'
import { useState } from 'react'
import type { Section } from '../../shared/services/schema'
import { EditableText } from './EditableText'

export type TaskEditModalProps = {
    isOpen: boolean
    onClose: () => void
    task: Todo
    onToggleComplete: () => void
    onUpdate: (id: string, text: string, description?: string) => void
}

type SectionWithProject = Section & { projectName?: string }

type RelatedTaskDisplay = {
    id: string
    name: string
    sectionName?: string
    projectName?: string
}

export default function TaskEditModal({
    isOpen,
    onClose,
    task,
    onToggleComplete,
    onUpdate,
}: TaskEditModalProps) {
    const [section] = useState<SectionWithProject | null>(null)
    const [relatedTasks] = useState<RelatedTaskDisplay[]>([])
    const [loading] = useState(false)

    const handleNameSave = (text: string) => {
        if (!text.trim()) return
        onUpdate(task.id, text, task.description)
    }

    const handleDescriptionSave = (description: string) => {
        onUpdate(task.id, task.text, description)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full overflow-y-auto gap-2 p-2">
                {/* Блок: название, описание, статус */}
                <div className="flex items-start gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <EditableText
                            value={task.text}
                            onSave={handleNameSave}
                            textClassName="text-white text-lg"
                        />
                        <EditableText
                            value={task.description || ''}
                            onSave={handleDescriptionSave}
                            textClassName="text-white/70 text-sm"
                            placeholder="Нет описания"
                        />
                    </div>
                    <div
                        onClick={onToggleComplete}
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 ${task.completed
                                ? 'border-emerald-500 bg-emerald-500/30'
                                : 'border-white/40'
                            }`}
                    >
                        {task.completed && (
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Блок: раздел */}
                <div className="border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="text-base text-white underline">Раздел</span>
                        <LinkButton>Редактировать</LinkButton>
                    </div>
                    {loading ? (
                        <span className="text-white/70 text-sm">Загрузка...</span>
                    ) : section ? (
                        <div className="p-2 bg-white/10 border border-white/20 rounded-2xl text-sm">
                            <span className="text-white">{section.name}{section.projectName ? ` / ${section.projectName}` : ''}</span>
                        </div>
                    ) : (
                        <span className="text-white/70 text-sm">Без раздела</span>
                    )}
                </div>

                {/* Блок: связанные задачи */}
                <div className="border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="text-base text-white underline">Связанные задачи</span>
                        <LinkButton>Редактировать</LinkButton>
                    </div>
                    {loading ? (
                        <span className="text-white/70 text-sm">Загрузка...</span>
                    ) : relatedTasks.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {relatedTasks.map((rt) => (
                                <div key={rt.id} className="p-2 bg-white/10 border border-white/20 rounded-2xl text-sm">
                                    <span className="text-white">{rt.name}{rt.sectionName ? ` / ${rt.sectionName}` : ''}{rt.projectName ? ` / ${rt.projectName}` : ''}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-white/70 text-sm">Нет связанных задач</span>
                    )}
                </div>

                {/* Блок: дата размещения */}
                <div className="border-white/10">
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                            {formatDateWithDay(new Date(task.date))}
                        </span>
                    </div>
                </div>

                {/* Блок: затреканное время */}
                <div className="border-white/10">
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">0 ч 0 м</span>
                    </div>
                </div>

                {/* Блок: теги */}
                <div className="border-white/10">
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-2 w-full">
                        <span className="text-white/50 text-sm italic">Нет тегов</span>
                    </div>
                </div>

                {/* Дата создания */}
                <div className="mt-auto pt-4 flex justify-end">
                    <span className="text-white text-xs">
                        Создано: {formatDateFull(new Date())}
                    </span>
                </div>
            </div>
        </Modal>
    )
}
