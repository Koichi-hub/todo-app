import { useMachine } from '@xstate/react'
import { useEffect, useState } from 'react'
import TodoItem from './components/TodoItem'
import { useStore } from './hooks/useStore'
import { machine } from './machines/todoMachine'
import { STORAGE_KEY } from '../shared/misc/constants'
import { Todo } from '../shared/types/Todo'

export default function DesktopApp() {
    const [save] = useStore<Todo[]>(STORAGE_KEY, (todos) => send({ type: 'TASKS_LOADED', todos }))
    const [snapshot, send] = useMachine(machine)
    const [input, setInput] = useState('')

    useEffect(() => {
        save(snapshot.context.todos)
    }, [snapshot.context.todos])

    const handleAdd = () => {
        if (input.trim()) {
            send({ type: 'ADD', text: input })
            setInput('')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md min-w-[600px] bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 max-[800px]:!w-full max-[800px]:!max-w-none max-[800px]:!p-8">
                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Задачи на сегодня
                </h1>

                <div className="flex gap-3 mb-8">
                    <input
                        type="text"
                        placeholder="Введите новую задачу..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
                    >
                        Добавить
                    </button>
                </div>

                {(() => {
                    const incomplete = snapshot.context.todos.filter((t) => !t.completed)
                    const complete = snapshot.context.todos.filter((t) => t.completed)
                    return (
                        <>
                            <h2 className="text-xl font-semibold text-white/80 mb-3">Ждут выполнения</h2>
                            <div className="space-y-3 mb-6">
                                {incomplete.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={() => send({ type: 'TOGGLE', id: todo.id })}
                                        onDelete={() => send({ type: 'DELETE', id: todo.id })}
                                    />
                                ))}
                            </div>

                            <h2 className="text-xl font-semibold inline-flex items-center text-white/80 mb-3">
                                Выполнены
                            </h2>
                            <div className="space-y-3">
                                {complete.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={() => send({ type: 'TOGGLE', id: todo.id })}
                                        onDelete={() => send({ type: 'DELETE', id: todo.id })}
                                    />
                                ))}
                            </div>
                        </>
                    )
                })()}
            </div>
        </div>
    )
}
