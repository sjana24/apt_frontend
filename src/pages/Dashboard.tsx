import { Calendar, MessageCircle, FlaskConical, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '@/components/StatCard';
import WeeklySchedule from '@/components/WeeklySchedule';
import UpcomingEvents from '@/components/UpcomingEvents';
import MiniCalendar from '@/components/MiniCalendar';
import { dashboardStats, scheduleEvents, upcomingEvents } from '@/data/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming"
          value={dashboardStats.upcoming}
          sublabel="Classes today"
          icon={Calendar}
          iconClassName="bg-primary/10"
          valueClassName="text-primary"
        />
        <StatCard
          label="Pending"
          value={dashboardStats.pending}
          sublabel="Approvals required"
          icon={MessageCircle}
          iconClassName="bg-warning/10"
          valueClassName="text-warning"
        />
        <StatCard
          label="Available"
          value={dashboardStats.available}
          sublabel="Lab slots this week"
          icon={FlaskConical}
          iconClassName="bg-success/10"
          valueClassName="text-success"
        />
        <StatCard
          label="Booked"
          value={`${dashboardStats.bookedHours}h`}
          sublabel="Total hours this week"
          icon={Clock}
          iconClassName="bg-info/10"
          valueClassName="text-info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-1.5 hover:bg-muted">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium text-foreground">Oct 23 - Oct 29</span>
              <button className="rounded-lg p-1.5 hover:bg-muted">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <WeeklySchedule events={scheduleEvents} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <UpcomingEvents events={upcomingEvents} />
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
