import { useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { mockDegrees, mockModules } from "@/data/mockDataAdmin";
import { Degree, CourseModule } from "@/types/indexAdmin";
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
import { Pencil, Trash2, Eye, ChevronRight, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminDegrees() {
  const [degrees, setDegrees] = useState<Degree[]>(mockDegrees);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [formData, setFormData] = useState({
    degreeProgram: "",
    level: "",
    semester: "",
    academicYear: new Date().getFullYear(),
  });

  // Get modules for selected degree
  const degreeModules = selectedDegree
    ? mockModules.filter((m) => m.degree === selectedDegree.id)
    : [];

  const handleCreate = () => {
    const newDegree: Degree = {
      id: Math.max(...degrees.map((d) => d.id)) + 1,
      ...formData,
    };
    setDegrees([...degrees, newDegree]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Degree created",
      description: `${newDegree.degreeProgram} has been added successfully.`,
    });
  };

  const handleEdit = () => {
    if (!selectedDegree) return;
    setDegrees(
      degrees.map((d) =>
        d.id === selectedDegree.id ? { ...d, ...formData } : d
      )
    );
    setIsEditOpen(false);
    resetForm();
    toast({
      title: "Degree updated",
      description: "The degree has been updated successfully.",
    });
  };

  const handleDelete = (degree: Degree) => {
    setDegrees(degrees.filter((d) => d.id !== degree.id));
    toast({
      title: "Degree deleted",
      description: `${degree.degreeProgram} has been removed.`,
      variant: "destructive",
    });
  };

  const openEdit = (degree: Degree) => {
    setSelectedDegree(degree);
    setFormData({
      degreeProgram: degree.degreeProgram,
      level: degree.level,
      semester: degree.semester,
      academicYear: degree.academicYear,
    });
    setIsEditOpen(true);
  };

  const openExplorer = (degree: Degree) => {
    setSelectedDegree(degree);
    setIsExplorerOpen(true);
  };

  const resetForm = () => {
    setFormData({
      degreeProgram: "",
      level: "",
      semester: "",
      academicYear: new Date().getFullYear(),
    });
    setSelectedDegree(null);
  };

  const columns: Column<Degree>[] = [
    { key: "degreeProgram", header: "Program" },
    {
      key: "level",
      header: "Level",
      render: (item) => (
        <Badge variant="secondary">Level {item.level}</Badge>
      ),
    },
    {
      key: "semester",
      header: "Semester",
      render: (item) => <span>Semester {item.semester}</span>,
    },
    { key: "academicYear", header: "Academic Year" },
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
              openExplorer(item);
            }}
            title="View modules"
          >
            <Eye className="h-4 w-4" />
          </Button>
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

  const moduleColumns: Column<CourseModule>[] = [
    { key: "module_code", header: "Code" },
    { key: "module_name", header: "Module Name" },
    {
      key: "credit",
      header: "Credits",
      render: (item) => (
        <Badge variant="outline">{item.credit} credits</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Degrees"
        description="Manage degree programs and explore their modules."
        actionLabel="Add Degree"
        onAction={() => setIsCreateOpen(true)}
      />

      <DataTable
        data={degrees}
        columns={columns}
        searchKey="degreeProgram"
        searchPlaceholder="Search degrees..."
        emptyMessage="No degree programs found. Create your first degree!"
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Degree</DialogTitle>
            <DialogDescription>
              Add a new degree program to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="program">Program Name</Label>
              <Input
                id="program"
                placeholder="e.g., BSc Computer Science"
                value={formData.degreeProgram}
                onChange={(e) =>
                  setFormData({ ...formData, degreeProgram: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="100">Level 100</SelectItem>
                    <SelectItem value="200">Level 200</SelectItem>
                    <SelectItem value="300">Level 300</SelectItem>
                    <SelectItem value="400">Level 400</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="I">Semester I</SelectItem>
                    <SelectItem value="II">Semester II</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Academic Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.academicYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicYear: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Degree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Degree</DialogTitle>
            <DialogDescription>
              Update the degree program details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-program">Program Name</Label>
              <Input
                id="edit-program"
                value={formData.degreeProgram}
                onChange={(e) =>
                  setFormData({ ...formData, degreeProgram: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="100">Level 100</SelectItem>
                    <SelectItem value="200">Level 200</SelectItem>
                    <SelectItem value="300">Level 300</SelectItem>
                    <SelectItem value="400">Level 400</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-semester">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) =>
                    setFormData({ ...formData, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="I">Semester I</SelectItem>
                    <SelectItem value="II">Semester II</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-year">Academic Year</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.academicYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicYear: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Degree Explorer Dialog */}
      <Dialog open={isExplorerOpen} onOpenChange={setIsExplorerOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Degree Explorer
            </DialogTitle>
            <DialogDescription>
              View modules associated with this degree program.
            </DialogDescription>
          </DialogHeader>

          {selectedDegree && (
            <div className="space-y-6">
              {/* Degree Info Card */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Program</p>
                    <p className="font-medium">{selectedDegree.degreeProgram}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="font-medium">Level {selectedDegree.level}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Semester</p>
                    <p className="font-medium">Semester {selectedDegree.semester}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Academic Year</p>
                    <p className="font-medium">{selectedDegree.academicYear}</p>
                  </div>
                </div>
              </div>

              {/* Modules Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    Course Modules ({degreeModules.length})
                  </h4>
                </div>

                {degreeModules.length > 0 ? (
                  <DataTable
                    data={degreeModules}
                    columns={moduleColumns}
                    pageSize={5}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      No modules assigned to this degree yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExplorerOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
