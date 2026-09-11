import { useEffect, useState, useRef } from 'react'

export function EditableText({
    value,
    onSave,
    textClassName,
    placeholder,
}: {
    value: string
    onSave: (value: string) => void
    textClassName: string
    placeholder?: string
}) {
    const [editing, setEditing] = useState(false)
    const [localValue, setLocalValue] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [editing])

    const handleSave = () => {
        const trimmed = localValue.trim()
        if (trimmed !== value) {
            onSave(trimmed)
        }
        setEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            setLocalValue(value)
            setEditing(false)
        }
    }

    if (editing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`bg-transparent border-none outline-none ${textClassName}`}
                placeholder={placeholder}
            />
        )
    }

    return (
        <span
            onClick={() => setEditing(true)}
            className={`cursor-pointer hover:opacity-80 ${textClassName}`}
        >
            {value || placeholder}
        </span>
    )
}
