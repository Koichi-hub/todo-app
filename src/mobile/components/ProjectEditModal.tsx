import { Modal } from '../components'
import { AddItemInput } from '../components'
import type { Project, Tag } from '../../shared/services/schema'
import { formatDateFull } from '../../shared/misc'
import type { SectionWithStats } from '../../shared/machines/todoMachine'
import SectionCard from './SectionCard'
import StatusTimeBlock from './StatusTimeBlock'
import { EditableText } from './EditableText'
import TagBadge from './TagBadge'

export type ProjectEditModalProps = {
    isOpen: boolean
    onClose: () => void
    project: Project
    sections: SectionWithStats[]
    projectTag: Tag | null
    onProjectUpdate: (project: Project) => void
    onAddSection: (name: string) => void
    onAddTaskToSection: (sectionId: string, name: string) => void
    onToggleTask: (taskId: string, projectId: string) => void
    onEditTask: (taskId: string) => void
}

export default function ProjectEditModal({
    isOpen,
    onClose,
    project,
    sections,
    projectTag,
    onProjectUpdate,
    onAddSection,
    onAddTaskToSection,
    onToggleTask,
    onEditTask,
}: ProjectEditModalProps) {
    const totalCompleted = sections.reduce((acc, s) => acc + s.completedCount, 0)
    const totalTasks = sections.reduce((acc, s) => acc + s.totalCount, 0)
    const totalRecordedTime = sections.reduce((acc, s) => acc + s.recordedTimeInSecs, 0)

    const handleNameSave = (name: string) => {
        if (!name.trim()) return
        onProjectUpdate({ ...project, name })
    }

    const handleDescriptionSave = (description: string) => {
        onProjectUpdate({ ...project, description })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full overflow-y-auto gap-2 p-2">
                <div className="flex items-start gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <EditableText
                            value={project.name}
                            onSave={handleNameSave}
                            textClassName="text-white text-lg"
                        />
                        <EditableText
                            value={project.description || ''}
                            onSave={handleDescriptionSave}
                            textClassName="text-white/70 text-sm"
                            placeholder="Нет описания"
                        />
                    </div>
                </div>

                {/* Блок разделы */}
                <div className="border-white/10">
                    <div className="mt-2">
                        <AddItemInput placeholder="Введите название раздела..." onAdd={onAddSection} />
                    </div>
                    {sections.length > 0 ? (
                        <div className="flex flex-col gap-2 mt-2">
                            {sections.map((s) => (
                                <SectionCard
                                    key={s.section.id}
                                    section={s.section}
                                    tasks={s.tasks}
                                    completedCount={s.completedCount}
                                    totalCount={s.totalCount}
                                    recordedTimeInSecs={s.recordedTimeInSecs}
                                    tag={s.tag}
                                    onAddTask={(name) => onAddTaskToSection(s.section.id, name)}
                                    onToggleTask={(taskId) => onToggleTask(taskId, project.id)}
                                    onEditTask={onEditTask}
                                />
                            ))}
                        </div>
                    ) : (
                        <span className="text-white/70 text-sm">Нет разделов</span>
                    )}
                </div>

                <div className="border-white/10">
                    <StatusTimeBlock
                        completed={totalCompleted}
                        total={totalTasks}
                        recordedTimeInSecs={totalRecordedTime}
                    />
                </div>

                <div className="border-white/10">
                    <TagBadge tag={projectTag} />
                </div>

                <div className="mt-auto pt-4 flex justify-end">
                    <span className="text-white text-xs">
                        Создано: {formatDateFull(new Date(project.creationDate))}
                    </span>
                </div>
            </div>
        </Modal>
    )
}
