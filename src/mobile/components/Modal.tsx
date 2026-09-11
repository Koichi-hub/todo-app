// Глобальный стек модалок для управления кнопкой "Назад" через Tauri onBackButtonPress
// Каждая модалка пушит себя в стек при открытии и удаляет при закрытии
// Глобальный слушатель onBackButtonPress закрывает верхнюю модалку из стека
// Если стек пуст — Tauri стандартно закрывает приложение

import { useEffect, useRef, useCallback } from "react"
import { onBackButtonPress } from "@tauri-apps/api/app"
import type { PluginListener } from "@tauri-apps/api/core"
import type { ModalProps } from '../types'

interface ModalEntry {
    id: number
    onClose: () => void
}

// Глобальный стек модалок (модульное состояние, не React state)
const modalStack: ModalEntry[] = []
let backButtonListener: PluginListener | null = null

// Обработчик нажатия кнопки "Назад" — закрывает верхнюю модалку из стека
// Вызывается из src/mobile/components/Modal.tsx
function handleBackButton() {
    const topModal = modalStack[modalStack.length - 1]
    if (topModal) {
        topModal.onClose()
    }
}

// Регистрация слушателя кнопки "Назад" (singletone)
function registerBackHandler() {
    if (backButtonListener) return
    onBackButtonPress(handleBackButton).then((listener) => {
        backButtonListener = listener
    })
}

// Удаление слушателя кнопки "Назад"
function unregisterBackHandler() {
    if (backButtonListener) {
        backButtonListener.unregister()
        backButtonListener = null
    }
}

// Добавление/удаление модалки из стека
function pushModal(id: number, onClose: () => void) {
    modalStack.push({ id, onClose })
}

function removeModal(id: number) {
    const index = modalStack.findIndex(m => m.id === id)
    if (index !== -1) modalStack.splice(index, 1)
    if (modalStack.length === 0) unregisterBackHandler()
}

let modalIdCounter = 0
function generateModalId() {
    return ++modalIdCounter
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalIdRef = useRef<number>(generateModalId())

    // Клик по оверлею закрывает модалку
    const handleOverlayClick = useCallback((e: MouseEvent) => {
        if (overlayRef.current === e.target) {
            removeModal(modalIdRef.current)
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        if (!isOpen) return

        pushModal(modalIdRef.current, onClose)
        registerBackHandler()

        document.addEventListener("mousedown", handleOverlayClick)

        return () => {
            document.removeEventListener("mousedown", handleOverlayClick)
            removeModal(modalIdRef.current)
        }
    }, [isOpen, onClose, handleOverlayClick])

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
