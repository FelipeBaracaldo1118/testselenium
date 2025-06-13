"use client";

import { useState } from 'react';
import { Subject } from '@/types/subject';
import { SubjectList } from '@/components/subjects/subject-list';
import { SubjectForm } from '@/components/subjects/subject-form';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSubject(null);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <SubjectList
          onCreateSubject={handleCreateSubject}
          onEditSubject={handleEditSubject}
          refreshTrigger={refreshTrigger}
        />
        
        <SubjectForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editingSubject={editingSubject}
        />
      </div>
      
      <Toaster />
    </div>
  );
}