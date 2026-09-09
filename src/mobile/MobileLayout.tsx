interface MobileLayoutProps {
    children: React.ReactNode;
    nav: React.ReactNode;
}

export default function MobileLayout({ children, nav }: MobileLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col p-1 gap-1 overflow-hidden bg-[length:100%_100%] bg-gradient-to-b from-[#0F172A] via-[#34175B] via-[#59168B] via-[#34175B] to-[#0F172A]">
            {children}
            {nav}
        </div>
    );
}
