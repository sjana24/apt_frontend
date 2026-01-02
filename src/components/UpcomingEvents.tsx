import { Clock, MapPin } from 'lucide-react';
import { UpcomingEvent } from '@/types';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  return (
    <div className="card-elevated p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Next Up</h3>
        <button className="text-sm font-medium text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="flex gap-3">
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg border border-border bg-muted/50">
              <span className="text-[10px] font-semibold uppercase text-primary">OCT</span>
              <span className="text-lg font-bold text-foreground">{event.date.split(' ')[1]}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{event.title}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
