import { useEffect, useState } from 'react'
import type { Section, Tag } from '../../shared/services/schema'
import StatusTimeBlock from './StatusTimeBlock'
import { taskService } from '../../shared/services/taskService'
import { tagService } from '../../shared/services/tagService'
import { formatDateFull } from '../../shared/misc'

type SectionCardProps = {
    section: Section
}

type TaskDisplay = {
    id: string
    name: string
    isCompleted: boolean
    recordedTimeInSecs: number
}

export default function SectionCard({ section }: SectionCardProps) {
    const [tasks, setTasks] = useState<TaskDisplay[]>([])
    const [tag, setTag] = useState<Tag | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const loadData = async () => {
            try {
                const sectionTasks = await taskService.getBySectionId(section.id)
                setTasks(sectionTasks.map(t => ({ id: t.id, name: t.name, isCompleted: t.isCompleted, recordedTimeInSecs: t.recordedTimeInSecs })))

                if (section.tagId) {
                    const t = await tagService.getById(section.tagId)
                    setTag(t || null)
                } else {
                    setTag(null)
                }
            } catch (e) {
                console.error('Failed to load section data:', e)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [section.id, section.tagId])

    const completedCount = tasks.filter(t => t.isCompleted).length
    const totalCount = tasks.length
    const recordedTimeInSecs = tasks.reduce((acc, t) => acc + (t.recordedTimeInSecs || 0), 0)

    return (
        <div className="p-3 bg-white/10 border border-white/20 rounded-2xl flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <span className="text-white text-base font-medium">{section.name}</span>
                <span className="text-white/70 text-sm">
                    {section.description || 'Нет описания'}
                </span>
            </div>

            <div className="border-t border-white/10 pt-2">
                <span className="text-white/50 text-xs underline">Задачи</span>
                {loading ? (
                    <span className="text-white/70 text-sm">Загрузка...</span>
                ) : tasks.length > 0 ? (
                    <div className="flex flex-col gap-1 mt-1">
                        {tasks.map(task => (
                            <div key={task.id} className="p-2 bg-white/5 border border-white/10 rounded-xl text-sm">
                                <span className="text-white">{task.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-white/70 text-sm">Нет задач</span>
                )}
            </div>

            <div className="border-t border-white/10 pt-2">
                <StatusTimeBlock
                    completed={completedCount}
                    total={totalCount}
                    recordedTimeInSecs={recordedTimeInSecs}
                />
            </div>

            <div className="border-t border-white/10 pt-2">
                <span className="text-white/50 text-xs italic">Теги</span>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2 mt-1">
                    {tag ? (
                        <span className="text-white text-sm">{tag.name}</span>
                    ) : (
                        <span className="text-white/50 text-sm italic">Нет тегов</span>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-2 flex justify-end">
                <span className="text-white/50 text-xs">
                    Создано: {formatDateFull(new Date(section.creationDate))}
                </span>
            </div>
        </div>
    )
}
