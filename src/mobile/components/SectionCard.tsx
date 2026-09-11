import type { Section, Tag, Task } from '../../shared/services/schema'
import { formatDateFull } from '../../shared/misc'
import StatusTimeBlock from './StatusTimeBlock'
import TagBadge from './TagBadge'

type SectionCardProps = {
    section: Section
    tasks: Task[]
    completedCount: number
    totalCount: number
    recordedTimeInSecs: number
    tag: Tag | null
}

export default function SectionCard({
    section,
    tasks,
    completedCount,
    totalCount,
    recordedTimeInSecs,
    tag,
}: SectionCardProps) {
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
                {tasks.length > 0 ? (
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

            <TagBadge tag={tag} variant="section" />

            <div className="mt-auto pt-2 flex justify-end">
                <span className="text-white/50 text-xs">
                    Создано: {formatDateFull(new Date(section.creationDate))}
                </span>
            </div>
        </div>
    )
}
