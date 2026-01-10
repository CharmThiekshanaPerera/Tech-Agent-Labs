import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Upload, FileText, Download } from "lucide-react";
import { format } from "date-fns";

interface ProjectDocument {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminDocuments = () => {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ProjectDocument | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("project_documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
    setLoading(false);
  };

  const openNewDialog = () => {
    setEditingDoc(null);
    setFormData({ name: "", description: "", is_active: true });
    setFile(null);
    setDialogOpen(true);
  };

  const openEditDialog = (doc: ProjectDocument) => {
    setEditingDoc(doc);
    setFormData({
      name: doc.name,
      description: doc.description || "",
      is_active: doc.is_active,
    });
    setFile(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!formData.name) {
        setFormData({ ...formData, name: e.target.files[0].name });
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a document name");
      return;
    }

    if (!editingDoc && !file) {
      toast.error("Please select a file to upload");
      return;
    }

    setSaving(true);

    try {
      let fileUrl = editingDoc?.file_url || "";
      let fileType = editingDoc?.file_type || "";

      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(fileName);

        fileUrl = urlData.publicUrl;
        fileType = file.type;
      }

      if (editingDoc) {
        const { error } = await supabase
          .from("project_documents")
          .update({
            name: formData.name,
            description: formData.description || null,
            is_active: formData.is_active,
            ...(file && { file_url: fileUrl, file_type: fileType }),
          })
          .eq("id", editingDoc.id);

        if (error) throw error;
        toast.success("Document updated");
      } else {
        const { error } = await supabase.from("project_documents").insert({
          name: formData.name,
          description: formData.description || null,
          file_url: fileUrl,
          file_type: fileType,
          is_active: formData.is_active,
        });

        if (error) throw error;
        toast.success("Document uploaded");
      }

      setDialogOpen(false);
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const { error } = await supabase.from("project_documents").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Document deleted");
      fetchDocuments();
    }
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("project_documents")
      .update({ is_active: !currentValue })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Document ${!currentValue ? "activated" : "deactivated"}`);
      fetchDocuments();
    }
  };

  return (
    <AdminLayout title="Documents" description="Manage project proposals and documents">
      <div className="flex justify-end mb-6">
        <Button onClick={openNewDialog} variant="glow">
          <Plus className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No documents uploaded
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {doc.file_type.split("/")[1]?.toUpperCase() || "FILE"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(doc.id, doc.is_active)}
                      className={doc.is_active ? "text-green-500" : "text-muted-foreground"}
                    >
                      {doc.is_active ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell>{format(new Date(doc.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(doc)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDoc ? "Edit Document" : "Upload Document"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Project Proposal 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the document"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{editingDoc ? "Replace File (optional)" : "File *"}</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to select a file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, Word, Excel, PowerPoint
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} variant="glow">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDoc ? "Update" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDocuments;
