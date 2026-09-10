import { setup, assign, fromPromise } from 'xstate'
import { taskService } from '../services/taskService'
import { projectService } from '../services/projectService'
import type { TodoEvent, TodoContext, Todo } from '../types'
import type { NewTask } from '../services/schema'
import type { Project } from '../services/schema'

type ProjectContext = {
    projects: Project[]
}

type CombinedContext = TodoContext & ProjectContext

export { type TodoEvent, type TodoContext, type ProjectContext }

type ProjectEvent =
    | { type: 'LOAD_PROJECTS' }
    | { type: 'ADD_PROJECT'; name: string }
    | { type: 'PROJECTS_LOADED'; projects: Project[] }

export { type ProjectEvent }

function todoToTask(todo: Todo): NewTask {
    return {
        id: todo.id,
        name: todo.text,
        description: '',
        isCompleted: todo.completed,
        creationDate: new Date(),
        placementDate: new Date(todo.date),
        recordedTimeInSecs: 0,
        sectionId: null,
    }
}

function taskToTodo(task: { id: string; name: string; isCompleted: boolean; placementDate: Date | null }): Todo {
    return {
        id: task.id,
        text: task.name,
        completed: task.isCompleted,
        date: task.placementDate ? task.placementDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }
}

const loadTodosLogic = fromPromise(async () => {
    const tasks = await taskService.getAll()
    return tasks.map((t: any) => taskToTodo(t))
})

const loadProjectsLogic = fromPromise(async () => {
    const projects = await projectService.getAll()
    return projects
})

export const machine = setup({
    types: {
        context: {} as TodoContext & ProjectContext,
        events: {} as TodoEvent | ProjectEvent,
    },
    actions: {
        loadTodos: assign({
            todos: ({ event }: { event: any }) => {
                if (event.type === 'TASKS_LOADED') return event.todos
                return []
            }
        }),
        addTodo: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'ADD') return context.todos
                const newTodo: Todo = {
                    id: crypto.randomUUID(),
                    text: event.text,
                    completed: false,
                    date: event.date ?? new Date().toISOString().split('T')[0],
                }
                taskService.create(todoToTask(newTodo))
                return [...context.todos, newTodo]
            },
        }),
        toggleTodo: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'TOGGLE') return context.todos
                const updatedTodos = context.todos.map((todo: Todo) =>
                    todo.id === event.id ? { ...todo, completed: !todo.completed } : todo
                )
                const todo = context.todos.find((t: Todo) => t.id === event.id)
                if (todo) {
                    taskService.update(event.id, { isCompleted: !todo.completed })
                }
                return updatedTodos
            },
        }),
        deleteTodo: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'DELETE') return context.todos
                taskService.delete(event.id)
                return context.todos.filter((todo: Todo) => todo.id !== event.id)
            },
        }),
        deleteAllCompleted: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'DELETE_ALL_COMPLETED') return context.todos
                const completedTodos = context.todos.filter((todo: Todo) => todo.completed)
                completedTodos.forEach((todo: Todo) => taskService.delete(todo.id))
                return context.todos.filter((todo: Todo) => !todo.completed)
            },
        }),
        moveToDay: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'MOVE_TO_DAY') return context.todos
                const updatedTodos = context.todos.map((todo: Todo) =>
                    todo.id === event.id ? { ...todo, date: event.date } : todo
                )
                taskService.update(event.id, { placementDate: new Date(event.date) })
                return updatedTodos
            },
        }),
        reorderTodos: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'REORDER') return context.todos
                const newTodos = [...context.todos]
                const [removed] = newTodos.splice(event.oldIndex, 1)
                newTodos.splice(event.newIndex, 0, removed)
                return newTodos
            },
        }),
        loadProjects: assign({
            projects: ({ event }: { event: any }) => {
                if (event.type === 'PROJECTS_LOADED') return event.projects
                return []
            }
        }),
        addProject: assign({
            projects: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'ADD_PROJECT') return context.projects
                const id = crypto.randomUUID()
                const newProject: Project = {
                    id,
                    name: event.name,
                    description: '',
                    creationDate: new Date(),
                    tagId: null,
                }
                projectService.create(newProject)
                return [...context.projects, newProject]
            },
        }),
    },
    actors: {
        loadTodosActor: loadTodosLogic,
        loadProjectsActor: loadProjectsLogic,
    },
}).createMachine({
    id: 'todo',
    initial: 'loading',
    context: {
        todos: [],
        projects: [],
    },
    states: {
        loading: {
            invoke: {
                src: 'loadTodosActor',
                onDone: {
                    target: 'active',
                    actions: [{ type: 'loadTodos', params: ({ event }: { event: any }) => ({ todos: event.output }) }],
                },
                onError: {
                    target: 'active',
                },
            },
        },
        active: {
            on: {
                ADD: {
                    actions: 'addTodo',
                },
                TOGGLE: {
                    actions: 'toggleTodo',
                },
                DELETE: {
                    actions: 'deleteTodo',
                },
                DELETE_ALL_COMPLETED: {
                    actions: 'deleteAllCompleted',
                },
                REORDER: {
                    actions: 'reorderTodos',
                },
                MOVE_TO_DAY: {
                    actions: 'moveToDay',
                },
                LOAD_PROJECTS: {
                    target: 'loadingProjects',
                },
                ADD_PROJECT: {
                    actions: 'addProject',
                },
            },
        },
        loadingProjects: {
            invoke: {
                src: 'loadProjectsActor',
                onDone: {
                    target: 'active',
                    actions: [{ type: 'loadProjects', params: ({ event }: { event: any }) => ({ projects: event.output }) }],
                },
                onError: {
                    target: 'active',
                },
            },
        },
    },
})