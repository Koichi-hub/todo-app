import { setup, assign } from 'xstate'
import { Todo } from '../types/Todo';

type AddEvent = { type: 'ADD'; text: string }
type ToggleEvent = { type: 'TOGGLE'; id: string }
type DeleteEvent = { type: 'DELETE'; id: string }
type SetInputEvent = { type: 'SET_INPUT'; text: string }
type ReorderEvent = { type: 'REORDER'; oldIndex: number; newIndex: number }
type TasksLoadedEvent = { type: 'TASKS_LOADED', todos: Todo[] }
type TodoEvent = AddEvent | ToggleEvent | DeleteEvent | SetInputEvent | ReorderEvent | TasksLoadedEvent

export const machine = setup({
  types: {
    context: {} as {
      todos: Todo[]
    },
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
        REORDER: {
          actions: 'reorderTodos',
        },
      },
    },
  },
})
