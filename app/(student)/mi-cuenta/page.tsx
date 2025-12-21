import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

export default async function MiCuentaPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/login');
    }

    // Obtener datos del usuario con sus inscripciones
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
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
            certificates: true
        }
    });

    if (!user) {
        redirect('/login');
    }

    // Transformar los datos para el componente
    const enrolledCourses = user.enrollments.map(enrollment => {
        const totalItems = enrollment.course.modules.reduce((acc, module) => {
            return acc + module.lessons.length + module.quizzes.length;
        }, 0);

        // Find certificate
        const cert = user.certificates.find(c => c.courseId === enrollment.course.id);

        return {
            id: enrollment.course.id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.image || '/course-placeholder.jpg',
            progress: enrollment.progress,
            totalLessons: totalItems,
            completedLessons: Math.round((totalItems * enrollment.progress) / 100),
            completedAt: enrollment.completedAt?.toISOString() || null,
            certificateAvailable: enrollment.progress === 100 || !!cert,
            certificateId: cert?.id
        };
    });

    const profileData = {
        name: user.name || 'Estudiante',
        email: user.email,
        phone: '+1 234 567 8900', // TODO: Agregar campo phone al schema
        address: '123 Main St, City, Country', // TODO: Agregar campo address al schema
        birthdate: '1990-01-01', // TODO: Agregar campo birthdate al schema
        photo: user.image || '/ivan-photo.jpg'
    };

    return <StudentDashboard enrolledCourses={enrolledCourses} profileData={profileData} />;
}
