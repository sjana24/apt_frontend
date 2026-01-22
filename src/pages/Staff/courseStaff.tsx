import { useEffect, useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { CourseModule, Degree } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu,DropdownMenuContent,DropdownMenuCheckboxItem,DropdownMenuTrigger,DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, Filter, ChevronDown, ArrowUpDown, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, parseISO, compareDesc } from "date-fns";
import moduleService from "@/services/admin/courseModules.service";
import { FilterOptions, StaffModuleAssignment } from "@/interfaces";

// Sort options type
type SortOption = "latest" | "oldest" | "name_asc" | "name_desc" | "code_asc" | "code_desc";

export function StaffModules() {
  // State declarations
  const [assignments, setAssignments] = useState<StaffModuleAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<StaffModuleAssignment[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<StaffModuleAssignment | null>(null);
  
  // Filter and sort states
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    roles: [],
    degrees: [],
    levels: [],
    semesters: [],
    minCredits: 1,
    maxCredits: 6,
  });
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    module_name: "",
    module_code: "",
    credit: 3,
    degree: 0,
  });

  // =========================
  // FETCH DATA - Optimized
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await moduleService.getAllModulesForSingleStaff(2);
        
        // Ensure we have an array and sort by latest first
        const data = Array.isArray(response) ? response : response?.data || [];
        
        // Sort by assigned_at (newest first) initially
        const sortedData = [...data].sort((a, b) => 
          compareDesc(parseISO(a.assigned_at), parseISO(b.assigned_at))
        );
        
        setAssignments(sortedData);
        setFilteredAssignments(sortedData);
        
        // Extract unique degrees from assignments for filter dropdown
        const uniqueDegrees = Array.from(
          new Map(
            sortedData
              .map(item => item.module_details.degree_details)
              .map(degree => [degree.id, degree])
          ).values()
        );
        
        // Transform to Degree type if needed
        const degreeOptions: Degree[] = uniqueDegrees.map(deg => ({
          id: deg.id,
          degreeProgram: deg.degreeProgram,
          level: deg.level,
          semester: deg.semester,
          academicYear: deg.academicYear,
          // Add other required Degree properties
          duration: 4, // Default
          status: "active",
        }));
        
        setDegrees(degreeOptions);
        
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load module assignments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // FILTER AND SORT - Memoized
  // =========================
  useMemo(() => {
    let result = [...assignments];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.module_details.module_name.toLowerCase().includes(query) ||
        item.module_details.module_code.toLowerCase().includes(query) ||
        item.staff_name.toLowerCase().includes(query) ||
        item.module_details.degree_details.degreeProgram.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (filterOptions.roles.length > 0) {
      result = result.filter(item =>
        item.role ? filterOptions.roles.includes(item.role) : false
      );
    }

    // Apply degree filter
    if (filterOptions.degrees.length > 0) {
      result = result.filter(item =>
        filterOptions.degrees.includes(item.module_details.degree_details.id)
      );
    }

    // Apply level filter
    if (filterOptions.levels.length > 0) {
      result = result.filter(item =>
        filterOptions.levels.includes(item.module_details.degree_details.level)
      );
    }

    // Apply semester filter
    if (filterOptions.semesters.length > 0) {
      result = result.filter(item =>
        filterOptions.semesters.includes(item.module_details.degree_details.semester)
      );
    }

    // Apply credit range filter
    result = result.filter(item =>
      item.module_details.credit >= filterOptions.minCredits &&
      item.module_details.credit <= filterOptions.maxCredits
    );

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return compareDesc(parseISO(a.assigned_at), parseISO(b.assigned_at));
        case "oldest":
          return compareDesc(parseISO(b.assigned_at), parseISO(a.assigned_at));
        case "name_asc":
          return a.module_details.module_name.localeCompare(b.module_details.module_name);
        case "name_desc":
          return b.module_details.module_name.localeCompare(a.module_details.module_name);
        case "code_asc":
          return a.module_details.module_code.localeCompare(b.module_details.module_code);
        case "code_desc":
          return b.module_details.module_code.localeCompare(a.module_details.module_code);
        default:
          return compareDesc(parseISO(a.assigned_at), parseISO(b.assigned_at));
      }
    });

    setFilteredAssignments(result);
  }, [assignments, searchQuery, filterOptions, sortBy]);

  // =========================
  // EXTRACT UNIQUE FILTER OPTIONS - Memoized
  // =========================
  const { roles, levels, semesters } = useMemo(() => {
    const uniqueRoles = Array.from(
      new Set(assignments.map(item => item.role).filter(Boolean) as string[])
    );
    
    const uniqueLevels = Array.from(
      new Set(assignments.map(item => item.module_details.degree_details.level))
    );
    
    const uniqueSemesters = Array.from(
      new Set(assignments.map(item => item.module_details.degree_details.semester))
    );
    
    return {
      roles: uniqueRoles,
      levels: uniqueLevels,
      semesters: uniqueSemesters,
    };
  }, [assignments]);

  // =========================
  // HANDLERS - useCallback optimized
  // =========================
  const handleCreate = useCallback(async () => {
    try {
      const moduleData = {
        module_name: formData.module_name,
        module_code: formData.module_code,
        credit: formData.credit,
        degree: formData.degree,
        staff_id: 2
      };

      const response = await moduleService.createModule(moduleData);

      if (response) {
        // Refresh the list to get updated data with proper sorting
        const refreshedData = await moduleService.getAllModulesForSingleStaff(2);
        const data = Array.isArray(refreshedData) ? refreshedData : refreshedData?.data || [];
        const sortedData = [...data].sort((a, b) => 
          compareDesc(parseISO(a.assigned_at), parseISO(b.assigned_at))
        );
        
        setAssignments(sortedData);
      }

      toast({
        title: "Module assigned",
        description: `${formData.module_name} has been assigned successfully.`,
      });

      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to assign module",
        variant: "destructive",
      });
    }
  }, [formData]);

  const handleEdit = useCallback(async () => {
    if (!selectedAssignment) return;

    try {
      // Update the assignment
      const updateData = {
        role: "Lecturer", // Make this dynamic from form
      };

      // Assuming you have an update service
      // const response = await moduleService.updateAssignment(selectedAssignment.id, updateData);
      
      // For now, simulate update and refresh
      const refreshedData = await moduleService.getAllModulesForSingleStaff(2);
      const data = Array.isArray(refreshedData) ? refreshedData : refreshedData?.data || [];
      const sortedData = [...data].sort((a, b) => 
        compareDesc(parseISO(a.assigned_at), parseISO(b.assigned_at))
      );
      
      setAssignments(sortedData);

      toast({
        title: "Assignment updated",
        description: "The module assignment has been updated successfully.",
      });

      setIsEditOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update assignment",
        variant: "destructive",
      });
    }
  }, [selectedAssignment]);

  const handleDelete = useCallback(async (assignment: StaffModuleAssignment) => {
    if (!confirm(`Are you sure you want to remove assignment for ${assignment.module_details.module_name}?`)) {
      return;
    }

    try {
      await moduleService.deleteModule(assignment.module_details.id);
      
      // Update state by removing the deleted item
      setAssignments(prev => {
        const updated = prev.filter(a => a.id !== assignment.id);
        return [...updated].sort((a, b) => 
          compareDesc(parseISO(a.assigned_at), parseISO(b.assigned_at))
        );
      });

      toast({
        title: "Assignment removed",
        description: `${assignment.module_details.module_name} has been unassigned.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove assignment",
        variant: "destructive",
      });
    }
  }, []);

  // =========================
  // FILTER HANDLERS
  // =========================
  const handleRoleFilterChange = useCallback((role: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  }, []);

  const handleDegreeFilterChange = useCallback((degreeId: number, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      degrees: checked 
        ? [...prev.degrees, degreeId]
        : prev.degrees.filter(id => id !== degreeId)
    }));
  }, []);

  const handleLevelFilterChange = useCallback((level: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      levels: checked 
        ? [...prev.levels, level]
        : prev.levels.filter(l => l !== level)
    }));
  }, []);

  const handleSemesterFilterChange = useCallback((semester: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      semesters: checked 
        ? [...prev.semesters, semester]
        : prev.semesters.filter(s => s !== semester)
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterOptions({
      roles: [],
      degrees: [],
      levels: [],
      semesters: [],
      minCredits: 1,
      maxCredits: 6,
    });
    setSearchQuery("");
    setSortBy("latest");
  }, []);

  // =========================
  // HELPERS
  // =========================
  const openEdit = useCallback((assignment: StaffModuleAssignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      module_name: assignment.module_details.module_name,
      module_code: assignment.module_details.module_code,
      credit: assignment.module_details.credit,
      degree: assignment.module_details.degree_details.id,
    });
    setIsEditOpen(true);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      module_name: "",
      module_code: "",
      credit: 3,
      degree: 0,
    });
    setSelectedAssignment(null);
  }, []);

  const getRoleBadgeVariant = useCallback((role: string | null) => {
    if (!role) return "secondary";
    switch(role.toLowerCase()) {
      case 'lecturer': return 'default';
      case 'coordinator': return 'destructive';
      case 'assistant': return 'outline';
      default: return 'secondary';
    }
  }, []);

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: Column<StaffModuleAssignment>[] = useMemo(() => [
    { 
      key: "module_details.module_code", 
      header: "Module Code",
      render: (item) => (
        <div className="font-mono font-semibold">
          {item.module_details.module_code}
        </div>
      )
    },
    { 
      key: "module_details.module_name", 
      header: "Module Name",
      render: (item) => (
        <div>
          <div className="font-medium">{item.module_details.module_name}</div>
          <div className="text-xs text-muted-foreground">
            Staff: {item.staff_name}
          </div>
        </div>
      )
    },
    {
      key: "credit",
      header: "Credits",
      render: (item) => (
        <Badge variant="outline" className="font-normal">
          {item.module_details.credit} credits
        </Badge>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (item) => (
        <Badge variant={getRoleBadgeVariant(item.role)}>
          {item.role || "Not assigned"}
        </Badge>
      ),
    },
    {
      key: "degree_details",
      header: "Degree Program",
      render: (item) => (
        <div className="space-y-1">
          <div className="font-medium">
            {item.module_details.degree_details.degreeProgram}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Level {item.module_details.degree_details.level}</span>
            <span>•</span>
            <span>Semester {item.module_details.degree_details.semester}</span>
          </div>
        </div>
      ),
    },
    {
      key: "assigned_at",
      header: "Assigned",
      render: (item) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(parseISO(item.assigned_at), "MMM d, yyyy")}
        </div>
      ),
    },
     ], [getRoleBadgeVariant, openEdit, handleDelete]);

  // =========================
  // FILTER COMPONENT
  // =========================
  const FilterPanel = () => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          disabled={
            !filterOptions.roles.length &&
            !filterOptions.degrees.length &&
            !filterOptions.levels.length &&
            !filterOptions.semesters.length &&
            filterOptions.minCredits === 1 &&
            filterOptions.maxCredits === 6
          }
        >
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Role Filter */}
        {roles.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Roles</Label>
            <div className="space-y-1">
              {roles.map(role => (
                <div key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${role}`}
                    checked={filterOptions.roles.includes(role)}
                    onChange={(e) => handleRoleFilterChange(role, e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`role-${role}`} className="text-sm">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Degree Filter */}
        {degrees.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Degree Programs</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {degrees.map(degree => (
                <div key={degree.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`degree-${degree.id}`}
                    checked={filterOptions.degrees.includes(degree.id)}
                    onChange={(e) => handleDegreeFilterChange(degree.id, e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`degree-${degree.id}`} className="text-sm truncate">
                    {degree.degreeProgram}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level Filter */}
        {levels.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Levels</Label>
            <div className="space-y-1">
              {levels.map(level => (
                <div key={level} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`level-${level}`}
                    checked={filterOptions.levels.includes(level)}
                    onChange={(e) => handleLevelFilterChange(level, e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`level-${level}`} className="text-sm">
                    Level {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semester Filter */}
        {semesters.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Semesters</Label>
            <div className="space-y-1">
              {semesters.map(semester => (
                <div key={semester} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`semester-${semester}`}
                    checked={filterOptions.semesters.includes(semester)}
                    onChange={(e) => handleSemesterFilterChange(semester, e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`semester-${semester}`} className="text-sm">
                    Semester {semester}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Credit Range Filter */}
      <div className="mt-4">
        <Label className="text-sm font-medium mb-2 block">Credit Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            max="6"
            value={filterOptions.minCredits}
            onChange={(e) => setFilterOptions(prev => ({
              ...prev,
              minCredits: parseInt(e.target.value) || 1
            }))}
            className="w-20"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="number"
            min="1"
            max="6"
            value={filterOptions.maxCredits}
            onChange={(e) => setFilterOptions(prev => ({
              ...prev,
              maxCredits: parseInt(e.target.value) || 6
            }))}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">credits</span>
        </div>
      </div>
    </div>
  );

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by module name, code, staff, or degree..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort: {sortBy === "latest" ? "Latest First" : 
                      sortBy === "oldest" ? "Oldest First" :
                      sortBy === "name_asc" ? "A → Z" :
                      sortBy === "name_desc" ? "Z → A" :
                      sortBy === "code_asc" ? "Code A → Z" : "Code Z → A"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={sortBy === "latest"}
                onCheckedChange={() => setSortBy("latest")}
              >
                Latest First
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "oldest"}
                onCheckedChange={() => setSortBy("oldest")}
              >
                Oldest First
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortBy === "name_asc"}
                onCheckedChange={() => setSortBy("name_asc")}
              >
                Name (A → Z)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "name_desc"}
                onCheckedChange={() => setSortBy("name_desc")}
              >
                Name (Z → A)
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortBy === "code_asc"}
                onCheckedChange={() => setSortBy("code_asc")}
              >
                Code (A → Z)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "code_desc"}
                onCheckedChange={() => setSortBy("code_desc")}
              >
                Code (Z → A)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.values(filterOptions).some(opt => 
              Array.isArray(opt) ? opt.length > 0 : 
              opt !== 1 && opt !== 6 // Check if credits are not default
            ) && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                !
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && <FilterPanel />}

      {/* Active Filters Badges */}
      {(filterOptions.roles.length > 0 || 
        filterOptions.degrees.length > 0 || 
        filterOptions.levels.length > 0 || 
        filterOptions.semesters.length > 0 ||
        filterOptions.minCredits > 1 || 
        filterOptions.maxCredits < 6) && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.roles.map(role => (
            <Badge key={role} variant="secondary">
              Role: {role}
              <button 
                onClick={() => handleRoleFilterChange(role, false)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {filterOptions.degrees.map(degreeId => {
            const degree = degrees.find(d => d.id === degreeId);
            return degree && (
              <Badge key={degreeId} variant="secondary">
                Degree: {degree.degreeProgram}
                <button 
                  onClick={() => handleDegreeFilterChange(degreeId, false)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            );
          })}
          {filterOptions.levels.map(level => (
            <Badge key={level} variant="secondary">
              Level: {level}
              <button 
                onClick={() => handleLevelFilterChange(level, false)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {filterOptions.semesters.map(semester => (
            <Badge key={semester} variant="secondary">
              Semester: {semester}
              <button 
                onClick={() => handleSemesterFilterChange(semester, false)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {(filterOptions.minCredits > 1 || filterOptions.maxCredits < 6) && (
            <Badge variant="secondary">
              Credits: {filterOptions.minCredits} - {filterOptions.maxCredits}
              <button 
                onClick={() => setFilterOptions(prev => ({
                  ...prev,
                  minCredits: 1,
                  maxCredits: 6
                }))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading assignments...</p>
          </div>
        </div>
      ) : (
        <>
          <DataTable
            data={filteredAssignments}
            columns={columns}
            searchPlaceholder="Search within filtered results..."
            emptyMessage="No module assignments match your filters. Try adjusting your search or filters."
          />

          {/* Stats */}
          {assignments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>Total: {assignments.length} assignments</div>
              <div>Filtered: {filteredAssignments.length} assignments</div>
              <div>Showing latest assignments first</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}