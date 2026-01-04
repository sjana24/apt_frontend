import { useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { mockModules, mockDegrees } from "@/data/mockDataAdmin";
import { CourseModule } from "@/types/indexAdmin";
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminModules() {
  const [modules, setModules] = useState<CourseModule[]>(mockModules);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [formData, setFormData] = useState({
    module_name: "",
    module_code: "",
    credit: 3,
    degree: 0,
  });

  const handleCreate = () => {
    const selectedDegree = mockDegrees.find((d) => d.id === formData.degree);
    const newModule: CourseModule = {
      id: Math.max(...modules.map((m) => m.id)) + 1,
      ...formData,
      degree_details: selectedDegree
        ? { degreeProgram: selectedDegree.degreeProgram, level: selectedDegree.level }
        : undefined,
      created_at: new Date().toISOString(),
    };
    setModules([...modules, newModule]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Module created",
      description: `${newModule.module_name} has been added successfully.`,
    });
  };

  const handleEdit = () => {
    if (!selectedModule) return;
    const selectedDegree = mockDegrees.find((d) => d.id === formData.degree);
    setModules(
      modules.map((m) =>
        m.id === selectedModule.id
          ? {
              ...m,
              ...formData,
              degree_details: selectedDegree
                ? { degreeProgram: selectedDegree.degreeProgram, level: selectedDegree.level }
                : undefined,
            }
          : m
      )
    );
    setIsEditOpen(false);
    resetForm();
    toast({
      title: "Module updated",
      description: "The module has been updated successfully.",
    });
  };

  const handleDelete = (module: CourseModule) => {
    setModules(modules.filter((m) => m.id !== module.id));
    toast({
      title: "Module deleted",
      description: `${module.module_name} has been removed.`,
      variant: "destructive",
    });
  };

  const openEdit = (module: CourseModule) => {
    setSelectedModule(module);
    setFormData({
      module_name: module.module_name,
      module_code: module.module_code,
      credit: module.credit,
      degree: module.degree,
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      module_name: "",
      module_code: "",
      credit: 3,
      degree: 0,
    });
    setSelectedModule(null);
  };

  const columns: Column<CourseModule>[] = [
    { key: "module_code", header: "Code" },
    { key: "module_name", header: "Module Name" },
    {
      key: "credit",
      header: "Credits",
      render: (item) => <Badge variant="outline">{item.credit} credits</Badge>,
    },
    {
      key: "degree_details.degreeProgram",
      header: "Degree Program",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.degree_details?.degreeProgram || "N/A"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (item) => format(new Date(item.created_at), "MMM d, yyyy"),
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
        title="Course Modules"
        description="Manage course modules across all degree programs."
        actionLabel="Add Module"
        onAction={() => setIsCreateOpen(true)}
      />

      <DataTable
        data={modules}
        columns={columns}
        searchKey="module_name"
        searchPlaceholder="Search modules..."
        emptyMessage="No modules found. Create your first module!"
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
            <DialogTitle>{isEditOpen ? "Edit Module" : "Create New Module"}</DialogTitle>
            <DialogDescription>
              {isEditOpen ? "Update the module details." : "Add a new course module to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                placeholder="e.g., Database Systems"
                value={formData.module_name}
                onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Module Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., CS301"
                  value={formData.module_code}
                  onChange={(e) => setFormData({ ...formData, module_code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credit">Credits</Label>
                <Input
                  id="credit"
                  type="number"
                  min={1}
                  max={6}
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="degree">Degree Program</Label>
              <Select
                value={formData.degree ? String(formData.degree) : ""}
                onValueChange={(value) => setFormData({ ...formData, degree: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree program" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockDegrees.map((degree) => (
                    <SelectItem key={degree.id} value={String(degree.id)}>
                      {degree.degreeProgram} (Level {degree.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isEditOpen ? "Save Changes" : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
