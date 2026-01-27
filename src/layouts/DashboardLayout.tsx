import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { ChevronDown, Clock } from 'lucide-react';
import { format } from 'date-fns';

const DashboardLayout = () => {
  const currentUser = sessionStorage.getItem('fullname');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Welcome back, <span className="font-semibold text-primary">{currentUser}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Clock Section */}
            <div className="flex items-center gap-4 border-r border-border pr-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-foreground">
                  {format(currentTime, 'EEEE, MMMM do')}
                </span>
                <div className="flex items-center gap-1.5 text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono font-bold tracking-tight">
                    {format(currentTime, 'HH:mm:ss')}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <Link to="/profile" className="flex items-center gap-3 hover:bg-muted/50 p-1.5 rounded-lg transition-colors cursor-pointer group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20 transition-transform group-hover:scale-105">
                {currentUser?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground leading-none">{currentUser}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                  Active Session
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto p-8 lg:p-10 space-y-8 animate-in fade-in duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
