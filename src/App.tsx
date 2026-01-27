import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import { Landing, SignIn, Register, Dashboard, PublicTimetable } from "./pages";
import { AdminDashboard, AdminDegrees, AdminModules, AdminLabs, AdminStaffPage, AdminAssignments, AdminTimetable } from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { StaffLabs, StaffDegrees, StaffModules } from "./pages/Staff";
import Profile from "./pages/shared/Profile";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import { AdminDashboardLayout } from "./components/adminComponents/layout/DashboardLayout";
import { AuthGuard, GuestGuard } from "./middleware/ProtectedRoute";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Accessible to EVERYONE */}
          <Route path="/" element={<Landing />} />
          <Route path="/timetable" element={<PublicTimetable />} />

          {/* Auth Routes - Redirect to dashboard ONLY if already logged in */}
          <Route element={<GuestGuard />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Staff Protected Routes */}
          <Route element={<AuthGuard allowedRoles={['staff']} />}>
            <Route path="/dashboard/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="staff/lab" element={<StaffLabs />} />
              <Route path="staff/degree" element={<StaffDegrees />} />
              <Route path="staff/course" element={<StaffModules />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AuthGuard allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="degrees" element={<AdminDegrees />} />
              <Route path="modules" element={<AdminModules />} />
              <Route path="labs" element={<AdminLabs />} />
              <Route path="staff" element={<AdminStaffPage />} />
              <Route path="assignments" element={<AdminAssignments />} />
              <Route path="timetable" element={<AdminTimetable />} />
            </Route>
          </Route>

          {/* Shared Protected Routes */}
          <Route element={<AuthGuard allowedRoles={['staff', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* Added admin profile here to ensure it works in both layouts if needed, 
                though App already had it inside Admin route. 
                Let's keep it specific to avoid layout confusion. */}
          </Route>

          {/* Catch-all - must be last */}
          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
