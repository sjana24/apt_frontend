import { Degree } from "@/types/indexAdmin";

export interface TimetableSlot {
    id: number;
    degree_name: string;
    module_name: string;
    module_code: string;
    lab_name: string;
    lab_code: string;
    created_by_name: string;
    slot_date: string;
    day_of_week: number;
    time_range: string;
    note: string;
    degree: number;
    module: number;
    lab: number;
    staff_list: StaffMember[];
}
export interface StaffMember {
    staff_id: number;
    staff_name: string;
    role: string | null;      // Role is null in your data, but usually a string
    assigned_at: string;      // ISO Date string
}


export interface GridCell {
    slot: TimetableSlot | null;
    displayText: string;
}

export interface TimetableRow {
    time: string;
    monday: GridCell;
    tuesday: GridCell;
    wednesday: GridCell;
    thursday: GridCell;
    friday: GridCell;
}

export interface SelectDateDialogProps {
    open: boolean;
    onClose: () => void;
    degree: Degree | null;
    onConfirm: (date: string) => void;
}

// New export interface for creating timetable slots
export interface CreateTimetableSlotData {
    degree: number;
    module: number;
    lab: number;
    slot_date: string;
    day_of_week: number;
    time_range: string;
    note: string;
}

// Filter options type
export interface FilterOptions {
  roles: string[];
  degrees: number[];
  levels: string[];
  semesters: string[];
  minCredits: number;
  maxCredits: number;
}

export interface StaffModuleAssignment {
  id: number;
  role: string | null;
  assigned_at: string;
  updated_at?: string; // Add this if your API returns it
  module_details: {
    id: number;
    module_name: string;
    module_code: string;
    credit: number;
    degree_details: {
      id: number;
      degreeProgram: string;
      level: string;
      semester: string;
      academicYear: number;
    };
  };
  staff_id: number;
  staff_name: string;
}