import { useState, useEffect, useRef } from 'react'
import { LazyStore } from '@tauri-apps/plugin-store'

const store = new LazyStore('todos.json')

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const load = async () => {
      try {
        const value = await store.get<T>(key)
        setStoredValue(value ?? initialValue)
      } catch {
        setStoredValue(initialValue)
      }
      setIsLoaded(true)
    }
    load()
  }, [key, initialValue])

  useEffect(() => {
    if (!isLoaded || isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const save = async () => {
      try {
        await store.set(key, storedValue)
        await store.save()
      } catch {
        console.error('Failed to save to store')
      }
    }
    save()
  }, [key, storedValue, isLoaded])

  return [storedValue, setStoredValue]
}
