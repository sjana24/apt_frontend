import { Room, Booking, ScheduleEvent, TimeSlot, DashboardStats, UpcomingEvent, User } from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'Dr. Thompson',
  email: 'thompson@university.edu',
  role: 'lecturer',
  avatar: undefined,
};

export const dashboardStats: DashboardStats = {
  upcoming: 3,
  pending: 2,
  available: 4,
  bookedHours: 12,
};

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Advanced Physics Hall',
    code: 'SCI-304',
    type: 'lecture-hall',
    building: 'Science Building',
    floor: 3,
    capacity: 120,
    status: 'available',
    equipment: [
      { name: '120 Seats' },
      { name: 'Recording' },
      { name: 'High-speed Wifi' },
      { name: 'Climate Control' },
    ],
    nextAvailableSlot: '14:00 PM',
  },
  {
    id: '2',
    name: 'Organic Chemistry Lab',
    code: 'CHEM-101',
    type: 'laboratory',
    building: 'Chemistry Building',
    floor: 1,
    capacity: 24,
    status: 'occupied',
    equipment: [
      { name: '24 Stations' },
      { name: 'Fume Hoods' },
      { name: 'Safety Showers' },
      { name: 'Smart Board' },
    ],
    nextAvailableSlot: '16:30 PM',
  },
  {
    id: '3',
    name: 'Group Study B',
    code: 'LIB-202',
    type: 'seminar',
    building: 'Library',
    floor: 2,
    capacity: 8,
    status: 'available',
    equipment: [
      { name: '8 Seats' },
      { name: '4K Display' },
      { name: 'Conf. Phone' },
      { name: 'Whiteboard' },
    ],
    nextAvailableSlot: 'Anytime',
  },
  {
    id: '4',
    name: 'Software Engineering Lab',
    code: 'ENG-204',
    type: 'computer-lab',
    building: 'Engineering Building',
    floor: 2,
    capacity: 40,
    status: 'available',
    equipment: [
      { name: '40 Workstations' },
      { name: 'Dual Monitors' },
      { name: 'Linux/Win' },
      { name: '3D Printer' },
    ],
    nextAvailableSlot: '13:00 PM',
  },
  {
    id: '5',
    name: 'Creative Studio',
    code: 'ART-401',
    type: 'seminar',
    building: 'Arts Building',
    floor: 4,
    capacity: 15,
    status: 'available',
    equipment: [
      { name: '15 Seats' },
      { name: 'Easels' },
      { name: 'Natural Light' },
      { name: 'Drafting Tables' },
    ],
    nextAvailableSlot: '11:00 AM',
  },
  {
    id: '6',
    name: 'Main Auditorium',
    code: 'MAIN-100',
    type: 'auditorium',
    building: 'Main Building',
    floor: 1,
    capacity: 500,
    status: 'maintenance',
    equipment: [
      { name: '500 Seats' },
      { name: 'Surround Sound' },
    ],
    nextAvailableSlot: 'Tomorrow',
  },
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'CS101',
    roomCode: 'Room 304',
    day: 'Mon',
    startTime: '08:00',
    endTime: '10:00',
    color: 'bg-primary/20 text-primary border-l-4 border-primary',
  },
  {
    id: '2',
    title: 'CS101',
    roomCode: 'Room 304',
    day: 'Wed',
    startTime: '08:00',
    endTime: '10:00',
    color: 'bg-primary/20 text-primary border-l-4 border-primary',
  },
  {
    id: '3',
    title: 'CS102',
    roomCode: 'Room 201',
    day: 'Fri',
    startTime: '10:00',
    endTime: '12:00',
    color: 'bg-info/20 text-info border-l-4 border-info',
  },
  {
    id: '4',
    title: 'Lab 2A',
    roomCode: 'Chemistry',
    day: 'Tue',
    startTime: '13:00',
    endTime: '15:00',
    color: 'bg-success/20 text-success border-l-4 border-success',
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Introduction to AI',
    date: 'OCT 25',
    time: '10:00 AM - 11:30 AM',
    location: 'Room 304',
  },
  {
    id: '2',
    title: 'Physics Lab 101',
    date: 'OCT 26',
    time: '02:00 PM - 04:00 PM',
    location: 'Lab B',
  },
];

export const bookings: Booking[] = [
  {
    id: '1',
    roomId: '1',
    roomName: 'Advanced Physics Hall',
    roomCode: 'SCI-304',
    userId: '1',
    userName: 'Dr. Thompson',
    date: '2023-10-24',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Physics 101 Lecture',
    status: 'confirmed',
  },
  {
    id: '2',
    roomId: '2',
    roomName: 'Organic Chemistry Lab',
    roomCode: 'CHEM-101',
    userId: '1',
    userName: 'Dr. Thompson',
    date: '2023-10-25',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Chemistry 101 Lab',
    status: 'pending',
  },
];

export const timeSlots: TimeSlot[] = [
  { time: '08:00 AM', status: 'past' },
  { time: '09:00 AM', status: 'available' },
  { time: '10:00 AM', status: 'booked', bookedBy: 'Prof. Alchemy' },
  { time: '11:00 AM', status: 'available' },
  { time: '12:00 PM', status: 'available' },
  { time: '01:00 PM', status: 'available' },
  { time: '02:00 PM', status: 'available' },
  { time: '03:00 PM', status: 'available' },
  { time: '04:00 PM', status: 'available' },
  { time: '05:00 PM', status: 'available' },
];

export const buildings = [
  'Science Building',
  'Chemistry Building',
  'Engineering Building',
  'Library',
  'Arts Building',
  'Main Building',
];

export const roomTypes = [
  { value: 'classroom', label: 'Classroom' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'seminar', label: 'Seminar Room' },
  { value: 'lecture-hall', label: 'Lecture Hall' },
  { value: 'computer-lab', label: 'Computer Lab' },
  { value: 'auditorium', label: 'Auditorium' },
];
