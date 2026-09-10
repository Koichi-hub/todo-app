import { useMachine } from '@xstate/react'
import { useEffect, useState } from 'react'
import TodoItem from '../components/TodoItem'
import Modal from '../components/Modal'
import { useStore } from '../../desktop/hooks/useStore'
import { machine } from '../../desktop/machines/todoMachine'
import { STORAGE_KEY } from '../../shared/misc/constants'
import { Todo } from '../../shared/types/Todo'
import Button from '../components/Button'

export default function DayTab() {
    const [save] = useStore<Todo[]>(STORAGE_KEY, (todos) => {
        if (todos.length === 0) {
            send({ type: 'TASKS_LOADED', todos: [] })
        } else {
            send({ type: 'TASKS_LOADED', todos })
        }
    })
    const [snapshot, send] = useMachine(machine)
    const [input, setInput] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (snapshot.context.todos.length > 0) {
            save(snapshot.context.todos)
        }
    }, [snapshot.context.todos])

    const today = new Date().toISOString().split('T')[0]

    const handleAdd = () => {
        if (input.trim()) {
            send({ type: 'ADD', text: input, date: today })
            setInput('')
        }
    }

    const incomplete = snapshot.context.todos.filter((t) => !t.completed)
    const complete = snapshot.context.todos.filter((t) => t.completed)

    return (
        <div className="flex flex-col items-center gap-2 h-full">
            <h1 className="text-white text-[20px] font-bold flex-shrink-0">Задачи на сегодня</h1>

            <div className="flex gap-2 w-full flex-shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Введите новую задачу..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-[14px] placeholder-white/50 outline-none"
                />
                <Button onClick={handleAdd}>+</Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar w-full">
                <div className="w-full mt-2">
                    <h2 className="text-white font-bold text-[16px]">Ждут выполнения</h2>
                    <div className="mt-1">
                        <div className="space-y-1">
                            {incomplete.length === 0 ? (
                                <p className="text-white/50 text-sm italic">Нет задач</p>
                            ) : (
                                incomplete.map((todo) => (
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
                </div>

                <div className="w-full mt-4 pb-2">
                    <h2 className="text-white font-bold text-[16px]">Выполнены</h2>
                    <div className="mt-1">
                        <div className="space-y-1">
                            {complete.length === 0 ? (
                                <p className="text-white/50 text-sm italic">Нет выполненных</p>
                            ) : (
                                complete.map((todo) => (
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
    );
}
