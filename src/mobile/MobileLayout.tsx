import type { MobileLayoutProps } from './types'
import './MobileLayout.css'

export default function MobileLayout({ children, nav }: MobileLayoutProps) {
    return (
        <div className='mobile-app h-screen bg-[length:100%_100%] bg-gradient-to-br from-[#0F172A] via-[#34175B] via-[#59168B] via-[#34175B] to-[#0F172A]'>
            <div className="flex h-full flex-col p-1 gap-1 overflow-hidden">
                {children}
                {nav}
            </div>
        </div>
    )
}
