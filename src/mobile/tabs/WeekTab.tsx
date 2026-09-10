import { useMachine } from '@xstate/react'
import { useEffect, useState, useRef } from 'react'
import TodoItem from '../components/TodoItem'
import Modal from '../components/Modal'
import { useStore } from '../../desktop/hooks/useStore'
import { machine } from '../../desktop/machines/todoMachine'
import { STORAGE_KEY } from '../../shared/misc/constants'
import { Todo } from '../../shared/types/Todo'

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}.${month}`
}

function getWeekDates(date: Date): Date[] {
    const start = new Date(date)
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diff)
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        dates.push(d)
    }
    return dates
}

function getDateKey(date: Date): string {
    return date.toISOString().split('T')[0]
}

export default function WeekTab() {
    const now = new Date()
    const weekDates = getWeekDates(now)
    const weekStart = weekDates[0]
    const weekEnd = weekDates[6]

    const [save] = useStore<Todo[]>(STORAGE_KEY, (todos) => {
        if (!initRef.current) {
            initRef.current = true
            if (todos.length === 0) {
                const sampleTodos: Todo[] = weekDates.flatMap((date, dayIndex) => {
                    const dateKey = getDateKey(date)
                    const tasks = [
                        { text: `Задача ${dayIndex * 2 + 1}`, completed: false },
                        { text: `Задача ${dayIndex * 2 + 2}`, completed: dayIndex % 2 === 0 },
                    ]
                    return tasks.map(t => ({
                        id: crypto.randomUUID(),
                        text: t.text,
                        completed: t.completed,
                        date: dateKey,
                    }))
                })
                send({ type: 'TASKS_LOADED', todos: sampleTodos })
            } else {
                const today = getDateKey(now)
                const migratedTodos = todos.map(t => ({
                    ...t,
                    date: t.date || today,
                }))
                send({ type: 'TASKS_LOADED', todos: migratedTodos })
            }
        }
    })
    const [snapshot, send] = useMachine(machine)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const initRef = useRef(false)

    useEffect(() => {
        if (snapshot.context.todos.length > 0) {
            save(snapshot.context.todos)
        }
    }, [snapshot.context.todos])

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
                                                onEdit={() => setIsModalOpen(true)}
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
