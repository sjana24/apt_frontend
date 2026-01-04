import { useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { mockLabs } from "@/data/mockDataAdmin";
import { Lab } from "@/types/indexAdmin";
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminLabs() {
  const [labs, setLabs] = useState<Lab[]>(mockLabs);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: 30,
  });

  const handleCreate = () => {
    const newLab: Lab = {
      id: Math.max(...labs.map((l) => l.id), 0) + 1,
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLabs([...labs, newLab]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Lab created",
      description: `${newLab.name} has been added successfully.`,
    });
  };

  const handleEdit = () => {
    if (!selectedLab) return;
    setLabs(
      labs.map((l) =>
        l.id === selectedLab.id
          ? { ...l, ...formData, updated_at: new Date().toISOString() }
          : l
      )
    );
    setIsEditOpen(false);
    resetForm();
    toast({
      title: "Lab updated",
      description: "The lab has been updated successfully.",
    });
  };

  const handleDelete = (lab: Lab) => {
    setLabs(labs.filter((l) => l.id !== lab.id));
    toast({
      title: "Lab deleted",
      description: `${lab.name} has been removed.`,
      variant: "destructive",
    });
  };

  const openEdit = (lab: Lab) => {
    setSelectedLab(lab);
    setFormData({
      name: lab.name,
      capacity: lab.capacity,
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      capacity: 30,
    });
    setSelectedLab(null);
  };

  const columns: Column<Lab>[] = [
    { key: "name", header: "Lab Name" },
    {
      key: "capacity",
      header: "Capacity",
      render: (item) => <Badge variant="secondary">{item.capacity} seats</Badge>,
    },
    {
      key: "created_at",
      header: "Created",
      render: (item) => format(new Date(item.created_at), "MMM d, yyyy"),
    },
    {
      key: "updated_at",
      header: "Updated",
      render: (item) => format(new Date(item.updated_at), "MMM d, yyyy"),
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
        title="Labs"
        description="Manage laboratory facilities and their capacities."
        actionLabel="Add Lab"
        onAction={() => setIsCreateOpen(true)}
      />

      <DataTable
        data={labs}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search labs..."
        emptyMessage="No labs found. Add your first lab!"
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
            <DialogTitle>{isEditOpen ? "Edit Lab" : "Create New Lab"}</DialogTitle>
            <DialogDescription>
              {isEditOpen ? "Update the lab details." : "Add a new laboratory to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Lab Name</Label>
              <Input
                id="name"
                placeholder="e.g., Computer Lab A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
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
              {isEditOpen ? "Save Changes" : "Create Lab"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
