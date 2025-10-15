// src/types/courses.ts
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseMeeting } from '../utilities/conflicts';

// Acceptable terms (include Summer for validation completeness)
export const TermEnum = z.enum(['Fall', 'Winter', 'Spring', 'Summer']);

// Course number: digits with optional -digits, e.g., "213" or "213-2"
const NumberPattern = /^\d+(?:-\d+)?$/;

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

export type CourseFormData = z.infer<typeof CourseSchema>;

// React Hook Form resolver
export const courseResolver = zodResolver(CourseSchema);

// Map of ID -> Course
export const CoursesByIdSchema = z.record(z.string(), CourseSchema);
export type CoursesById = z.infer<typeof CoursesByIdSchema>;

// (Optional) helpers if you want to validate objects elsewhere
export const validateCourse = (data: unknown) => CourseSchema.safeParse(data);
export const validateCoursesById = (data: unknown) =>
  CoursesByIdSchema.safeParse(data);
