import { z } from "zod";

export const degreeSchema = z.object({
    degreeProgram: z.string().min(2, "Program name is required"),
    level: z.string().min(1, "Level is required"),
    semester: z.string().min(1, "Semester is required"),
    academicYear: z.number().int().min(2020, "Invalid year").max(2100, "Invalid year"),
});

export const labSchema = z.object({
    name: z.string().min(2, "Lab name is required"),
    lab_code: z.string().optional(),
    capacity: z.number().int().min(1, "Capacity must be at least 1").max(500, "Capacity too large"),
});

export const moduleSchema = z.object({
    module_code: z.string().min(2, "Module code is required"),
    module_name: z.string().min(2, "Module name is required"),
    credit: z.number().int().min(1, "Credit must be at least 1").max(10, "Credit too large"),
    degree: z.number().int().min(1, "Please select a degree"),
});

export const staffSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().optional(),
    department: z.string().optional(),
    is_active: z.boolean().default(true),
});

export const assignmentSchema = z.object({
    staff: z.number().int().min(1, "Please select a staff member"),
    module: z.number().int().min(1, "Please select a module"),
});

export const timetableFilterSchema = z.object({
    degree: z.number().int().min(1, "Please select a degree"),
    level: z.string().min(1, "Level is required"),
    semester: z.string().min(1, "Semester is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
});

export type DegreeInput = z.infer<typeof degreeSchema>;
export type LabInput = z.infer<typeof labSchema>;
export type ModuleInput = z.infer<typeof moduleSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type TimetableFilterInput = z.infer<typeof timetableFilterSchema>;
