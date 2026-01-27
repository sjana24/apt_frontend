import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import Navbar from "@/components/Navbar";
import authService from "@/services/auth/auth.service";
import {
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type VerifyOTPInput,
  type ResetPasswordInput,
} from "@/schemas/forgotPassword.schema";
import { toast } from "@/hooks/use-toast";
import campusBuildingImg from "@/assets/campus-building.jpg";

type Step = "email" | "otp" | "password" | "success";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userOTP, setUserOTP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const otpForm = useForm<VerifyOTPInput>({
    resolver: zodResolver(verifyOTPSchema),
    mode: "onBlur",
  });

  const passwordForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onEmailSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      setUserEmail(data.email);
      setStep("otp");

      toast({
        title: "✓ OTP Sent Successfully",
        description:
          response.message || "Please check your email for the OTP code.",
      });
    } catch (error: any) {
      const errorDetail =
        error.response?.data?.error || "Failed to send OTP. Please try again.";
      toast({
        title: "✗ Failed to Send OTP",
        description: errorDetail,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onOTPSubmit = async (data: VerifyOTPInput) => {
    setLoading(true);
    try {
      const response = await authService.verifyOTP(userEmail, data.otp);
      setUserOTP(data.otp);
      setStep("password");

      toast({
        title: "✓ OTP Verified",
        description:
          response.message ||
          "OTP verified successfully. Now set your new password.",
      });
    } catch (error: any) {
      const errorDetail =
        error.response?.data?.error || "Invalid OTP. Please try again.";

      let title = "✗ Verification Failed";
      if (errorDetail.includes("expired")) {
        title = "✗ OTP Expired";
      } else if (errorDetail.includes("Invalid")) {
        title = "✗ Invalid OTP";
      }

      toast({
        title: title,
        description: errorDetail,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    try {
      const response = await authService.resetPassword(
        userEmail,
        userOTP,
        data.new_password,
      );
      setStep("success");

      toast({
        title: "✓ Password Reset Successful",
        description:
          response.message || "Your password has been reset successfully.",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error: any) {
      const errorDetail =
        error.response?.data?.error ||
        "Failed to reset password. Please try again.";

      let title = "✗ Password Reset Failed";
      if (errorDetail.includes("8 characters")) {
        title = "✗ Password Too Short";
      } else if (errorDetail.includes("letters and numbers")) {
        title = "✗ Weak Password";
      }

      toast({
        title: title,
        description: errorDetail,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      await authService.forgotPassword(userEmail);
      toast({
        title: "✓ OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "✗ Failed to Resend",
        description: "Could not resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="auth" />
        <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                Password Reset Successful!
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Your password has been successfully reset. Redirecting to sign
                in...
              </p>
              <Link to="/signin">
                <Button className="w-full">Go to Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="auth" />
      <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8 sm:py-12">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
          {/* Left Panel - Image */}
          <div className="relative hidden overflow-hidden rounded-2xl lg:block">
            <img
              src={campusBuildingImg}
              alt="University campus"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/60" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {step === "email" && "Reset Your Password"}
                {step === "otp" && "Verify Your Identity"}
                {step === "password" && "Create New Password"}
              </h2>
              <p className="text-white/90">
                {step === "email" &&
                  "Enter your email to receive a one-time password (OTP)."}
                {step === "otp" && "Enter the 6-digit code sent to your email."}
                {step === "password" &&
                  "Choose a strong password to secure your account."}
              </p>
            </div>
          </div>

          {/* Right Panel - Forms */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
            {/* Progress Indicator */}
            <div className="mb-6 flex justify-center gap-2">
              <div
                className={`h-2 w-16 rounded-full ${step === "email" ? "bg-primary" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 w-16 rounded-full ${step === "otp" ? "bg-primary" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 w-16 rounded-full ${step === "password" ? "bg-primary" : "bg-gray-300"}`}
              />
            </div>

            {/* Step 1: Email */}
            {step === "email" && (
              <>
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold text-foreground">
                    Forgot Password?
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you an OTP to reset
                    your password.
                  </p>
                </div>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@uwu.ac.lk"
                        className="pr-10"
                        {...emailForm.register("email")}
                      />
                      <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {emailForm.formState.errors.email && (
                      <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    loadingText="Sending..."
                    className="w-full"
                    size="lg"
                  >
                    Send OTP
                  </LoadingButton>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <>
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold text-foreground">
                    Enter OTP
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-foreground">
                      {userEmail}
                    </span>
                  </p>
                </div>
                <form
                  onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="otp">One-Time Password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="pr-10 text-center text-2xl tracking-widest"
                        {...otpForm.register("otp")}
                      />
                      <KeyRound className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {otpForm.formState.errors.otp && (
                      <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      OTP expires in 10 minutes
                    </p>
                  </div>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    loadingText="Verifying..."
                    className="w-full"
                    size="lg"
                  >
                    Verify OTP
                  </LoadingButton>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resendOTP}
                      className="text-sm text-primary hover:underline"
                      disabled={loading}
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
              <>
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold text-foreground">
                    Create New Password
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Choose a strong password that you haven't used before.
                  </p>
                </div>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="new_password">New Password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="new_password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        {...passwordForm.register("new_password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.new_password && (
                      <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {passwordForm.formState.errors.new_password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        {...passwordForm.register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="mb-2 text-sm font-medium text-blue-900">
                      Password Requirements:
                    </h3>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li>✓ At least 8 characters long</li>
                      <li>✓ Contains at least one letter</li>
                      <li>✓ Contains at least one number</li>
                    </ul>
                  </div>
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    loadingText="Resetting..."
                    className="w-full"
                    size="lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Reset Password
                  </LoadingButton>
                </form>
              </>
            )}

            {/* Back to Sign In */}
            <div className="mt-6">
              <Link to="/signin">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              © 2026 Uva Wellassa University of Sri Lanka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
