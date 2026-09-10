import { useState } from "react"
import { useMachine } from '@xstate/react'
import MobileLayout from "./MobileLayout"
import { DayTab, WeekTab, ProjectsTab, OverviewTab } from "./tabs"
import { TABS, type TabId } from "./misc"
import { machine, MachineContext } from "../shared/machines"

const tabComponents: Record<TabId, React.ComponentType> = {
    day: DayTab,
    week: WeekTab,
    projects: ProjectsTab,
    overview: OverviewTab,
}

export default function MobileApp() {
    const [activeTab, setActiveTab] = useState<TabId>("day")
    const [pressingTab, setPressingTab] = useState<TabId | null>(null)
    const [snapshot, send] = useMachine(machine)

    const ActiveTabComponent = tabComponents[activeTab]

    return (
        <MachineContext.Provider value={{ snapshot, send }}>
        <MobileLayout
            nav={
                <nav className="flex items-center justify-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-2">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id
                        const isPressing = pressingTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                onMouseDown={() => setPressingTab(tab.id)}
                                onMouseUp={() => setPressingTab(null)}
                                onMouseLeave={() => setPressingTab(null)}
                                onTouchStart={() => setPressingTab(tab.id)}
                                onTouchEnd={() => setPressingTab(null)}
                                className={`
                                    flex items-center justify-center rounded-full p-3 text-white
                                    border transition-all duration-150
                                    ${isActive
                                        ? "border-[#59168B] bg-[#59168B]/20 scale-110"
                                        : "border-white/20 bg-white/10"
                                    }
                                    ${isPressing ? "scale-90" : ""}
                                `}
                            >
                                {tab.icon}
                            </button>
                        );
                    })}
                </nav>
            }
        >
            <div className="flex-1 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                <div className="h-full p-2">
                    <ActiveTabComponent />
                </div>
            </div>
        </MobileLayout>
        </MachineContext.Provider>
    )
}
