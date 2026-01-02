import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Plus, ChevronDown } from 'lucide-react';
import { currentUser } from '@/data/mockData';
import { Link } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {currentUser.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search rooms, labs, or bookings..."
                className="pl-10"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <Button asChild>
              <Link to="/spaces">
                <Plus className="mr-2 h-4 w-4" />
                Book Room
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                DT
              </div>
              <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
