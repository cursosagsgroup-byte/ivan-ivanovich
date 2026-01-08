import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BookOpen, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';

import { prisma } from '@/lib/prisma';
import SalesAnalytics from '@/components/dashboard/SalesAnalytics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const session = await getServerSession(authOptions);
  // Admin Dashboard Logic
  // Admin Dashboard Logic
  // Check if user is admin
  if (session?.user?.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  // 1. Basic Counts
  const courseCount = await prisma.course.count();
  const registeredUserCount = await prisma.user.count({ where: { role: 'STUDENT' } });

  // 2. Real Enrollment Data
  const activeEnrollmentCount = await prisma.enrollment.count();
  const graduateCount = await prisma.enrollment.count({ where: { progress: 100 } });

  // 3. Earnings
  const earningsResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: 'completed' }
  });
  const totalEarnings = earningsResult._sum.total || 0;

  // 4. Breakdown by Language (via Course Titles)
  const coursesWithCounts = await prisma.course.findMany({
    include: { _count: { select: { enrollments: true } } }
  });

  let spanishCount = 0;
  let englishCount = 0;

  coursesWithCounts.forEach(c => {
    const t = c.title.toLowerCase();
    if (t.includes('protection') && !t.includes('protección')) {
      englishCount += c._count.enrollments;
    } else {
      spanishCount += c._count.enrollments;
    }
  });


  // Recent Enrollments (as Activity)
  const recentEnrollments = await prisma.enrollment.findMany({
    take: 10,
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

  const salesDataRaw = await prisma.orderItem.findMany({
    // ... existing sales query logic if relevant, keeping basic ...
    take: 50, // Limit just in case
    where: { order: { status: 'completed' } }, // Simplified for brevity in this view if needed, but keeping original logic best
    include: { course: true, order: true },
    orderBy: { order: { createdAt: 'desc' } }
  });

  // Re-implementing specific sales logic from original file to avoid breaking
  // Actually, I should just replace the stats section and keep everything else if possible.
  // But replacer requires contiguous block.
  // I will just reconstruct the sales part briefly or use the original lines if I can match them.
  // The original sales logic was specific (last 30 days). I'll preserve it.

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: 'completed',
        createdAt: { gte: thirtyDaysAgo }
      }
    },
    include: {
      course: { select: { title: true } },
      order: { select: { createdAt: true } }
    },
    orderBy: { order: { createdAt: 'asc' } }
  });

  const salesData = salesItems.map(item => ({
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
          href="/admin/courses/create"
          className="rounded-md bg-[#B70126] px-4 py-2 text-sm font-medium text-white hover:bg-red-800 transition-colors"
        >
          Crear Nuevo Curso
        </Link>
      </div>

      {/* Main Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Usuarios Registrados"
          value={registeredUserCount.toString()}
          icon={Users}
          trend="Total en Base de Datos"
          trendUp={true}
        />
        <StatsCard
          title="Inscripciones Activas"
          value={activeEnrollmentCount.toString()}
          icon={BookOpen} // Reusing BookOpen for active enrollments
          trend="Estudiantes Reales"
          trendUp={true}
        />
        <StatsCard
          title="Graduados"
          value={graduateCount.toString()}
          icon={Users} // Maybe distinct icon would be better but reusing for now
          trend="Cursos Completados"
          trendUp={true}
        />
        <StatsCard
          title="Ganancias Totales"
          value={`$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="Total Historico"
          trendUp={true}
        />
      </div>

      {/* Language Breakdown Row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Estudiantes en Español</h3>
            <span className="text-2xl">🇪🇸</span>
          </div>
          <div className="text-2xl font-bold">{spanishCount}</div>
          <p className="text-xs text-muted-foreground">Cursos en Español</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Estudiantes en Inglés</h3>
            <span className="text-2xl">🇺🇸</span>
          </div>
          <div className="text-2xl font-bold">{englishCount}</div>
          <p className="text-xs text-muted-foreground">Cursos en Inglés</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={activities} />
        <SalesAnalytics data={salesData} courses={allCourses} />
      </div>
    </div>
  );
}
