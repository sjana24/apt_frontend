import { Link } from 'react-router-dom';
import { GraduationCap, LogIn, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  variant?: 'landing' | 'auth' | 'dashboard';
}

const Navbar = ({ variant = 'landing' }: NavbarProps) => {
  if (variant === 'auth') {
    return (
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">UWU <span className="text-primary">Portal</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Removed Support Button as page doesn't exist */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">UWU <span className="text-primary">Portal</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex mr-4">
            <Button variant="ghost" asChild className="font-semibold hover:bg-primary/5">
              <Link to="/">Home</Link>
            </Button>
          </div>

          <Button variant="outline" asChild className="border-primary/20 hover:bg-primary/5 font-bold h-11 px-6 rounded-xl">
            <Link to="/signin" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Staff Sign In
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
