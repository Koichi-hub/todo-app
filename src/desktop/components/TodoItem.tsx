import { Todo } from "../../shared/types/Todo"

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-200`}
    >
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
