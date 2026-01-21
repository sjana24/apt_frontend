// types/timetable.ts
export interface TimetableSlot {
    id: number;
    degree_name: string;
    module_name: string;
    lab_name: string;
    created_by_name: string;
    slot_date: string; // YYYY-MM-DD
    day_of_week: number; // 1-5 (Monday-Friday)
    time_range: string;
    note: string;
    created_at: string;
    updated_at: string;
    degree: number;
    module: number;
    lab: number;
    created_by: number;
}

export interface DegreeTimetableResponse {
    degree: any;
    start_date: string;
    end_date: string;
    timetable: Record<string, TimetableSlot[]>; // Key: date, Value: slots for that date
    total_slots: number;
}

export interface Lab {
    id: number;
    name: string;
    capacity: number;
    availability: boolean;
}

export interface CourseModule {
    id: number;
    module_name: string;
    module_code: string;
    credit: number;
    degree: number;
}