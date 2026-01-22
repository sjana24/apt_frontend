import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

import studyRoomImg from '@/assets/study-room.jpg';
import authService from '@/services/auth/auth.service';

export function Register () {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const result = await authService.signup(formData);

        console.log("Signup successful:", result);
        alert("Registration successful! Please sign in.");
        window.location.href = '/signin';
        
    } catch (error: any) {
          const errorMessage = error.response?.data?.detail || "Signup failed. Please try again.";
        alert(errorMessage);
        console.error("Signup error:", error);
    }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="auth" />
      
      <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
          {/* Left Panel - Image */}
          <div className="relative hidden overflow-hidden rounded-2xl lg:block">
            <img 
              src={studyRoomImg} 
              alt="University study space"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/60" />
            <div className="absolute left-8 top-8">
              <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3">
                <Building className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Access Campus Resources
              </h2>
              <p className="mb-6 text-white/90">
                Seamlessly book study rooms, lecture halls, and laboratories with your university credentials.
              </p>
              <div className="flex gap-8 border-t border-white/20 pt-6">
                <div>
                  <p className="text-2xl font-bold text-white">150+</p>
                  <p className="text-sm text-white/70">Rooms</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm text-white/70">Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-bold text-foreground">Create your Account</h1>
              <p className="text-muted-foreground">
                Join the university booking platform to start reserving spaces.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pr-10"
                  />
                  <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">University Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex.j@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-primary">
                  Please use your official .edu email address.
                </p>
              </div>

              <div>
                <Label htmlFor="role">Academic Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link to="/help" className="hover:text-foreground">Help Center</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <span>•</span>
              <span>© 2023 UniBook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
