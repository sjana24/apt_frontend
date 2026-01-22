import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
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
import { Pencil, Trash2, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import labService from "@/services/admin/lab.service";

export  function AdminLabs() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    capacity: 10,
  });

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      try {
        const data = await labService.getAllLabs();
        setLabs(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load labs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // =========================
  // CREATE
  // =========================
  const handleCreate = async () => {
    try {
      const response = await labService.createLab(formData);
      setLabs((prev) => [...prev, response]);
      toast({
        title: "Lab created",
        description: `${response.name} has been added successfully.`,
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create lab",
        variant: "destructive",
      });
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = async () => {
    if (!selectedLab) return;
    try {
      const response = await labService.updateLab(selectedLab.id, formData);
      setLabs((prev) => prev.map((l) => (l.id === response.id ? response : l)));
      toast({ title: "Lab updated", description: "The lab details were saved." });
      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update lab", variant: "destructive" });
    }
  };

  // =========================
  // TOGGLE AVAILABILITY (THE NEW FIX)
  // =========================
  const handleAvailability = async (lab: Lab) => {
    // Toggle between 0 and 1
    const newStatus = lab.availability ? 0 : 1;
    
    try {
      // We send the partial update to the backend
      // Using spreading ensures we don't lose other fields
      const response = await labService.updateLab(lab.id, {
        ...lab,
        availability: newStatus
      });

      setLabs((prev) =>
        prev.map((l) => (l.id === response.id ? response : l))
      );

      toast({
        title: "Status Changed",
        description: `${lab.name} is now ${newStatus ? "Open" : "Closed"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not change lab status",
        variant: "destructive",
      });
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (lab: Lab) => {
    try {
      await labService.deleteLab(lab.id);
      setLabs((prev) => prev.filter((l) => l.id !== lab.id));
      toast({
        title: "Lab deleted",
        description: `${lab.name} has been removed.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete lab", variant: "destructive" });
    }
  };

  // =========================
  // HELPERS
  // =========================
  const openEdit = (lab: Lab) => {
    setSelectedLab(lab);
    setFormData({ name: lab.name, capacity: lab.capacity });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", capacity: 30 });
    setSelectedLab(null);
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: Column<Lab>[] = [
    { key: "name", header: "Lab Name" },
    {
      key: "capacity",
      header: "Capacity",
      render: (item) => <Badge variant="outline">{item.capacity} seats</Badge>,
    },
    {
      key: "availability",
      header: "Status",
      render: (item) => (
        <Badge className={item.availability ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
          {item.availability ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          {/* TOGGLE BUTTON */}
          <Button
            className={`w-24 gap-1 ${item.availability ? "hover:bg-red-50 text-red-600 border-red-200" : "hover:bg-green-50 text-green-600 border-green-200"}`}
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAvailability(item);
            }}
          >
            <Power className="h-3 w-3" />
            {item.availability ? "Close Lab" : "Open Lab"}
          </Button>

          {/* EDIT BUTTON */}
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(item); }}>
            <Pencil className="h-4 w-4" />
          </Button>

          {/* DELETE BUTTON */}
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
        emptyMessage="No labs found."
      />

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
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Lab Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); resetForm(); }}>
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