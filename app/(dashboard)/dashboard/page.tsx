import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BookOpen, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { prisma } from '@/lib/prisma';
import SalesAnalytics from '@/components/dashboard/SalesAnalytics';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isStudent = session?.user?.role === 'STUDENT';

  if (isStudent && session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true
                  }
                }
              }
            }
          }
        },
        lessonProgress: {
          where: { completed: true }
        },
        certificates: true
      }
    });



    if (user) {
      const enrolledCourses = user.enrollments.map(enrollment => {
        const totalLessons = enrollment.course.modules.reduce(
          (acc, module) => acc + module.lessons.length,
          0
        );

        // Count completed lessons for this course
        const courseLessonIds = enrollment.course.modules.flatMap(m => m.lessons.map(l => l.id));
        const completedLessons = user.lessonProgress.filter(p =>
          courseLessonIds.includes(p.lessonId)
        ).length;

        // Use stored progress or calculate from lessons? 
        // Enrollment has a progress field, let's use that or syncing might be an issue.
        // But for consistency let's rely on enrollment.progress

        // Find certificate
        const cert = user.certificates.find(c => c.courseId === enrollment.course.id);

        return {
          id: enrollment.course.id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.image || '/placeholder-course.jpg',
          progress: enrollment.progress,
          totalLessons,
          completedLessons,
          completedAt: enrollment.completedAt ? enrollment.completedAt.toISOString() : null,
          certificateAvailable: enrollment.progress === 100 || !!cert,
          certificateId: cert?.id
        };
      });

      const profileData = {
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        address: user.country || '', // Mapping country to address for now as per schema limits
        birthdate: '', // Schema doesn't have birthdate
        photo: user.image || session.user.image || '/placeholder-user.jpg' // Typo in placeholder
      };

      return <StudentDashboard enrolledCourses={enrolledCourses} profileData={profileData} />;
    }
  }

  // Admin Dashboard Logic
  const courseCount = await prisma.course.count();
  const studentCount = await prisma.user.count({
    where: { role: 'STUDENT' }
  });

  const earningsResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: 'completed' }
  });
  const totalEarnings = earningsResult._sum.total || 0;

  // Recent Enrollments (as Activity)
  const recentEnrollments = await prisma.enrollment.findMany({
    take: 5,
    orderBy: { enrolledAt: 'desc' },
    include: {
      user: true,
      course: true
    }
  });

  const activities = recentEnrollments.map(enrollment => ({
    id: enrollment.id,
    user: enrollment.user.name || enrollment.user.email,
    action: 'se inscribió en',
    target: enrollment.course.title,
    time: enrollment.enrolledAt,
    type: 'enrollment' as const
  }));

  // Sales Analytics Data (Last 30 Days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesDataRaw = await prisma.orderItem.findMany({
    where: {
      order: {
        status: 'completed',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    },
    include: {
      course: {
        select: { title: true }
      },
      order: {
        select: { createdAt: true }
      }
    },
    orderBy: {
      order: { createdAt: 'asc' }
    }
  });

  const salesData = salesDataRaw.map(item => ({
    id: item.id,
    courseTitle: item.course.title,
    courseId: item.courseId,
    amount: item.price,
    date: item.order.createdAt.toISOString()
  }));

  const allCourses = await prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard General</h1>
        <Link
          href="/courses/create"
          className="rounded-md bg-[#B70126] px-4 py-2 text-sm font-medium text-white hover:bg-red-800 transition-colors"
        >
          Crear Nuevo Curso
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Cursos"
          value={courseCount.toString()}
          icon={BookOpen}
          trend=""
          trendUp={true}
        />
        <StatsCard
          title="Total Alumnos"
          value={studentCount.toString()}
          icon={Users}
          trend=""
          trendUp={true}
        />
        <StatsCard
          title="Ganancias Totales"
          value={`$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend=""
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={activities} />
        <SalesAnalytics data={salesData} courses={allCourses} />
      </div>
    </div>
  );
}
