import { setup, assign } from 'xstate'
import type { TodoEvent, TodoContext } from '../types'

export { type TodoEvent, type TodoContext }

export const machine = setup({
    types: {
        context: {} as TodoContext,
        events: {} as TodoEvent,
    },
    actions: {
        addTodo: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'ADD') return context.todos
                return [
                    ...context.todos,
                    {
                        id: crypto.randomUUID(),
                        text: event.text,
                        completed: false,
                        date: event.date ?? new Date().toISOString().split('T')[0],
                    },
                ]
            },
        }),
        toggleTodo: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'TOGGLE') return context.todos
                return context.todos.map((todo) =>
                    todo.id === event.id ? { ...todo, completed: !todo.completed } : todo
                )
            },
        }),
        deleteTodo: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'DELETE') return context.todos
                return context.todos.filter((todo) => todo.id !== event.id)
            },
        }),
        deleteAllCompleted: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'DELETE_ALL_COMPLETED') return context.todos
                return context.todos.filter((todo) => !todo.completed)
            },
        }),
        moveToDay: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'MOVE_TO_DAY') return context.todos
                return context.todos.map((todo) =>
                    todo.id === event.id ? { ...todo, date: event.date } : todo
                )
            },
        }),
        reorderTodos: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'REORDER') return context.todos
                const newTodos = [...context.todos]
                const [removed] = newTodos.splice(event.oldIndex, 1)
                newTodos.splice(event.newIndex, 0, removed)
                return newTodos
            },
        }),
        tasksLoaded: assign({
            todos: ({ context, event }) => {
                if (event.type !== 'TASKS_LOADED') return context.todos
                return event.todos
            }
        })
    },
}).createMachine({
    id: 'todo',
    initial: 'active',
    context: {
        todos: [],
    },
    on: {
        TASKS_LOADED: {
            actions: 'tasksLoaded'
        }
    },
    states: {
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
            },
        },
    },
})
