import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, AlertCircle, ChevronLeft, ChevronRight, X, Maximize2, Minimize2, RefreshCw, Grid3x3, MapPin, Clock } from "lucide-react";
import { format, parseISO, eachDayOfInterval } from "date-fns";
import { Degree } from "@/types/indexAdmin";
import timeTableService from "@/services/admin/timeTable.service";
import { Badge } from "@/components/ui/badge";
import { TimetableRow, TimetableSlot } from "@/interfaces";
import { TIME_SLOTS } from "@/constants";

interface TimetableModalProps {
    open: boolean;
    onClose: () => void;
    degree: Degree | null;
}

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

export function TimetableModal({ open, onClose, degree }: TimetableModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<{ monday: string; friday: string } | null>(null);
    const [timetableData, setTimetableData] = useState<TimetableSlot[]>([]);
    const [timetableGrid, setTimetableGrid] = useState<TimetableRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Initial load
    useEffect(() => {
        if (open && degree) {
            handleDateSelect(selectedDate);
        }
    }, [open, degree]);

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
            weekDates[format(date, 'yyyy-MM-dd')] = i + 1;
        }

        slots.forEach(slot => {
            if (slot.slot_date < weekRange.monday || slot.slot_date > weekRange.friday) return;
            const timeIndex = TIME_SLOTS.indexOf(slot.time_range);
            if (timeIndex === -1) return;
            const dayOfWeek = weekDates[slot.slot_date];
            if (!dayOfWeek) return;

            // Simple display text logic
            const moduleCode = slot.module_name.split(' ')[0] || slot.module_name;
            const displayText = `${moduleCode}`;

            const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][dayOfWeek - 1] as keyof Omit<TimetableRow, 'time'>;
            if (dayKey && grid[timeIndex][dayKey]) {
                grid[timeIndex][dayKey] = { slot, displayText };
            }
        });

        return grid;
    };

    const handleDateSelect = async (date: Date) => {
        if (!degree) return;
        setSelectedDate(date);
        setIsLoading(true);
        setError(null);

        const week = getWeekRange(date);
        try {
            const response = await timeTableService.getByDegreeAndRange(degree.id, week.monday, week.friday);
            let slots: TimetableSlot[] = [];

            if (Array.isArray(response)) {
                slots = response;
            } else if (response?.data && Array.isArray(response.data)) {
                slots = response.data;
            } else if (response?.timetable) {
                slots = Object.values(response.timetable).flat() as TimetableSlot[];
            }

            setTimetableData(slots);
            setTimetableGrid(transformDataToGrid(slots, week));
            setCurrentWeek(week);
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError("Failed to load timetable.");
            setTimetableData([]);
            setTimetableGrid([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviousWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        handleDateSelect(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        handleDateSelect(newDate);
    };

    const formatDate = (dateStr: string) => {
        try { return format(parseISO(dateStr), 'MMM dd'); } catch { return dateStr; }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={cn(
                "p-0 overflow-hidden bg-white flex flex-col",
                isFullscreen ? "w-screen h-screen max-w-none rounded-none" : "max-w-6xl max-h-[90vh] rounded-xl"
            )}>
                {/* Header */}
                <div className="border-b px-4 py-3 bg-white flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Grid3x3 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-base font-semibold truncate">
                                Timetable View
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="font-normal text-xs">
                                    {degree?.degreeProgram}
                                </Badge>
                                <Badge variant="outline" className="font-normal text-xs">
                                    Level {degree?.level}
                                </Badge>
                                <Badge variant="outline" className="font-normal text-xs">
                                    Sem {degree?.semester}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1 bg-muted/30 rounded-lg p-1 mr-2">
                            <Button variant="ghost" size="sm" onClick={handlePreviousWeek} disabled={isLoading} className="h-7 w-7 p-0">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium px-2 min-w-[100px] text-center">
                                {currentWeek ? `${formatDate(currentWeek.monday)} - ${formatDate(currentWeek.friday)}` : "Loading..."}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleNextWeek} disabled={isLoading} className="h-7 w-7 p-0">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8">
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 bg-gray-50/50">
                    {error && (
                        <div className="mb-4 bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-muted/30 sticky top-0 z-10">
                                <tr>
                                    <th className="border-b border-r py-3 px-4 text-left text-xs font-semibold text-muted-foreground w-24">Time</th>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                        <th key={day} className="border-b border-r py-3 px-4 text-center text-xs font-semibold text-muted-foreground min-w-[140px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {timetableGrid.map((row, i) => (
                                    <tr key={i} className="hover:bg-muted/5 transition-colors">
                                        <td className="border-r py-3 px-4 text-xs font-medium text-muted-foreground bg-gray-50/30 whitespace-nowrap">
                                            {row.time}
                                        </td>
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((dayKey) => {
                                            const cell = row[dayKey as keyof typeof row] as { slot: TimetableSlot | null };
                                            const slot = cell?.slot;

                                            return (
                                                <td key={dayKey} className="border-r p-2 align-top h-[80px]">
                                                    {slot ? (
                                                        <div className="bg-primary/5 border border-primary/10 rounded-md p-2 h-full flex flex-col justify-between group hover:bg-primary/10 transition-colors cursor-default">
                                                            <div>
                                                                <div className="font-semibold text-xs text-primary mb-1 line-clamp-2" title={slot.module_name}>
                                                                    {slot.module_name}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                                    <MapPin className="h-3 w-3" />
                                                                    <span>{slot.lab_name}</span>
                                                                </div>
                                                            </div>
                                                            {slot.note && (
                                                                <div className="mt-1 text-[10px] text-gray-500 italic truncate" title={slot.note}>
                                                                    {slot.note}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="h-full w-full" />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
