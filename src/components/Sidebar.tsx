import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  School,
  FlaskConical,
  CalendarDays,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import authService from "@/services/auth/auth.service";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: School, label: "Lecture Hall", path: "/dashboard/staff/lab" },
  // { icon: FlaskConical, label: 'Staffs', path: '/spaces?type=laboratory' },
  {
    icon: CalendarDays,
    label: "Degreee Program",
    path: "/dashboard/staff/degree",
  },
  {
    icon: CalendarDays,
    label: "Course Module",
    path: "/dashboard/staff/course",
  },
  // { icon: CalendarDays, label: 'Degreee Program', path: '/bookings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoLogoutDialog, setShowLogoLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoClick = () => {
    setShowLogoLogoutDialog(true);
  };

  const confirmLogout = () => {
    authService.logout();
    toast({
      title: "Logging out...",
      description: "You have been successfully logged out.",
    });
    navigate("/signin");
  };

  const confirmLogoLogout = () => {
    authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <button
        onClick={handleLogoClick}
        className="flex h-16 items-center gap-2 border-b border-border px-6 hover:bg-muted/50 transition-colors cursor-pointer w-full text-left"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">
          UWU Portal
        </span>
      </button>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path.includes("?") &&
              location.pathname === item.path.split("?")[0]);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        {/* <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link> */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the sign in page and will need to login
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showLogoLogoutDialog}
        onOpenChange={setShowLogoLogoutDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout and go to Home?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogoLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              Logout & Go Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default Sidebar;
