import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import { Landing, SignIn, Register, Dashboard } from "./pages";
import { AdminDashboard, AdminDegrees, AdminModules, AdminLabs, AdminStaffPage, AdminAssignments } from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { StaffLabs, StaffDegrees, StaffModules } from "./pages/Staff";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import { AdminDashboardLayout } from "./components/adminComponents/layout/DashboardLayout";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="staff/lab" element={<StaffLabs />} />
            <Route path="staff/degree" element={<StaffDegrees />} />
            <Route path="staff/course" element={<StaffModules />} />
          </Route>

          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="degrees" element={<AdminDegrees />} />
            <Route path="modules" element={<AdminModules />} />
            <Route path="labs" element={<AdminLabs />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="assignments" element={<AdminAssignments />} />
          </Route>

          {/* Catch-all - must be last */}
          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
