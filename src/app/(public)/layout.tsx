import { ReactNode } from "react";

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen">
            {/* 公共页面的导航栏可以在这里添加 */}
            <main>{children}</main>
        </div>
    );
}