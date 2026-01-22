import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { Staff } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Eye, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import staffService from "@/services/admin/staff.service";

const roleLabels: Record<Staff["role"], string> = {
  admin: "Admin",
  lecturer: "Lecturer",
  lab_instructor: "Lab Instructor",
  assistant: "Assistant",
  staff: "Staff"
};

const roleColors: Record<Staff["role"], "default" | "secondary" | "outline"> = {
  admin: "default",
  lecturer: "secondary",
  lab_instructor: "outline",
  assistant: "outline",
  staff: "outline"
};

export  function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "lecturer" as Staff["role"],
    is_active: true,
  });

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const data = await staffService.getAllStaff();
        setStaff(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load staff",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  // =========================
  // CREATE / EDIT / DELETE
  // =========================
  const handleCreate = async () => {
    try {
      const response = await staffService.createStaff(formData);
      setStaff((prev) => [...prev, response]);
      toast({ title: "Staff created", description: `${response.full_name} added.` });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to create staff", variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!selectedStaff) return;
    try {
      const response = await staffService.updateStaff(selectedStaff.id, formData);
      setStaff((prev) => prev.map((s) => (s.id === response.id ? response : s)));
      toast({ title: "Staff updated", description: "Changes saved successfully." });
      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    }
  };

  const handleDelete = async (member: Staff) => {
    try {
      await staffService.deleteStaff(member.id);
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
      toast({ title: "Staff deleted", variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  // =========================
  // TOGGLE STATUS (ACTIVE/INACTIVE)
  // =========================
  const handleToggleStatus = async (member: Staff) => {
    const newStatus = !member.is_active;
    try {
      const response = await staffService.updateStaff(member.id, {
        ...member,
        is_active: newStatus,
      });
      setStaff((prev) => prev.map((s) => (s.id === response.id ? response : s)));
      toast({
        title: "Status Updated",
        description: `${member.full_name} is now ${newStatus ? "Active" : "Inactive"}.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Status change failed", variant: "destructive" });
    }
  };

  // =========================
  // HELPERS
  // =========================
  const openEdit = (member: Staff) => {
    setSelectedStaff(member);
    setFormData({
      email: member.email,
      full_name: member.full_name,
      role: member.role,
      is_active: member.is_active,
    });
    setIsEditOpen(true);
  };

  const openView = (member: Staff) => {
    setSelectedStaff(member);
    setIsViewOpen(true);
  };

  const resetForm = () => {
    setFormData({ email: "", full_name: "", role: "lecturer", is_active: true });
    setSelectedStaff(null);
  };

  const columns: Column<Staff>[] = [
    { key: "full_name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (item) => <Badge variant={roleColors[item.role]}>{roleLabels[item.role]}</Badge>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <Badge variant={item.is_active ? "default" : "secondary"} className={item.is_active ? "bg-green-100 text-green-700 border-green-200" : ""}>
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          {/* VIEW ACTION */}
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openView(item); }}>
            <Eye className="h-4 w-4 text-blue-500" />
          </Button>

          {/* TOGGLE STATUS ACTION */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }}
            title={item.is_active ? "Deactivate" : "Activate"}
          >
            <Power className={`h-4 w-4 ${item.is_active ? "text-amber-500" : "text-green-500"}`} />
          </Button>

          {/* EDIT ACTION */}
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(item); }}>
            <Pencil className="h-4 w-4" />
          </Button>

          {/* DELETE ACTION */}
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage teaching personnel, roles, and system access."
        actionLabel="Add Staff"
        onAction={() => setIsCreateOpen(true)}
      />

      <DataTable data={staff} columns={columns} searchKey="full_name" />

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => { if (!open) { setIsCreateOpen(false); setIsEditOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? "Edit Staff member" : "Add New Staff"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as Staff["role"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="lab_instructor">Lab Instructor</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between border p-2 rounded-md">
              <Label>Active Account</Label>
              <Switch checked={formData.is_active} onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={isEditOpen ? handleEdit : handleCreate}>{isEditOpen ? "Save Changes" : "Add Staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="font-semibold">Full Name:</span>
                <span>{selectedStaff.full_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="font-semibold">Email:</span>
                <span>{selectedStaff.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="font-semibold">Role:</span>
                <Badge variant={roleColors[selectedStaff.role]}>{roleLabels[selectedStaff.role]}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="font-semibold">Status:</span>
                <span>{selectedStaff.is_active ? "✅ Active" : "❌ Inactive"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Member Since:</span>
                <span>{selectedStaff.created_at ? format(new Date(selectedStaff.created_at), "PPP") : "N/A"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}