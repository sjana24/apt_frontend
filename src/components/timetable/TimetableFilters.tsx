import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, GraduationCap, School, BookOpen, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { timetableFilterSchema, type TimetableFilterInput } from "@/schemas/admin.schema";
import { Degree } from "@/types/indexAdmin";
import { format, startOfWeek, addDays } from "date-fns";

interface TimetableFiltersProps {
    degrees: Degree[];
    onSearch: (filters: TimetableFilterInput) => void;
    loading?: boolean;
}

export function TimetableFilters({ degrees, onSearch, loading }: TimetableFiltersProps) {
    const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TimetableFilterInput>({
        // resolver: zodResolver(timetableFilterSchema), // We'll handle custom range logic
        defaultValues: {
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'), // This will be calculated on submit
        },
    });

    const handleDegreeChange = (degreeId: string) => {
        const degree = degrees.find(d => d.id === parseInt(degreeId));
        setSelectedDegree(degree || null);
        setValue("degree", parseInt(degreeId));

        if (degree) {
            setValue("level", degree.level);
            setValue("semester", degree.semester);
        }
    };

    const onSubmit = (data: any) => {
        // Calculate the Monday and Friday of the week for the selected date
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
            {/* <CardHeader className="text-center pb-8 p-0">
                <CardTitle className="text-2xl sm:text-3xl">View Your Timetable</CardTitle>
                <CardDescription className="text-base">
                    Select your degree program to view the weekly schedule
                </CardDescription>
            </CardHeader> */}
            <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Degree Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="degree" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Degree Program
                        </Label>
                        <Select onValueChange={handleDegreeChange}>
                            <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm transition-all focus:ring-primary/20" id="degree">
                                <SelectValue placeholder="Select your degree program" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
                                {degrees.map((degree) => (
                                    <SelectItem key={degree.id} value={degree.id.toString()} className="hover:bg-primary/10 transition-colors">
                                        {degree.degreeProgram}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.degree && (
                            <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {errors.degree.message}
                            </p>
                        )}
                    </div>

                    {/* Level and Semester */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="level" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                <School className="h-4 w-4 text-primary" />
                                Academic Level
                            </Label>
                            <Select
                                value={selectedDegree?.level || ""}
                                onValueChange={(value) => setValue("level", value)}
                                disabled={!selectedDegree}
                            >
                                <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm" id="level">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
                                    {["100", "200", "300", "400"].map((level) => (
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
                                value={selectedDegree?.semester || ""}
                                onValueChange={(value) => setValue("semester", value)}
                                disabled={!selectedDegree}
                            >
                                <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm" id="semester">
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl">
                                    {["1", "2"].map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                            Semester {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Date Selection - Single Week Picker */}
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
                        <p className="text-[10px] text-muted-foreground pt-1">We'll automatically show the full week for your selection.</p>
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
