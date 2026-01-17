import { Degree, CourseModule, Lab, Staff, StaffAssignment } from "@/types";

export const mockDegrees: Degree[] = [
  { id: 1, degreeProgram: "BSc Computer Science", level: "300", semester: "I", academicYear: 2024 },
  { id: 2, degreeProgram: "BSc Information Technology", level: "200", semester: "II", academicYear: 2024 },
  { id: 3, degreeProgram: "BSc Software Engineering", level: "400", semester: "I", academicYear: 2024 },
  { id: 4, degreeProgram: "BSc Data Science", level: "100", semester: "I", academicYear: 2024 },
  { id: 5, degreeProgram: "BSc Cyber Security", level: "300", semester: "II", academicYear: 2024 },
];

export const mockModules: CourseModule[] = [
  { id: 1, module_name: "Database Systems", module_code: "CS301", credit: 3, degree: 1, degree_details: { degreeProgram: "BSc Computer Science", level: "300" }, created_at: "2024-01-15T10:00:00Z" },
  { id: 2, module_name: "Web Development", module_code: "CS302", credit: 3, degree: 1, degree_details: { degreeProgram: "BSc Computer Science", level: "300" }, created_at: "2024-01-15T10:00:00Z" },
  { id: 3, module_name: "Algorithms", module_code: "CS303", credit: 4, degree: 1, degree_details: { degreeProgram: "BSc Computer Science", level: "300" }, created_at: "2024-01-16T10:00:00Z" },
  { id: 4, module_name: "Network Fundamentals", module_code: "IT201", credit: 3, degree: 2, degree_details: { degreeProgram: "BSc Information Technology", level: "200" }, created_at: "2024-01-17T10:00:00Z" },
  { id: 5, module_name: "Software Architecture", module_code: "SE401", credit: 4, degree: 3, degree_details: { degreeProgram: "BSc Software Engineering", level: "400" }, created_at: "2024-01-18T10:00:00Z" },
  { id: 6, module_name: "Machine Learning", module_code: "DS101", credit: 3, degree: 4, degree_details: { degreeProgram: "BSc Data Science", level: "100" }, created_at: "2024-01-19T10:00:00Z" },
];

export const mockLabs: Lab[] = [
  { id: 1, name: "Computer Lab A", capacity: 40, created_at: "2024-01-01T10:00:00Z", updated_at: "2024-01-01T10:00:00Z" },
  { id: 2, name: "Network Lab", capacity: 25, created_at: "2024-01-02T10:00:00Z", updated_at: "2024-01-02T10:00:00Z" },
  { id: 3, name: "Security Lab", capacity: 20, created_at: "2024-01-03T10:00:00Z", updated_at: "2024-01-03T10:00:00Z" },
];

export const mockStaff: Staff[] = [
  { id: 1, email: "john.smith@university.edu", full_name: "Dr. John Smith", role: "admin", is_active: true, created_at: "2023-01-01T10:00:00Z" },
  { id: 2, email: "jane.doe@university.edu", full_name: "Prof. Jane Doe", role: "lecturer", is_active: true, created_at: "2023-02-15T10:00:00Z" },
  { id: 3, email: "mike.johnson@university.edu", full_name: "Mike Johnson", role: "lab_instructor", is_active: true, created_at: "2023-03-20T10:00:00Z" },
  { id: 4, email: "sarah.williams@university.edu", full_name: "Sarah Williams", role: "assistant", is_active: true, created_at: "2023-04-10T10:00:00Z" },
  { id: 5, email: "david.brown@university.edu", full_name: "Dr. David Brown", role: "lecturer", is_active: false, created_at: "2023-05-05T10:00:00Z" },
];

export const mockAssignments: StaffAssignment[] = [
  { id: 1, module: 1, module_name: "Database Systems", staff: 2, staff_name: "Prof. Jane Doe", role: "Lead Lecturer" },
  { id: 2, module: 1, module_name: "Database Systems", staff: 3, staff_name: "Mike Johnson", role: "Lab Instructor" },
  { id: 3, module: 2, module_name: "Web Development", staff: 2, staff_name: "Prof. Jane Doe", role: "Lead Lecturer" },
  { id: 4, module: 3, module_name: "Algorithms", staff: 5, staff_name: "Dr. David Brown", role: "Lead Lecturer" },
];

// Dashboard stats
export const dashboardStats = {
  totalDegrees: mockDegrees.length,
  totalModules: mockModules.length,
  totalStaff: mockStaff.filter(s => s.is_active).length,
  totalLabs: mockLabs.length,
};
