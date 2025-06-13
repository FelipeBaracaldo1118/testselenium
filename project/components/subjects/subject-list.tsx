"use client";

import { useState, useEffect } from 'react';
import { Subject } from '@/types/subject';
import { SubjectApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, BookOpen, User, Building } from 'lucide-react';

interface SubjectListProps {
  onEditSubject: (subject: Subject) => void;
  onCreateSubject: () => void;
  refreshTrigger: number;
}

export function SubjectList({ onEditSubject, onCreateSubject, refreshTrigger }: SubjectListProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch subjects with current filters
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        page: currentPage,
        limit: 9,
      };

      const response = await SubjectApi.getSubjects(params);
      setSubjects(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch subjects');
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments for filter
  const fetchDepartments = async () => {
    try {
      const deps = await SubjectApi.getDepartments();
      setDepartments(deps);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Handle subject deletion
  const handleDeleteSubject = async () => {
    if (!deleteSubject) return;

    try {
      setDeleting(true);
      await SubjectApi.deleteSubject(deleteSubject.subjectId);
      toast.success('Subject deleted successfully');
      setDeleteSubject(null);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to delete subject');
      console.error('Error deleting subject:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDepartment]);

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, search, selectedDepartment, refreshTrigger]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subject Management</h2>
          <p className="text-muted-foreground">Manage your course subjects and curriculum</p>
        </div>
        <Button 
          onClick={onCreateSubject}
          className="flex items-center gap-2"
          data-testid="create-subject-btn"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subjects, professors, or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="department-filter">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-20 mr-2" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
          <p className="text-muted-foreground mb-4">
            {search || selectedDepartment !== 'all'
              ? 'No subjects match your current filters.'
              : 'Get started by creating your first subject.'}
          </p>
          {!search && selectedDepartment === 'all' && (
            <Button onClick={onCreateSubject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.subjectId} className="hover:shadow-md transition-shadow" data-testid={`subject-card-${subject.subjectId}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2" data-testid="subject-name">
                      {subject.subjectName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      {subject.department}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {subject.credits} {subject.credits === 1 ? 'Credit' : 'Credits'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span data-testid="subject-professor">{subject.professor}</span>
                  </div>
                  <p className="text-sm line-clamp-3" data-testid="subject-description">
                    {subject.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditSubject(subject)}
                  className="flex items-center gap-1"
                  data-testid={`edit-subject-${subject.subjectId}`}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteSubject(subject)}
                  className="flex items-center gap-1 text-destructive hover:text-destructive"
                  data-testid={`delete-subject-${subject.subjectId}`}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            data-testid="prev-page"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            data-testid="next-page"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSubject} onOpenChange={() => setDeleteSubject(null)}>
        <AlertDialogContent data-testid="delete-confirmation-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject "
              {deleteSubject?.subjectName}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubject}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="confirm-delete"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}