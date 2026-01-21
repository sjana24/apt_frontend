import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { 
    Calendar as CalendarIcon, 
    Clock, 
    AlertCircle, 
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Printer,
    Download,
    X,
    Menu,
    Maximize2,
    Minimize2,
    RefreshCw,
    Grid3x3,
    Filter,
    Building,
    Zap,
    TrendingUp,
    Users,
    CalendarDays
} from "lucide-react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { Degree } from "@/types/indexAdmin";
import timeTableService from "@/services/admin/timeTable.service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* =========================
   Helper: Get Monday–Friday
========================= */
function getWeekRange(date: Date) {
    const d = new Date(date);
    const day = d.getDay();

    const monday = new Date(d);
    const diffToMonday = day === 0 ? -6 : 1 - day;
    monday.setDate(d.getDate() + diffToMonday);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return {
        monday: format(monday, "yyyy-MM-dd"),
        friday: format(friday, "yyyy-MM-dd"),
    };
}

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
    day_of_week: number;
    time_range: string;
    note: string;
    degree: number;
    module: number;
    lab: number;
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

interface SelectDateDialogProps {
    open: boolean;
    onClose: () => void;
    degree: Degree | null;
    onConfirm: (date: string) => void;
}

// Compact color scheme for different days
const DAY_COLORS = {
    monday: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500' },
    tuesday: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500' },
    wednesday: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', accent: 'bg-violet-500' },
    thursday: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500' },
    friday: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', accent: 'bg-rose-500' }
};

export function SelectDateDialog({
    open,
    onClose,
    onConfirm,
    degree,
}: SelectDateDialogProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [currentWeek, setCurrentWeek] = useState<{
        monday: string;
        friday: string;
    } | null>(null);
    const [timetableData, setTimetableData] = useState<TimetableSlot[]>([]);
    const [timetableGrid, setTimetableGrid] = useState<TimetableRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(true);

    // Transform API data into grid format
    const transformDataToGrid = (slots: TimetableSlot[], weekRange: { monday: string; friday: string }): TimetableRow[] => {
        const grid: TimetableRow[] = TIME_SLOTS.map(time => ({
            time,
            monday: { slot: null, displayText: "" },
            tuesday: { slot: null, displayText: "" },
            wednesday: { slot: null, displayText: "" },
            thursday: { slot: null, displayText: "" },
            friday: { slot: null, displayText: "" }
        }));

        const weekDates: Record<string, number> = {};
        const mondayDate = parseISO(weekRange.monday);
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(mondayDate);
            date.setDate(mondayDate.getDate() + i);
            const dateStr = format(date, 'yyyy-MM-dd');
            weekDates[dateStr] = i + 1;
        }

        slots.forEach(slot => {
            if (slot.slot_date < weekRange.monday || slot.slot_date > weekRange.friday) return;

            const timeIndex = TIME_SLOTS.indexOf(slot.time_range);
            if (timeIndex === -1) return;

            const dayOfWeek = weekDates[slot.slot_date];
            if (!dayOfWeek) return;

            // Extract module code from module_name
            const moduleCode = slot.module_name.match(/^[A-Z]{3}\s\d{3}(?:-\d)?/)?.[0] || slot.module_name.split(' ')[0] || slot.module_name;
            const displayText = moduleCode;

            let dayKey: keyof Omit<TimetableRow, 'time'>;
            switch (dayOfWeek) {
                case 1: dayKey = 'monday'; break;
                case 2: dayKey = 'tuesday'; break;
                case 3: dayKey = 'wednesday'; break;
                case 4: dayKey = 'thursday'; break;
                case 5: dayKey = 'friday'; break;
                default: return;
            }

            grid[timeIndex][dayKey] = { slot, displayText };
        });

        return grid;
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'MMM dd');
        } catch {
            return dateStr;
        }
    };

    // Get week days with dates
    const getWeekDays = () => {
        if (!currentWeek) return [];
        const monday = parseISO(currentWeek.monday);
        return eachDayOfInterval({ start: monday, end: new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000) });
    };

    // Handle date selection
    const handleDateSelect = async (date?: Date) => {
        if (!date || !degree) return;

        setSelectedDate(date);
        setIsLoading(true);
        setError(null);

        const week = getWeekRange(date);

        try {
            const response = await timeTableService.getByDegreeAndRange(
                degree.id,
                week.monday,
                week.friday
            );

            let slots: TimetableSlot[] = [];
            
            if (Array.isArray(response)) {
                slots = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                slots = response.data;
            } else if (response && response.timetable && typeof response.timetable === 'object') {
                slots = Object.values(response.timetable).flat() as TimetableSlot[];
            }

            setTimetableData(slots);
            const grid = transformDataToGrid(slots, week);
            setTimetableGrid(grid);
            setCurrentWeek(week);
        } catch (err: any) {
            console.error("Error fetching timetable:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch timetable data");
            setTimetableData([]);
            setTimetableGrid([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Load timetable for initial date
    useEffect(() => {
        if (open && degree && selectedDate) {
            handleDateSelect(selectedDate);
        }
    }, [open, degree]);

    const handleConfirm = () => {
        if (!selectedDate) return;
        onConfirm(format(selectedDate, "yyyy-MM-dd"));
        onClose();
    };

    const handlePreviousWeek = () => {
        if (!selectedDate) return;
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        setSelectedDate(newDate);
        handleDateSelect(newDate);
    };

    const handleNextWeek = () => {
        if (!selectedDate) return;
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        setSelectedDate(newDate);
        handleDateSelect(newDate);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const refreshData = () => {
        if (selectedDate) handleDateSelect(selectedDate);
    };

    // Calendar component for sidebar
    const CalendarPanel = () => (
        <div className="w-full h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-100">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Select Week</h3>
                        <p className="text-xs text-gray-500">Click any date</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCalendar(false)}
                    className="md:hidden h-7 w-7 p-0"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
            
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-lg border"
                initialFocus
                classNames={{
                    months: "w-full",
                    month: "space-y-2",
                    caption: "flex justify-center pt-1 pb-2 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-0",
                    nav_button: "h-6 w-6 p-0",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-500 w-7 text-xs font-normal",
                    row: "flex w-full",
                    cell: "h-7 w-7 text-center text-xs p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-7 w-7 p-0 font-normal text-xs hover:bg-blue-100 rounded",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                    day_today: "bg-blue-50 text-blue-700",
                    day_outside: "text-gray-300",
                    day_disabled: "text-gray-300",
                    day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-700",
                    day_hidden: "invisible",
                }}
            />
            
            <div className="space-y-3">
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Selected Date</p>
                    <div className="bg-white border rounded p-2 text-center">
                        <p className="text-lg font-bold text-blue-700">
                            {selectedDate ? format(selectedDate, "dd") : "--"}
                        </p>
                        <p className="text-xs text-gray-600">
                            {selectedDate ? format(selectedDate, "EEE, MMM yyyy") : "No date"}
                        </p>
                    </div>
                </div>

                <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-gray-500 mb-2">Week Navigation</p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handlePreviousWeek}
                            className="flex-1 text-xs h-7"
                        >
                            <ChevronLeft className="h-3 w-3 mr-1" />
                            Prev
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleNextWeek}
                            className="flex-1 text-xs h-7"
                        >
                            Next
                            <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Empty timetable grid
    const getEmptyTimetableGrid = () => {
        return TIME_SLOTS.map(time => ({
            time,
            monday: { slot: null, displayText: "" },
            tuesday: { slot: null, displayText: "" },
            wednesday: { slot: null, displayText: "" },
            thursday: { slot: null, displayText: "" },
            friday: { slot: null, displayText: "" }
        }));
    };

    const displayGrid = timetableData.length > 0 ? timetableGrid : getEmptyTimetableGrid();
    const weekDays = getWeekDays();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={cn(
                "p-0 overflow-hidden bg-white",
                isFullscreen 
                    ? "max-w-none w-screen h-screen rounded-none" 
                    : "max-w-[95vw] max-h-[90vh] rounded-xl"
            )}>
                {/* Header - Compact */}
                <div className="sticky top-0 z-50 bg-white border-b px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="md:hidden h-8 w-8 p-0"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-blue-100">
                                        <Grid3x3 className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-sm font-semibold text-gray-800 truncate">
                                            Timetable Preview
                                        </DialogTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs h-5">
                                                {degree?.degreeProgram || "Computer Science"}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs h-5">
                                                Semester I
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullscreen}
                                className="hidden md:flex h-7 w-7 p-0"
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="h-3.5 w-3.5" />
                                ) : (
                                    <Maximize2 className="h-3.5 w-3.5" />
                                )}
                            </Button>
                            
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="md:hidden h-7 w-7 p-0">
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-4">
                                    <CalendarPanel />
                                </SheetContent>
                            </Sheet>
                            
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={onClose}
                                className="h-7 w-7 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Desktop Calendar Sidebar */}
                    <div className={cn(
                        "hidden md:block w-64 border-r bg-gray-50 p-4 overflow-auto transition-all duration-200",
                        showCalendar ? "translate-x-0" : "-translate-x-full absolute"
                    )}>
                        <CalendarPanel />
                    </div>

                    {/* Main Timetable Area */}
                    <div className="flex-1 overflow-auto p-3">
                        {/* Action Bar - Compact */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handlePreviousWeek}
                                    className="h-7 px-2"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </Button>
                                
                                <div className="text-center min-w-[180px]">
                                    <p className="text-xs font-semibold text-gray-700">
                                        {currentWeek ? `${formatDate(currentWeek.monday)} - ${formatDate(currentWeek.friday)}` : "Select a date"}
                                    </p>
                                    <p className="text-[10px] text-gray-500">Week View</p>
                                </div>
                                
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleNextWeek}
                                    className="h-7 px-2"
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>

                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={refreshData}
                                    disabled={isLoading}
                                    className="h-7 px-2"
                                >
                                    <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                    <Printer className="h-3.5 w-3.5 mr-1" />
                                    Print
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                    <Download className="h-3.5 w-3.5 mr-1" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-3">
                                <div className="bg-red-50 border border-red-200 rounded p-2 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-red-700">Error loading timetable</p>
                                        <p className="text-xs text-red-600 mt-0.5">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Overview - Compact */}
                        {timetableData.length > 0 && (
                            <div className="mb-3">
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="bg-blue-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-blue-700">{timetableData.length}</p>
                                        <p className="text-[10px] text-gray-600">Sessions</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-emerald-700">
                                            {new Set(timetableData.map(s => s.module)).size}
                                        </p>
                                        <p className="text-[10px] text-gray-600">Modules</p>
                                    </div>
                                    <div className="bg-violet-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-violet-700">
                                            {new Set(timetableData.map(s => s.lab_name)).size}
                                        </p>
                                        <p className="text-[10px] text-gray-600">Rooms</p>
                                    </div>
                                    <div className="bg-amber-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-amber-700">
                                            {new Set(timetableData.map(s => formatDate(s.slot_date))).size}
                                        </p>
                                        <p className="text-[10px] text-gray-600">Active Days</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="h-48 flex flex-col items-center justify-center">
                                <div className="relative">
                                    <div className="h-8 w-8 rounded-full border-2 border-gray-200"></div>
                                    <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">Loading...</p>
                            </div>
                        ) : (
                            /* Compact Timetable Grid */
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                {/* Table Header - Compact */}
                                <div className="bg-gray-800 text-white">
                                    <div className="grid grid-cols-6">
                                        <div className="p-2 border-r border-gray-700 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span className="text-xs font-medium">Time</span>
                                            </div>
                                        </div>
                                        {weekDays.map((date, index) => {
                                            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                                            const colors = Object.values(DAY_COLORS)[index];
                                            return (
                                                <div 
                                                    key={date.toString()} 
                                                    className="p-2 border-r border-gray-700 last:border-r-0 text-center"
                                                >
                                                    <div className="text-xs font-medium">{dayNames[index]}</div>
                                                    <div className="text-[10px] opacity-90 mt-0.5">
                                                        {format(date, 'dd/MM')}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Table Body - Compact */}
                                <div className="bg-white">
                                    {displayGrid.map((row, index) => (
                                        <div 
                                            key={index} 
                                            className={cn(
                                                "grid grid-cols-6 border-b last:border-b-0",
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                            )}
                                        >
                                            {/* Time Column - Compact */}
                                            <div className="p-2 border-r bg-gray-50/50">
                                                <div className="text-center">
                                                    <p className="text-xs font-semibold text-gray-800">
                                                        {row.time.split(' - ')[0]}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {row.time.split(' - ')[1]}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Day Columns - Compact */}
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day, dayIndex) => {
                                                const cell = row[day as keyof TimetableRow] as GridCell;
                                                const colors = Object.values(DAY_COLORS)[dayIndex];
                                                const isEmpty = !cell.slot && timetableData.length === 0;
                                                
                                                return (
                                                    <div 
                                                        key={day} 
                                                        className={cn(
                                                            "p-2 border-r last:border-r-0 min-h-[55px] flex items-center justify-center",
                                                            cell.slot && "cursor-pointer hover:bg-gray-50/50"
                                                        )}
                                                    >
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="w-full h-full">
                                                                        {cell.slot ? (
                                                                            <div className={cn(
                                                                                "w-full h-full p-2 rounded border text-center flex flex-col items-center justify-center",
                                                                                colors.bg, colors.border
                                                                            )}>
                                                                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                                                                    <div className={`h-1.5 w-1.5 rounded-full ${colors.accent}`}></div>
                                                                                    <p className={cn("text-xs font-semibold truncate", colors.text)}>
                                                                                        {cell.displayText}
                                                                                    </p>
                                                                                </div>
                                                                                {cell.slot.lab_name && (
                                                                                    <div className="flex items-center justify-center gap-0.5">
                                                                                        <Building className="h-2.5 w-2.5 text-gray-500" />
                                                                                        <p className="text-[10px] text-gray-600 truncate">
                                                                                            {cell.slot.lab_name}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                {/* {cell.slot.note && (
                                                                                    <p className="text-[9px] text-gray-500 italic truncate w-full mt-0.5">
                                                                                        {cell.slot.note}
                                                                                    </p>
                                                                                )} */}
                                                                            </div>
                                                                        ) : isEmpty ? (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <div className="p-1.5 rounded border border-dashed border-gray-200 bg-gray-50/30">
                                                                                    <p className="text-[10px] text-gray-400">Available</p>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <span className="text-gray-300 text-xs">—</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                {cell.slot && (
                                                                    <TooltipContent>
                                                                        <div className="text-xs space-y-1 p-2 max-w-xs">
                                                                            <p className="font-semibold">{cell.slot.module_name}</p>
                                                                            <div className="flex items-center gap-1">
                                                                                <Building className="h-3 w-3" />
                                                                                <span>{cell.slot.lab_name}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Clock className="h-3 w-3" />
                                                                                <span>{cell.slot.time_range}</span>
                                                                            </div>
                                                                            {cell.slot.note && (
                                                                                <p className="italic text-gray-600">Note: {cell.slot.note}</p>
                                                                            )}
                                                                        </div>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>

                                {/* Table Footer - Compact */}
                                <div className="bg-gray-50 border-t px-3 py-1.5">
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                <span>Live</span>
                                            </div>
                                            <span>•</span>
                                            <span>
                                                {timetableData.length} of {TIME_SLOTS.length * 5} slots
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {Object.entries(DAY_COLORS).map(([day, color]) => (
                                                <div key={day} className="flex items-center gap-0.5">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${color.accent}`}></div>
                                                    <span className="text-[10px] text-gray-600">{day.slice(0, 1)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Compact */}
                <div className="sticky bottom-0 bg-white border-t px-4 py-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-gray-600">
                                    Updated: {format(new Date(), 'HH:mm')}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 sm:flex-none h-8 text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!selectedDate || isLoading}
                                className="flex-1 sm:flex-none h-8 text-xs bg-blue-600 hover:bg-blue-700"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="h-3 w-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                                        Loading
                                    </>
                                ) : (
                                    `Select Week (${timetableData.length} sessions)`
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}