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