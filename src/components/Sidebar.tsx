import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  School,
  FlaskConical,
  CalendarDays,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import authService from '@/services/auth/auth.service';
import { toast } from '@/hooks/use-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: School, label: 'Lecture Hall', path: '/dashboard/staff/lab' },
  // { icon: FlaskConical, label: 'Staffs', path: '/spaces?type=laboratory' },
  { icon: CalendarDays, label: 'Degreee Program', path: '/dashboard/staff/degree' },
  { icon: CalendarDays, label: 'Course Module', path: '/dashboard/staff/course' },
  // { icon: CalendarDays, label: 'Degreee Program', path: '/bookings' },
];



const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You have been successfully logged out.",
    });
    authService.logout();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">UWU Portal</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path.includes('?') && location.pathname === item.path.split('?')[0]);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
    </aside>
  );
};

export default Sidebar;
