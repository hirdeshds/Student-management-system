import api from './api';
import { Student } from './studentApi';
import { Course } from './courseApi';

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_date?: string;
  student?: Student;
  course?: Course;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEnrollmentData {
  student_id: number;
  course_id: number;
}

export const getEnrollments = async (): Promise<Enrollment[]> => {
  const response = await api.get('/api/enrollments');
  return response.data;
};

export const getEnrollmentById = async (id: number): Promise<Enrollment> => {
  const response = await api.get(`/api/enrollments/${id}`);
  return response.data;
};

export const addEnrollment = async (data: CreateEnrollmentData): Promise<Enrollment> => {
  const response = await api.post('/api/enrollments', data);
  return response.data;
};

export const deleteEnrollment = async (id: number): Promise<void> => {
  await api.delete(`/api/enrollments/${id}`);
};
