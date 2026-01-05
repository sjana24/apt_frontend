import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
// import { PageHeader } from "@/components/shared/PageHeader";
// import { DataTable, Column } from "@/components/shared/DataTable";
import { mockStaff } from "@/data/mockDataAdmin";
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import staffService from "@/services/admin/staff.service";

const roleLabels: Record<Staff["role"], string> = {
  admin: "Admin",
  lecturer: "Lecturer",
  lab_instructor: "Lab Instructor",
  assistant: "Assistant",
};

const roleColors: Record<Staff["role"], "default" | "secondary" | "outline"> = {
  admin: "default",
  lecturer: "secondary",
  lab_instructor: "outline",
  assistant: "outline",
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  // const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "lecturer" as Staff["role"],
    is_active: true,
  });

    useEffect(() => {
  const fetchStaffs = async () => {
    // setLoading(true);
    try {
      const data = await staffService.getAllStaff();
      setStaff(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load labs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchStaffs();
}, []);

  const handleCreate = () => {
    const newStaff: Staff = {
      id: Math.max(...staff.map((s) => s.id), 0) + 1,
      ...formData,
      created_at: new Date().toISOString(),
    };
    setStaff([...staff, newStaff]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Staff created",
      description: `${newStaff.full_name} has been added successfully.`,
    });
  };

  const handleEdit = () => {
    if (!selectedStaff) return;
    setStaff(
      staff.map((s) =>
        s.id === selectedStaff.id ? { ...s, ...formData } : s
      )
    );
    setIsEditOpen(false);
    resetForm();
    toast({
      title: "Staff updated",
      description: "The staff member has been updated successfully.",
    });
  };

  const handleDelete = (member: Staff) => {
    setStaff(staff.filter((s) => s.id !== member.id));
    toast({
      title: "Staff deleted",
      description: `${member.full_name} has been removed.`,
      variant: "destructive",
    });
  };

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

  const resetForm = () => {
    setFormData({
      email: "",
      full_name: "",
      role: "lecturer",
      is_active: true,
    });
    setSelectedStaff(null);
  };

  const columns: Column<Staff>[] = [
    { key: "full_name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (item) => (
        <Badge variant={roleColors[item.role]}>{roleLabels[item.role]}</Badge>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <Badge variant={item.is_active ? "default" : "secondary"}>
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    // {
    //   key: "created_at",
    //   header: "Joined",
    //   render: (item) => format(new Date(item.created_at), "MMM d, yyyy"),
    // },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(item);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Manage teaching personnel and their roles."
        actionLabel="Add Staff"
        onAction={() => setIsCreateOpen(true)}
      />

      <DataTable
        data={staff}
        columns={columns}
        searchKey="full_name"
        searchPlaceholder="Search staff..."
        emptyMessage="No staff found. Add your first staff member!"
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setIsEditOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? "Edit Staff" : "Add New Staff"}</DialogTitle>
            <DialogDescription>
              {isEditOpen ? "Update the staff member details." : "Add a new staff member to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Dr. John Smith"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john.smith@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as Staff["role"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="lab_instructor">Lab Instructor</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active Status</Label>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              setIsEditOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={isEditOpen ? handleEdit : handleCreate}>
              {isEditOpen ? "Save Changes" : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
