import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    // Listener helps when the auth library emits PASSWORD_RECOVERY after exchanging the code.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoverySession(true);
      }
    });

    const init = async () => {
      try {
        // 1) PKCE recovery links (most common): /admin/reset-password?type=recovery&code=...
        const searchParams = new URLSearchParams(window.location.search);
        const type = searchParams.get("type");
        const code = searchParams.get("code");

        if (type === "recovery" && code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (!cancelled) {
            if (error) {
              console.error("Error exchanging recovery code:", error);
              setIsRecoverySession(false);
            } else {
              setIsRecoverySession(true);
              // Remove the code from the URL once it has been consumed.
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            setCheckingSession(false);
          }
          return;
        }

        // 2) Legacy implicit recovery links: /admin/reset-password#type=recovery&access_token=...
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashType = hashParams.get("type");
        const accessToken = hashParams.get("access_token");

        if (hashType === "recovery" && accessToken) {
          if (!cancelled) {
            setIsRecoverySession(true);
            setCheckingSession(false);
          }
          return;
        }

        // 3) Already signed in (allow changing password)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!cancelled) {
          setIsRecoverySession(!!session);
          setCheckingSession(false);
        }
      } catch (err) {
        console.error("Error checking recovery session:", err);
        if (!cancelled) {
          setIsRecoverySession(false);
          setCheckingSession(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSuccess(true);
      toast.success("Password updated successfully!");
      
      // Redirect to admin login after a short delay
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (error) {
      toast.error("An error occurred while updating password");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isRecoverySession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="gradient-border rounded-2xl p-8 card-glow text-center">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Tech Agent Labs logo - Password reset" className="h-16 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              variant="glow"
              className="w-full"
              onClick={() => navigate("/admin/login")}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="gradient-border rounded-2xl p-8 card-glow text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Password Updated!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully updated. Redirecting to login...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="gradient-border rounded-2xl p-8 card-glow">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Tech Agent Labs logo - Reset password" className="h-16 w-auto" />
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Set New Password
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Enter your new password below
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
