import { useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { mockModules, mockStaff, mockAssignments } from "@/data/mockDataAdmin";
import { StaffAssignment, CourseModule } from "@/types/indexAdmin";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, UserPlus, BookOpen, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const roleOptions: StaffAssignment["role"][] = ["Lead Lecturer", "Assistant", "Lab Instructor"];

export  function AdminAssignments() {
  const [assignments, setAssignments] = useState<StaffAssignment[]>(mockAssignments);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<StaffAssignment | null>(null);
  const [formData, setFormData] = useState({
    staff: 0,
    role: "Assistant" as StaffAssignment["role"],
  });

  const moduleAssignments = selectedModule
    ? assignments.filter((a) => a.module === selectedModule.id)
    : [];

  const handleAssign = () => {
    const staff = mockStaff.find((s) => s.id === formData.staff);
    if (!staff || !selectedModule) return;

    const newAssignment: StaffAssignment = {
      id: Math.max(...assignments.map((a) => a.id), 0) + 1,
      module: selectedModule.id,
      module_name: selectedModule.module_name,
      staff: formData.staff,
      staff_name: staff.full_name,
      role: formData.role,
    };
    setAssignments([...assignments, newAssignment]);
    setIsAssignOpen(false);
    resetForm();
    toast({
      title: "Staff assigned",
      description: `${staff.full_name} has been assigned as ${formData.role}.`,
    });
  };

  const handleEditRole = () => {
    if (!selectedAssignment) return;
    setAssignments(
      assignments.map((a) =>
        a.id === selectedAssignment.id ? { ...a, role: formData.role } : a
      )
    );
    setIsEditOpen(false);
    resetForm();
    toast({
      title: "Assignment updated",
      description: "The staff role has been updated successfully.",
    });
  };

  const handleRemove = (assignment: StaffAssignment) => {
    setAssignments(assignments.filter((a) => a.id !== assignment.id));
    toast({
      title: "Assignment removed",
      description: `${assignment.staff_name} has been unassigned.`,
      variant: "destructive",
    });
  };

  const openEditRole = (assignment: StaffAssignment) => {
    setSelectedAssignment(assignment);
    setFormData({ ...formData, role: assignment.role });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ staff: 0, role: "Assistant" });
    setSelectedAssignment(null);
  };

  const moduleColumns: Column<CourseModule>[] = [
    { key: "module_code", header: "Code" },
    { key: "module_name", header: "Module Name" },
    {
      key: "assignments",
      header: "Assigned Staff",
      render: (item) => {
        const count = assignments.filter((a) => a.module === item.id).length;
        return <Badge variant="secondary">{count} staff</Badge>;
      },
    },
  ];

  const assignmentColumns: Column<StaffAssignment>[] = [
    { key: "staff_name", header: "Staff Member" },
    {
      key: "role",
      header: "Role",
      render: (item) => (
        <Badge
          variant={
            item.role === "Lead Lecturer"
              ? "default"
              : item.role === "Lab Instructor"
              ? "secondary"
              : "outline"
          }
        >
          {item.role}
        </Badge>
      ),
    },
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
              openEditRole(item);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(item);
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
        title="Staff Assignments"
        description="Assign staff members to course modules."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Modules List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Modules
            </CardTitle>
            <CardDescription>Select a module to manage its staff assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={mockModules}
              columns={moduleColumns}
              pageSize={5}
              onRowClick={setSelectedModule}
            />
          </CardContent>
        </Card>

        {/* Assignments Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedModule ? selectedModule.module_name : "Staff Assignments"}
                </CardTitle>
                <CardDescription>
                  {selectedModule
                    ? `Manage staff for ${selectedModule.module_code}`
                    : "Select a module to view assignments"}
                </CardDescription>
              </div>
              {selectedModule && (
                <Button size="sm" onClick={() => setIsAssignOpen(true)} className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  Assign
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedModule ? (
              moduleAssignments.length > 0 ? (
                <DataTable
                  data={moduleAssignments}
                  columns={assignmentColumns}
                  pageSize={5}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No staff assigned to this module yet.</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a module from the list to view and manage assignments.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assign Staff Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Staff</DialogTitle>
            <DialogDescription>
              Assign a staff member to {selectedModule?.module_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select
                value={formData.staff ? String(formData.staff) : ""}
                onValueChange={(value) => setFormData({ ...formData, staff: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockStaff
                    .filter((s) => s.is_active)
                    .map((staff) => (
                      <SelectItem key={staff.id} value={String(staff.id)}>
                        {staff.full_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as StaffAssignment["role"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>Assign Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedAssignment?.staff_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as StaffAssignment["role"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
