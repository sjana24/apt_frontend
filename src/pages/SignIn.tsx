import { useState } from 'react';
import { Link, useNavigation } from 'react-router-dom';
import { Eye, EyeOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import authService from '@/services/auth/auth.service';
import { useNavigate } from 'react-router-dom';


import campusBuildingImg from '@/assets/campus-building.jpg';

type UserRole = 'student' | 'lecturer' | 'admin';

export function SignIn () {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const roleRoutes = {
    'admin': '/admin',
    'staff': '/dashboard',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // Reset errors on new attempt

    try {
      const response = await authService.login(formData);

      // 1. Success Feedback
      setSuccessMessage("Login Successful! Redirecting...");

      // 2. Extract Data
      const role = response.user.user.role;
      const targetRoute = roleRoutes[role] || '/login';

      // 3. Delay navigation slightly so user can see the success message
      setTimeout(() => {
        navigate(targetRoute);
      }, 1500);

    } catch (error: any) {
      // 4. Handle specific error messages from Django
      const errorDetail = error.response?.data?.error || "Invalid email or password.";
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
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
              src={campusBuildingImg}
              alt="University campus building"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/60" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Reserve Your Academic Space
              </h2>
              <p className="text-white/90">
                Manage classroom and laboratory bookings efficiently for the upcoming semester. Secure your spot in just a few clicks.
              </p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                {/* Display messages to the user */}
                {errorMessage && <div className="error-banner">{errorMessage}</div>}
                {successMessage && <div className="success-banner">{successMessage}</div>}
                {/* <Label className="mb-2 block text-sm font-medium">I am a...</Label>
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-border p-1">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${selectedRole === role.value
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div> */}
              </div>

              <div>
                <Label htmlFor="email"> Email</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="email"
                    type="text"
                    placeholder="e.g. abc@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pr-10"
                  />
                  <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {/* Sign In */}
                {loading ? "Verifying..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Having trouble?{' '}
              <Link to="/contact" className="font-medium text-primary hover:underline">
                Contact IT Support
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              © 2023 University Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};