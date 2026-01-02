import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Users, 
  Monitor, 
  Pencil, 
  Droplets,
  Map,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TimeSlotList from '@/components/TimeSlotList';
import MiniCalendar from '@/components/MiniCalendar';
import BookingConfirmModal from '@/components/BookingConfirmModal';
import { timeSlots, buildings, roomTypes } from '@/data/mockData';

const RoomAvailability = () => {
  const { id } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Thursday, Oct 24, 2023');

  const handleConfirmBooking = () => {
    setShowConfirmModal(false);
    // Navigate to bookings or show success
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">UniBook System</span>
          </Link>
          
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/spaces" className="nav-link">Schedule</Link>
            <Link to="/bookings" className="nav-link">My Bookings</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/30 bg-orange-100">
            <span className="text-sm font-medium text-orange-800">DT</span>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/spaces" className="text-muted-foreground hover:text-foreground">Campus A</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/spaces" className="text-muted-foreground hover:text-foreground">Science Building</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">Room 304</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Left Sidebar - Filters */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="mb-4 font-semibold text-foreground">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block text-sm">Building</Label>
                  <Select defaultValue="Science Building">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map(building => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">Room Type</Label>
                  <Select defaultValue="laboratory">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">Min. Capacity</Label>
                  <Input type="number" defaultValue="20" />
                </div>
              </div>
            </div>

            <MiniCalendar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Room Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">Room 304 - Chemistry Lab</h1>
                  <span className="status-badge status-available">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Available
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    25 Students
                  </span>
                  <span className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" />
                    Projector
                  </span>
                  <span className="flex items-center gap-1">
                    <Pencil className="h-4 w-4" />
                    Whiteboard
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="h-4 w-4" />
                    Sink
                  </span>
                </div>
              </div>
              <Button variant="outline">
                <Map className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </div>

            {/* Date Navigation */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <button className="rounded-lg p-2 hover:bg-muted">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{selectedDate}</span>
              </div>
              <span className="text-sm text-muted-foreground">Today</span>
              <button className="rounded-lg p-2 hover:bg-muted">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Time Slots */}
            <TimeSlotList slots={timeSlots} />

            {/* Booking Summary */}
            <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Summary</p>
                  <p className="font-medium text-foreground">Oct 24 • 11:00 AM - 01:00 PM (2 Hours)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => setShowConfirmModal(true)}>Book Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingConfirmModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default RoomAvailability;
