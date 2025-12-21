import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Mail, Calendar, BookOpen, User as UserIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getStudentDetails(id: string) {
    try {
        const student = await prisma.user.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        course: {
                            include: {
                                modules: {
                                    include: {
                                        lessons: true,
                                        quizzes: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        enrolledAt: 'desc'
                    }
                },
                lessonProgress: {
                    where: {
                        completed: true
                    }
                },
                quizAttempts: {
                    orderBy: {
                        attemptedAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        quizAttempts: true,
                        certificates: true
                    }
                }
            }
        });

        // Calculate detailed progress for each enrollment
        if (student) {
            const enrichedEnrollments = await Promise.all(
                student.enrollments.map(async (enrollment) => {
                    const totalLessons = enrollment.course.modules.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0
                    );

                    const completedLessons = await prisma.lessonProgress.count({
                        where: {
                            userId: id,
                            completed: true,
                            lesson: {
                                module: {
                                    courseId: enrollment.courseId
                                }
                            }
                        }
                    });

                    const courseQuizAttempts = await prisma.quizAttempt.count({
                        where: {
                            userId: id,
                            quiz: {
                                module: {
                                    courseId: enrollment.courseId
                                }
                            }
                        }
                    });

                    const lastActivity = await prisma.lessonProgress.findFirst({
                        where: {
                            userId: id,
                            lesson: {
                                module: {
                                    courseId: enrollment.courseId
                                }
                            }
                        },
                        orderBy: {
                            completedAt: 'desc'
                        }
                    });

                    return {
                        ...enrollment,
                        totalLessons,
                        completedLessons,
                        courseQuizAttempts,
                        lastActivity: lastActivity?.completedAt
                    };
                })
            );

            return {
                ...student,
                enrollments: enrichedEnrollments
            };
        }

        return student;
    } catch (error) {
        console.error('Error fetching student details:', error);
        return null;
    }
}

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Authorization check - only admins can access
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const { id } = await params;
    const student = await getStudentDetails(id);

    if (!student) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/students"
                        className="flex items-center text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Estudiante no encontrado</h1>
                </div>
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                    <p className="text-slate-500">El estudiante solicitado no existe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href="/students"
                    className="flex items-center text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Detalles del Estudiante</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Student Profile Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center">
                                {student.image ? (
                                    <img className="h-24 w-24 rounded-full" src={student.image} alt="" />
                                ) : (
                                    <UserIcon className="h-12 w-12 text-slate-400" />
                                )}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-slate-900">{student.name || 'Sin nombre'}</h2>
                            <p className="text-sm text-slate-500">ID: ...{student.id.slice(-8)}</p>

                            <div className="mt-6 w-full space-y-4 text-left">
                                <div className="flex items-center text-sm text-slate-600">
                                    <Mail className="mr-3 h-4 w-4 text-slate-400" />
                                    {student.email}
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <Calendar className="mr-3 h-4 w-4 text-slate-400" />
                                    Registrado {format(new Date(student.createdAt), 'dd MMM, yyyy')}
                                </div>
                            </div>

                            <div className="mt-6 w-full pt-6 border-t border-border">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{student._count.enrollments}</p>
                                        <p className="text-xs text-slate-500">Cursos</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{student._count.quizAttempts}</p>
                                        <p className="text-xs text-slate-500">Quizzes</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{student._count.certificates}</p>
                                        <p className="text-xs text-slate-500">Certificados</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enrolled Courses */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-border bg-white shadow-sm">
                        <div className="border-b border-border px-6 py-4">
                            <h3 className="text-lg font-medium text-slate-900">Cursos Inscritos</h3>
                        </div>
                        <div className="divide-y divide-border">
                            {student.enrollments.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">
                                    Este estudiante no está inscrito en ningún curso.
                                </div>
                            ) : (
                                student.enrollments.map((enrollment: any) => (
                                    <div key={enrollment.id} className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center flex-1">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h4 className="text-sm font-medium text-slate-900">{enrollment.course.title}</h4>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <p className="text-xs text-slate-500">
                                                            Inscrito: {format(new Date(enrollment.enrolledAt), 'dd MMM, yyyy')}
                                                        </p>
                                                        {enrollment.lastActivity && (
                                                            <p className="text-xs text-slate-500">
                                                                Última actividad: {format(new Date(enrollment.lastActivity), 'dd MMM, yyyy')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-slate-900">{enrollment.progress}%</span>
                                                {enrollment.completedAt && (
                                                    <p className="text-xs text-green-600 font-medium">✓ Completado</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 mb-3">
                                            <div
                                                className={`absolute left-0 top-0 h-full transition-all ${enrollment.completedAt ? 'bg-green-500' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${enrollment.progress}%` }}
                                            />
                                        </div>

                                        {/* Detailed Stats */}
                                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-100">
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {enrollment.completedLessons}/{enrollment.totalLessons}
                                                </p>
                                                <p className="text-xs text-slate-500">Lecciones</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {enrollment.courseQuizAttempts}
                                                </p>
                                                <p className="text-xs text-slate-500">Intentos de Quiz</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {enrollment.course.modules.length}
                                                </p>
                                                <p className="text-xs text-slate-500">Módulos</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

