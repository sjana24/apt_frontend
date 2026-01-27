import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TimetableFilters } from "@/components/timetable/TimetableFilters";
import { TimetableModal } from "@/components/timetable/TimetableModal";
import { Degree } from "@/types/indexAdmin";
import { TimetableFilterInput } from "@/schemas/admin.schema";
import degreeService from "@/services/admin/degree.service";
import { toast } from "@/hooks/use-toast";

export function PublicTimetable() {
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);

    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const data = await degreeService.getAllDegrees();
                setDegrees(data);
            } catch (error) {
                console.error("Failed to fetch degrees", error);
                toast({
                    title: "Error",
                    description: "Failed to load degree programs. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDegrees();
    }, []);

    const handleSearch = (filters: TimetableFilterInput) => {
        const degree = degrees.find(d => d.id === filters.degree);
        if (degree) {
            setSelectedDegree(degree);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Student Timetable Portal</h1>
                        <p className="text-muted-foreground">Find your class schedule by selecting your degree details below.</p>
                    </div>

                    <TimetableFilters
                        degrees={degrees}
                        onSearch={handleSearch}
                        loading={loading}
                    />
                </div>
            </main>

            <TimetableModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                degree={selectedDegree}
            />

            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
