export interface Todo {
    id: string
    text: string
    completed: boolean
    date: string
}

export type AddEvent = { type: 'ADD'; text: string; date?: string }
export type ToggleEvent = { type: 'TOGGLE'; id: string }
export type DeleteEvent = { type: 'DELETE'; id: string }
export type DeleteAllCompletedEvent = { type: 'DELETE_ALL_COMPLETED' }
export type SetInputEvent = { type: 'SET_INPUT'; text: string }
export type ReorderEvent = { type: 'REORDER'; oldIndex: number; newIndex: number; date?: string }
export type TasksLoadedEvent = { type: 'TASKS_LOADED', todos: Todo[] }
export type MoveToDayEvent = { type: 'MOVE_TO_DAY'; id: string; date: string }

export type TodoEvent =
    | AddEvent
    | ToggleEvent
    | DeleteEvent
    | DeleteAllCompletedEvent
    | SetInputEvent
    | ReorderEvent
    | TasksLoadedEvent
    | MoveToDayEvent

export type TodoContext = {
    todos: Todo[]
}
