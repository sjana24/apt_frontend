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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Power, Filter, Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import labService from "@/services/admin/lab.service";

export function AdminLabs() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lab_code: "",
    capacity: 10,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      try {
        const data = await labService.getAllLabs();
        setLabs(data);
        setFilteredLabs(data); // Initialize filtered data
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

  // Apply filters whenever filters or labs change
  useEffect(() => {
    let result = labs;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(lab =>
        lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.lab_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.capacity.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const statusValue = statusFilter === "available" ? true : false;
      result = result.filter(lab => lab.availability === statusValue);
    }

    // Apply capacity filter
    if (capacityFilter !== "all") {
      switch (capacityFilter) {
        case "small":
          result = result.filter(lab => lab.capacity <= 20);
          break;
        case "medium":
          result = result.filter(lab => lab.capacity > 20 && lab.capacity <= 40);
          break;
        case "large":
          result = result.filter(lab => lab.capacity > 40);
          break;
        case "custom":
          // Custom range filter - you can expand this as needed
          result = result.filter(lab => lab.capacity >= 30);
          break;
      }
    }

    setFilteredLabs(result);
  }, [labs, searchTerm, statusFilter, capacityFilter]);

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
  // TOGGLE AVAILABILITY
  // =========================
  const handleAvailability = async (lab: Lab) => {
    // Toggle between 0 and 1
    const newStatus = lab.availability ? 0 : 1;

    try {
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
    setFormData({ name: lab.name, lab_code: lab.lab_code || "", capacity: lab.capacity });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", lab_code: "", capacity: 30 });
    setSelectedLab(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCapacityFilter("all");
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: Column<Lab>[] = [
    { key: "lab_code", header: "Lab Code" },
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

      {/* Filter and Search Section */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={!searchTerm && statusFilter === "all" && capacityFilter === "all"}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search labs by name, code, or capacity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="text-xs h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity-filter" className="text-xs">Capacity</Label>
            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger id="capacity-filter" className="text-xs h-9">
                <SelectValue placeholder="All Capacities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Capacities</SelectItem>
                <SelectItem value="small">Small (≤ 20 seats)</SelectItem>
                <SelectItem value="medium">Medium (21-40 seats)</SelectItem>
                <SelectItem value="large">Large (41+ seats)</SelectItem>
                <SelectItem value="custom">30+ seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            Showing {filteredLabs.length} of {labs.length} labs
          </span>
          {(searchTerm || statusFilter !== "all" || capacityFilter !== "all") && (
            <span className="text-blue-600 font-medium">
              Filters applied
            </span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredLabs}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search labs..."
        emptyMessage="No labs found."
      // loading={loading}
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
              <Label htmlFor="lab_code">Lab Code</Label>
              <Input
                id="lab_code"
                value={formData.lab_code}
                onChange={(e) => setFormData({ ...formData, lab_code: e.target.value })}
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