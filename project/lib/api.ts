import axios, { AxiosResponse, AxiosError } from 'axios';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest, PaginatedResponse, ApiResponse } from '@/types/subject';

// Configure axios instance with security settings
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor for authentication and security
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add authentication token if available
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 429) {
      // Rate limit exceeded
      throw new Error('Too many requests. Please try again later.');
    } else if (error.response?.status >= 500) {
      // Server error
      throw new Error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Subject API service
export class SubjectApi {
  // Get all subjects with optional filtering and pagination
  static async getSubjects(params?: {
    search?: string;
    department?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Subject>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Subject>>>('/api/subjects', { params });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch subjects');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }

  // Get specific subject by ID
  static async getSubject(id: string): Promise<Subject> {
    try {
      const response = await api.get<ApiResponse<Subject>>(`/api/subjects/${id}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch subject');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw error;
    }
  }

  // Create new subject
  static async createSubject(data: CreateSubjectRequest): Promise<Subject> {
    try {
      const response = await api.post<ApiResponse<Subject>>('/api/subjects', data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to create subject');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  // Update existing subject
  static async updateSubject(id: string, data: CreateSubjectRequest): Promise<Subject> {
    try {
      const response = await api.put<ApiResponse<Subject>>(`/api/subjects/${id}`, data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to update subject');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  // Delete subject
  static async deleteSubject(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/api/subjects/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete subject');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }

  // Get all departments
  static async getDepartments(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/api/subjects/departments');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch departments');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }
}