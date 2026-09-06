import {
  DndContext,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useMachine } from '@xstate/react'
import { useEffect, useState } from 'react'
import './App.css'
import SortableTodo from './components/SortableTodo'
import { useStore } from './hooks/useStore'
import { machine } from './machines/todoMachine'
import { STORAGE_KEY } from './misc/constants'
import { Todo } from './types/Todo'

export default function App() {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = snapshot.context.todos.findIndex((t) => t.id === active.id)
      const newIndex = snapshot.context.todos.findIndex((t) => t.id === over.id)
      send({ type: 'REORDER', oldIndex, newIndex })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Мои Задачи
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

        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={snapshot.context.todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {snapshot.context.todos.map((todo) => (
                <SortableTodo
                  key={todo.id}
                  todo={todo}
                  onToggle={() => send({ type: 'TOGGLE', id: todo.id })}
                  onDelete={() => send({ type: 'DELETE', id: todo.id })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
