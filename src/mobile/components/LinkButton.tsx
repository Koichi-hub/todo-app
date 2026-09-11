import type { ButtonProps } from '../types'

export default function LinkButton({ children, onClick, ...props }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            {...props}
            className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
        >
            {children}
        </button>
    )
}