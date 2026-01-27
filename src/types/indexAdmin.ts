// Degree types
export interface Degree {
  id: number;
  degreeProgram: string;
  level: string;
  semester: string;
  academicYear: number;
}

export interface DegreeWithModules extends Degree {
  modules: CourseModule[];
}

// Course Module types
export interface CourseModule {
  id: number;
  module_name: string;
  module_code: string;
  credit: number;
  degree: number;
  staff_name: string;
  degree_details: Degree;
  created_at: string;
}

// Lab types
export interface Lab {
  id: number;
  availability: boolean;
  name: string;
  labName: string;
  lab_code: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

// Staff types
export interface Staff {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "staff";
  is_active: boolean;
  created_at: string;
}

// Staff Assignment types
export interface StaffAssignment {
  id: number;
  course_module: number;
  module_name?: string;
  staff: number;
  staff_name?: string;
  role: "Lecturer" | "Demonstrator";
}


export interface StaffModuleAssignment {
  id: number;
  role: string;
  module_details: CourseModule;
  assigned_at: string;
  staff_name: string;
}

export interface TimetableSlot {
  id: number;
  degree: number;
  degree_name?: string; // For display
  module: number;
  module_code?: string; // Added for display
  module_name?: string; // For display
  lab: number | null;
  lab_name?: string; // For display
  lab_code?: string; // Added for display
  slot_date: string;
  day_of_week: number;
  time_range: string;
  note?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
