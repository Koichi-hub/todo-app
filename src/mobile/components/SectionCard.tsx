import type { Section, Tag, Task } from '../../shared/services/schema'
import { formatDateFull, taskToTodo } from '../../shared/misc'
import { AddItemInput } from '../components'
import { TodoItem } from './TodoItem'
import StatusTimeBlock from './StatusTimeBlock'
import TagBadge from './TagBadge'

type SectionCardProps = {
    section: Section
    tasks: Task[]
    completedCount: number
    totalCount: number
    recordedTimeInSecs: number
    tag: Tag | null
    onAddTask: (name: string) => void
    onToggleTask: (taskId: string) => void
    onEditTask: (taskId: string) => void
}

export default function SectionCard({
    section,
    tasks,
    completedCount,
    totalCount,
    recordedTimeInSecs,
    tag,
    onAddTask,
    onToggleTask,
    onEditTask,
}: SectionCardProps) {
    return (
        <div className="p-3 bg-white/10 border border-white/20 rounded-2xl flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <span className="text-white text-base font-medium">{section.name}</span>
                <span className="text-white/70 text-sm">
                    {section.description || 'Нет описания'}
                </span>
            </div>

            <div className="border-white/10">
                <AddItemInput placeholder="Введите название задачи..." onAdd={onAddTask} />
            </div>

            <div className="border-white/10">
                {tasks.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {tasks.map(task => (
                            <TodoItem
                                key={task.id}
                                todo={taskToTodo(task)}
                                onToggle={() => onToggleTask(task.id)}
                                onAction={() => onEditTask(task.id)}
                                actionType="edit"
                            />
                        ))}
                    </div>
                ) : (
                    <span className="text-white/70 text-sm">Нет задач</span>
                )}
            </div>

            <div className="border-white/10">
                <StatusTimeBlock
                    completed={completedCount}
                    total={totalCount}
                    recordedTimeInSecs={recordedTimeInSecs}
                />
            </div>

            <TagBadge tag={tag} />

            <div className="mt-auto pt-2 flex justify-end">
                <span className="text-white/50 text-xs">
                    Создано: {formatDateFull(new Date(section.creationDate))}
                </span>
            </div>
        </div>
    )
}
