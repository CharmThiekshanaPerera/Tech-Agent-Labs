import { ReactNode } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "./AdminSidebar";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const { loading, signOut } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar onSignOut={signOut} />
      
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
