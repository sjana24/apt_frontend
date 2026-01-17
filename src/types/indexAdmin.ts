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
  degree_details?: {
    degreeProgram: string;
    level: string;
  };
  created_at: string;
}

// Lab types
export interface Lab {
  id: number;
  availability: boolean;
  name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

// Staff types
export interface Staff {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "lecturer" | "lab_instructor" | "assistant" | "staff" ;
  is_active: boolean;
  created_at: string;
}

// Staff Assignment types
export interface StaffAssignment {
  id: number;
  module: number;
  module_name?: string;
  staff: number;
  staff_name?: string;
  role: "Lead Lecturer" | "Assistant" | "Lab Instructor";
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
