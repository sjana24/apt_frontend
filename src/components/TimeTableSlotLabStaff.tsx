import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, AlertCircle, ChevronLeft, ChevronRight, Printer, Download, X, Menu, Maximize2, Minimize2, RefreshCw, Grid3x3, Building, Plus, Save, Trash2 } from "lucide-react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { Lab } from "@/types/indexAdmin";
import { CourseModule } from "@/types/indexAdmin";
import timeTableService from "@/services/admin/timeTable.service";
import moduleService from "@/services/admin/courseModules.service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateTimetableSlotData, GridCell, StaffModuleAssignment, TimeTableSlotLabStaffProps, TimetableRow, TimetableSlot } from "@/interfaces";
import { TIME_SLOTS, DAY_COLORS } from "@/constants";

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

export function TimeTableSlotLabStaff({
    open,
    onClose,
    onConfirm,
    lab,
}: TimeTableSlotLabStaffProps) {
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

    // State for adding new slots
    const [editingCell, setEditingCell] = useState<{ time: string, day: string, dayIndex: number } | null>(null);
    const [modules, setModules] = useState<StaffModuleAssignment[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loadingModules, setLoadingModules] = useState(false);
    const [loadingLabs, setLoadingLabs] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // const userId = authUser?.id;
    const userId = 2;

    // Form state for new slot
    const [newSlotData, setNewSlotData] = useState<CreateTimetableSlotData>({
        lab: lab?.id || 0,
        module: 0,
        slot_date: "",
        degree: 0,
        day_of_week: 0,
        time_range: "",
        note: ""
    });

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
            if (!slot.slot_date || slot.slot_date < weekRange.monday || slot.slot_date > weekRange.friday) return;

            const timeIndex = TIME_SLOTS.indexOf(slot.time_range);
            if (timeIndex === -1) return;

            const dayOfWeek = weekDates[slot.slot_date];
            if (!dayOfWeek) return;

            // Handle both BOOKED and FREE slots
            let displayText = "";
            let displaySlot = null;

            if (slot.status === 'BOOKED' && slot.id) {
                // For booked slots with ID
                const moduleCode = slot.module_code ||
                    slot.module_name?.match(/^[A-Z]{3}\s\d{3}(?:-\d)?/)?.[0] ||
                    slot.module_name?.split(' ')[0] ||
                    'Booked';
                displayText = moduleCode;
                displaySlot = slot;
            } else if (slot.status === 'FREE' || !slot.id) {
                // For free slots or slots without ID
                displayText = "FREE";
                displaySlot = null;
            }

            let dayKey: keyof Omit<TimetableRow, 'time'>;
            switch (dayOfWeek) {
                case 1: dayKey = 'monday'; break;
                case 2: dayKey = 'tuesday'; break;
                case 3: dayKey = 'wednesday'; break;
                case 4: dayKey = 'thursday'; break;
                case 5: dayKey = 'friday'; break;
                default: return;
            }

            grid[timeIndex][dayKey] = {
                slot: displaySlot,
                displayText: displayText || ""
            };
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
        return eachDayOfInterval({
            start: monday,
            end: new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000)
        });
    };

    // Handle date selection
    const handleDateSelect = async (date?: Date) => {
        if (!date || !lab) return;

        setSelectedDate(date);
        setIsLoading(true);
        setError(null);

        const week = getWeekRange(date);

        try {
            const response = await timeTableService.getByLabAndRange(
                lab.id,
                week.monday,
                week.friday
            );

            console.log('Raw API response:', response); // Debug log

            let slots: TimetableSlot[] = [];

            if (response && response.timetable && typeof response.timetable === 'object') {
                // Flatten the timetable object into an array
                const timetableEntries = Object.values(response.timetable);
                slots = timetableEntries.flat() as TimetableSlot[];

                // Process each slot to ensure it has the expected properties
                slots = slots.map(slot => {
                    // For BOOKED slots with ID
                    if (slot.id) {
                        return {
                            ...slot,
                            status: 'BOOKED',
                            module_name: slot.module_name || '',
                            module_code: slot.module_code || '',
                            lab_code: slot.lab_code || lab.lab_code,
                            lab_name: slot.lab_name || lab.name,
                            time_range: slot.time_range || '',
                            displayText: slot.module_code || 'Booked'
                        };
                    } else {
                        // For FREE slots
                        return {
                            ...slot,
                            status: 'FREE',
                            module_name: '',
                            module_code: '',
                            lab_code: slot.lab_code || lab.lab_code,
                            lab_name: slot.lab_name || lab.name,
                            time_range: slot.time_range || '',
                            displayText: 'FREE'
                        };
                    }
                });
            } else if (Array.isArray(response)) {
                slots = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                slots = response.data;
            }

            console.log('Processed slots:', slots); // Debug log

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

    // Fetch modules and labs
    useEffect(() => {
        if (open && lab) {
            fetchCreateFormData();
        }
    }, [open, lab]);

    // Fetch modules
    const fetchCreateFormData = async () => {
        if (!lab) return;

        setLoadingModules(true);
        try {
            // You need to fix this service call based on your actual API
            const response = await moduleService.getAllModulesForSingleStaff(userId);
            const data = Array.isArray(response) ? response : response?.data;

            if (data) {
                console.log("Modules data:", data);
                setModules(data);
            } else {
                setModules([]);
            }
        } catch (err) {
            console.error("Error fetching modules:", err);
            setModules([]);
        } finally {
            setLoadingModules(false);
        }
    };

    // Load timetable for initial date
    useEffect(() => {
        if (open && lab && selectedDate) {
            handleDateSelect(selectedDate);
        }
    }, [open, lab]);

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

    // Handle cell click for adding new slot
    const handleCellClick = async (time: string, day: string, dayIndex: number) => {
        if (!currentWeek || !lab) return;

        const mondayDate = parseISO(currentWeek.monday);
        const slotDate = new Date(mondayDate);
        slotDate.setDate(mondayDate.getDate() + dayIndex);

        // Fetch modules for this lab
        await fetchCreateFormData();

        setNewSlotData({
            lab: lab.id,
            module: 0,
            degree: 0,
            slot_date: format(slotDate, 'yyyy-MM-dd'),
            day_of_week: dayIndex + 1,
            time_range: time,
            note: ""
        });

        setEditingCell({ time, day, dayIndex });
    };

    // Handle create timetable slot
    const handleCreateSlot = async () => {
        if (!lab || !newSlotData.module) {
            setError("Please select a module");
            return;
        }

        setIsCreating(true);
        try {
            const dataToSend = {
                lab: lab.id,
                module: newSlotData.module,
                slot_date: newSlotData.slot_date,
                degree: 2,
                day_of_week: newSlotData.day_of_week,
                time_range: newSlotData.time_range,
                note: newSlotData.note || ""
            };

            console.log("Creating slot with data:", dataToSend);

            const response = await timeTableService.createTimeSlot(dataToSend);
            console.log("Slot creation response:", response);

            // Refresh timetable data
            if (selectedDate) {
                await handleDateSelect(selectedDate);
            }

            // Reset form
            setEditingCell(null);
            setNewSlotData({
                lab: lab.id,
                module: 0,
                slot_date: "",
                degree: 0,
                day_of_week: 0,
                time_range: "",
                note: ""
            });

            // Show success message
            alert("Timetable slot created successfully!");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to create timetable slot");
            console.error("Error creating timetable slot:", err);
        } finally {
            setIsCreating(false);
        }
    };

    // Handle delete timetable slot
    const handleDeleteSlot = async (slotId: number) => {
        if (!confirm("Are you sure you want to delete this timetable slot?")) return;

        try {
            await timeTableService.deleteTimetableSlot(slotId);

            // Refresh timetable data
            if (selectedDate) {
                await handleDateSelect(selectedDate);
            }

            alert("Timetable slot deleted successfully!");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to delete timetable slot");
            console.error("Error deleting timetable slot:", err);
        }
    };

    // Calendar component for sidebar
    const CalendarPanel = () => (
        <div className="w-full h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-100">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
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

    // Create Slot Form Modal
    const CreateSlotForm = () => {
        if (!editingCell || !currentWeek) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Add Timetable Slot</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingCell(null)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Date & Time</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 bg-gray-50 p-2 rounded">
                                        <p className="text-sm">
                                            {newSlotData.slot_date ? format(parseISO(newSlotData.slot_date), 'EEE, MMM dd, yyyy') : 'Select date'}
                                        </p>
                                        <p className="text-xs text-gray-500">{newSlotData.time_range}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-sm">Day {newSlotData.day_of_week}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="module" className="text-sm font-medium">Module *</Label>
                                <Select
                                    value={newSlotData.module.toString()}
                                    onValueChange={(value) => setNewSlotData({ ...newSlotData, module: parseInt(value) })}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingModules ? (
                                            <SelectItem value="loading" disabled>Loading modules...</SelectItem>
                                        ) : modules.length === 0 ? (
                                            <SelectItem value="none" disabled>No modules found</SelectItem>
                                        ) : (
                                            modules.map((module) => (
                                                <SelectItem key={module.id} value={module.module_details.id.toString()}>
                                                    [ {module.module_details.module_code || 'Unnamed Module'} - {module.module_details.credit || 'Unnamed Module'}]-  {module.module_details.module_name || module.id} -[ {module.module_details.degree_details.semester || 'Unnamed Module'}-{module.module_details.degree_details.academicYear || 'Unnamed Module'}]
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="note" className="text-sm font-medium">Notes (Optional)</Label>
                                <Input
                                    id="note"
                                    value={newSlotData.note}
                                    onChange={(e) => setNewSlotData({ ...newSlotData, note: e.target.value })}
                                    placeholder="Add any notes here..."
                                    className="mt-1"
                                />
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditingCell(null)}
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateSlot}
                                        disabled={isCreating || !newSlotData.module || !newSlotData.slot_date}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isCreating ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create Slot
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    // Helper to check if slot can be modified
    const canModifySlot = (slot: TimetableSlot | null) => {
        if (!slot) return false;
        // Add your logic here to check if current user can modify this slot
        // For now, return true for all booked slots
        return slot.status === 'BOOKED' && slot.id !== undefined;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={cn(
                "p-0 overflow-hidden bg-white",
                isFullscreen
                    ? "max-w-none w-screen h-screen rounded-none"
                    : "max-w-[95vw] max-h-[90vh] rounded-xl"
            )}>
                {/* Create Slot Form Modal */}
                <CreateSlotForm />

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
                                            Lab Timetable - {lab?.name || 'Computer Lab'}
                                        </DialogTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs h-5">
                                                Lab Code: {lab?.lab_code || 'C2'}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs h-5">
                                                Capacity: {lab?.capacity || 30}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs h-5 bg-green-50 text-green-700 border-green-200">
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add Mode
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                        <p className="text-xs font-medium text-red-700">Error</p>
                                        <p className="text-xs text-red-600 mt-0.5">{error}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setError(null)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Stats Overview - Compact */}
                        {timetableData.length > 0 && (
                            <div className="mb-3">
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="bg-blue-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-blue-700">
                                            {timetableData.filter(s => s.status === 'BOOKED').length}
                                        </p>
                                        <p className="text-[10px] text-gray-600">Booked</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-emerald-700">
                                            {timetableData.filter(s => s.status === 'FREE').length}
                                        </p>
                                        <p className="text-[10px] text-gray-600">Available</p>
                                    </div>
                                    <div className="bg-violet-50 rounded p-2 text-center">
                                        <p className="text-xs font-bold text-violet-700">
                                            {new Set(timetableData.filter(s => s.status === 'BOOKED').map(s => s.module_name)).size}
                                        </p>
                                        <p className="text-[10px] text-gray-600">Modules</p>
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
                                <p className="text-sm font-medium text-gray-700 mt-2">Loading timetable...</p>
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
                                                    style={{ backgroundColor: colors?.bg?.replace('bg-', '') ? undefined : '#4B5563' }}
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

                                {/* Table Body - Compact with Add Functionality */}
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

                                            {/* Day Columns */}
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day, dayIndex) => {
                                                const cell = row[day as keyof TimetableRow] as GridCell;
                                                const colors = Object.values(DAY_COLORS)[dayIndex] || {};

                                                return (
                                                    <div
                                                        key={day}
                                                        className="p-2 border-r last:border-r-0 min-h-[55px] flex items-center justify-center relative group"
                                                    >
                                                        {cell.displayText === "FREE" ? (
                                                            // Free slot - green background
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleCellClick(row.time, day, dayIndex)}
                                                                className="w-full h-full flex flex-col items-center justify-center p-2 hover:bg-green-50/50 transition-colors"
                                                            >
                                                                <div className={cn(
                                                                    "w-full h-full p-1.5 rounded border border-dashed border-green-300 bg-green-50/30 flex flex-col items-center justify-center",
                                                                    editingCell?.time === row.time && editingCell?.day === day
                                                                        ? "border-blue-300 bg-blue-50/30"
                                                                        : "hover:border-green-400 hover:bg-green-100/30"
                                                                )}>
                                                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                                        <p className="text-xs font-normal text-green-700">
                                                                            FREE
                                                                        </p>
                                                                    </div>
                                                                    <p className="text-[10px] text-green-600">Click to book</p>
                                                                </div>
                                                            </Button>
                                                        ) : cell.slot ? (
                                                            // Booked slot
                                                            <div className="w-full h-full relative group">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className={cn(
                                                                                "w-full h-full p-2 rounded border text-center flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity",
                                                                                // colors.bg || "bg-blue-50",
                                                                                // colors.border || "border-blue-200"
                                                                            )}>
                                                                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                                                                    <div className={`h-1.5 w-1.5 rounded-full ${"bg-blue-500"}`}></div>
                                                                                    <p className={cn("text-xs font-semibold truncate", "text-blue-700")}>
                                                                                        {cell.displayText || cell.slot.module_code}
                                                                                    </p>
                                                                                </div>
                                                                                {cell.slot.lab_code && (
                                                                                    <div className="flex items-center justify-center gap-0.5">
                                                                                        <Building className="h-2.5 w-2.5 text-gray-500" />
                                                                                        <p className="text-[10px] text-gray-600 truncate">
                                                                                            {cell.slot.lab_code}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <div className="text-xs space-y-1 p-2 max-w-xs">
                                                                                <p className="font-semibold">{cell.slot.module_name || 'Booked Slot'}</p>
                                                                                <div className="flex items-center gap-1">
                                                                                    <Building className="h-3 w-3" />
                                                                                    <span>{cell.slot.lab_name || 'Lab'}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <Clock className="h-3 w-3" />
                                                                                    <span>{cell.slot.time_range}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="font-medium">Date:</span>
                                                                                    <span>{format(parseISO(cell.slot.slot_date), 'MMM dd, yyyy')}</span>
                                                                                </div>
                                                                                {cell.slot.note && (
                                                                                    <p className="italic text-gray-600">Note: {cell.slot.note}</p>
                                                                                )}
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>

                                                                {/* Delete button on hover */}
                                                                {canModifySlot(cell.slot) && (
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => cell.slot && cell.slot.id && handleDeleteSlot(cell.slot.id)}
                                                                        className="absolute -top-2 -right-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            // Empty cell (no data)
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleCellClick(row.time, day, dayIndex)}
                                                                className="w-full h-full flex flex-col items-center justify-center p-2 hover:bg-gray-50/50 transition-colors"
                                                            >
                                                                <div className={cn(
                                                                    "p-1.5 rounded border border-dashed transition-colors",
                                                                    editingCell?.time === row.time && editingCell?.day === day
                                                                        ? "border-blue-300 bg-blue-50/30"
                                                                        : "border-gray-300 bg-gray-50/30 hover:border-blue-300 hover:bg-blue-50/30"
                                                                )}>
                                                                    <Plus className="h-3 w-3 text-gray-400 mb-1" />
                                                                    <p className="text-[10px] text-gray-500">Add Slot</p>
                                                                </div>
                                                            </Button>
                                                        )}
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
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                <span>Available</span>
                                            </div>
                                            <Separator orientation="vertical" className="h-4" />
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                                <span>Booked</span>
                                            </div>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span>
                                                {timetableData.filter(s => s.status === 'BOOKED').length} booked, {timetableData.filter(s => s.status === 'FREE').length} free
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-blue-600 font-medium">
                                                Click on FREE slots to book
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}