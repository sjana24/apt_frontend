import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

import studyRoomImg from "@/assets/study-room.jpg";
import authService from "@/services/auth/auth.service";

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await authService.signup(formData);

      console.log("Signup successful:", result);

      toast({
        title: "✓ Registration Successful",
        description: "Your account has been created. Redirecting to sign in...",
      });

      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (error: any) {
      const errorDetail =
        error.response?.data?.error || "Registration failed. Please try again.";

      // Show specific error based on backend response
      let title = "✗ Registration Failed";
      if (errorDetail.includes("already exists")) {
        title = "✗ Email Already Registered";
      } else if (errorDetail.includes("Invalid email")) {
        title = "✗ Invalid Email Format";
      } else if (errorDetail.includes("disposable email")) {
        title = "✗ Email Not Allowed";
      } else if (errorDetail.includes("8 characters")) {
        title = "✗ Password Too Short";
      } else if (errorDetail.includes("letters and numbers")) {
        title = "✗ Weak Password";
      } else if (errorDetail.includes("required")) {
        title = "✗ Missing Information";
      }

      toast({
        title: title,
        description: errorDetail,
        variant: "destructive",
      });

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
                Seamlessly book study rooms, lecture halls, and laboratories
                with your university credentials.
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
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                Staff Registration
              </h1>
              <p className="text-muted-foreground">
                Join the UWU Portal as a staff member to manage your modules and
                schedules.
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-primary">
                  Please use your official .edu email address.
                </p>
              </div>

              <div>
                <Label htmlFor="role">Academic Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="mt-1.5 h-12 rounded-xl border-border bg-background">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff Member</SelectItem>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      agreeToTerms: checked as boolean,
                    })
                  }
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  I agree to follow the university guidelines and regulations.{" "}
                  <span className="text-destructive">*</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!formData.agreeToTerms}
              >
                Create Account
              </Button>

              {!formData.agreeToTerms && (
                <p className="text-xs text-center text-muted-foreground -mt-2">
                  Please agree to the terms to create an account
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>© 2026 Uva Wellassa University</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
