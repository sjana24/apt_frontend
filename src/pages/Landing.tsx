import { useState } from 'react';
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, GraduationCap, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWeekRange } from '@/middleware/getWeek';
import timeTableService from '@/services/admin/timeTable.service';
import { Badge } from '@/components/ui/badge';

// Define the time slots for the grid
const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00'
];

// Define types
interface TimetableSlot {
  id: number;
  degree_name: string;
  module_name: string;
  lab_name: string;
  created_by_name: string;
  slot_date: string;
  day_of_week: number; // 1 = Monday, 2 = Tuesday, etc.
  time_range: string;
  note: string;
  degree: number;
  module: number;
  lab: number;
}

interface FormData {
  degree: string;
  year: string;
  semester: string;
  date: Date | undefined;
}

interface GridCell {
  slot: TimetableSlot | null;
  displayText: string;
}

interface TimetableRow {
  time: string;
  monday: GridCell;
  tuesday: GridCell;
  wednesday: GridCell;
  thursday: GridCell;
  friday: GridCell;
}

export function Landing() {
  const [formData, setFormData] = useState<FormData>({
    degree: "",
    year: "",
    semester: "",
    date: new Date(), // Set default to today
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timetableData, setTimetableData] = useState<TimetableSlot[]>([]);
  const [timetableGrid, setTimetableGrid] = useState<TimetableRow[]>([]);
  const [selectedWeekRange, setSelectedWeekRange] = useState<{ monday: string; friday: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Transform API data into grid format - FIXED VERSION
  const transformDataToGrid = (slots: TimetableSlot[], weekRange: { monday: string; friday: string }): TimetableRow[] => {
    console.log("Transforming slots:", slots);
    console.log("Week range:", weekRange);
    
    // Initialize empty grid
    const grid: TimetableRow[] = TIME_SLOTS.map(time => ({
      time,
      monday: { slot: null, displayText: "" },
      tuesday: { slot: null, displayText: "" },
      wednesday: { slot: null, displayText: "" },
      thursday: { slot: null, displayText: "" },
      friday: { slot: null, displayText: "" }
    }));

    // Create a map of dates to days for the week
    const weekDates: Record<string, number> = {};
    const mondayDate = parseISO(weekRange.monday);
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + i);
      const dateStr = format(date, 'yyyy-MM-dd');
      weekDates[dateStr] = i + 1; // 1 = Monday, 2 = Tuesday, etc.
    }
    
    console.log("Week dates mapping:", weekDates);

    // Fill grid with data
    slots.forEach(slot => {
      console.log("Processing slot:", {
        slot_date: slot.slot_date,
        day_of_week: slot.day_of_week,
        time_range: slot.time_range,
        week_monday: weekRange.monday,
        week_friday: weekRange.friday
      });

      // Check if slot is within the requested week
      if (slot.slot_date < weekRange.monday || slot.slot_date > weekRange.friday) {
        console.log(`Slot ${slot.id} date ${slot.slot_date} is outside week range`);
        return;
      }

      const timeIndex = TIME_SLOTS.indexOf(slot.time_range);
      if (timeIndex === -1) {
        console.log(`Time ${slot.time_range} not found in TIME_SLOTS`);
        return;
      }

      // Get the correct day for this date
      const dayOfWeek = weekDates[slot.slot_date];
      console.log(`Slot ${slot.id}: date ${slot.slot_date} maps to day ${dayOfWeek}`);

      if (!dayOfWeek) {
        console.log(`No day mapping found for date ${slot.slot_date}`);
        return;
      }

      // Create display text: Module Name (Lab Name)
      const displayText = `${slot.module_name} (${slot.lab_name})`;

      // Map day_of_week to grid property
      let dayKey: keyof Omit<TimetableRow, 'time'>;
      switch (dayOfWeek) {
        case 1: dayKey = 'monday'; break;
        case 2: dayKey = 'tuesday'; break;
        case 3: dayKey = 'wednesday'; break;
        case 4: dayKey = 'thursday'; break;
        case 5: dayKey = 'friday'; break;
        default: 
          console.log(`Invalid day number: ${dayOfWeek}`);
          return;
      }

      // Update grid cell
      grid[timeIndex][dayKey] = {
        slot,
        displayText
      };
      
      console.log(`Added slot ${slot.id} to ${dayKey} at time index ${timeIndex}`);
    });

    console.log("Final grid:", grid);
    return grid;
  };

  // Get unique dates for badge display
  const getUniqueDates = (): string[] => {
    const dates = timetableData.map(slot => slot.slot_date);
    return [...new Set(dates)];
  };

  // Get modules summary
  const getModulesSummary = () => {
    const modules = new Map<number, { name: string; code: string; count: number }>();
    
    timetableData.forEach(slot => {
      if (!modules.has(slot.module)) {
        // Extract code from module name
        const codeMatch = slot.module_name.match(/^[A-Z]{3}\s\d{3}(-\d)?/);
        const code = codeMatch ? codeMatch[0] : slot.module_name;
        
        modules.set(slot.module, {
          name: slot.module_name,
          code,
          count: 1
        });
      } else {
        const module = modules.get(slot.module)!;
        module.count++;
        modules.set(slot.module, module);
      }
    });
    
    return Array.from(modules.values());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTimetableData([]);
    setTimetableGrid([]);
    setDebugInfo(null);

    try {
      // Get week range from selected date
      const selectedDate = formData.date || new Date();
      console.log("Selected date:", selectedDate);
      
      const weekRange = getWeekRange(selectedDate);
      console.log("Calculated week range:", weekRange);
      setSelectedWeekRange(weekRange);

      // For demo, using hardcoded degreeId = 2
      const degreeId = 2;
      
      console.log("Fetching timetable for:", {
        degreeId,
        startDate: weekRange.monday,
        endDate: weekRange.friday
      });

      // Fetch timetable data
      const response = await timeTableService.getByDegreeAndRange(
        degreeId,
        weekRange.monday,
        weekRange.friday
      );

      console.log("API Response:", response);

      // Handle response format
      let slots: TimetableSlot[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array of slots
        slots = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response has data property containing array
        slots = response.data;
      } else if (response && response.timetable && typeof response.timetable === 'object') {
        // Response has timetable object with dates as keys
        // Flatten all slots from all dates
        slots = Object.values(response.timetable).flat() as TimetableSlot[];
      }

      console.log("Extracted slots:", slots);
      setTimetableData(slots);

      // Transform to grid format
      const grid = transformDataToGrid(slots, weekRange);
      setTimetableGrid(grid);

      // Set debug info
      setDebugInfo({
        weekRange,
        slotCount: slots.length,
        slots: slots.map(s => ({
          date: s.slot_date,
          day: s.day_of_week,
          time: s.time_range,
          module: s.module_name
        }))
      });

    } catch (err: any) {
      console.error("Error fetching timetable:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch timetable data");
      
      // Fallback to mock data for testing
      const mockWeekRange = { monday: '2026-03-09', friday: '2026-03-13' };
      const mockSlots: TimetableSlot[] = [
        {
          id: 1,
          degree_name: "BSc in Computer Science",
          module_name: "Database Management Systems",
          lab_name: "Computer Lab 02",
          created_by_name: "Dr. Smith",
          slot_date: "2026-03-10", // Tuesday
          day_of_week: 2,
          time_range: "09:00 - 10:00",
          note: "Operating Systems Lab",
          degree: 2,
          module: 2,
          lab: 2
        },
        {
          id: 2,
          degree_name: "BSc in Computer Science",
          module_name: "Database Management Systems",
          lab_name: "Computer Lab 02",
          created_by_name: "Dr. Smith",
          slot_date: "2026-03-10", // Tuesday
          day_of_week: 2,
          time_range: "11:00 - 12:00",
          note: "Operating Systems Lab",
          degree: 2,
          module: 2,
          lab: 2
        },
        {
          id: 3,
          degree_name: "BSc in Computer Science",
          module_name: "Database Management Systems",
          lab_name: "Computer Lab 02",
          created_by_name: "Dr. Smith",
          slot_date: "2026-03-12", // Thursday
          day_of_week: 4,
          time_range: "11:00 - 12:00",
          note: "Operating Systems Lab",
          degree: 2,
          module: 2,
          lab: 2
        },
        {
          id: 4,
          degree_name: "BSc in Computer Science",
          module_name: "Database Management Systems",
          lab_name: "Computer Lab 02",
          created_by_name: "Dr. Smith",
          slot_date: "2026-03-12", // Thursday
          day_of_week: 4,
          time_range: "13:00 - 14:00",
          note: "Operating Systems Lab",
          degree: 2,
          module: 2,
          lab: 2
        }
      ];
      
      setTimetableData(mockSlots);
      const grid = transformDataToGrid(mockSlots, mockWeekRange);
      setTimetableGrid(grid);
      setSelectedWeekRange(mockWeekRange);
      
      setDebugInfo({
        weekRange: mockWeekRange,
        slotCount: mockSlots.length,
        slots: mockSlots.map(s => ({
          date: s.slot_date,
          day: s.day_of_week,
          time: s.time_range,
          module: s.module_name
        }))
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM dd');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Timetable Form Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="rounded-3xl bg-card border shadow-elevated overflow-hidden">
          <div className="grid lg:grid-cols-5">
            {/* Left Side: Info */}
            <div className="lg:col-span-2 bg-primary p-8 md:p-12 text-primary-foreground flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">View Timetable</h2>
              <p className="text-primary-foreground/80 mb-6">
                Select your academic details to view available slots for classrooms and laboratories.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span>Real-time availability</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span>Integrated Lab schedules</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span>Weekly view</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-background">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Degree Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Degree Program
                    </label>
                    <select
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    >
                      <option value="">Select Degree</option>
                      <option value="cs">Computer Science</option>
                      <option value="ds">Data Science</option>
                      <option value="it">Information Technology</option>
                      <option value="se">Software Engineering</option>
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Academic Year
                    </label>
                    <select
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="">Select Year</option>
                      <option value="100">Level 100</option>
                      <option value="200">Level 200</option>
                      <option value="300">Level 300</option>
                      <option value="400">Level 400</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Semester Radio Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semester</label>
                    <div className="flex gap-4 p-2 border rounded-md">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="semester"
                          value="I"
                          checked={formData.semester === "I"}
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Semester I</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="semester"
                          value="II"
                          checked={formData.semester === "II"}
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Semester II</span>
                      </label>
                    </div>
                  </div>

                  {/* Calendar Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" /> Select Week
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
                        >
                          {formData.date ? format(formData.date, "PPP") : <span>Pick a date to select week</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(day) => setFormData({ ...formData, date: day })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select any date to view that week's timetable
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg shadow-lg" 
                  disabled={isSubmitting}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Loading Timetable..." : "View Timetable"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Info */}
      {debugInfo && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-800">Debug Info</h4>
            </div>
            <div className="text-xs space-y-1">
              <p><strong>Week Range:</strong> {debugInfo.weekRange?.monday} to {debugInfo.weekRange?.friday}</p>
              <p><strong>Total Slots:</strong> {debugInfo.slotCount}</p>
              <p><strong>Slots Found:</strong></p>
              <ul className="list-disc pl-4">
                {debugInfo.slots?.map((slot: any, idx: number) => (
                  <li key={idx}>
                    {slot.date} (Day {slot.day}) at {slot.time}: {slot.module}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive font-medium">{error}</p>
            <p className="text-sm text-destructive/80 mt-1">Showing demo data instead.</p>
          </div>
        </div>
      )}

      {/* Timetable Display Section */}
      {timetableData.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="rounded-3xl bg-card border shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b bg-muted/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Semester {formData.semester || "I"} Timetable
                    {selectedWeekRange && (
                      <span className="ml-2 text-lg font-normal text-muted-foreground">
                        ({formatDate(selectedWeekRange.monday)} - {formatDate(selectedWeekRange.friday)})
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      {formData.degree === "cs" ? "Computer Science" : 
                       formData.degree === "ds" ? "Data Science" :
                       formData.degree === "it" ? "Information Technology" : 
                       "Software Engineering"}
                    </Badge>
                    <Badge variant="secondary">
                      Level {formData.year}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {timetableData.length} sessions
                    </span>
                  </div>
                </div>
                
                {/* Dates Badges */}
                <div className="flex flex-wrap gap-2">
                  {getUniqueDates().map(date => (
                    <Badge key={date} variant="outline" className="text-xs">
                      {formatDate(date)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary text-secondary-foreground">
                    <th className="border p-4 text-left w-36 font-bold">Time Slot</th>
                    <th className="border p-4 text-center">
                      Monday
                      {selectedWeekRange && (
                        <div className="text-xs font-normal">
                          {formatDate(selectedWeekRange.monday)}
                        </div>
                      )}
                    </th>
                    <th className="border p-4 text-center">
                      Tuesday
                      {selectedWeekRange && (
                        <div className="text-xs font-normal">
                          {formatDate(new Date(parseISO(selectedWeekRange.monday).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                        </div>
                      )}
                    </th>
                    <th className="border p-4 text-center">
                      Wednesday
                      {selectedWeekRange && (
                        <div className="text-xs font-normal">
                          {formatDate(new Date(parseISO(selectedWeekRange.monday).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                        </div>
                      )}
                    </th>
                    <th className="border p-4 text-center">
                      Thursday
                      {selectedWeekRange && (
                        <div className="text-xs font-normal">
                          {formatDate(new Date(parseISO(selectedWeekRange.monday).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
                        </div>
                      )}
                    </th>
                    <th className="border p-4 text-center">
                      Friday
                      {selectedWeekRange && (
                        <div className="text-xs font-normal">
                          {formatDate(selectedWeekRange.friday)}
                        </div>
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {timetableGrid.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="border p-4 font-semibold bg-muted/10">
                        <div className="flex items-center justify-between">
                          <span>{row.time}</span>
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </td>
                      
                      {/* Render each day */}
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
                        const cell = row[day as keyof TimetableRow] as GridCell;
                        const colors = {
                          monday: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                          tuesday: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
                          wednesday: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
                          thursday: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                          friday: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' }
                        };
                        const color = colors[day as keyof typeof colors];
                        
                        return (
                          <td key={day} className="border p-3">
                            {cell.slot ? (
                              <div className={`p-3 rounded-lg ${color.bg} border ${color.border} hover:${color.bg.replace('50', '100')} transition-all cursor-pointer`}>
                                <div className="space-y-1">
                                  <p className={`font-bold ${color.text} text-sm truncate`}>
                                    {cell.displayText}
                                  </p>
                                  {cell.slot.note && (
                                    <p className={`text-xs ${color.text}/70 italic truncate`}>
                                      {cell.slot.note}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between text-xs pt-1">
                                    <span className={`${color.text}/80`}>
                                      {cell.slot.lab_name}
                                    </span>
                                    <Badge variant="outline" className="text-[10px]">
                                      {formatDate(cell.slot.slot_date)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-20 flex items-center justify-center">
                                <span className="text-muted-foreground/50 text-sm">-</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Module Summary */}
            {getModulesSummary().length > 0 && (
              <div className="p-6 border-t bg-muted/30">
                <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                  Modules in This Timetable
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getModulesSummary().map((module, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div>
                        <p className="font-bold text-primary text-sm">{module.code}</p>
                        <p className="text-xs text-muted-foreground truncate">{module.name}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {module.count} session{module.count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Landing;