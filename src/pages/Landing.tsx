import { Link } from 'react-router-dom';
import { LogIn, ShieldCheck, Search, CalendarCheck, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import studyRoomImg from '@/assets/study-room.jpg';

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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
