// src/types/courses.ts
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseMeeting } from '../utilities/conflicts';

// Acceptable terms (include Summer)
export const TermEnum = z.enum(['Fall', 'Winter', 'Spring', 'Summer']);

// Course number: digits with optional -digits, e.g., "213" or "213-2"
const NumberPattern = /^\d+(?:-\d+)?$/;

// Define the schema for a single course
export const CourseSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  term: TermEnum,
  number: z
    .string()
    .trim()
    .regex(NumberPattern, 'Must be like "213" or "213-2"'),
  // meets: "" OR parseable like "MWF 12:00-13:20" or "TuTh 14:00-15:20"
  meets: z
    .string()
    .trim()
    .refine(
      (s) => s === '' || parseMeeting(s) !== null,
      'Must contain days and start-end, e.g., MWF 12:00-13:20'
    ),
});

// ✅ Export the inferred Course type (used by components)
export type Course = z.infer<typeof CourseSchema>;

// ✅ Export form data type alias (your components import this)
export type CourseFormData = z.infer<typeof CourseSchema>;

// React Hook Form resolver for this schema
export const courseResolver = zodResolver(CourseSchema);

// Map of ID -> Course
export const CoursesByIdSchema = z.record(z.string(), CourseSchema);
export type CoursesById = z.infer<typeof CoursesByIdSchema>;

// Optional wrapper for the whole schedule (matches Firebase root)
export interface Schedule {
  title: string;
  courses: CoursesById;
}

// Optional validators if you want them elsewhere
export const validateCourse = (data: unknown) => CourseSchema.safeParse(data);
export const validateCoursesById = (data: unknown) =>
  CoursesByIdSchema.safeParse(data);
