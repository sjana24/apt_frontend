import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { mockDegrees, mockModules } from "@/data/mockDataAdmin";
import { Degree, CourseModule } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { Pencil, Trash2, Eye, ChevronRight, BookOpen, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import degreeService from "@/services/admin/degree.service";

export interface TimetableRow {
  time: string
  1: string
  2: string
  3: string
  4: string
  5: string
}

export const mockTimetable: TimetableRow[] = [
  {
    time: "08:00 - 09:00",
    1: "-",
    2: "Library",
    3: "CST 372-3 (E3)",
    4: "CST 381-2 (E3)",
    5: "CST 371-2 (G6)"
  },
  {
    time: "09:00 - 10:00",
    1: "CST 327-2 (A1)",
    2: "Library",
    3: "CST 372-3 (E3)",
    4: "CST 381-2 (E3)",
    5: "CST 371-2 (G6)"
  },
  {
    time: "10:00 - 11:00",
    1: "CST 381-2 (G5)",
    2: "CST 345-2 (E3)",
    3: "CST 328-2 (G5)",
    4: "CST 384-2 (MCL)",
    5: "CST 372-3 (D1)"
  },
  {
    time: "11:00 - 12:00",
    1: "CST 381-2 (G5)",
    2: "CST 345-2 (E3)",
    3: "CST 333-2 (G6)",
    4: "CST 384-2 (MCL)",
    5: "CST 372-3 (D1)"
  },
  {
    time: "12:00 - 13:00",
    1: "CST 344-2 (D1)",
    2: "",
    3: "CST 333-2 (G6)",
    4: "CST 384-2 (MCL)",
    5: "Student Activities"
  },
  {
    time: "14:00 - 15:00",
    1: "CST 315-2 (G6)",
    2: "CST 328-2 (E3)",
    3: "CST 345-2 (E3)",
    4: "ESD 311-1 (MLT)",
    5: "CST 315-2 (G6)"
  },
  {
    time: "15:00 - 16:00",
    1: "",
    2: "CST 328-2 (E3)",
    3: "CST 345-2 (E3)",
    4: "",
    5: "CST 315-2 (G6)"
  }
]


export  function StaffDegrees() {
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [loading, setLoading] = useState(false);

    // const [degrees, setDegrees] = useState<Degree[]>(mockDegrees);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);
    const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
    const [formData, setFormData] = useState({
        degreeProgram: "",
        level: "",
        semester: "",
        academicYear: new Date().getFullYear(),
    });
    useEffect(() => {
        const fetchDegrees = async () => {
            setLoading(true);

            try {
                const data = await degreeService.getAllDegrees();
                setDegrees(data);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description:
                        error.response?.data?.message || "Failed to fetch degrees",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDegrees();
    }, []);


    // Get modules for selected degree
    const degreeModules = selectedDegree
        ? mockModules.filter((m) => m.degree === selectedDegree.id)
        : [];

    const handleCreate1 = async (e) => {
        console.log("Save clicked", formData)
    };
    const handleCreate = async (e?: React.MouseEvent) => {
        e?.preventDefault();

        try {
            const response = await degreeService.createDegree(formData);

            setDegrees((prev) => [...prev, response]);

            toast({
                title: "Degree created",
                description: `${response.degreeProgram} added successfully.`,
            });

            setIsCreateOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to create degree",
                variant: "destructive",
            });
        }
    };


    const handleEdit = async () => {
        if (!selectedDegree?.id) return;

        try {
            // const response = await degreeService.updateDegree(
            //   selectedDegree.id,
            //   formData
            // );

            // setDegrees((prev) =>
            //   prev.map((d) => (d.id === response.id ? response : d))
            // );

            // toast({
            //   title: "Degree updated",
            //   description: `${response.degreeProgram} updated successfully.`,
            // });

            // setIsEditOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to update degree",
                variant: "destructive",
            });
        }
    };


    const handleDelete = async (degree: Degree) => {
        try {
            // await degreeService.deleteDegree(degree.id);

            // setDegrees((prev) => prev.filter((d) => d.id !== degree.id));

            // toast({
            //   title: "Degree deleted",
            //   description: `${degree.degreeProgram} has been removed.`,
            //   variant: "destructive",
            // });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to delete degree",
                variant: "destructive",
            });
        }
    };


    const openEdit = (degree: Degree) => {
        setSelectedDegree(degree);
        setFormData({
            degreeProgram: degree.degreeProgram,
            level: degree.level,
            semester: degree.semester,
            academicYear: degree.academicYear,
        });
        setIsEditOpen(true);
    };

    const openExplorer = (degree: Degree) => {
        setSelectedDegree(degree);
        setIsExplorerOpen(true);
    };

    const resetForm = () => {
        setFormData({
            degreeProgram: "",
            level: "",
            semester: "",
            academicYear: new Date().getFullYear(),
        });
        setSelectedDegree(null);
    };

    const columns: Column<Degree>[] = [
        { key: "degreeProgram", header: "Program" },
        {
            key: "level",
            header: "Level",
            render: (item) => (
                <Badge variant="secondary">Level {item.level}</Badge>
            ),
        },
        {
            key: "semester",
            header: "Semester",
            render: (item) => <span>Semester {item.semester}</span>,
        },
        { key: "academicYear", header: "Academic Year" },
        {
            key: "actions",
            header: "Actions",
            render: (item) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            openExplorer(item);
                        }}
                        title="View modules"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(item);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    const moduleColumns: Column<CourseModule>[] = [
        { key: "module_code", header: "Code" },
        { key: "module_name", header: "Module Name" },
        {
            key: "credit",
            header: "Credits",
            render: (item) => (
                <Badge variant="outline">{item.credit} credits</Badge>
            ),
        },
    ];

    const AVAILABLE_HALLS = ["A1", "E3", "G5", "G6", "D1", "MCL", "MLT", "L1", "L2"];

    const handleRowClick = (degree: Degree) => {
        console.log("Row Clicked Data:", degree); // Print to console
        openExplorer(degree); // Open the explorer popup
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Degrees"
                description="Manage degree programs and explore their modules."
                actionLabel="Add Degree"
                onAction={() => setIsCreateOpen(true)}
            />

            <DataTable
                data={degrees}
                columns={columns}
                searchKey="degreeProgram"
                searchPlaceholder="Search degrees..."
                emptyMessage="No degree programs found. Create your first degree!"
                onRowClick={handleRowClick}
            />


            <Dialog open={false} onOpenChange={setIsExplorerOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                    {/* Dialog Header is now inside the main container for styling */}
                    <div className="rounded-3xl bg-card border shadow-elevated overflow-hidden">

                        {/* Table Header Section */}
                        <div className="p-6 border-b bg-muted/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Semester {selectedDegree?.semester} Timetable ({selectedDegree?.academicYear} / {selectedDegree?.academicYear + 1})
                                </h2>
                                <p className="text-muted-foreground font-medium">
                                    {selectedDegree?.degreeProgram} – Level {selectedDegree?.level}
                                </p>
                            </div>
                            <BookOpen className="h-8 w-8 text-primary/40 hidden md:block" />
                        </div>

                        {/* Timetable Grid Container */}
                        <div className="overflow-x-auto p-4 bg-background">
                            <table className="w-full border-collapse rounded-lg overflow-hidden border">
                                <thead>
                                    <tr className="bg-secondary text-secondary-foreground">
                                        <th className="border p-3 text-left w-32 font-bold">Time</th>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                                            <th key={day} className="border p-3 font-bold">{day}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="text-sm">
                                    {[
                                        { time: "08:00 - 09:00", mon: "CST 327-2 (A1)", tue: "Library", wed: "CST 372-3 (E3)", thu: "CST 381-2 (E3)", fri: "CST 371-2 (G6)" },
                                        { time: "09:00 - 10:00", mon: "CST 327-2 (A1)", tue: "Library", wed: "CST 372-3 (E3)", thu: "CST 381-2 (E3)", fri: "CST 371-2 (G6)" },
                                        { time: "10:00 - 11:00", mon: "CST 381-2 (G5)", tue: "CST 345-2 (E3)", wed: "CST 328-2 (G5)", thu: "CST 384-2 (MCL)", fri: "CST 372-3 (D1)" },
                                        { time: "11:00 - 12:00", mon: "CST 381-2 (G5)", tue: "CST 345-2 (E3)", wed: "CST 333-2 (G6)", thu: "CST 384-2 (MCL)", fri: "CST 372-3 (D1)" },
                                        { time: "12:00 - 13:00", mon: "CST 344-2 (D1)", tue: "", wed: "CST 333-2 (G6)", thu: "CST 384-2 (MCL)", fri: "Student Activities" },
                                        { time: "13:00 - 14:00", mon: "Interval", tue: "Interval", wed: "Interval", thu: "Interval", fri: "Interval", isInterval: true },
                                        { time: "14:00 - 15:00", mon: "CST 315-2 (G6)", tue: "CST 328-2 (E3)", wed: "CST 345-2 (E3)", thu: "ESD 311-1 (MLT)", fri: "CST 315-2 (G6)" },
                                        { time: "15:00 - 16:00", mon: "", tue: "CST 328-2 (E3)", wed: "CST 345-2 (E3)", thu: "", fri: "CST 315-2 (G6)" }
                                    ].map((row, index) => (
                                        <tr
                                            key={index}
                                            className={row.isInterval ? "bg-muted/30" : "hover:bg-muted/50 transition-colors"}
                                        >
                                            <td className="border p-3 font-semibold bg-muted/20">{row.time}</td>
                                            {[row.mon, row.tue, row.wed, row.thu, row.fri].map((cell, i) => (
                                                <td key={i} className="border p-3 text-center min-w-[120px]">
                                                    {cell ? (
                                                        <span className={cn(
                                                            "inline-block rounded-md px-3 py-1.5 text-[12px] font-bold w-full",
                                                            row.isInterval
                                                                ? "text-muted-foreground italic bg-transparent"
                                                                : "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                                        )}>
                                                            {cell}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground/30">-</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Course Detail Footer - Replicates the logic from your printed image */}
                        <div className="p-6 bg-muted/10 border-t">
                            <h3 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Module Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* You can map over degreeModules here to show the staff/title list */}
                                <div className="text-[12px] flex justify-between p-2 border-b">
                                    <span className="font-bold">CST 328-2</span>
                                    <span className="text-muted-foreground">Advanced Programming Techniques</span>
                                </div>
                                <div className="text-[12px] flex justify-between p-2 border-b">
                                    <span className="font-bold">CST 371-2</span>
                                    <span className="text-muted-foreground">Human Computer Interaction</span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-background border-t">
                            <Button
                                variant="outline"
                                onClick={() => setIsExplorerOpen(false)}
                                className="w-full md:w-auto"
                            >
                                Close Timetable
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isExplorerOpen} onOpenChange={setIsExplorerOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 border-none bg-transparent">
          <div className="rounded-3xl bg-card border shadow-2xl overflow-hidden">
            
            {/* 1. Header Section */}
            <div className="p-6 border-b bg-muted/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Semester {selectedDegree?.semester} Timetable ({selectedDegree?.academicYear} / {selectedDegree?.academicYear + 1})
                </h2>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {selectedDegree?.degreeProgram} — Level {selectedDegree?.level}
                </p>
              </div>
              <Badge variant="outline" className="h-fit py-1 px-3 border-primary/30 text-primary bg-primary/5">
                Academic Year {selectedDegree?.academicYear}
              </Badge>
            </div>

            {/* 2. Timetable Grid Section */}
            <div className="overflow-x-auto p-6 bg-background">
              <table className="w-full border-collapse rounded-xl overflow-hidden border shadow-sm">
                <thead>
                  <tr className="bg-secondary/80 text-secondary-foreground">
                    <th className="border p-4 text-left w-36 font-bold uppercase text-[11px] tracking-widest">Time</th>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <th key={day} className="border p-4 font-bold uppercase text-[11px] tracking-widest text-center">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {mockTimetable.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors group">
                      {/* Time Slot */}
                      <td className="border p-4 font-bold bg-muted/10 whitespace-nowrap text-foreground">
                        {row.time}
                      </td>

                      {/* Day Columns 1 to 5 */}
                      {[1, 2, 3, 4, 5].map((dayKey) => {
                        const cellData = row[dayKey as keyof TimetableRow];
                        // Logic: If data is not "-", not empty, and not null, show badge. Else show Select.
                        const hasAssignment = cellData && cellData !== "-" && cellData !== "";

                        return (
                          <td key={dayKey} className="border p-3 text-center min-w-[160px]">
                            {hasAssignment ? (
                              <div className="group relative rounded-lg bg-primary/10 text-primary border border-primary/20 p-3 font-bold shadow-sm hover:bg-primary/15 transition-all">
                                <div className="text-[13px]">{cellData}</div>
                                <div className="text-[10px] opacity-70 font-medium mt-1 flex items-center justify-center gap-1">
                                  <MapPin className="h-3 w-3" /> Assigned
                                </div>
                              </div>
                            ) : (
                              /* Dropdown for empty slots */
                              <Select onValueChange={(val) => console.log(`Assigning ${val} to ${row.time}`)}>
                                <SelectTrigger className="h-10 border-dashed border-2 bg-muted/20 hover:border-primary/40 hover:bg-background transition-all group-hover:border-primary/30">
                                  <SelectValue placeholder="Assign Hall" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_HALLS.map((hall) => (
                                    <SelectItem key={hall} value={hall}>
                                      Hall {hall}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. Module Index Footer */}
            <div className="p-6 bg-muted/20 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">Module Descriptions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                   {/* This part can be mapped from your actual degreeModules */}
                   <div className="text-xs flex justify-between border-b border-muted py-1">
                      <span className="font-bold text-primary">CST 327-2</span>
                      <span className="text-muted-foreground truncate ml-2">Advanced Database Systems</span>
                   </div>
                   <div className="text-xs flex justify-between border-b border-muted py-1">
                      <span className="font-bold text-primary">CST 372-3</span>
                      <span className="text-muted-foreground truncate ml-2">Software Engineering</span>
                   </div>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end space-y-2">
                <p className="text-[10px] text-muted-foreground italic">
                  * Selected halls are subject to Department approval.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


        </div>
    );
}
