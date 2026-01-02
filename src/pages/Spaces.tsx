import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, X, Bell, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RoomCard from '@/components/RoomCard';
import Navbar from '@/components/Navbar';
import { rooms, buildings, roomTypes } from '@/data/mockData';

const Spaces = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Projector Available', 'Science Building']);

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">UniBook</span>
          </Link>
          
          <div className="hidden items-center gap-8 md:flex">
            <Link to="/bookings" className="nav-link">My Bookings</Link>
            <Link to="/spaces" className="nav-link-active">Schedule</Link>
            <Link to="/help" className="nav-link">Support</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-200">
              <span className="text-sm font-medium text-orange-800">JD</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Available Spaces</h1>
              <p className="mt-1 text-muted-foreground">
                Browse and book classrooms, laboratories, and study spaces across campus.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-card py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search room number, name, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-20">1-20 seats</SelectItem>
                <SelectItem value="21-50">21-50 seats</SelectItem>
                <SelectItem value="51-100">51-100 seats</SelectItem>
                <SelectItem value="100+">100+ seats</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map(building => (
                  <SelectItem key={building} value={building}>{building}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Date & Time
            </Button>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ACTIVE:</span>
              {activeFilters.map(filter => (
                <span 
                  key={filter}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {filter}
                  <button onClick={() => removeFilter(filter)} className="hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button 
                onClick={clearAllFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Room Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">1</span> to{' '}
            <span className="font-medium text-foreground">6</span> of{' '}
            <span className="font-medium text-foreground">42</span> results
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button variant="default" size="sm" className="h-9 w-9">1</Button>
            <Button variant="outline" size="sm" className="h-9 w-9">2</Button>
            <Button variant="outline" size="sm" className="h-9 w-9">3</Button>
            <span className="px-2 text-muted-foreground">...</span>
            <Button variant="outline" size="sm" className="h-9 w-9">8</Button>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spaces;
