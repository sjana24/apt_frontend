import { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { Lab } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Filter,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  Users,
  Search,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, parseISO, compareDesc } from "date-fns";
import labService from "@/services/admin/lab.service";
import { TimeTableSlotLabStaff } from "@/components/TimeTableSlotLabStaff";
import { getWeekRange } from "@/middleware/getWeek";

// Sort options type
type SortOption = "latest" | "oldest" | "name_asc" | "name_desc" | "capacity_asc" | "capacity_desc";

export function StaffLabs() {
  // State declarations
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  // const [pendingDe, setPendingDegree] = useState<Degree | null>(null);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  // Filter and sort states
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([1, 100]);
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    capacity: 30,
  });

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      try {
        const data = await labService.getAllLabsStaff();

        // Sort by updated_at (newest first) initially
        const sortedData = [...data].sort((a, b) =>
          compareDesc(parseISO(a.updated_at), parseISO(b.updated_at))
        );

        setLabs(sortedData);
        setFilteredLabs(sortedData);

        // Calculate capacity range from data
        if (sortedData.length > 0) {
          const capacities = sortedData.map(lab => lab.capacity);
          const minCapacity = Math.min(...capacities);
          const maxCapacity = Math.max(...capacities);
          setCapacityRange([minCapacity, maxCapacity]);
        }

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

  const handleDateConfirm = (date: string) => {
    console.log("Selected Date:", date);

    setSelectedDate(date);
    // Convert string → Date
    const selected = new Date(date);

    // Get Monday & Friday
    const weekRange = getWeekRange(selected);

    if (weekRange) {
      console.log("Week Start (Monday):", weekRange.monday);
      console.log("Week End (Friday):", weekRange.friday);
      // console.log("Week End (Friday):",pendingDegree.id);
    }

    // if (pendingDegree) {
    //     // openExplorer(pendingDegree); // existing function
    // }
  };

  // =========================
  // FILTER AND SORT - Memoized
  // =========================
  useEffect(() => {
    let result = [...labs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lab =>
        lab.name.toLowerCase().includes(query)
      );
    }

    // Apply capacity filter
    if (selectedCapacity !== null) {
      result = result.filter(lab => lab.capacity === selectedCapacity);
    } else {
      // Apply capacity range filter
      result = result.filter(lab =>
        lab.capacity >= capacityRange[0] &&
        lab.capacity <= capacityRange[1]
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return compareDesc(parseISO(a.updated_at), parseISO(b.updated_at));
        case "oldest":
          return compareDesc(parseISO(b.updated_at), parseISO(a.updated_at));
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "capacity_asc":
          return a.capacity - b.capacity;
        case "capacity_desc":
          return b.capacity - a.capacity;
        default:
          return compareDesc(parseISO(a.updated_at), parseISO(b.updated_at));
      }
    });

    setFilteredLabs(result);
  }, [labs, searchQuery, selectedCapacity, capacityRange, sortBy]);

  // =========================
  // EXTRACT UNIQUE CAPACITIES - Memoized
  // =========================
  const uniqueCapacities = useMemo(() => {
    const capacities = Array.from(new Set(labs.map(lab => lab.capacity)));
    return capacities.sort((a, b) => a - b);
  }, [labs]);



  // =========================
  // FILTER HANDLERS
  // =========================
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCapacity(null);
    setCapacityRange([1, 100]);
    setSortBy("latest");
  }, []);

  const openEdit = useCallback((lab: Lab) => {
    setSelectedLab(lab);
    setFormData({
      name: lab.name,
      capacity: lab.capacity,
    });
    setIsEditOpen(true);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      capacity: 30,
    });
    setSelectedLab(null);
  }, []);

  const handleRowClick = (lab: Lab) => {
    console.log("Row Clicked Data:", lab); // Print to console
    // openExplorer(degree); // Open the explorer popup
    setSelectedLab(lab);
    setIsDateDialogOpen(true);

  };


  // =========================
  // TABLE COLUMNS
  // =========================
  const columns: Column<Lab>[] = useMemo(() => [
    {
      key: "lab_code",
      header: "Lab Code",
      render: (item) => (
        <div>
          <div className="font-medium">{item.lab_code}</div>
          <div className="text-xs text-muted-foreground">
          </div>
        </div>
      )
    },
    {
      key: "name",
      header: "Lab Name",
      render: (item) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">
          </div>
        </div>
      )
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (item) => (
        <Badge variant="secondary">
          {item.capacity} seats
        </Badge>
      ),
    },
    {
      key: "updated_at",
      header: "Last Updated",
      render: (item) => (
        <div className="text-sm text-muted-foreground">
          {format(parseISO(item.updated_at), "MMM d, yyyy")}
        </div>
      ),
    },

  ], [openEdit]);

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
          disabled={!searchQuery && selectedCapacity === null && capacityRange[0] === 1 && capacityRange[1] === 100}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {/* Capacity Range Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Capacity Range: {capacityRange[0]} - {capacityRange[1]} seats
          </Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Min</span>
              <Input
                type="range"
                min={1}
                max={500}
                value={capacityRange[0]}
                onChange={(e) => setCapacityRange([parseInt(e.target.value), capacityRange[1]])}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground">Max</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={500}
                value={capacityRange[0]}
                onChange={(e) => setCapacityRange([parseInt(e.target.value) || 1, capacityRange[1]])}
                className="w-24"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                min={1}
                max={500}
                value={capacityRange[1]}
                onChange={(e) => setCapacityRange([capacityRange[0], parseInt(e.target.value) || 100])}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">seats</span>
            </div>
          </div>
        </div>

        {/* Quick Capacity Filter */}
        {uniqueCapacities.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Capacity Filter</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCapacity === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCapacity(null)}
              >
                All
              </Button>
              {uniqueCapacities.slice(0, 8).map(capacity => (
                <Button
                  key={capacity}
                  variant={selectedCapacity === capacity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCapacity(capacity)}
                >
                  {capacity} seats
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search labs by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
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
                        sortBy === "capacity_asc" ? "Low Capacity" : "High Capacity"}
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
                checked={sortBy === "capacity_asc"}
                onCheckedChange={() => setSortBy("capacity_asc")}
              >
                Capacity (Low to High)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "capacity_desc"}
                onCheckedChange={() => setSortBy("capacity_desc")}
              >
                Capacity (High to Low)
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
            {(searchQuery || selectedCapacity !== null || capacityRange[0] > 1 || capacityRange[1] < 100) && (
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
      {(searchQuery || selectedCapacity !== null || capacityRange[0] > 1 || capacityRange[1] < 100) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCapacity !== null && (
            <Badge variant="secondary">
              Capacity: {selectedCapacity} seats
              <button
                onClick={() => setSelectedCapacity(null)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {(capacityRange[0] > 1 || capacityRange[1] < 100) && selectedCapacity === null && (
            <Badge variant="secondary">
              Range: {capacityRange[0]} - {capacityRange[1]} seats
              <button
                onClick={() => setCapacityRange([1, 100])}
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
            <p className="mt-2 text-sm text-muted-foreground">Loading laboratories...</p>
          </div>
        </div>
      ) : (
        <>
          <DataTable
            data={filteredLabs}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search within filtered results..."
            emptyMessage="No laboratories match your filters. Try adjusting your search or filters."
            onRowClick={handleRowClick}
          />

          {/* Stats */}
          {labs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Labs</div>
                <div className="text-2xl font-bold mt-1">{labs.length}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Available Labs</div>
                <div className="text-2xl font-bold mt-1">
                  {labs.filter(lab => lab.availability).length}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Capacity</div>
                <div className="text-2xl font-bold mt-1">
                  {labs.reduce((sum, lab) => sum + lab.capacity, 0)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium text-muted-foreground">Showing</div>
                <div className="text-2xl font-bold mt-1">
                  {filteredLabs.length}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <TimeTableSlotLabStaff
        lab={selectedLab}
        open={isDateDialogOpen}
        onClose={() => setIsDateDialogOpen(false)}
        onConfirm={handleDateConfirm}
      />
    </div>
  );
}