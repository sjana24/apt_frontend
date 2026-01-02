import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MiniCalendar = () => {
  const [currentDate] = useState(new Date(2023, 9, 5)); // October 2023
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Generate calendar days for October 2023
  const getDaysInMonth = () => {
    const year = 2023;
    const month = 9; // October
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = getDaysInMonth();
  const selectedDay = 5;
  const eventDays = [10, 15, 25];

  return (
    <div className="card-elevated p-4">
      <div className="mb-4 flex items-center justify-between">
        <button className="rounded-lg p-1.5 hover:bg-muted">
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-semibold text-foreground">October 2023</span>
        <button className="rounded-lg p-1.5 hover:bg-muted">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day, i) => (
          <div key={i} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              'relative p-2 text-center text-sm',
              day === null && 'invisible',
              day === selectedDay && 'rounded-full bg-primary text-primary-foreground font-medium',
              day !== selectedDay && day && 'hover:bg-muted rounded-full cursor-pointer text-foreground'
            )}
          >
            {day}
            {day && eventDays.includes(day) && day !== selectedDay && (
              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-destructive" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
