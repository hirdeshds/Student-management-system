import api from './api';

export interface Course {
  course_name: ReactNode;
  course_id: Key;
  id: number;
  name: string;
  description?: string;
  credits?: number;
  instructor?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  credits?: number;
  instructor?: string;
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  credits?: number;
  instructor?: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get('/api/courses');
  return response.data;
};

export const getCourseById = async (id: number): Promise<Course> => {
  const response = await api.get(`/api/courses/${id}`);
  return response.data;
};

export const addCourse = async (data: CreateCourseData): Promise<Course> => {
  const response = await api.post('/api/courses', data);
  return response.data;
};

export const updateCourse = async (id: number, data: UpdateCourseData): Promise<Course> => {
  const response = await api.put(`/api/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/api/courses/${id}`);
};
