import { useMachine } from '@xstate/react'
import { useState, useEffect, useMemo } from 'react'
import { createTodoMachine, type Todo } from './machines/todoMachine'
import { useLocalStorage } from './hooks/useLocalStorage'
import {
  DndContext,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import './App.css'

const STORAGE_KEY = 'todos'

interface SortableTodoProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}

function SortableTodo({ todo, onToggle, onDelete }: SortableTodoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 touch-none transition-all duration-200 ${
        isHovered && !isDragging ? 'animate-shake' : ''
      }`}
    >
      <div
        {...listeners}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60"
      >
        ⋮⋮
      </div>
      <div
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 ${
          todo.completed
            ? 'border-emerald-500 bg-emerald-500/20'
            : 'border-white/30'
        }`}
      />
      <span
        className={`flex-1 ${
          todo.completed ? 'text-white/70 line-through' : 'text-white/90'
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={onDelete}
        className="text-white/50 hover:text-red-400 transition-colors duration-200"
      >
        ✕
      </button>
    </div>
  )
}

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, [])
  const machine = useMemo(() => createTodoMachine(todos), [todos])
  const [snapshot, send] = useMachine(machine)
  const [input, setInput] = useState('')

  useEffect(() => {
    setTodos(snapshot.context.todos)
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

  const todoIds = snapshot.context.todos.map((t) => t.id)

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
          <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
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

export default App
