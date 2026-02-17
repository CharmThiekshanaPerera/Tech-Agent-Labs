import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { logAdminActivity } from "@/hooks/useAdminActivity";
import { User } from "@supabase/supabase-js";

export const useAdmin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        setIsAdmin(false);
        navigate("/admin/login");
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => checkAdmin(session.user.id), 0);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          navigate("/admin/login");
        }
      }
    );

    // Then check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkAdmin(session.user.id);
      } else {
        setLoading(false);
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await logAdminActivity("logout", "Admin logged out");
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return { user, isAdmin, loading, signOut };
};
