import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, GraduationCap, Users, BookOpen,
  Building2, ArrowRight, CheckCircle2, Search,
  ShieldCheck, Sparkles, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TimetableFilters } from "@/components/timetable/TimetableFilters";
import { TimetableModal } from "@/components/timetable/TimetableModal";
import degreeService from "@/services/admin/degree.service";
import { Degree } from "@/types/indexAdmin";
import { TimetableFilterInput } from "@/schemas/admin.schema";
import { toast } from "@/hooks/use-toast";

export function Landing() {
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
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide animate-fade-in uppercase">
              <Sparkles className="h-4 w-4" />
              Next-Gen Academic Scheduling
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Seamless Scheduling for
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mt-2">
                Academic Excellence
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Official timetable and resource management platform for Uva Wellassa University. Access schedules instantly with no login required for students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Button asChild size="lg" className="h-14 px-10 text-lg font-bold bg-blue-600 hover:bg-blue-500 border-0 shadow-2xl shadow-blue-500/20 group transition-all">
                <Link to="/signin" className="flex items-center">
                  Staff Portal login
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-slate-800 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link to="/register">Staff Registration</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2 text-white font-bold"><ShieldCheck className="text-blue-500" /> Secure Access</div>
              <div className="flex items-center gap-2 text-white font-bold"><Users className="text-indigo-500" /> Dedicated Faculty</div>
              <div className="flex items-center gap-2 text-white font-bold"><Building2 className="text-purple-500" /> Modern Campus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Timetable Hub */}
      <section className="relative -mt-20 pb-24 z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/80 backdrop-blur-xl border border-white/10 shadow-3xl rounded-[2.5rem] p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                    <span className="h-px w-8 bg-primary" />
                    Student Access
                  </div>
                  <h2 className="text-3xl font-bold">Find Your Schedule</h2>
                  <p className="text-muted-foreground">Select your program to view your weekly classes instantly.</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 hidden md:block">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
              </div>

              <TimetableFilters
                degrees={degrees}
                onSearch={handleSearch}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-4 py-1">Management Suite</Badge>
            <h2 className="text-4xl font-bold">Engineered for Excellence</h2>
            <p className="max-w-2xl text-slate-500">Every feature is designed to eliminate conflicts and maximize educational time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Smart Lab Allocation",
                description: "Automatically assign labs based on capacity and required equipment specifications.",
                color: "bg-blue-500",
              },
              {
                icon: Clock,
                title: "Conflict Resolution",
                description: "Real-time engine ensures no lecturer or room is double-booked across the institution.",
                color: "bg-indigo-500",
              },
              {
                icon: GraduationCap,
                title: "Institutional Credits",
                description: "Monitor staff workload and student credit hours with automated reporting tools.",
                color: "bg-purple-500",
              },
            ].map((feature, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <TimetableModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        degree={selectedDegree}
      />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
