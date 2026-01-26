import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingButton } from '@/components/ui/LoadingButton';
import Navbar from '@/components/Navbar';
import authService from '@/services/auth/auth.service';
import { signInSchema, type SignInInput } from '@/schemas/auth.schema';
import { toast } from '@/hooks/use-toast';
import campusBuildingImg from '@/assets/campus-building.jpg';

const roleRoutes = {
  'admin': '/admin',
  'staff': '/dashboard',
};

export function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignInInput) => {
    setLoading(true);

    try {
      const response = await authService.login(data);
      const role = response.user.user.role;
      const targetRoute = roleRoutes[role as keyof typeof roleRoutes] || '/';

      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });

      setTimeout(() => {
        navigate(targetRoute);
      }, 500);

    } catch (error: any) {
      const errorDetail = error.response?.data?.error || "Invalid email or password.";
      toast({
        title: "Login Failed",
        description: errorDetail,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="auth" />

      <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8 sm:py-12">
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
                Manage classroom and laboratory bookings efficiently. Secure your spot in just a few clicks.
              </p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
            <div className="mb-6 sm:mb-8">
              <h1 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. abc@gmail.com"
                    className="pr-10"
                    {...register('email')}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    {...register('password')}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Signing in..."
                className="w-full"
                size="lg"
              >
                Sign In
              </LoadingButton>
            </form>

            {/* Support Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Having trouble?{' '}
              <Link to="/contact" className="font-medium text-primary hover:underline">
                Contact IT Support
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-8 text-center text-xs text-muted-foreground">
              © 2026 University Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}