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
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
