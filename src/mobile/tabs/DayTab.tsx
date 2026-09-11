import { useState } from 'react'
import { AddItemInput, TodoItem, TaskEditModal } from '../components'
import { useMachineContext } from '../../shared/machines'

export default function DayTab() {
    const { snapshot, send } = useMachineContext()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

    const today = new Date().toISOString().split('T')[0]

    const handleAdd = (text: string) => {
        send({ type: 'ADD', text, date: today })
    }

    const handleEdit = (id: string) => {
        setSelectedTaskId(id)
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setSelectedTaskId(null)
    }

    const selectedTask = selectedTaskId
        ? snapshot.context.todos.find((t) => t.id === selectedTaskId)
        : null

    const incomplete = snapshot.context.todos.filter((t) => !t.completed)
    const complete = snapshot.context.todos.filter((t) => t.completed)

    return (
        <div className="flex flex-col items-center gap-2 h-full">
            <h1 className="text-white text-[20px] font-bold flex-shrink-0">Задачи на сегодня</h1>

            <AddItemInput placeholder="Введите новую задачу..." onAdd={handleAdd} />

            <div className="flex-1 overflow-y-auto w-full">
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
                                        onAction={() => handleEdit(todo.id)}
                                        actionType="edit"
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
                                        onAction={() => handleEdit(todo.id)}
                                        actionType="edit"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedTask && (
                <TaskEditModal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    task={selectedTask}
                    onToggleComplete={() => send({ type: 'TOGGLE', id: selectedTask.id })}
                    onUpdate={(id, text, description) => send({ type: 'UPDATE_TODO', id, text, description })}
                />
            )}
        </div>
    )
}
