import { AddItemInput, ProjectCard } from '../components'

export default function ProjectsTab() {
    const handleAdd = (value: string) => {
        console.log('Create project:', value)
    }

    return (
        <div className="flex flex-col items-center gap-2 h-full">
            <h1 className="text-white text-[20px] font-bold flex-shrink-0">Проекты</h1>

            <AddItemInput placeholder="Введите название проекта..." onAdd={handleAdd} />

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar w-full mt-2">
                <div className="space-y-2">
                    <ProjectCard
                        name="Мобильное приложение"
                        description="Разработка кроссплатформенного приложения на React Native"
                        createdAt={new Date(2026, 8, 1)}
                    />
                    <ProjectCard
                        name="Веб-сайт портфолио"
                        description="Создание персонального сайта с галереей работ"
                        createdAt={new Date(2026, 8, 5)}
                    />
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
