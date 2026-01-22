import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { CourseModule, Degree } from "@/types/indexAdmin";
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

import moduleService from "@/services/admin/courseModules.service";
// import degreeService from "@/services/degreeService";

export  function StaffModules() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  const [formData, setFormData] = useState({
    module_name: "",
    module_code: "",
    credit: 3,
    degree: 0,
  });

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moduleData] = await Promise.all([
          moduleService.getAllModules(),
          // degreeService.getAllDegrees(),
        ]);

        setModules(moduleData);
        // setDegrees(degreeData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load modules or degrees",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // CREATE
  // =========================
  const handleCreate = async () => {
    try {
      const response = await moduleService.createModule(formData);

      setModules((prev) => [...prev, response]);

      toast({
        title: "Module created",
        description: `${response.module_name} has been added successfully.`,
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create module",
        variant: "destructive",
      });
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = async () => {
    if (!selectedModule) return;

    try {
      const response = await moduleService.updateModule(
        selectedModule.id,
        formData
      );

      setModules((prev) =>
        prev.map((m) => (m.id === response.id ? response : m))
      );

      toast({
        title: "Module updated",
        description: "The module has been updated successfully.",
      });

      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update module",
        variant: "destructive",
      });
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (module: CourseModule) => {
    try {
      await moduleService.deleteModule(module.id);

      setModules((prev) => prev.filter((m) => m.id !== module.id));

      toast({
        title: "Module deleted",
        description: `${module.module_name} has been removed.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete module",
        variant: "destructive",
      });
    }
  };

  // =========================
  // HELPERS
  // =========================
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

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: Column<CourseModule>[] = [
    { key: "module_code", header: "Code" },
    { key: "module_name", header: "Module Name" },
    {
      key: "credit",
      header: "Credits",
      render: (item) => (
        <Badge variant="outline">{item.credit} credits</Badge>
      ),
    },
    {
      key: "degree_details.degreeProgram",
      header: "Degree Program",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.module_details?.degreeProgram || "N/A"}
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

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Modules"
        description="Manage course modules across all degree programs."
        actionLabel="Add Module"
        onAction={() => setIsCreateOpen(true)}
      />

      {loading && (
        <p className="text-sm text-muted-foreground">Loading modules...</p>
      )}

      <DataTable
        data={modules}
        columns={columns}
        searchKey="module_name"
        searchPlaceholder="Search modules..."
        emptyMessage="No modules found. Create your first module!"
      />

      {/* CREATE / EDIT DIALOG */}
      <Dialog
        open={isCreateOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setIsEditOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit Module" : "Create New Module"}
            </DialogTitle>
            <DialogDescription>
              {isEditOpen
                ? "Update the module details."
                : "Add a new course module to the system."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Module Name</Label>
              <Input
                value={formData.module_name}
                onChange={(e) =>
                  setFormData({ ...formData, module_name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Module Code</Label>
                <Input
                  value={formData.module_code}
                  onChange={(e) =>
                    setFormData({ ...formData, module_code: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Credits</Label>
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={formData.credit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credit: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Degree Program</Label>
              <Select
                value={formData.degree ? String(formData.degree) : ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, degree: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree program" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {degrees.map((degree) => (
                    <SelectItem
                      key={degree.id}
                      value={String(degree.id)}
                    >
                      {degree.degreeProgram} (Level {degree.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setIsEditOpen(false);
                resetForm();
              }}
            >
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
