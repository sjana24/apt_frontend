import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const MiniCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="rounded-lg p-1.5 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-bold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="rounded-lg p-1.5 hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day, i) => (
          <div key={i} className="p-2 text-center text-[10px] font-bold text-muted-foreground/60 uppercase">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              'relative p-2 text-center text-xs h-9 w-9 flex items-center justify-center transition-all',
              !isSameMonth(day, currentMonth) && 'text-muted-foreground/20 pointer-events-none',
              isSameDay(day, today) && 'rounded-full bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20',
              isSameDay(day, today) === false && isSameMonth(day, currentMonth) && 'hover:bg-primary/10 hover:text-primary rounded-full cursor-pointer text-foreground'
            )}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
