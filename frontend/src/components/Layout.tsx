import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "lg:pl-64" : ""}>
        {children}
      </main>
    </div>
  );
}
