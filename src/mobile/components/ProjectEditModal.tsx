import { Modal } from '../components'
import LinkButton from './LinkButton'
import type { Project } from '../../shared/services/schema'
import { formatDateFull } from '../../shared/misc'
import { sectionService } from '../../shared/services/sectionService'
import { taskService } from '../../shared/services/taskService'
import { tagService } from '../../shared/services/tagService'
import { useEffect, useState } from 'react'
import type { Tag } from '../../shared/services/schema'
import SectionCard from './SectionCard'
import StatusTimeBlock from './StatusTimeBlock'

export type ProjectEditModalProps = {
    isOpen: boolean
    onClose: () => void
    project: Project
}

export default function ProjectEditModal({
    isOpen,
    onClose,
    project,
}: ProjectEditModalProps) {
    const [sections, setSections] = useState<any[]>([])
    const [tag, setTag] = useState<Tag | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        setLoading(true)
        const loadData = async () => {
            try {
                const projectSections = await sectionService.getByProjectId(project.id)
                const sectionsWithStats = await Promise.all(
                    projectSections.map(async (s) => {
                        const tasks = await taskService.getBySectionId(s.id)
                        const completedCount = tasks.filter(t => t.isCompleted).length
                        const recordedTimeInSecs = tasks.reduce((acc, t) => acc + (t.recordedTimeInSecs || 0), 0)
                        return { section: s, completedCount, totalCount: tasks.length, recordedTimeInSecs }
                    })
                )
                setSections(sectionsWithStats)

                if (project.tagId) {
                    const t = await tagService.getById(project.tagId)
                    setTag(t || null)
                } else {
                    setTag(null)
                }
            } catch (e) {
                console.error('Failed to load project data:', e)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [isOpen, project.id, project.tagId])

    const totalCompleted = sections.reduce((acc, s) => acc + s.completedCount, 0)
    const totalTasks = sections.reduce((acc, s) => acc + s.totalCount, 0)
    const totalRecordedTime = sections.reduce((acc, s) => acc + s.recordedTimeInSecs, 0)

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full overflow-y-auto gap-2 p-2">
                <div className="flex items-start gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-white text-lg">{project.name}</span>
                        <span className="text-white/70 text-sm">
                            {project.description || 'Нет описания'}
                        </span>
                    </div>
                </div>

                <div className="border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="text-base text-white underline">Разделы</span>
                        <LinkButton>Редактировать</LinkButton>
                    </div>
                    {loading ? (
                        <span className="text-white/70 text-sm">Загрузка...</span>
                    ) : sections.length > 0 ? (
                        <div className="flex flex-col gap-2 mt-2">
                            {sections.map((s) => (
                                <SectionCard key={s.section.id} section={s.section} />
                            ))}
                        </div>
                    ) : (
                        <span className="text-white/70 text-sm">Нет разделов</span>
                    )}
                </div>

                <div className="border-white/10">
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-3 mt-1">
                        <StatusTimeBlock
                            completed={totalCompleted}
                            total={totalTasks}
                            recordedTimeInSecs={totalRecordedTime}
                        />
                    </div>
                </div>

                <div className="border-white/10">
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-2 mt-1">
                        {tag ? (
                            <span className="text-white text-sm">{tag.name}</span>
                        ) : (
                            <span className="text-white/50 text-sm italic">Нет тегов</span>
                        )}
                    </div>
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
