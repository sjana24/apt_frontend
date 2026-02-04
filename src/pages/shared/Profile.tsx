import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import userService from "@/services/user.service";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (passwords.new.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    // Validate password contains letters and numbers
    if (!/[A-Za-z]/.test(passwords.new) || !/\d/.test(passwords.new)) {
      toast({
        title: "Error",
        description: "Password must contain both letters and numbers",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      const result = await userService.changePassword(
        passwords.old,
        passwords.new,
      );
      toast({
        title: "Success",
        description: result.message || "Password updated successfully",
      });
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (error: any) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);

      let errorMessage = "Failed to update password";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your profile information and security.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Profile Info Card */}
        <Card className="md:col-span-5 border-primary/10 shadow-xl shadow-primary/5">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 mb-4 group transition-all hover:scale-105">
              <User className="h-12 w-12 text-primary transition-all group-hover:scale-110" />
            </div>
            <CardTitle className="text-2xl">{profile?.full_name}</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-1 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className="bg-primary/5 text-primary border-primary/10 font-bold px-3"
              >
                {profile?.role?.toUpperCase()}
              </Badge>
              {profile?.role === "staff" && (
                <Badge
                  variant="outline"
                  className="border-success/20 text-success gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" /> Verified Staff
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 border-t border-border/50">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <div className="p-2 rounded-lg bg-background border border-border shadow-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                  Email Address
                </p>
                <p className="text-sm font-semibold">{profile?.email}</p>
                <p className="text-[10px] text-muted-foreground">
                  Primary contact email (Read only)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <div className="p-2 rounded-lg bg-background border border-border shadow-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                  Account Security
                </p>
                <p className="text-sm font-semibold">Two-Factor Enabled</p>
                <p className="text-[10px] text-muted-foreground">
                  Managed by system administrator
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/50 justify-center p-4">
            <p className="text-[11px] text-muted-foreground italic text-center">
              To update your name or email, please contact IT Support.
            </p>
          </CardFooter>
        </Card>

        {/* Password Change Card */}
        <Card className="md:col-span-7 border-border/50 shadow-xl shadow-black/5 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Keep your account secure with a strong password.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-8">
            <form
              id="password-form"
              onSubmit={handlePasswordChange}
              className="space-y-6 text-left"
            >
              <div className="space-y-2">
                <Label htmlFor="old-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="old-password"
                    type={showOld ? "text" : "password"}
                    required
                    className="pr-10 bg-background/50 focus:bg-background transition-colors"
                    value={passwords.old}
                    onChange={(e) =>
                      setPasswords({ ...passwords, old: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showOld ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      required
                      className="pr-10 bg-background/50 focus:bg-background transition-colors"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type={showNew ? "text" : "password"}
                    required
                    className="bg-background/50 focus:bg-background transition-colors"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 border border-orange-100 flex gap-3 items-start">
                <Shield className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-orange-900 leading-none">
                    Security Tip
                  </p>
                  <p className="text-xs text-orange-800/80">
                    Use at least 8 characters, including letters, numbers, and
                    symbols.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/50 px-8 py-6 flex justify-end">
            <Button
              form="password-form"
              type="submit"
              disabled={updating}
              className="px-8 font-bold shadow-lg shadow-primary/20 h-11"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
