import {
    useSortable
} from '@dnd-kit/sortable'
import { Todo } from "../../shared/types/Todo"

interface SortableTodoProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}

export default function SortableTodo({ todo, onToggle, onDelete }: SortableTodoProps) {
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
      className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 touch-none transition-all duration-200`}
    >
      <div
        {...listeners}
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