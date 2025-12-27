import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Course, CreateCourseData, UpdateCourseData, addCourse, updateCourse } from '@/api/courseApi';
import { Loader2 } from 'lucide-react';

const courseSchema = z.object({
  name: z.string().min(2, 'Course name must be at least 2 characters'),
  description: z.string().optional(),
  credits: z.coerce.number().min(1).max(10).optional(),
  instructor: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess?: () => void; // optional callback after success
}

export function CourseForm({ open, onOpenChange, course, onSuccess }: CourseFormProps) {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      description: '',
      credits: undefined,
      instructor: '',
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      form.reset({
        name: course.name || '',
        description: course.description || '',
        credits: course.credits,
        instructor: course.instructor || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        credits: undefined,
        instructor: '',
      });
    }
  }, [course, form]);

  const handleSubmit = async (data: CourseFormData) => {
    // Frontend validation: ensure name is not empty
    if (!data.name.trim()) {
      alert('Course name is required');
      return;
    }

    setLoading(true);

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      credits: data.credits === undefined ? undefined : data.credits,
      instructor: data.instructor?.trim() || undefined,
    };

    console.log('Submitting payload:', payload); // debug payload

    try {
      if (course) {
        const updateData: UpdateCourseData = payload;
        await updateCourse(course.id, updateData);
        alert('Course updated successfully!');
      } else {
        const createData: CreateCourseData = payload;
        await addCourse(createData);
        alert('Course added successfully!');
      }

      form.reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      console.error('API Error:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Introduction to Computer Science" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Course description..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} max={10} placeholder="3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Dr. Smith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {course ? 'Update' : 'Add'} Course
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
