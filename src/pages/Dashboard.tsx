import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, FlaskConical, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import WeeklySchedule from '@/components/WeeklySchedule';
import UpcomingEvents from '@/components/UpcomingEvents';
import MiniCalendar from '@/components/MiniCalendar';
import { EmptyState } from '@/components/ui/EmptyState';
import timeTableService from '@/services/admin/timeTable.service';
import { TimetableSlot } from '@/types/indexAdmin';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    available: 0,
    bookedHours: 0
  });
  const [schedule, setSchedule] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, scheduleData] = await Promise.all([
          timeTableService.getDashboardStats(),
          timeTableService.getMySchedule()
        ]);
        setStats(statsData);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          sublabel="Sessions today"
          icon={Calendar}
          iconClassName="bg-primary/10"
          valueClassName="text-primary"
        />
        <StatCard
          label="Sessions"
          value={stats.pending}
          sublabel="Total this week"
          icon={MessageCircle}
          iconClassName="bg-warning/10"
          valueClassName="text-warning"
        />
        <StatCard
          label="Available Labs"
          value={stats.available}
          sublabel="Across campus"
          icon={FlaskConical}
          iconClassName="bg-success/10"
          valueClassName="text-success"
        />
        <StatCard
          label="Booked Credits"
          value={stats.bookedHours}
          sublabel="Total assigned"
          icon={Clock}
          iconClassName="bg-info/10"
          valueClassName="text-info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Schedule / Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Schedule</h2>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {schedule.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Module</th>
                      <th className="px-4 py-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {schedule.map((slot) => (
                      <tr key={slot.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          {format(parseISO(slot.slot_date), 'MMM dd, EEE')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="font-mono">
                            {slot.time_range}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{slot.module_code}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {slot.module_name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[10px]">
                              {slot.lab_code}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                              {slot.lab_name}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 flex items-center justify-center">
                <EmptyState
                  title="No classes scheduled"
                  description="Your upcoming schedule is clean."
                  icon="search"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Calendar Preview
            </h3>
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};
