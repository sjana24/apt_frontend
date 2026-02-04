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
    // Local state for the selected degree
    const [selectedDegreeId, setSelectedDegreeId] = useState<string>("");

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

    const handleDegreeChange = (degreeIdStr: string) => {
        const degreeId = parseInt(degreeIdStr);
        setSelectedDegreeId(degreeIdStr);

        const degree = degrees.find(d => d.id === degreeId);

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
                description: "Please select a Degree.",
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
                    {/* Degree Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="degree" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Select Degree
                        </Label>
                        <Select onValueChange={handleDegreeChange} value={selectedDegreeId}>
                            <SelectTrigger className="mt-1.5 h-14 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm transition-all focus:ring-primary/20" id="degree">
                                <SelectValue placeholder="Select a degree..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/20 bg-white/10 backdrop-blur-xl max-h-[300px]">
                                {degrees.map((degree) => (
                                    <SelectItem key={degree.id} value={degree.id.toString()}>
                                        <span className="font-medium">{degree.degreeProgram}</span>
                                        <span className="text-muted-foreground ml-2">
                                            | Level {degree.level} | Sem {degree.semester} | {degree.academicYear}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
