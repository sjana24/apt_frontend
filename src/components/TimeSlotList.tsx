import { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { TimeSlot as TimeSlotType } from '@/types';
import { cn } from '@/lib/utils';

interface TimeSlotListProps {
  slots: TimeSlotType[];
  onSelectionChange?: (selectedSlots: string[]) => void;
}

const TimeSlotList = ({ slots, onSelectionChange }: TimeSlotListProps) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['11:00 AM', '12:00 PM']);

  const toggleSlot = (time: string, status: string) => {
    if (status === 'booked' || status === 'past') return;
    
    setSelectedSlots(prev => {
      const newSelection = prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  const getSlotStatus = (slot: TimeSlotType) => {
    if (selectedSlots.includes(slot.time)) return 'selected';
    return slot.status;
  };

  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const status = getSlotStatus(slot);
        return (
          <div
            key={slot.time}
            onClick={() => toggleSlot(slot.time, slot.status)}
            className={cn(
              'time-slot flex items-center justify-between',
              status === 'available' && 'time-slot-available',
              status === 'booked' && 'time-slot-booked',
              status === 'selected' && 'time-slot-selected',
              status === 'past' && 'time-slot-past'
            )}
          >
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm font-medium text-muted-foreground">{slot.time}</span>
              <div>
                {status === 'available' && (
                  <>
                    <p className="font-medium text-success">Available</p>
                    <p className="text-xs text-muted-foreground">1 hour slot</p>
                  </>
                )}
                {status === 'booked' && (
                  <>
                    <p className="flex items-center gap-1 font-medium text-destructive">
                      Booked <Lock className="h-3 w-3" />
                    </p>
                    <p className="text-xs text-muted-foreground">Reserved by {slot.bookedBy}</p>
                  </>
                )}
                {status === 'selected' && (
                  <>
                    <p className="font-medium text-primary">Your Selection</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedSlots.indexOf(slot.time) === 0 ? 'Start Time' : 'End Time: 01:00 PM'}
                    </p>
                  </>
                )}
                {status === 'past' && (
                  <p className="font-medium text-muted-foreground">Past</p>
                )}
              </div>
            </div>

            <div className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border-2',
              status === 'selected' && 'border-primary bg-primary',
              status === 'booked' && 'border-destructive/30 bg-destructive/10',
              status === 'available' && 'border-border',
              status === 'past' && 'border-border'
            )}>
              {status === 'selected' && <Check className="h-4 w-4 text-primary-foreground" />}
              {status === 'booked' && <span className="text-xs text-destructive">Occupied</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotList;
