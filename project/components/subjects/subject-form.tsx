"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Subject, CreateSubjectRequest } from '@/types/subject';
import { SubjectApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Form validation schema
const subjectSchema = z.object({
  subjectName: z.string()
    .min(2, 'Subject name must be at least 2 characters')
    .max(100, 'Subject name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&()]+$/, 'Subject name contains invalid characters'),
  credits: z.number()
    .min(1, 'Credits must be at least 1')
    .max(10, 'Credits must not exceed 10'),
  professor: z.string()
    .min(2, 'Professor name must be at least 2 characters')
    .max(100, 'Professor name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\-.']+$/, 'Professor name contains invalid characters'),
  department: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must not exceed 50 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingSubject?: Subject | null;
}

export function SubjectForm({ isOpen, onClose, onSuccess, editingSubject }: SubjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectName: '',
      credits: 3,
      professor: '',
      department: '',
      description: '',
    },
  });

  // Fetch departments for dropdown
  const fetchDepartments = async () => {
    try {
      const deps = await SubjectApi.getDepartments();
      setDepartments(deps);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      if (editingSubject) {
        // Populate form with existing data
        form.reset({
          subjectName: editingSubject.subjectName,
          credits: editingSubject.credits,
          professor: editingSubject.professor,
          department: editingSubject.department,
          description: editingSubject.description,
        });
      } else {
        // Reset to default values for create
        form.reset({
          subjectName: '',
          credits: 3,
          professor: '',
          department: '',
          description: '',
        });
      }
    }
  }, [isOpen, editingSubject, form]);

  // Handle form submission
  const onSubmit = async (data: SubjectFormData) => {
    try {
      setLoading(true);

      if (editingSubject) {
        // Update existing subject
        await SubjectApi.updateSubject(editingSubject.subjectId, data);
        toast.success('Subject updated successfully');
      } else {
        // Create new subject
        await SubjectApi.createSubject(data);
        toast.success('Subject created successfully');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving subject:', error);
      toast.error(error.message || 'Failed to save subject');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (loading) return; // Prevent closing while saving
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" data-testid="subject-form-dialog">
        <DialogHeader>
          <DialogTitle>
            {editingSubject ? 'Edit Subject' : 'Create New Subject'}
          </DialogTitle>
          <DialogDescription>
            {editingSubject 
              ? 'Make changes to the subject details below.'
              : 'Fill in the details to create a new subject.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject Name */}
              <FormField
                control={form.control}
                name="subjectName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Subject Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Computer Science Fundamentals"
                        {...field}
                        data-testid="subject-name-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Credits */}
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="3"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        data-testid="credits-input"
                      />
                    </FormControl>
                    <FormDescription>1-10 credits</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Professor */}
              <FormField
                control={form.control}
                name="professor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Dr. Sarah Johnson"
                        {...field}
                        data-testid="professor-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="department-select">
                          <SelectValue placeholder="Select department or type a new one" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select from existing departments or the form will accept custom input
                    </FormDescription>
                    <FormMessage />
                    {/* Custom department input fallback */}
                    {!departments.includes(field.value) && field.value && (
                      <Input
                        placeholder="Enter custom department"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the subject, including topics covered, prerequisites, and learning objectives..."
                        className="min-h-[100px]"
                        {...field}
                        data-testid="description-input"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                data-testid="save-button"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}