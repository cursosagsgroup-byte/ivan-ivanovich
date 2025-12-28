import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BookOpen, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';

import { prisma } from '@/lib/prisma';
import SalesAnalytics from '@/components/dashboard/SalesAnalytics';

export default async function Home() {
  const session = await getServerSession(authOptions);
  // Admin Dashboard Logic
  // Check if user is admin (though middleware should handle this)
  if (session?.user?.role !== 'ADMIN') {
    return <div>Access Denied</div>;
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
