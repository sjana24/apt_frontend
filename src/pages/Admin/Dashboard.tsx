import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Users, FlaskConical } from "lucide-react";
import { StatsCard } from "@/components/adminComponents/dashboard/StatsCard";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { Degree } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import degreeService from "@/services/admin/degree.service";
import moduleService from "@/services/admin/courseModules.service";
import staffService from "@/services/admin/staff.service";
import labService from "@/services/admin/lab.service";
import { toast } from "@/hooks/use-toast";

const recentDegreesColumns: Column<Degree>[] = [
  { key: "degreeProgram", header: "Program" },
  { key: "level", header: "Level", render: (item) => <Badge variant="secondary">Level {item.level}</Badge> },
  { key: "semester", header: "Semester" },
  { key: "academicYear", header: "Academic Year" },
];

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDegrees: 0,
    totalModules: 0,
    totalStaff: 0,
    totalLabs: 0,
  });
  const [recentDegrees, setRecentDegrees] = useState<Degree[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [degrees, modules, staff, labs] = await Promise.all([
          degreeService.getAllDegrees(),
          moduleService.getAllModules(),
          staffService.getAllStaff(),
          labService.getAllLabs(),
        ]);

        setStats({
          totalDegrees: degrees.length,
          totalModules: modules.length,
          totalStaff: staff.filter((s: any) => s.is_active).length, // Assuming staff object has is_active
          totalLabs: labs.length,
        });

        // Use the last 5 degrees as "recent" (assuming API returns them in some order, or we slice)
        // If API returns oldest first, we might want to reverse. For now, just slice.
        // If we want true "recent", we might need to sort by ID or date if available.
        // Assuming higher ID = newer
        const sortedDegrees = [...degrees].sort((a, b) => b.id - a.id);
        setRecentDegrees(sortedDegrees.slice(0, 5));

      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        toast({
          title: "Error loading dashboard",
          description: "Could not fetch dashboard statistics.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton type="stats" count={4} />
        <div className="space-y-4">
          <LoadingSkeleton type="table" count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your academic system."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Degrees"
          value={stats.totalDegrees}
          icon={GraduationCap}
          description="Active degree programs"
        // trend={{ value: 12, isPositive: true }} // Removed static trend
        />
        <StatsCard
          title="Course Modules"
          value={stats.totalModules}
          icon={BookOpen}
          description="Across all programs"
        // trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Staff"
          value={stats.totalStaff}
          icon={Users}
          description="Teaching personnel"
        // trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Labs"
          value={stats.totalLabs}
          icon={FlaskConical}
          description="Available facilities"
        />
      </div>

      {/* Recent Degrees */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Degree Programs</h2>
        </div>
        <DataTable
          data={recentDegrees}
          columns={recentDegreesColumns}
          pageSize={5}
          emptyMessage="No recent degrees found."
        />
      </div>
    </div>
  );
}
