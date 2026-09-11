import { useEffect, useRef } from 'react'
import { LazyStore } from '@tauri-apps/plugin-store'

// tauri-plugin-store (JSON): альтернативная персистенция (не используется для основных данных).
// Используется для настроек/конфига. Основные данные хранятся в SQLite через tauri-plugin-sql.
const store = new LazyStore('todos.json')

export function useStore<T>(key: string, onLoad: (value: T) => void): [(value: T) => Promise<void>] {
    const isMountedRef = useRef(true)
    const isLoadedRef = useRef(false)

    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    // Загрузка данных из LazyStore (tauri-plugin-store).
    // Флаг isLoadedRef предотвращает сохранение до первого чтения.
    useEffect(() => {
        const load = async () => {
            try {
                const value = await store.get<T>(key)
                if (isMountedRef.current) {
                    onLoad(value ?? ([] as T))
                    isLoadedRef.current = true
                }
            } catch {}
        }
        load()
    }, [key])

    const save = async (value: T) => {
        if (!isMountedRef.current || !isLoadedRef.current) return
        try {
            await store.set(key, value)
            await store.save()
        } catch {
            console.error('Failed to save to store')
        }
    }

    return [save]
}
