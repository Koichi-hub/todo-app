// Глобальный стек модалок для управления кнопкой "Назад" через Tauri onBackButtonPress
// Каждая модалка пушит себя в стек при открытии и удаляет при закрытии
// Глобальный слушатель onBackButtonPress закрывает верхнюю модалку из стека
// Если стек пуст — Tauri стандартно закрывает приложение

import { useEffect, useRef } from "react"
import { onBackButtonPress } from "@tauri-apps/api/app"
import type { PluginListener } from "@tauri-apps/api/core"
import type { ModalProps } from '../types'

interface ModalEntry {
    id: number
    onClose: () => void
}

const modalStack: ModalEntry[] = []
let backButtonListener: PluginListener | null = null

function registerBackHandler() {
    if (backButtonListener) return

    onBackButtonPress(() => {
        const topModal = modalStack[modalStack.length - 1]
        if (topModal) {
            topModal.onClose()
        }
    }).then((listener) => {
        backButtonListener = listener
    })
}

function unregisterBackHandler() {
    if (backButtonListener) {
        backButtonListener.unregister()
        backButtonListener = null
    }
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalIdRef = useRef<number>(Date.now())

    useEffect(() => {
        if (!isOpen) return

        modalStack.push({ id: modalIdRef.current, onClose })
        registerBackHandler()

        const handleClick = (e: MouseEvent) => {
            if (overlayRef.current === e.target) {
                modalStack.splice(modalStack.findIndex(m => m.id === modalIdRef.current), 1)
                if (modalStack.length === 0) {
                    unregisterBackHandler()
                }
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClick)

        return () => {
            document.removeEventListener("mousedown", handleClick)
            modalStack.splice(modalStack.findIndex(m => m.id === modalIdRef.current), 1)
            if (modalStack.length === 0) {
                unregisterBackHandler()
            }
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
