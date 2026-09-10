import { useState } from 'react'
import { TodoItem } from '../../shared/components'
import { Modal } from '../components'
import { useMachineContext } from '../../shared/machines'
import { DAY_NAMES, getDateKey, getWeekDates } from '../../shared/misc'

export default function WeekTab() {
    const { snapshot, send } = useMachineContext()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const now = new Date()
    const weekDates = getWeekDates(now)
    const weekStart = weekDates[0]
    const weekEnd = weekDates[6]

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${day}.${month}`
    }

    const todosByDate = weekDates.map(date => {
        const dateKey = getDateKey(date)
        return {
            date,
            todos: snapshot.context.todos.filter(t => t.date === dateKey),
        }
    })

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-white text-[20px] font-bold text-center mb-3 flex-shrink-0">
                {formatDate(weekStart)} - {formatDate(weekEnd)}
            </h1>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="space-y-4 pb-2">
                    {todosByDate.map(({ date, todos }) => {
                        const dateKey = getDateKey(date)
                        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
                        const dayName = DAY_NAMES[dayIndex]
                        const dayDate = formatDate(date)
                        const isToday = getDateKey(now) === dateKey

                        const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed))

                        return (
                            <div key={dateKey} className="flex flex-col">
                                <div className={`flex items-center gap-2 mb-2 ${isToday ? 'text-white' : 'text-white/70'}`}>
                                    <span className="font-bold text-[16px]">{dayName}</span>
                                    <span className="text-[16px]">{dayDate}</span>
                                    {isToday && (
                                        <>
                                            <div className="flex-1 h-px bg-white/50 mx-2" />
                                            <span className="text-sm text-white">Сегодня</span>
                                        </>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {sortedTodos.length === 0 ? (
                                        <p className="text-white/50 text-sm italic py-2">Нет задач</p>
                                    ) : (
                                        sortedTodos.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onToggle={() => send({ type: 'TOGGLE', id: todo.id })}
                                                onAction={() => setIsModalOpen(true)}
                                                actionType="edit"
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-white text-lg font-bold mb-4">Редактирование</h2>
            </Modal>

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