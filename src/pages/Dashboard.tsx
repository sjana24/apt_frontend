import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, FlaskConical, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '@/components/StatCard';
import WeeklySchedule from '@/components/WeeklySchedule';
import UpcomingEvents from '@/components/UpcomingEvents';
import MiniCalendar from '@/components/MiniCalendar';
import { EmptyState } from '@/components/ui/EmptyState';
// Remove mock data import

export function Dashboard() {
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    available: 0,
    bookedHours: 0
  });

  // Placeholder for real API call
  useEffect(() => {
    // const fetchStats = async () => { ... }
    // fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          sublabel="Classes today"
          icon={Calendar}
          iconClassName="bg-primary/10"
          valueClassName="text-primary"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          sublabel="Approvals required"
          icon={MessageCircle}
          iconClassName="bg-warning/10"
          valueClassName="text-warning"
        />
        <StatCard
          label="Available"
          value={stats.available}
          sublabel="Lab slots this week"
          icon={FlaskConical}
          iconClassName="bg-success/10"
          valueClassName="text-success"
        />
        <StatCard
          label="Booked"
          value={`${stats.bookedHours}h`}
          sublabel="Total hours this week"
          icon={Clock}
          iconClassName="bg-info/10"
          valueClassName="text-info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-1.5 hover:bg-muted">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium text-foreground">Current Week</span>
              <button className="rounded-lg p-1.5 hover:bg-muted">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Passing empty array for now as we don't have real schedule data yet */}
          <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
            <EmptyState
              title="No classes scheduled"
              description="Your weekly schedule is empty."
              icon="search"
            />
          </div>
          {/* <WeeklySchedule events={[]} /> */}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <EmptyState
              title="No events"
              description="You have no upcoming events."
              icon="file"
            />
          </div>
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
};
