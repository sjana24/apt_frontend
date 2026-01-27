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
import { format } from "date-fns";

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
        resolver: zodResolver(timetableFilterSchema),
        defaultValues: {
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
        },
    });

    const selectedDegreeId = watch("degree");

    const handleDegreeChange = (degreeId: string) => {
        const degree = degrees.find(d => d.id === parseInt(degreeId));
        setSelectedDegree(degree || null);
        setValue("degree", parseInt(degreeId));

        if (degree) {
            setValue("level", degree.level);
            setValue("semester", degree.semester);
        }
    };

    const onSubmit = (data: TimetableFilterInput) => {
        onSearch(data);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl">View Your Timetable</CardTitle>
                <CardDescription className="text-base">
                    Select your degree program to view the weekly schedule
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Degree Selection */}
                    <div>
                        <Label htmlFor="degree" className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Degree Program
                        </Label>
                        <Select onValueChange={handleDegreeChange}>
                            <SelectTrigger className="mt-1.5" id="degree">
                                <SelectValue placeholder="Select your degree program" />
                            </SelectTrigger>
                            <SelectContent>
                                {degrees.map((degree) => (
                                    <SelectItem key={degree.id} value={degree.id.toString()}>
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

                    {/* Level and Semester - Side by side on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="level" className="flex items-center gap-2">
                                <School className="h-4 w-4" />
                                Level
                            </Label>
                            <Select
                                value={selectedDegree?.level || ""}
                                onValueChange={(value) => setValue("level", value)}
                                disabled={!selectedDegree}
                            >
                                <SelectTrigger className="mt-1.5" id="level">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["1", "2", "3", "4", "5", "6"].map((level) => (
                                        <SelectItem key={level} value={level}>\
                                            Level {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.level && (
                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.level.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="semester" className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Semester
                            </Label>
                            <Select
                                value={selectedDegree?.semester || ""}
                                onValueChange={(value) => setValue("semester", value)}
                                disabled={!selectedDegree}
                            >
                                <SelectTrigger className="mt-1.5" id="semester">
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["1", "2"].map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                            Semester {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.semester && (
                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.semester.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Start Date
                            </Label>
                            <input
                                type="date"
                                id="startDate"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                                {...register("startDate")}
                            />
                            {errors.startDate && (
                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="endDate" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                End Date
                            </Label>
                            <input
                                type="date"
                                id="endDate"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                                {...register("endDate")}
                            />
                            {errors.endDate && (
                                <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Loading timetable..."
                        className="w-full"
                        size="lg"
                    >
                        View Timetable
                    </LoadingButton>
                </form>
            </CardContent>
        </Card>
    );
}
