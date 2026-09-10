import type { Todo } from '../types'

export type TodoItemProps = {
    todo: Todo
    onToggle: () => void
    onAction: () => void
    actionType: 'delete' | 'edit'
}

export function TodoItem({ todo, onToggle, onAction, actionType }: TodoItemProps) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl">
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
                    onAction()
                }}
                className="text-white/50 hover:text-white/80 transition-colors duration-200 flex-shrink-0"
            >
                {actionType === 'edit' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>
        </div>
    )
}
