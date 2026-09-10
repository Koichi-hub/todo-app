import { useSortable } from '@dnd-kit/sortable'
import { Todo } from '../../shared/types/Todo'

interface SortableTodoProps {
    todo: Todo
    listType: 'incomplete' | 'complete'
    onToggle: () => void
    onEdit: () => void
}

export default function SortableTodo({ todo, listType, onToggle, onEdit }: SortableTodoProps) {
    const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: todo.id,
        data: { listType },
    })

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
            {...listeners}
            className="flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-xl touch-none"
        >
            <div
                onClick={onToggle}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 ${
                    todo.completed
                        ? 'border-emerald-500 bg-emerald-500/30'
                        : 'border-white/40'
                }`}
            >
                {todo.completed && (
                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={`flex-1 ${todo.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                {todo.text}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                }}
                className="text-white/50 hover:text-white/80 transition-colors duration-200 flex-shrink-0"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>
        </div>
    )
}
