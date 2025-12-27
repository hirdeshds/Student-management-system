import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/shared/DataTable';
import { StudentForm } from '@/components/students/StudentForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import {
  Student,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  CreateStudentData,
} from '@/api/studentApi';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateStudentData) => {
    try {
      setActionLoading(true);
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, data);
        toast.success('Student updated successfully');
      } else {
        await addStudent(data);
        toast.success('Student added successfully');
      }
      setFormOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error(selectedStudent ? 'Failed to update student' : 'Failed to add student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    try {
      setActionLoading(true);
      await deleteStudent(selectedStudent.id);
      toast.success('Student deleted successfully');
      setDeleteDialogOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row: Student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: (row: Student) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: (row: Student) => (
        <span className="text-sm text-muted-foreground">
          {row.address || '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: () => (
        <Badge variant="secondary" className="bg-success/10 text-success border-0">
          Active
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Student) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditStudent(row);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <MainLayout title="Students" subtitle="Manage student records">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Total: <span className="font-medium text-foreground">{students.length}</span> students
            </p>
          </div>
          <Button onClick={handleAddStudent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          emptyMessage="No students found. Add your first student!"
        />
      </div>

      {/* Student Form Dialog */}
      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Student"
        description={`Are you sure you want to delete "${selectedStudent?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        loading={actionLoading}
      />
    </MainLayout>
  );
}
