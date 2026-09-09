import { useState } from "react";
import MobileLayout from "./MobileLayout";
import DayTab from "./tabs/DayTab";
import WeekTab from "./tabs/WeekTab";
import ProjectsTab from "./tabs/ProjectsTab";
import OverviewTab from "./tabs/OverviewTab";

type TabId = "day" | "week" | "projects" | "overview";

const tabs: { id: TabId; icon: React.ReactNode }[] = [
    {
        id: "day",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        ),
    },
    {
        id: "week",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M3 10h18M8 2v4M16 2v4M3 14h4M10 14h4M17 14h4" />
            </svg>
        ),
    },
    {
        id: "projects",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
    },
    {
        id: "overview",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
];

const tabComponents: Record<TabId, React.ComponentType> = {
    day: DayTab,
    week: WeekTab,
    projects: ProjectsTab,
    overview: OverviewTab,
};

export default function MobileApp() {
    const [activeTab, setActiveTab] = useState<TabId>("day");
    const [pressingTab, setPressingTab] = useState<TabId | null>(null);

    const ActiveTabComponent = tabComponents[activeTab];

    return (
        <MobileLayout
            nav={
                <nav className="flex h-[60px] items-center justify-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const isPressing = pressingTab === tab.id;
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
    );
}
