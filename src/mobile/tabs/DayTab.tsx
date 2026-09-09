import {
    DndContext,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useMachine } from '@xstate/react'
import { useEffect, useState } from 'react'
import SortableTodo from '../components/SortableTodo'
import { useStore } from '../../desktop/hooks/useStore'
import { machine } from '../../desktop/machines/todoMachine'
import { STORAGE_KEY } from '../../shared/misc/constants'
import { Todo } from '../../shared/types/Todo'
import Button from '../components/Button'

export default function DayTab() {
    const [save] = useStore<Todo[]>(STORAGE_KEY, (todos) => {
        if (todos.length === 0) {
            send({ type: 'TASKS_LOADED', todos: [] })
        } else {
            send({ type: 'TASKS_LOADED', todos })
        }
    })
    const [snapshot, send] = useMachine(machine)
    const [input, setInput] = useState('')

    useEffect(() => {
        if (snapshot.context.todos.length > 0) {
            save(snapshot.context.todos)
        }
    }, [snapshot.context.todos])

    const handleAdd = () => {
        if (input.trim()) {
            send({ type: 'ADD', text: input })
            setInput('')
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const list = event.active.data.current?.listType === 'complete'
                ? snapshot.context.todos.filter((t) => t.completed)
                : snapshot.context.todos.filter((t) => !t.completed)
            const oldIndex = list.findIndex((t) => t.id === active.id)
            const newIndex = list.findIndex((t) => t.id === over.id)
            send({ type: 'REORDER', oldIndex, newIndex })
        }
    }

    const incomplete = snapshot.context.todos.filter((t) => !t.completed)
    const complete = snapshot.context.todos.filter((t) => t.completed)

    return (
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-white text-[20px] font-bold">Задачи на сегодня</h1>

            <div className="flex gap-2 w-full">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Введите новую задачу..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-[14px] placeholder-white/50 outline-none"
                />
                <Button>+</Button>
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="w-full mt-2">
                    <h2 className="text-white font-bold text-[16px]">Ждут выполнения</h2>
                    <div className="mt-1">
                        <SortableContext items={incomplete.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1">
                                {incomplete.length === 0 ? (
                                    <p className="text-white/50 text-sm italic">Нет задач</p>
                                ) : (
                                    incomplete.map((todo) => (
                                        <SortableTodo
                                            key={todo.id}
                                            todo={todo}
                                            listType="incomplete"
                                            onToggle={() => send({ type: 'TOGGLE', id: todo.id })}
                                        />
                                    ))
                                )}
                            </div>
                        </SortableContext>
                    </div>
                </div>

                <div className="w-full mt-4">
                    <h2 className="text-white font-bold text-[16px]">Выполнены</h2>
                    <div className="mt-1">
                        <SortableContext items={complete.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1">
                                {complete.length === 0 ? (
                                    <p className="text-white/50 text-sm italic">Нет выполненных</p>
                                ) : (
                                    complete.map((todo) => (
                                        <SortableTodo
                                            key={todo.id}
                                            todo={todo}
                                            listType="complete"
                                            onToggle={() => send({ type: 'TOGGLE', id: todo.id })}
                                        />
                                    ))
                                )}
                            </div>
                        </SortableContext>
                    </div>
                </div>
            </DndContext>
        </div>
    );
}
