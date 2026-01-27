import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-400 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">UWU <span className="text-primary">Portal</span></span>
            </Link>
            <p className="text-sm leading-relaxed">
              Official Academic Portal of Uva Wellassa University of Sri Lanka. Streamlining university logistics and scheduling.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Quick Access</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Student Timetables</Link></li>
              <li><Link to="/signin" className="hover:text-primary transition-colors">Staff Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Staff Registration</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contact Institution</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Uva Wellassa University of Sri Lanka<br />Passara Road, Badulla 90000, Sri Lanka</span>
              </li>
              <li className="flex flex-col gap-2">
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +94 55 2226622</div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> Fax: +94 55 2226633</div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> vc@uwu.ac.lk</div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <a href="http://www.uwu.ac.lk" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.uwu.ac.lk</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Uva Wellassa University of Sri Lanka. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Academic Tech Division</span>
            <span className="text-white/20">|</span>
            <span>Server Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
