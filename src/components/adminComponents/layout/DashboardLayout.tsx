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
        <main className="flex-1 overflow-auto bg-slate-50/30">
          <div className="max-w-[1600px] mx-auto p-8 lg:p-10 animate-in fade-in duration-700">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
