import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";

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
import timeTableService from "@/services/admin/timeTable.service";
import { SelectDateDialog } from "@/components/TimeTableSlotStaff";
import { getWeekRange } from "@/middleware/getWeek";

export interface TimetableRow {
    time: string
    1: string
    2: string
    3: string
    4: string
    5: string
}
// {
//     time: "09:00 - 10:00",
//         1: "CST 327-2 (A1)",
//             2: "Library",
//                 3: "CST 372-3 (E3)",
//                     4: "CST 381-2 (E3)",
//                         5: "CST 371-2 (G6)"
// },
// {
//     time: "10:00 - 11:00",
//         1: "CST 381-2 (G5)",
//             2: "CST 345-2 (E3)",
//                 3: "CST 328-2 (G5)",
//                     4: "CST 384-2 (MCL)",
//                         5: "CST 372-3 (D1)"
// },
// {
//     time: "11:00 - 12:00",
//         1: "CST 381-2 (G5)",
//             2: "CST 345-2 (E3)",
//                 3: "CST 333-2 (G6)",
//                     4: "CST 384-2 (MCL)",
//                         5: "CST 372-3 (D1)"
// },
// {
//     time: "12:00 - 13:00",
//         1: "CST 344-2 (D1)",
//             2: "",
//                 3: "CST 333-2 (G6)",
//                     4: "CST 384-2 (MCL)",
//                         5: "Student Activities"
// },
// {
//     time: "14:00 - 15:00",
//         1: "CST 315-2 (G6)",
//             2: "CST 328-2 (E3)",
//                 3: "CST 345-2 (E3)",
//                     4: "ESD 311-1 (MLT)",
//                         5: "CST 315-2 (G6)"
// },
// {
//     time: "15:00 - 16:00",
//         1: "",
//             2: "CST 328-2 (E3)",
//                 3: "CST 345-2 (E3)",
//                     4: "",
//                         5: "CST 315-2 (G6)"
// }
// ]


export function StaffDegrees() {
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
    const [pendingDegree, setPendingDegree] = useState<Degree | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);



    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
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
                const staffId = sessionStorage.getItem('userId');
                if (!staffId) {
                    toast({
                        title: "Error",
                        description: "User ID not found. Please log in again.",
                        variant: "destructive",
                    });
                    return;
                }
                const response = await degreeService.getDegreesByStaff(parseInt(staffId));

                // Extract unique degrees from assignments
                const assignments = Array.isArray(response) ? response : response?.data || [];
                const uniqueDegrees = Array.from(
                    new Map(
                        assignments
                            .filter((a: any) => a.module_details?.degree_details)
                            .map((a: any) => [a.module_details.degree_details.id, a.module_details.degree_details])
                    ).values()
                ) as Degree[];

                setDegrees(uniqueDegrees);
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
    // const degreeModules = selectedDegree
    //     ? mockModules.filter((m) => m.degree === selectedDegree.id)
    //     : [];





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
                            setPendingDegree(item);
                            setIsDateDialogOpen(true);
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

    const handleDateConfirm = (date: string) => {
        console.log("Selected Date:", date);

        setSelectedDate(date);
        // Convert string → Date
        const selected = new Date(date);

        // Get Monday & Friday
        const weekRange = getWeekRange(selected);

        if (weekRange) {
            console.log("Week Start (Monday):", weekRange.monday);
            console.log("Week End (Friday):", weekRange.friday);
            console.log("Week End (Friday):", pendingDegree.id);
        }

        if (pendingDegree) {
            // openExplorer(pendingDegree); // existing function
        }
    };


    const handleRowClick = (degree: Degree) => {
        console.log("Row Clicked Data:", degree); // Print to console
        // openExplorer(degree); // Open the explorer popup
        setPendingDegree(degree);
        setIsDateDialogOpen(true);

    };

    return (
        <div className="space-y-6">
            <DataTable
                data={degrees}
                columns={columns}
                searchKey="degreeProgram"
                searchPlaceholder="Search degrees..."
                emptyMessage="No degree programs found. Create your first degree!"
                onRowClick={handleRowClick}
            />




            <SelectDateDialog
                degree={pendingDegree}
                open={isDateDialogOpen}
                onClose={() => setIsDateDialogOpen(false)}
                onConfirm={handleDateConfirm}
            />


        </div>
    );
}
