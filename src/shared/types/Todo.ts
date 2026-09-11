// Фронтенд-модель задачи (view model). Маппится в Task (БД) через todoMachine.ts:todoToTask()/taskToTodo().
// ВАЖНО: При изменении структуры Todo синхронизировать с Task в schema.ts и наоборот!
export interface Todo {
    id: string
    text: string
    description?: string
    completed: boolean
    date: string
    sectionId?: string | null
    relatedTaskIds?: string[]
}

export type InitializeEvent = { type: 'INITIALIZE' }
export type AddEvent = { type: 'ADD'; text: string; date?: string }
export type ToggleEvent = { type: 'TOGGLE'; id: string }
export type DeleteEvent = { type: 'DELETE'; id: string }
export type DeleteAllCompletedEvent = { type: 'DELETE_ALL_COMPLETED' }
export type SetInputEvent = { type: 'SET_INPUT'; text: string }
export type ReorderEvent = { type: 'REORDER'; oldIndex: number; newIndex: number; date?: string }
export type TasksLoadedEvent = { type: 'TASKS_LOADED', todos: Todo[] }
export type MoveToDayEvent = { type: 'MOVE_TO_DAY'; id: string; date: string }
export type UpdateTodoEvent = { type: 'UPDATE_TODO'; id: string; text?: string; description?: string }

export type TodoEvent =
    | InitializeEvent
    | AddEvent
    | ToggleEvent
    | DeleteEvent
    | DeleteAllCompletedEvent
    | SetInputEvent
    | ReorderEvent
    | TasksLoadedEvent
    | MoveToDayEvent
    | UpdateTodoEvent

export type TodoContext = {
    todos: Todo[]
}
