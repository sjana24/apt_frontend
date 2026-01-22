import { useEffect, useState, useRef } from "react";
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
import { Pencil, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

import moduleService from "@/services/admin/courseModules.service";

export  function AdminModules() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search and Dropdown States
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Degree[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  const [formData, setFormData] = useState({
    module_name: "",
    module_code: "",
    credit: 3,
    degree: 0,
    degree_name: "" // Added to track the label in the UI
  });

  // =========================
  // FETCH DATA (INITIAL)
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const moduleData = await moduleService.getAllModules();
        setModules(moduleData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load modules",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // =========================
  // SEARCH LOGIC (DEBOUNCE)
  // =========================
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0 && !formData.degree_name.includes(query)) {
        sendSearchRequest(query);
      } else if (query.length === 0) {
        setResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const sendSearchRequest = async (searchTerm: string) => {
    try {
      const data = await moduleService.fetchFilteredData(searchTerm);
      setResults(data);
      setIsDropdownOpen(data.length > 0);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // CREATE / EDIT / DELETE
  // =========================
  const handleCreate = async () => {
    try {
      const { degree_name, ...payload } = formData;
      const response = await moduleService.createModule(payload);
      setModules((prev) => [...prev, response]);
      toast({ title: "Module created", description: `${response.module_name} added successfully.` });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to create module", variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!selectedModule) return;
    try {
      const { degree_name, ...payload } = formData;
      const response = await moduleService.updateModule(selectedModule.id, payload);
      console.log(response,"dfdfdfd")
      const updatedModuleWithDetails = {
      ...response,
      degree_details: {
        degreeProgram: formData.degree_name // Use the name from our form state
      }
    };
      setModules((prev) => prev.map((m) => (m.id === response.id ? updatedModuleWithDetails : m)));
      toast({ title: "Module updated", description: "Updated successfully." });
      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update module", variant: "destructive" });
    }
  };

  const handleDelete = async (module: CourseModule) => {
    try {
      await moduleService.deleteModule(module.id);
      setModules((prev) => prev.filter((m) => m.id !== module.id));
      toast({ title: "Module deleted", variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
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
      degree_name: module.module_details?.degreeProgram || ""
    });
    setQuery(module.module_details?.degreeProgram || "");
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ module_name: "", module_code: "", credit: 3, degree: 0, degree_name: "" });
    setQuery("");
    setResults([]);
    setSelectedModule(null);
  };

  const handleSelectDegree = (degree: Degree) => {
    setFormData({ ...formData, degree: degree.id, degree_name: degree.degreeProgram });
    setQuery(degree.degreeProgram);
    setIsDropdownOpen(false);
  };

  const columns: Column<CourseModule>[] = [
    { key: "module_code", header: "Code" },
    { key: "module_name", header: "Module Name" },
    { key: "credit", header: "Credits", render: (item) => <Badge variant="outline">{item.credit} credits</Badge> },
    { key: "degree_details.degreeProgram", header: "Degree Program", render: (item) => <span className="text-muted-foreground">{item.module_details?.degreeProgram || "N/A"}</span> },
    // { key: "created_at", header: "Created", render: (item) => format(new Date(item.created_at), "MMM d, yyyy") },
    {
      key: "actions", header: "Actions", render: (item) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(item); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Course Modules" description="Manage course modules across all degree programs." actionLabel="Add Module" onAction={() => setIsCreateOpen(true)} />

      <DataTable data={modules} columns={columns} searchKey="module_name" searchPlaceholder="Search modules..." emptyMessage="No modules found." />

      <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => { if (!open) { setIsCreateOpen(false); setIsEditOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? "Edit Module" : "Create New Module"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Module Name</Label>
              <Input value={formData.module_name} onChange={(e) => setFormData({ ...formData, module_name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Module Code</Label>
                <Input value={formData.module_code} onChange={(e) => setFormData({ ...formData, module_code: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Credits</Label>
                <Input type="number" value={formData.credit} onChange={(e) => setFormData({ ...formData, credit: parseInt(e.target.value) })} />
              </div>
            </div>

            {/* SEARCHABLE DROPDOWN FOR DEGREE */}
            <div className="grid gap-2 relative" ref={dropdownRef}>
              <Label>Degree Program</Label>
              <Input 
                placeholder="Type to search degree..." 
                value={query} 
                onChange={(e) => {
                    setQuery(e.target.value);
                    if(formData.degree !== 0) setFormData({...formData, degree: 0, degree_name: ""});
                }}
                onFocus={() => query.length > 0 && setIsDropdownOpen(true)}
              />
              
              {isDropdownOpen && (
                <div className="absolute top-[70px] left-0 w-full z-50 bg-popover border rounded-md shadow-md max-h-[200px] overflow-auto">
                  {results.map((degree) => (
                    <div 
                      key={degree.id} 
                      className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer text-sm"
                      onClick={() => handleSelectDegree(degree)}
                    >
                      <span>{degree.degreeProgram} (L{degree.level})</span>
                      {formData.degree === degree.id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  ))}
                </div>
              )}
              {formData.degree !== 0 && (
                <p className="text-[11px] text-primary font-medium">Selected: {formData.degree_name}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); resetForm(); }}>Cancel</Button>
            <Button disabled={formData.degree === 0} onClick={isEditOpen ? handleEdit : handleCreate}>
              {isEditOpen ? "Save Changes" : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}