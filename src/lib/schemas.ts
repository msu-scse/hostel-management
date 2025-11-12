import { z } from 'zod';

// Student Registration Schema
export const studentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  enrollmentNumber: z.string().trim().min(1, 'Enrollment number is required'),
  course: z.string().trim().min(1, 'Course is required'),
  year: z.number().int().min(1, 'Year must be at least 1').max(5, 'Year must be at most 5'),
  guardianName: z.string().trim().min(2, 'Guardian name must be at least 2 characters'),
  guardianPhone: z.string().trim().regex(/^[0-9]{10}$/, 'Guardian phone must be 10 digits'),
  address: z.string().trim().min(10, 'Address must be at least 10 characters').max(500, 'Address must be less than 500 characters'),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// Room Schema
export const roomSchema = z.object({
  number: z.string().trim().min(1, 'Room number is required').max(20, 'Room number must be less than 20 characters'),
  floor: z.number().int().min(0, 'Floor must be at least 0').max(20, 'Floor must be at most 20'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(10, 'Capacity must be at most 10'),
  type: z.enum(['single', 'double', 'triple', 'quad'], { required_error: 'Room type is required' }),
  hostel: z.string().trim().min(1, 'Hostel is required'),
});

export type RoomFormData = z.infer<typeof roomSchema>;

// Room Assignment Schema
export const roomAssignmentSchema = z.object({
  studentId: z.string().trim().min(1, 'Student is required'),
  roomId: z.string().trim().min(1, 'Room is required'),
});

export type RoomAssignmentFormData = z.infer<typeof roomAssignmentSchema>;

// Complaint Schema
export const complaintSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(['maintenance', 'cleanliness', 'food', 'security', 'other'], { required_error: 'Category is required' }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], { required_error: 'Priority is required' }),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;

// Leave Request Schema
export const leaveRequestSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().trim().min(10, 'Reason must be at least 10 characters').max(500, 'Reason must be less than 500 characters'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;
