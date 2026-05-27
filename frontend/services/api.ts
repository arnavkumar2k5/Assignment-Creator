import axios from 'axios';
import { Assignment, AssignmentFormData, ApiResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const assignmentService = {
  create: async (data: AssignmentFormData): Promise<ApiResponse<Assignment>> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('dueDate', data.dueDate);
    formData.append('instructions', data.instructions);
    formData.append('questionTypes', JSON.stringify(data.questionTypes));
    if (data.file) formData.append('file', data.file);

    const res = await api.post('/api/v1/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Assignment>> => {
    const res = await api.get(`/api/v1/assignments/${id}`);
    return res.data;
  },

  list: async (): Promise<ApiResponse<Assignment[]>> => {
    const res = await api.get('/api/v1/assignments');
    return res.data;
  },

  regenerate: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.post(`/api/v1/assignments/${id}/regenerate`);
    return res.data;
  },
};

export default api;
