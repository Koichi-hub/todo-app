import type { Todo } from '../types'
import type { NewTask } from '../services/schema'

// Todo (frontend) -> Task (DB schema). Синхронизировать при изменении структуры!
export function todoToTask(todo: Todo): NewTask {
    return {
        id: todo.id,
        name: todo.text,
        description: '',
        isCompleted: todo.completed,
        creationDate: new Date(),
        placementDate: new Date(todo.date),
        recordedTimeInSecs: 0,
        sectionId: todo.sectionId || null,
    }
}

// Task (DB schema) -> Todo (frontend view model). Синхронизировать при изменении структуры!
export function taskToTodo(task: { id: string; name: string; isCompleted: boolean; placementDate: Date | null; sectionId?: string | null }): Todo {
    return {
        id: task.id,
        text: task.name,
        completed: task.isCompleted,
        date: task.placementDate ? task.placementDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        sectionId: task.sectionId,
    }
}
