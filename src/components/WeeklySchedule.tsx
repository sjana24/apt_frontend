import { ScheduleEvent } from '@/types';
import { cn } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const times = ['08:00', '10:00', '12:00', '14:00', '16:00'];

interface WeeklyScheduleProps {
  events: ScheduleEvent[];
}

const WeeklySchedule = ({ events }: WeeklyScheduleProps) => {
  const getEventForSlot = (day: string, time: string) => {
    return events.find(e => e.day === day && e.startTime === time);
  };

  return (
    <div className="card-elevated overflow-hidden">
      <div className="grid grid-cols-6">
        {/* Header */}
        <div className="border-b border-r border-border bg-muted/50 p-3 text-center text-sm font-medium text-muted-foreground">
          Time
        </div>
        {days.map(day => (
          <div key={day} className="border-b border-border bg-muted/50 p-3 text-center text-sm font-medium text-foreground">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {times.map(time => (
          <>
            <div key={time} className="border-b border-r border-border p-3 text-center text-sm text-muted-foreground">
              {time}
            </div>
            {days.map(day => {
              const event = getEventForSlot(day, time);
              return (
                <div key={`${day}-${time}`} className="min-h-[80px] border-b border-border p-1">
                  {event && (
                    <div className={cn(
                      'h-full rounded-lg p-2 text-xs',
                      event.color
                    )}>
                      <p className="font-semibold">{event.title}</p>
                      <p className="mt-1 opacity-80">{event.roomCode}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
