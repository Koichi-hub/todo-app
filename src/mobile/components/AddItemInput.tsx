import { useState } from 'react'
import { Button } from '../components'

interface AddItemInputProps {
    placeholder: string
    onAdd: (value: string) => void
    buttonContent?: React.ReactNode
}

export default function AddItemInput({ placeholder, onAdd, buttonContent = '+' }: AddItemInputProps) {
    const [input, setInput] = useState('')

    const handleAdd = () => {
        if (input.trim()) {
            onAdd(input)
            setInput('')
        }
    }

    return (
        <div className="flex gap-2 w-full flex-shrink-0">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder={placeholder}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-[14px] placeholder-white/50 outline-none"
            />
            <Button onClick={handleAdd}>{buttonContent}</Button>
        </div>
    )
}
