import { useEffect, useState } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
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
import { Pencil, Trash2, Eye, ChevronRight, Filter, Search, X, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import degreeService from "@/services/admin/degree.service";
import moduleService from "@/services/admin/courseModules.service";

export function AdminDegrees() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [filteredDegrees, setFilteredDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<CourseModule[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [academicYearFilter, setAcademicYearFilter] = useState<string>("all");

  // Dialog states
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

  // Get unique values for filters
  const uniqueLevels = Array.from(new Set(degrees.map(d => d.level)));
  const uniqueSemesters = Array.from(new Set(degrees.map(d => d.semester)));
  const uniqueAcademicYears = Array.from(new Set(degrees.map(d => d.academicYear.toString()))).sort((a, b) => parseInt(b) - parseInt(a));

  useEffect(() => {
    const fetchDegrees = async () => {
      setLoading(true);
      try {
        const data = await degreeService.getAllDegrees();
        setDegrees(data);
        setFilteredDegrees(data); // Initialize filtered data
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch degrees",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDegrees();
  }, []);

  // Fetch modules when explorer opens (or pre-fetch if optimizing)
  useEffect(() => {
    if (isExplorerOpen) {
      const fetchModules = async () => {
        try {
          // Ideally this should filter by degree ID on the server side
          const data = await moduleService.getAllModules();
          setModules(data);
        } catch (error: any) {
          console.error("Error fetching modules", error);
        }
      };
      fetchModules();
    }
  }, [isExplorerOpen]);


  // Apply filters whenever filters or degrees change
  useEffect(() => {
    let result = degrees;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(degree =>
        degree.degreeProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.academicYear.toString().includes(searchTerm)
      );
    }

    // Apply level filter
    if (levelFilter !== "all") {
      result = result.filter(degree => degree.level === levelFilter);
    }

    // Apply semester filter
    if (semesterFilter !== "all") {
      result = result.filter(degree => degree.semester === semesterFilter);
    }

    // Apply academic year filter
    if (academicYearFilter !== "all") {
      result = result.filter(degree => degree.academicYear.toString() === academicYearFilter);
    }

    setFilteredDegrees(result);
  }, [degrees, searchTerm, levelFilter, semesterFilter, academicYearFilter]);

  // Get modules for selected degree
  const degreeModules = selectedDegree
    ? modules.filter((m) => m.degree === selectedDegree.id)
    : [];

  const handleCreate = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      const response = await degreeService.createDegree(formData);
      setDegrees((prev) => [...prev, response]);
      toast({
        title: "Degree created",
        description: `${response.degreeProgram} added successfully.`,
      });
      setIsCreateOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create degree",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedDegree?.id) return;
    try {
      const response = await degreeService.updateDegree(
        selectedDegree.id,
        formData
      );
      setDegrees((prev) =>
        prev.map((d) => (d.id === response.id ? response : d))
      );
      toast({
        title: "Degree updated",
        description: `${response.degreeProgram} updated successfully.`,
      });
      setIsEditOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update degree",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (degree: Degree) => {
    try {
      await degreeService.deleteDegree(degree.id);
      setDegrees((prev) => prev.filter((d) => d.id !== degree.id));
      toast({
        title: "Degree deleted",
        description: `${degree.degreeProgram} has been removed.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete degree",
        variant: "destructive",
      });
    }
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

  const resetFilters = () => {
    setSearchTerm("");
    setLevelFilter("all");
    setSemesterFilter("all");
    setAcademicYearFilter("all");
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
            type="button"
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
            disabled={!searchTerm && levelFilter === "all" && semesterFilter === "all" && academicYearFilter === "all"}
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
            placeholder="Search degrees by program, level, semester, or year..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level-filter" className="text-xs">Level</Label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger id="level-filter" className="text-xs h-9">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {uniqueLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester-filter" className="text-xs">Semester</Label>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger id="semester-filter" className="text-xs h-9">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {uniqueSemesters.map(semester => (
                  <SelectItem key={semester} value={semester}>
                    Semester {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-filter" className="text-xs">Academic Year</Label>
            <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
              <SelectTrigger id="year-filter" className="text-xs h-9">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueAcademicYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            Showing {filteredDegrees.length} of {degrees.length} degree programs
          </span>
          {(searchTerm || levelFilter !== "all" || semesterFilter !== "all" || academicYearFilter !== "all") && (
            <span className="text-blue-600 font-medium">
              Filters applied
            </span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredDegrees}
        columns={columns}
        searchKey="degreeProgram"
        searchPlaceholder="Search degrees..."
        emptyMessage="No degree programs found. Create your first degree!"
      // loading={loading}
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
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
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
            <Button type="button" onClick={handleCreate}>Create Degree</Button>
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
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
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
            <Button type="button" onClick={handleEdit}>Save Changes</Button>
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
            <Button type="button" variant="outline" onClick={() => setIsExplorerOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}