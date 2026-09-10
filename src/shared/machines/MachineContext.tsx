import { createContext, useContext } from 'react'
import type { SnapshotFrom } from 'xstate'
import type { machine, TodoEvent } from './todoMachine'

export type MachineSnapshot = SnapshotFrom<typeof machine>

export type MachineContextType = {
    snapshot: MachineSnapshot
    send: (event: TodoEvent) => void
}

export const MachineContext = createContext<MachineContextType | null>(null)

export function useMachineContext() {
    const context = useContext(MachineContext)
    if (!context) {
        throw new Error('useMachineContext must be used within MachineProvider')
    }
    return context
}
