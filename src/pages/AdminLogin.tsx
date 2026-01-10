import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Loader2, KeyRound } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  // Check if any admin already exists using secure database function
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase.rpc("admin_exists");

        if (error) {
          console.error("Error checking admin:", error);
          // Default to true (admin exists) for safety if check fails
          setAdminExists(true);
          setIsSignUp(false);
        } else {
          const exists = data === true;
          setAdminExists(exists);
          // If no admin exists yet, default the screen to "Create Admin Account"
          setIsSignUp(!exists);
        }
      } catch (error) {
        console.error("Error:", error);
        setAdminExists(true);
        setIsSignUp(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleError || !roleData) {
          await supabase.auth.signOut();
          toast.error("You don't have admin access. Contact the system administrator.");
          return;
        }

        toast.success("Welcome back, Admin!");
        navigate("/admin");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Double-check no admin exists before allowing signup using secure function
      const { data: exists, error: checkError } = await supabase.rpc("admin_exists");

      if (checkError || exists === true) {
        toast.error("An admin already exists. Please login instead.");
        setAdminExists(true);
        setIsSignUp(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Auto-assign admin role for the first admin
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: "admin",
        });

        if (roleError) {
          console.error("Error assigning admin role:", roleError);
          toast.error(
            "Account created but failed to assign admin role. Please contact support."
          );
          return;
        }

        toast.success("Admin account created successfully! You can now login.");
        setAdminExists(true);
        setIsSignUp(false);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const fallbackAdminEmail = "info@techagentlabs.com";
    const targetEmail = (email.trim() || fallbackAdminEmail).toLowerCase();

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(`Password reset link sent to ${targetEmail}. Check your inbox!`);
      setShowResetPassword(false);
    } catch (error) {
      toast.error("An error occurred while sending reset link");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="gradient-border rounded-2xl p-8 card-glow">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Tech Agent Labs" className="h-16 w-auto" />
          </div>

          {showResetPassword ? (
            <>
              <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                Reset Password
              </h1>
              <p className="text-muted-foreground text-center text-sm mb-8">
                Send a password reset link to the admin email
              </p>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Reset link will be sent to:</p>
                  <p className="font-medium text-foreground">info@techagentlabs.com</p>
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowResetPassword(false)}
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                {isSignUp ? "Create Admin Account" : "Admin Login"}
              </h1>
              <p className="text-muted-foreground text-center text-sm mb-8">
                {isSignUp 
                  ? "Set up the first admin account for your system" 
                  : "Enter your credentials to access the dashboard"}
              </p>

              <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isSignUp ? "Creating account..." : "Signing in..."}
                    </>
                  ) : (
                    isSignUp ? "Create Admin Account" : "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                {/* Only show signup option if no admin exists */}
                {!adminExists && (
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-primary hover:underline transition-colors block w-full"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "First time? Create admin account"}
                  </button>
                )}
                
                {/* Show forgot password only on login view */}
                {!isSignUp && (
                  <button
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
                  >
                    Forgot password?
                  </button>
                )}
                
                <div>
                  <a
                    href="/"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Back to website
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
