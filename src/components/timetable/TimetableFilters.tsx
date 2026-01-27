import { useState } from "react";
import { useForm } from "react-hook-form";
import { GraduationCap, School, BookOpen, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { type TimetableFilterInput } from "@/schemas/admin.schema";
import { Degree } from "@/types/indexAdmin";
import { format, startOfWeek, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface TimetableFiltersProps {
    degrees: Degree[];
    onSearch: (filters: TimetableFilterInput) => void;
    loading?: boolean;
}

export function TimetableFilters({ degrees, onSearch, loading }: TimetableFiltersProps) {
    // Local states for cascading selection
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TimetableFilterInput>({
        defaultValues: {
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
        },
    });

    // Get unique degree programs
    const uniquePrograms = Array.from(new Set(degrees.map(d => d.degreeProgram)));

    // Filtered levels based on selection
    const availableLevels = selectedProgram
        ? Array.from(new Set(degrees.filter(d => d.degreeProgram === selectedProgram).map(d => d.level))).sort()
        : [];

    // Filtered semesters based on program + level selection
    const availableSemesters = (selectedProgram && selectedLevel)
        ? Array.from(new Set(degrees.filter(d => d.degreeProgram === selectedProgram && d.level === selectedLevel).map(d => d.semester))).sort()
        : [];

    const handleProgramChange = (program: string) => {
        setSelectedProgram(program);
        setSelectedLevel("");
        setSelectedSemester("");
        setValue("degree", 0);
    };

    const handleLevelChange = (level: string) => {
        setSelectedLevel(level);
        setSelectedSemester("");
        setValue("degree", 0);
    };

    const handleSemesterChange = (semester: string) => {
        setSelectedSemester(semester);

        const degree = degrees.find(d =>
            d.degreeProgram === selectedProgram &&
            d.level === selectedLevel &&
            d.semester === semester
        );

        if (degree) {
            setValue("degree", degree.id);
            setValue("level", degree.level);
            setValue("semester", degree.semester);
        }
    };

    const onSubmit = (data: any) => {
        if (!data.degree) {
            toast({
                title: "Incomplete Selection",
                description: "Please select Program, Level, and Semester.",
                variant: "destructive"
            });
            return;
        }

        const selectedDate = new Date(data.startDate);
        const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const friday = addDays(monday, 4);

        onSearch({
            ...data,
            startDate: format(monday, 'yyyy-MM-dd'),
            endDate: format(friday, 'yyyy-MM-dd')
        });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Program Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="program" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Degree Program
                        </Label>
                        <Select onValueChange={handleProgramChange} value={selectedProgram}>
                            <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm transition-all focus:ring-primary/20" id="program">
                                <SelectValue placeholder="Select your degree program" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
                                {uniquePrograms.map((program) => (
                                    <SelectItem key={program} value={program}>
                                        {program}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Level and Semester */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="level" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                <School className="h-4 w-4 text-primary" />
                                Academic Level
                            </Label>
                            <Select
                                value={selectedLevel}
                                onValueChange={handleLevelChange}
                                disabled={!selectedProgram}
                            >
                                <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm" id="level">
                                    <SelectValue placeholder={selectedProgram ? "Select level" : "Select program first"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
                                    {availableLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            Level {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="semester" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Semester
                            </Label>
                            <Select
                                value={selectedSemester}
                                onValueChange={handleSemesterChange}
                                disabled={!selectedLevel}
                            >
                                <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm" id="semester">
                                    <SelectValue placeholder={selectedLevel ? "Select semester" : "Select level first"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
                                    {availableSemesters.map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                            Semester {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Week Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="startDate" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            Select Week (Any Day)
                        </Label>
                        <div className="relative group">
                            <input
                                type="date"
                                id="startDate"
                                className="flex h-14 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 hover:bg-white/10 transition-all cursor-pointer"
                                {...register("startDate")}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform">
                                <Calendar className="h-5 w-5 text-primary opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Gathering timetable..."
                        className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-all bg-primary hover:bg-primary/90"
                    >
                        View Timetable
                    </LoadingButton>
                </form>
            </CardContent>
        </Card>
    );
}
