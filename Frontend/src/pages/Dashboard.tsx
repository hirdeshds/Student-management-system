import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/shared/StatsCard';
import { Users, BookOpen, UserPlus, TrendingUp } from 'lucide-react';
import { getStudents } from '@/api/studentApi';
import { getCourses } from '@/api/courseApi';
import { getEnrollments } from '@/api/enrollmentApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, courses, enrollments] = await Promise.all([
          getStudents(),
          getCourses(),
          getEnrollments(),
        ]);
        setStats({
          students: students.length,
          courses: courses.length,
          enrollments: enrollments.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout title="Dashboard" subtitle="Welcome to EduManage">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={loading ? '...' : stats.students}
            icon={Users}
            description="Registered students"
          />
          <StatsCard
            title="Total Courses"
            value={loading ? '...' : stats.courses}
            icon={BookOpen}
            description="Available courses"
          />
          <StatsCard
            title="Enrollments"
            value={loading ? '...' : stats.enrollments}
            icon={UserPlus}
            description="Active enrollments"
          />
          <StatsCard
            title="Completion Rate"
            value="87%"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/students"
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Students</p>
                <p className="text-sm text-muted-foreground">Add or edit students</p>
              </div>
            </a>
            <a
              href="/courses"
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Courses</p>
                <p className="text-sm text-muted-foreground">Add or edit courses</p>
              </div>
            </a>
            <a
              href="/enrollments"
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <UserPlus className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Enrollments</p>
                <p className="text-sm text-muted-foreground">Manage enrollments</p>
              </div>
            </a>
          </div>
        </div>

        {/* Connection Status */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4"></h2>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">
             <code className="text-primary"></code>
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
