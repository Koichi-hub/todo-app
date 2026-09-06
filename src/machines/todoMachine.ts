import { setup, assign } from 'xstate'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

type AddEvent = { type: 'ADD'; text: string }
type ToggleEvent = { type: 'TOGGLE'; id: string }
type DeleteEvent = { type: 'DELETE'; id: string }
type SetInputEvent = { type: 'SET_INPUT'; text: string }
type ReorderEvent = { type: 'REORDER'; oldIndex: number; newIndex: number }
type TodoEvent = AddEvent | ToggleEvent | DeleteEvent | SetInputEvent | ReorderEvent

const machineSetup = setup({
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
  },
})

export const createTodoMachine = (initialTodos: Todo[] = []) =>
  machineSetup.createMachine({
    id: 'todo',
    initial: 'active',
    context: {
      todos: initialTodos,
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

export const todoMachine = createTodoMachine()
