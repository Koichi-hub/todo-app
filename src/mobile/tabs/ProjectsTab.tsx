import { useEffect, useState } from 'react'
import { AddItemInput, ProjectCard, ProjectEditModal } from '../components'
import { useMachineContext } from '../../shared/machines'
import type { Project } from '../../shared/services/schema'
import type { SectionWithStats } from '../../shared/machines/todoMachine'

export default function ProjectsTab() {
    const { snapshot, send } = useMachineContext()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [selectedProjectSections, setSelectedProjectSections] = useState<SectionWithStats[]>([])

    useEffect(() => {
        send({ type: 'LOAD_PROJECTS' })
        send({ type: 'LOAD_TAGS' })
    }, [send])

    useEffect(() => {
        if (selectedProject && isModalOpen) {
            send({ type: 'LOAD_PROJECT_SECTIONS', projectId: selectedProject.id })
        }
    }, [selectedProject?.id, isModalOpen, send])

    useEffect(() => {
        if (selectedProject) {
            const sections = snapshot.context.projectSections.get(selectedProject.id)
            if (sections) {
                setSelectedProjectSections(sections)
            }
        }
    }, [snapshot.context.projectSections, selectedProject?.id])

    const handleAdd = (value: string) => {
        send({ type: 'ADD_PROJECT', name: value })
    }

    const handleEdit = (project: Project) => {
        setSelectedProject(project)
        setSelectedProjectSections([])
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setSelectedProject(null)
        setSelectedProjectSections([])
    }

    const handleProjectUpdate = (updatedProject: Project) => {
        send({ type: 'UPDATE_PROJECT', project: updatedProject })
        setSelectedProject(updatedProject)
    }

    const projectTag = selectedProject?.tagId
        ? snapshot.context.tags.get(selectedProject.tagId) || null
        : null

    return (
        <div className="flex flex-col items-center gap-2 h-full">
            <h1 className="text-white text-[20px] font-bold flex-shrink-0">Проекты</h1>

            <AddItemInput placeholder="Введите название проекта..." onAdd={handleAdd} />

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar w-full mt-2">
                <div className="space-y-2">
                    {snapshot.context.projects.length === 0 ? (
                        <p className="text-white/50 text-sm italic">Нет проектов</p>
                    ) : (
                        snapshot.context.projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                name={project.name}
                                description={project.description}
                                createdAt={project.creationDate}
                                onEdit={() => handleEdit(project)}
                            />
                        ))
                    )}
                </div>
            </div>

            {selectedProject && (
                <ProjectEditModal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    project={selectedProject}
                    sections={selectedProjectSections}
                    projectTag={projectTag}
                    onProjectUpdate={handleProjectUpdate}
                />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
            `}</style>
        </div>
    )
}
