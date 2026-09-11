// XState 5 machine: управляет состоянием todos и projects.
// ВАЖНО: Todo (фронтенд) != Task (БД). Маппинг через todoToTask() и taskToTodo().
// Операции с БД: taskService, projectService, sectionService (src/shared/services/).
// НЕ использует invoke() — сервисы работают напрямую с tauri-plugin-sql.
import { setup, assign, fromPromise } from 'xstate'
import { taskService } from '../services/taskService'
import { projectService } from '../services/projectService'
import { sectionService } from '../services/sectionService'
import { tagService } from '../services/tagService'
import type { TodoEvent, TodoContext, Todo } from '../types'
import type { NewTask, Task } from '../services/schema'
import type { Project, Section, Tag } from '../services/schema'

type SectionWithStats = {
    section: Section
    tasks: Task[]
    completedCount: number
    totalCount: number
    recordedTimeInSecs: number
    tag: Tag | null
}

type ProjectContext = {
    projects: Project[]
    projectSections: Map<string, SectionWithStats[]>
    tags: Map<string, Tag>
}

type CombinedContext = TodoContext & ProjectContext

export { type TodoEvent, type TodoContext, type ProjectContext }

type ProjectEvent =
    | { type: 'LOAD_PROJECTS' }
    | { type: 'ADD_PROJECT'; name: string }
    | { type: 'PROJECTS_LOADED'; projects: Project[] }
    | { type: 'UPDATE_PROJECT'; project: Project }
    | { type: 'LOAD_PROJECT_SECTIONS'; projectId: string }
    | { type: 'PROJECT_SECTIONS_LOADED'; projectId: string; sections: SectionWithStats[] }
    | { type: 'LOAD_TAGS' }
    | { type: 'TAGS_LOADED'; tags: Tag[] }

export { type ProjectEvent, type SectionWithStats }

// Todo (frontend) -> Task (DB schema). Синхронизировать при изменении структуры!
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

// Task (DB schema) -> Todo (frontend view model). Синхронизировать при изменении структуры!
function taskToTodo(task: { id: string; name: string; isCompleted: boolean; placementDate: Date | null; sectionId?: string | null }): Todo {
    return {
        id: task.id,
        text: task.name,
        completed: task.isCompleted,
        date: task.placementDate ? task.placementDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        sectionId: task.sectionId,
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

const loadProjectSectionsLogic = fromPromise(async ({ input }: { input: { projectId: string } }) => {
    const sections = await sectionService.getByProjectId(input.projectId)
    const sectionsWithStats = await Promise.all(
        sections.map(async (s) => {
            const tasks = await taskService.getBySectionId(s.id)
            const completedCount = tasks.filter(t => t.isCompleted).length
            const recordedTimeInSecs = tasks.reduce((acc, t) => acc + (t.recordedTimeInSecs || 0), 0)
            const tag = s.tagId ? await tagService.getById(s.tagId) : null
            return {
                section: s,
                tasks,
                completedCount,
                totalCount: tasks.length,
                recordedTimeInSecs,
                tag,
            }
        })
    )
    return { projectId: input.projectId, sections: sectionsWithStats }
})

const loadTagsLogic = fromPromise(async () => {
    const tags = await tagService.getAll()
    return tags
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
        updateTodo: assign({
            todos: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'UPDATE_TODO') return context.todos
                const updatedTodos = context.todos.map((todo: Todo) => {
                    if (todo.id !== event.id) return todo
                    const updates: Partial<Todo> = { id: todo.id }
                    if (event.text !== undefined) updates.text = event.text
                    if (event.description !== undefined) updates.description = event.description
                    return { ...todo, ...updates }
                })
                const todo = context.todos.find((t: Todo) => t.id === event.id)
                if (todo) {
                    const taskUpdates: any = {}
                    if (event.text !== undefined) taskUpdates.name = event.text
                    if (event.description !== undefined) taskUpdates.description = event.description
                    if (Object.keys(taskUpdates).length > 0) {
                        taskService.update(event.id, taskUpdates)
                    }
                }
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
        updateProject: assign({
            projects: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'UPDATE_PROJECT') return context.projects
                projectService.update(event.project.id, event.project)
                return context.projects.map((p: Project) =>
                    p.id === event.project.id ? event.project : p
                )
            },
        }),
        loadProjectSections: assign({
            projectSections: ({ context, event }: { context: CombinedContext; event: any }) => {
                if (event.type !== 'PROJECT_SECTIONS_LOADED') return context.projectSections
                const newMap = new Map(context.projectSections)
                newMap.set(event.projectId, event.sections)
                return newMap
            },
        }),
        loadTags: assign({
            tags: ({ event }: { event: any }) => {
                if (event.type !== 'TAGS_LOADED') return new Map()
                return new Map(event.tags.map((t: Tag) => [t.id, t]))
            },
        }),
    },
    actors: {
        loadTodosActor: loadTodosLogic,
        loadProjectsActor: loadProjectsLogic,
        loadProjectSectionsActor: loadProjectSectionsLogic,
        loadTagsActor: loadTagsLogic,
    },
}).createMachine({
    id: 'todo',
    initial: 'loading',
    context: {
        todos: [],
        projects: [],
        projectSections: new Map(),
        tags: new Map(),
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
                UPDATE_TODO: {
                    actions: 'updateTodo',
                },
                LOAD_PROJECTS: {
                    target: 'loadingProjects',
                },
                ADD_PROJECT: {
                    actions: 'addProject',
                },
                UPDATE_PROJECT: {
                    actions: 'updateProject',
                },
                LOAD_PROJECT_SECTIONS: {
                    target: 'loadingProjectSections',
                },
                LOAD_TAGS: {
                    target: 'loadingTags',
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
        loadingProjectSections: {
            invoke: {
                src: 'loadProjectSectionsActor',
                input: ({ event }: { event: any }) => ({ projectId: event.projectId }),
                onDone: {
                    target: 'active',
                    actions: [{ type: 'loadProjectSections', params: ({ event }: { event: any }) => ({ projectId: event.output.projectId, sections: event.output.sections }) }],
                },
                onError: {
                    target: 'active',
                },
            },
        },
        loadingTags: {
            invoke: {
                src: 'loadTagsActor',
                onDone: {
                    target: 'active',
                    actions: [{ type: 'loadTags', params: ({ event }: { event: any }) => ({ tags: event.output }) }],
                },
                onError: {
                    target: 'active',
                },
            },
        },
    },
})