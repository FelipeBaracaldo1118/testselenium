import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '@/types/subject';
import { generateSubjectId, sanitizeInput } from './security';

// In-memory store for subjects (in production, use a proper database)
class SubjectStore {
  private subjects: Map<string, Subject> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleSubjects: Subject[] = [
      {
        subjectId: 'SUBJ_001',
        subjectName: 'Computer Science Fundamentals',
        credits: 4,
        professor: 'Dr. Sarah Johnson',
        department: 'Computer Science',
        description: 'Introduction to programming concepts, algorithms, and data structures. Covers basic programming principles and problem-solving techniques.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        subjectId: 'SUBJ_002',
        subjectName: 'Database Systems',
        credits: 3,
        professor: 'Prof. Michael Chen',
        department: 'Computer Science',
        description: 'Comprehensive study of database design, SQL, normalization, and database management systems. Includes hands-on experience with popular databases.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        subjectId: 'SUBJ_003',
        subjectName: 'Advanced Mathematics',
        credits: 4,
        professor: 'Dr. Emily Davis',
        department: 'Mathematics',
        description: 'Advanced topics in calculus, linear algebra, and discrete mathematics. Focused on applications in computer science and engineering.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleSubjects.forEach(subject => {
      this.subjects.set(subject.subjectId, subject);
    });
  }

  // Get all subjects with optional filtering and pagination
  getAllSubjects(
    filters?: { search?: string; department?: string },
    page: number = 1,
    limit: number = 10
  ): { subjects: Subject[]; total: number } {
    let filteredSubjects = Array.from(this.subjects.values());

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredSubjects = filteredSubjects.filter(subject =>
        subject.subjectName.toLowerCase().includes(searchTerm) ||
        subject.professor.toLowerCase().includes(searchTerm) ||
        subject.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.department) {
      filteredSubjects = filteredSubjects.filter(subject =>
        subject.department.toLowerCase() === filters.department!.toLowerCase()
      );
    }

    // Sort by subject name
    filteredSubjects.sort((a, b) => a.subjectName.localeCompare(b.subjectName));

    const total = filteredSubjects.length;
    const startIndex = (page - 1) * limit;
    const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + limit);

    return { subjects: paginatedSubjects, total };
  }

  // Get subject by ID
  getSubjectById(subjectId: string): Subject | null {
    return this.subjects.get(subjectId) || null;
  }

  // Create new subject
  createSubject(data: CreateSubjectRequest): Subject {
    const subjectId = generateSubjectId();
    const now = new Date().toISOString();

    const subject: Subject = {
      subjectId,
      subjectName: sanitizeInput(data.subjectName),
      credits: data.credits,
      professor: sanitizeInput(data.professor),
      department: sanitizeInput(data.department),
      description: sanitizeInput(data.description),
      createdAt: now,
      updatedAt: now,
    };

    this.subjects.set(subjectId, subject);
    return subject;
  }

  // Update existing subject
  updateSubject(data: UpdateSubjectRequest): Subject | null {
    const existingSubject = this.subjects.get(data.subjectId);
    if (!existingSubject) {
      return null;
    }

    const updatedSubject: Subject = {
      ...existingSubject,
      subjectName: sanitizeInput(data.subjectName),
      credits: data.credits,
      professor: sanitizeInput(data.professor),
      department: sanitizeInput(data.department),
      description: sanitizeInput(data.description),
      updatedAt: new Date().toISOString(),
    };

    this.subjects.set(data.subjectId, updatedSubject);
    return updatedSubject;
  }

  // Delete subject
  deleteSubject(subjectId: string): boolean {
    return this.subjects.delete(subjectId);
  }

  // Get unique departments
  getDepartments(): string[] {
    const departments = new Set<string>();
    this.subjects.forEach(subject => departments.add(subject.department));
    return Array.from(departments).sort();
  }
}

// Export singleton instance
export const subjectStore = new SubjectStore();