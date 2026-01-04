import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  variant?: 'landing' | 'auth' | 'dashboard';
}

const Navbar = ({ variant = 'landing' }: NavbarProps) => {
  if (variant === 'auth') {
    return (
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">UniBook</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/contact">Contact IT</Link>
            </Button>
            <Button asChild>
              <Link to="/help">Help Center</Link>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Campus Scheduler</span>
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="nav-link">Home</Link>
          {/* <Link to="/timetable" className="nav-link">Timetable</Link> */}
          {/* <Link to="/spaces" className="nav-link">Features</Link> */}
          {/* <Link to="/contact" className="nav-link">Contact</Link> */}
        </div>

        <Button variant="outline" asChild>
          <Link to="/help">Help/Support</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
