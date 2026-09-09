interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function Button({ children, onClick, ...props }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            {...props}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all duration-300 active:scale-95"
        >
            {children}
        </button>
    );
}