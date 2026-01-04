import { Link } from 'react-router-dom';
import { LogIn, ShieldCheck, Search, CalendarCheck, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar as CalendarIcon, GraduationCap, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn/ui
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


import studyRoomImg from '@/assets/study-room.jpg';
import { useState } from 'react';

const features = [
  {
    icon: Search,
    title: 'Real-time Availability',
    description: 'Instant access to room schedules. Filter by capacity, equipment (projectors, whiteboards), and location instantly.',
  },
  {
    icon: CalendarCheck,
    title: 'Instant Confirmation',
    description: 'Book recurring lab sessions or one-off study groups and receive immediate digital confirmation and email alerts.',
  },
  {
    icon: ClipboardCheck,
    title: 'Lab Safety Checklists',
    description: 'Integrated safety protocols. Ensure all required safety certifications are met before booking restricted laboratory zones.',
  },
];



const Landing = () => {
  const [formData, setFormData] = useState({
    degree: "",
    year: "",
    semester: "",
    date: undefined as Date | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This is the object you send to your Django backend
    const payload = {
      degree: formData.degree,
      year: formData.year,
      semester: formData.semester,
      date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
    };

    console.log("Sending to Backend:", payload);

    try {
      // Example API call
      // const response = await axios.post('/api/timetable/', payload);
      alert("Fetching Timetable for: " + payload.degree);
    } catch (error) {
      console.error("Error fetching timetable", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <div className="rounded-3xl bg-card border shadow-elevated overflow-hidden">
          <div className="grid lg:grid-cols-5">

            {/* Left Side: Info (2 columns) */}
            <div className="lg:col-span-2 bg-primary p-8 md:p-12 text-primary-foreground flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">View Timetable</h2>
              <p className="text-primary-foreground/80 mb-8">
                Select your academic details to view available slots for classrooms and laboratories.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Real-time availability</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Integrated Lab schedules</span>
                </li>
              </ul>
            </div>

            {/* Right Side: Form (3 columns) */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-background">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Degree Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Degree Program
                    </label>
                    <select
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    >
                      <option value="">Select Degree</option>
                      <option value="cs">Computer Science</option>
                      <option value="ee">Electrical Engineering</option>
                      <option value="me">Mechanical Engineering</option>
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Academic Year
                    </label>
                    <select
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Semester Radio Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semester</label>
                    <div className="flex gap-4 p-2 border rounded-md">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="semester"
                          value="1"
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Semester 01</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="semester"
                          value="2"
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Semester 02</span>
                      </label>
                    </div>
                  </div>

                  {/* Calendar Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" /> Select Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
                        >
                          {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(day) => setFormData({ ...formData, date: day })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button type="submit" className="w-full py-6 text-lg shadow-lg" disabled={isSubmitting}>
                  <Clock className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Loading..." : "View Time Table"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center animate-slide-up">
            <span className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Ava Wells University Portal
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Campus Space Scheduler
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Efficient Classroom and Laboratory Booking System. Streamline your academic planning with our integrated tools.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/signin">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In with University ID
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Register New Account</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Secure login via University SSO
            </div>
          </div>

          <div className="animate-fade-in">
            <img
              src={studyRoomImg}
              alt="Students collaborating in a modern study room"
              className="h-full max-h-[500px] w-full rounded-2xl object-cover shadow-elevated"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Why use the Scheduler?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Simplify the complexity of room management. Our platform is designed for faculty, students, and administrators.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
