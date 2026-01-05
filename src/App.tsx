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
import StaffLabs from "./pages/Staff/Labs";
import StaffDegrees from "./pages/Staff/degreeStaff";
import StaffModules from "./pages/Staff/courseStaff";

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
          <Route path="/dashboard/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="staff/lab" element={<StaffLabs />} />
            <Route path="staff/degree" element={<StaffDegrees />} />
            <Route path="staff/course" element={<StaffModules />} />
          </Route>
          
          {/* Room Booking Routes */}
          {/* <Route path="/spaces" element={<Spaces />} /> */}
          {/* <Route path="/room/:id" element={<RoomAvailability />} /> */}
          {/* <Route path="/bookings" element={<Spaces />} /> */}
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />

            <Route path="admin" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="admin/degrees" element={<AdminDegrees />} />
        <Route path="admin/modules" element={<AdminModules />} />
        <Route path="admin/labs" element={<AdminLabs />} />
        <Route path="admin/staff" element={<AdminStaffPage />} />
        <Route path="admin/assignments" element={<AdminAssignments />} />
      </Route>

        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
