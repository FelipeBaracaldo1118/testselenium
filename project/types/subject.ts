// Subject entity type definitions
export interface Subject {
  subjectId: string;
  subjectName: string;
  credits: number;
  professor: string;
  department: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectRequest {
  subjectName: string;
  credits: number;
  professor: string;
  department: string;
  description: string;
}

export interface UpdateSubjectRequest extends CreateSubjectRequest {
  subjectId: string;
}

export interface SubjectFilters {
  search?: string;
  department?: string;
  minCredits?: number;
  maxCredits?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}