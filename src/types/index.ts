export type UserRole = 'admin' | 'lecturer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type RoomType = 'classroom' | 'laboratory' | 'seminar' | 'lecture-hall' | 'computer-lab' | 'auditorium';

export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface RoomEquipment {
  name: string;
  icon?: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  type: RoomType;
  building: string;
  floor: number;
  capacity: number;
  status: RoomStatus;
  equipment: RoomEquipment[];
  image?: string;
  nextAvailableSlot?: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
}

export type TimeSlotStatus = 'available' | 'booked' | 'selected' | 'past';

export interface TimeSlot {
  time: string;
  status: TimeSlotStatus;
  bookedBy?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  roomCode: string;
  day: string;
  startTime: string;
  endTime: string;
  color?: string;
}

export interface DashboardStats {
  upcoming: number;
  pending: number;
  available: number;
  bookedHours: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}
