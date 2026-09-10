import { useEffect, useRef } from "react"
import type { ModalProps } from '../types'

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return

        const handleClick = (e: MouseEvent) => {
            if (overlayRef.current === e.target) {
                onClose()
            }
        }

        const handleBackButton = () => {
            onClose()
        }

        document.addEventListener("mousedown", handleClick)
        window.addEventListener("popstate", handleBackButton)

        if (isOpen) {
            history.pushState(null, "", location.href)
        }

        return () => {
            document.removeEventListener("mousedown", handleClick)
            window.removeEventListener("popstate", handleBackButton)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div
                className="w-[94%] h-[70%] rounded-xl p-2 overflow-hidden"
                style={{
                    backgroundColor: "#34175B",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                }}
            >
                {children}
            </div>
        </div>
    )
}
