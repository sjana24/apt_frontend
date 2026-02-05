import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { TimetableSlot, Degree, CourseModule, Lab } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import timeTableService from "@/services/admin/timeTable.service";
import degreeService from "@/services/admin/degree.service";
import moduleService from "@/services/admin/courseModules.service";
import labService from "@/services/admin/lab.service";

const DAYS = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
];

export function AdminTimetable() {
    const [slots, setSlots] = useState<TimetableSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);

    // Filter / View State
    const [selectedDegree, setSelectedDegree] = useState<number | null>(null);

    // Form State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        degree: 0,
        module: 0,
        lab: 0,
        slot_date: "",
        day_of_week: 1,
        time_range: "08:00 - 10:00",
        note: ""
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [d, m, l] = await Promise.all([
                degreeService.getAllDegrees(),
                moduleService.getAllModules(),
                labService.getAllLabs()
            ]);
            setDegrees(d);
            setModules(m);
            setLabs(l);
        } catch (error) {
            console.error("Failed to load metadata", error);
        }
    };

    const fetchTimetable = async (degreeId: number) => {
        setLoading(true);
        try {
            // Assuming 'main/timetable-slots' or similar can filter by degree via query param 
            // OR we reuse getByDegreeAndRange if date range is mandatory...
            // User service has 'getByDegreeAndRange'. We might need to adjust it or call getAll if supported.
            // Looking at `timeTableView.py` -> `TimetableSlotListCreateAPIView` (ListCreateAPIView)
            // I'll try calling getByDegreeAndRange with a wide range for now, or assume there's a list endpoint.
            // Actually `TimetableSlotViewSet` (lines 48 urls.py) is `timetable/by-degree`.

            const currentYear = new Date().getFullYear();
            const response = await timeTableService.getByDegreeAndRange(degreeId, `${currentYear}-01-01`, `${currentYear}-12-31`);
            // If we want next year too (academic year overlap):
            // const response = await timeTableService.getByDegreeAndRange(degreeId, `${currentYear}-01-01`, `${currentYear+1}-12-31`);
            setSlots(response);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load timetable",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDegree) {
            fetchTimetable(selectedDegree);
        } else {
            setSlots([]);
        }
    }, [selectedDegree]);

    const handleCreate = async () => {
        try {
            const payload = {
                degree: formData.degree,
                module: formData.module,
                lab: formData.lab === 0 ? null : formData.lab,
                slot_date: formData.slot_date, // Needs YYYY-MM-DD
                day_of_week: formData.day_of_week,
                time_range: formData.time_range,
                note: formData.note
            };

            const newSlot = await timeTableService.createTimeSlot(payload);
            if (selectedDegree === formData.degree) {
                setSlots([...slots, newSlot]);
            }
            toast({ title: "Slot Created", description: "Timetable slot added successfully." });
            setIsCreateOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create slot",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await timeTableService.deleteTimetableSlot(id);
            setSlots(slots.filter(s => s.id !== id));
            toast({ title: "Deleted", description: "Slot removed." });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete slot",
                variant: "destructive"
            });
        }
    };

    const columns: Column<TimetableSlot>[] = [
        { key: "day_of_week", header: "Day", render: (i) => DAYS.find(d => d.value === i.day_of_week)?.label || "Unknown" },
        { key: "time_range", header: "Time" },
        { key: "module_name", header: "Module", render: (i) => i.module_name || modules.find(m => m.id === i.module)?.module_name || "N/A" },
        { key: "lab_name", header: "Lab/Room", render: (i) => i.lab_name || labs.find(l => l.id === i.lab)?.name || "Classroom" },
        { key: "slot_date", header: "Date" },
        {
            key: "actions", header: "Actions", render: (item) => (
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Timetable Management"
                description="Manage lecture and lab schedules."
                actionLabel="Add Slot"
                onAction={() => setIsCreateOpen(true)}
            />

            {/* Select Degree to View */}
            <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
                <Label>Select Degree Program:</Label>
                <Select value={selectedDegree ? String(selectedDegree) : ""} onValueChange={(v) => setSelectedDegree(parseInt(v))}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select a degree..." />
                    </SelectTrigger>
                    <SelectContent>
                        {degrees.map(d => (
                            <SelectItem key={d.id} value={String(d.id)}>{d.degreeProgram} (L{d.level})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                data={slots}
                columns={columns}
                emptyMessage="No slots found for this degree."
            />

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Timetable Slot</DialogTitle>
                        <DialogDescription>Assign a module to a time slot and lab/room.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Degree</Label>
                                <Select value={String(formData.degree)} onValueChange={(v) => setFormData({ ...formData, degree: parseInt(v) })}>
                                    <SelectTrigger><SelectValue placeholder="Select Degree" /></SelectTrigger>
                                    <SelectContent>
                                        {degrees.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.degreeProgram} (L{d.level})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Module</Label>
                                <Select value={String(formData.module)} onValueChange={(v) => setFormData({ ...formData, module: parseInt(v) })}>
                                    <SelectTrigger><SelectValue placeholder="Select Module" /></SelectTrigger>
                                    <SelectContent>
                                        {modules.filter(m => formData.degree ? m.degree === formData.degree : true).map(m => (
                                            <SelectItem key={m.id} value={String(m.id)}>{m.module_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date</Label>
                                <Input type="date" value={formData.slot_date} onChange={(e) => setFormData({ ...formData, slot_date: e.target.value })} />
                            </div>
                            <div>
                                <Label>Day</Label>
                                <Select value={String(formData.day_of_week)} onValueChange={(v) => setFormData({ ...formData, day_of_week: parseInt(v) })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {DAYS.map(d => <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Time Range</Label>
                                <Select value={formData.time_range} onValueChange={(v) => setFormData({ ...formData, time_range: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="08:00 - 10:00">08:00 - 10:00</SelectItem>
                                        <SelectItem value="10:30 - 12:30">10:30 - 12:30</SelectItem>
                                        <SelectItem value="13:30 - 15:30">13:30 - 15:30</SelectItem>
                                        <SelectItem value="16:00 - 18:00">16:00 - 18:00</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Lab / Room (Optional)</Label>
                                <Select value={String(formData.lab)} onValueChange={(v) => setFormData({ ...formData, lab: parseInt(v) })}>
                                    <SelectTrigger><SelectValue placeholder="None (Classroom)" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No specific lab</SelectItem>
                                        {labs.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.name} ({l.lab_code})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}>Create Slot</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
