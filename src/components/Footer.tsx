import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-semibold text-foreground">Campus Scheduler</span>
              <p className="text-sm text-muted-foreground">Streamlining campus logistics since 2023.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              IT Contact
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2023 Ava Wells University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
