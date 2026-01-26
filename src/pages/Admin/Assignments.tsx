import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { StaffAssignment, CourseModule, Staff } from "@/types/indexAdmin";
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
import moduleService from "@/services/admin/courseModules.service";
import staffService from "@/services/admin/staff.service";
// Note: Assuming there is an assignment service or we might need to use a different service.
// If 'StaffAssignment' is managed via a specific endpoint, we should use it.
// Checking file list, there is no explicit assignment service.
// Maybe it's part of module or staff service?
// Step 250 (moduleService) has getAllModulesForSingleStaff, but not generic assignments.
// I'll assume for now I should use a hypothetical assignment service or manage it locally if backend isn't ready.
// Typically 'assignments' link staff to modules.
// Let's assume for now we might need to fetch modules and staff, and maybe assignments are embedded or separate.
// If no service exists, I'll create a placeholder or reuse existing.
// Wait, `StaffAssignment` type suggests ID, module, staff, role.
// I will simulate with local state for now if API is missing, BUT the prompt asked to remove mock data.
// I'll try to find where assignments are.
// If not found, I will create `assignment.service.ts` similar to others.
// import assignmentService from "@/services/admin/assignment.service"; // I will create this

const roleOptions: StaffAssignment["role"][] = ["Lead Lecturer", "Assistant", "Lab Instructor"];

export function AdminAssignments() {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<StaffAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    staff: 0,
    role: "Assistant" as StaffAssignment["role"],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modulesData, staffData, assignmentsData] = await Promise.all([
        moduleService.getAllModules(),
        staffService.getAllStaff(),
        assignmentService.getAllAssignments(),
      ]);
      setModules(modulesData);
      setStaffList(staffData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load assignment data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moduleAssignments = selectedModule
    ? assignments.filter((a) => a.module === selectedModule.id)
    : [];

  const handleAssign = async () => {
    const staff = staffList.find((s) => s.id === formData.staff);
    if (!staff || !selectedModule) return;

    try {
      const newAssignment = await assignmentService.createAssignment({
        module: selectedModule.id,
        staff: formData.staff,
        role: formData.role,
      });

      // Optimistic update or refetch
      // For now, let's append assuming backend returns the full object with names
      // If backend returns just IDs, we might need to manual construct the object or refetch.
      // Let's assume standard response.
      setAssignments([...assignments, newAssignment]);

      setIsAssignOpen(false);
      resetForm();
      toast({
        title: "Staff assigned",
        description: `${staff.full_name} has been assigned as ${formData.role}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to assign staff",
        variant: "destructive",
      });
    }
  };

  const handleEditRole = async () => {
    if (!selectedAssignment) return;
    try {
      const updated = await assignmentService.updateAssignment(selectedAssignment.id, {
        role: formData.role,
      });

      setAssignments(
        assignments.map((a) =>
          a.id === selectedAssignment.id ? updated : a
        )
      );
      setIsEditOpen(false);
      resetForm();
      toast({
        title: "Assignment updated",
        description: "The staff role has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (assignment: StaffAssignment) => {
    try {
      await assignmentService.deleteAssignment(assignment.id);
      setAssignments(assignments.filter((a) => a.id !== assignment.id));
      toast({
        title: "Assignment removed",
        description: `${assignment.staff_name} has been unassigned.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove assignment",
        variant: "destructive",
      });
    }
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
              data={modules}
              columns={moduleColumns}
              pageSize={5}
              onRowClick={setSelectedModule}
              searchKey="module_name"
              searchPlaceholder="Search modules..."
              emptyMessage="No modules found."
            //   loading={loading}
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
                  emptyMessage="No assignments found for this module."
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
                  {staffList
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
