import api from './api';

export interface Student {
  student_id: Key;
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStudentData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/api/students');
  return response.data;
};

export const getStudentById = async (id: number): Promise<Student> => {
  const response = await api.get(`/api/students/${id}`);
  return response.data;
};

export const addStudent = async (data: CreateStudentData): Promise<Student> => {
  const response = await api.post('/api/students', data);
  return response.data;
};

export const updateStudent = async (id: number, data: UpdateStudentData): Promise<Student> => {
  const response = await api.put(`/api/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/api/students/${id}`);
};
