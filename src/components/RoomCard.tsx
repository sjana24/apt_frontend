import { Link } from 'react-router-dom';
import { Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Room, RoomType } from '@/types';
import { cn } from '@/lib/utils';

import lectureHallImg from '@/assets/lecture-hall.jpg';
import chemistryLabImg from '@/assets/chemistry-lab.jpg';
import seminarRoomImg from '@/assets/seminar-room.jpg';
import computerLabImg from '@/assets/computer-lab.jpg';

const roomImages: Record<RoomType, string> = {
  'lecture-hall': lectureHallImg,
  'laboratory': chemistryLabImg,
  'seminar': seminarRoomImg,
  'computer-lab': computerLabImg,
  'classroom': lectureHallImg,
  'auditorium': lectureHallImg,
};

const roomTypeLabels: Record<RoomType, string> = {
  'lecture-hall': 'LECTURE HALL',
  'laboratory': 'LABORATORY',
  'seminar': 'SEMINAR ROOM',
  'computer-lab': 'COMPUTER LAB',
  'classroom': 'CLASSROOM',
  'auditorium': 'AUDITORIUM',
};

interface RoomCardProps {
  room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const statusStyles = {
    available: 'status-available',
    occupied: 'status-booked',
    maintenance: 'status-maintenance',
  };

  const statusLabels = {
    available: 'Available',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
  };

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={roomImages[room.type]} 
          alt={room.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute left-3 bottom-3 rounded-md bg-foreground/80 px-2 py-1 text-xs font-medium text-background">
          Level {room.floor}
        </div>
        <div className={cn(
          'absolute right-3 top-3 status-badge',
          statusStyles[room.status]
        )}>
          <span className={cn(
            'h-1.5 w-1.5 rounded-full',
            room.status === 'available' && 'bg-success',
            room.status === 'occupied' && 'bg-destructive',
            room.status === 'maintenance' && 'bg-muted-foreground'
          )} />
          {statusLabels[room.status]}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-primary">
            {roomTypeLabels[room.type]}
          </span>
          <span className="text-xs text-muted-foreground">• {room.code}</span>
        </div>

        <h3 className="mb-3 text-lg font-semibold text-foreground">{room.name}</h3>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {room.equipment.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {item.name}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Next slot: </span>
            <span className="font-medium text-foreground">{room.nextAvailableSlot}</span>
          </div>
          
          {room.status === 'maintenance' ? (
            <Button variant="outline" disabled>
              Unavailable
            </Button>
          ) : room.status === 'available' ? (
            <Button asChild>
              <Link to={`/room/${room.id}`}>Book Now</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to={`/room/${room.id}`}>View Schedule</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
