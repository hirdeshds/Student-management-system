import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/shared/DataTable';
import { EnrollmentForm } from '@/components/enrollments/EnrollmentForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, User, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  Enrollment,
  getEnrollments,
  addEnrollment,
  deleteEnrollment,
  CreateEnrollmentData,
} from '@/api/enrollmentApi';
import { Student, getStudents } from '@/api/studentApi';
import { Course, getCourses } from '@/api/courseApi';
import { format } from 'date-fns';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getCourses(),
      ]);
      setEnrollments(enrollmentsData);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddEnrollment = () => {
    setFormOpen(true);
  };

  const handleDeleteClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateEnrollmentData) => {
    try {
      setActionLoading(true);
      await addEnrollment(data);
      toast.success('Student enrolled successfully');
      setFormOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to enroll student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEnrollment) return;
    try {
      setActionLoading(true);
      await deleteEnrollment(selectedEnrollment.id);
      toast.success('Enrollment removed successfully');
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to remove enrollment');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to find student/course by ID
  const getStudentName = (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentEmail = (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    return student?.email || '';
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.name || 'Unknown Course';
  };

  const getCourseCredits = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.credits || 0;
  };

  const columns = [
    {
      header: 'Student',
      accessor: (row: Enrollment) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
            {getStudentName(row.student_id).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">
              {row.student?.name || getStudentName(row.student_id)}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.student?.email || getStudentEmail(row.student_id)}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Course',
      accessor: (row: Enrollment) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {row.course?.name || getCourseName(row.course_id)}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.course?.credits || getCourseCredits(row.course_id)} Credits
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Enrolled Date',
      accessor: (row: Enrollment) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {row.enrollment_date
              ? format(new Date(row.enrollment_date), 'MMM dd, yyyy')
              : row.created_at
              ? format(new Date(row.created_at), 'MMM dd, yyyy')
              : '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: () => (
        <Badge variant="secondary" className="bg-success/10 text-success border-0">
          Enrolled
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Enrollment) => (
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
      ),
      className: 'w-16',
    },
  ];

  return (
    <MainLayout title="Enrollments" subtitle="Manage student course enrollments">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Total: <span className="font-medium text-foreground">{enrollments.length}</span> enrollments
            </p>
          </div>
          <Button onClick={handleAddEnrollment} disabled={students.length === 0 || courses.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            New Enrollment
          </Button>
        </div>

        {/* Warning if no students or courses */}
        {(students.length === 0 || courses.length === 0) && !loading && (
          <div className="rounded-lg border border-warning/50 bg-warning/10 p-4">
            <p className="text-sm text-warning-foreground">
              {students.length === 0 && courses.length === 0
                ? 'Please add students and courses before creating enrollments.'
                : students.length === 0
                ? 'Please add students before creating enrollments.'
                : 'Please add courses before creating enrollments.'}
            </p>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={enrollments}
          loading={loading}
          emptyMessage="No enrollments found. Enroll students in courses!"
        />
      </div>

      {/* Enrollment Form Dialog */}
      <EnrollmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        students={students}
        courses={courses}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove Enrollment"
        description="Are you sure you want to remove this enrollment? The student will be unenrolled from the course."
        confirmText="Remove"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        loading={actionLoading}
      />
    </MainLayout>
  );
}
