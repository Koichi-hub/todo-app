import type { ReactNode } from 'react'

export type TabId = 'day' | 'week' | 'projects' | 'overview'

export interface Tab {
    id: TabId
    icon: ReactNode
}

export const TABS: Tab[] = [
    {
        id: 'day',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        ),
    },
    {
        id: 'week',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M3 10h18M8 2v4M16 2v4M3 14h4M10 14h4M17 14h4" />
            </svg>
        ),
    },
    {
        id: 'projects',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
    },
    {
        id: 'overview',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
]
