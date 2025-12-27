import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/shared/DataTable';
import { CourseForm } from '@/components/courses/CourseForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, User, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import {
  Course,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  CreateCourseData,
} from '@/api/courseApi';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateCourseData) => {
    try {
      setActionLoading(true);
      if (selectedCourse) {
        await updateCourse(selectedCourse.id, data);
        toast.success('Course updated successfully');
      } else {
        await addCourse(data);
        toast.success('Course added successfully');
      }
      setFormOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error(selectedCourse ? 'Failed to update course' : 'Failed to add course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return;
    try {
      setActionLoading(true);
      await deleteCourse(selectedCourse.id);
      toast.success('Course deleted successfully');
      setDeleteDialogOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Course',
      accessor: (row: Course) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {row.description || 'No description'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Instructor',
      accessor: (row: Course) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.instructor || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Credits',
      accessor: (row: Course) => (
        <Badge variant="outline" className="font-mono">
          {row.credits || 0} Credits
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: () => (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
          Active
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Course) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCourse(row);
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
    <MainLayout title="Courses" subtitle="Manage course catalog">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Total: <span className="font-medium text-foreground">{courses.length}</span> courses
            </p>
          </div>
          <Button onClick={handleAddCourse}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={courses}
          loading={loading}
          emptyMessage="No courses found. Add your first course!"
        />
      </div>

      {/* Course Form Dialog */}
      <CourseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        course={selectedCourse}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        loading={actionLoading}
      />
    </MainLayout>
  );
}
