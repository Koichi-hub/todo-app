import { useEffect } from 'react'
import { AddItemInput, ProjectCard } from '../components'
import { useMachineContext } from '../../shared/machines'

export default function ProjectsTab() {
    const { snapshot, send } = useMachineContext()

    useEffect(() => {
        send({ type: 'LOAD_PROJECTS' })
    }, [send])

    const handleAdd = (value: string) => {
        send({ type: 'ADD_PROJECT', name: value })
    }

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
                            />
                        ))
                    )}
                </div>
            </div>

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
