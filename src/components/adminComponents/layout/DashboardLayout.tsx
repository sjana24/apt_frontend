import { Outlet } from "react-router-dom";
import { AdminAppSidebar } from "./AppSidebar";
import { AdminTopBar } from "./TopBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <AdminTopBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
