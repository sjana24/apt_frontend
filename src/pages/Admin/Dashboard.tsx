import { GraduationCap, BookOpen, Users, FlaskConical } from "lucide-react";
import { StatsCard } from "@/components/adminComponents/dashboard/StatsCard";
import { dashboardStats, mockDegrees, mockModules } from "@/data/mockDataAdmin";
import { PageHeader } from "@/components/adminComponents/shared/PageHeader";
import { DataTable, Column } from "@/components/adminComponents/shared/DataTable";
import { Degree } from "@/types/indexAdmin";
import { Badge } from "@/components/ui/badge";

const recentDegreesColumns: Column<Degree>[] = [
  { key: "degreeProgram", header: "Program" },
  { key: "level", header: "Level", render: (item) => <Badge variant="secondary">Level {item.level}</Badge> },
  { key: "semester", header: "Semester" },
  { key: "academicYear", header: "Academic Year" },
];

export default function AdminDashboard() {
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
          value={dashboardStats.totalDegrees}
          icon={GraduationCap}
          description="Active degree programs"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Course Modules"
          value={dashboardStats.totalModules}
          icon={BookOpen}
          description="Across all programs"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Staff"
          value={dashboardStats.totalStaff}
          icon={Users}
          description="Teaching personnel"
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Labs"
          value={dashboardStats.totalLabs}
          icon={FlaskConical}
          description="Available facilities"
        />
      </div>

      {/* Recent Degrees */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Degree Programs</h2>
        <DataTable
          data={mockDegrees.slice(0, 5)}
          columns={recentDegreesColumns}
          pageSize={5}
        />
      </div>
    </div>
  );
}
