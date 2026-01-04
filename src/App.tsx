import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Spaces from "./pages/Spaces";
import RoomAvailability from "./pages/RoomAvailability";
import Timetable from "./pages/Timetable";
import NotFound from "./pages/NotFound";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import Degrees from "./pages/Admin/Degrees";
import Modules from "./pages/Admin/Modules";
import Assignments from "./pages/Admin/Assignments";
import Labs from "./pages/Admin/Labs";
import StaffPage from "./pages/Admin/Staff";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminDegrees from "./pages/Admin/Degrees";
import AdminModules from "./pages/Admin/Modules";
import AdminLabs from "./pages/Admin/Labs";
import AdminStaffPage from "./pages/Admin/Staff";
import AdminAssignments from "./pages/Admin/Assignments";
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
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          
          {/* Room Booking Routes */}
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/room/:id" element={<RoomAvailability />} />
          <Route path="/bookings" element={<Spaces />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />

            <Route path="abc" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="abc/degrees" element={<AdminDegrees />} />
        <Route path="abc/modules" element={<AdminModules />} />
        <Route path="abc/labs" element={<AdminLabs />} />
        <Route path="abc/staff" element={<AdminStaffPage />} />
        <Route path="abc/assignments" element={<AdminAssignments />} />
      </Route>

        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
