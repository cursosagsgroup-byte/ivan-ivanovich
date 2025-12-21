import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CourseEditorClient from '@/components/admin/CourseEditorClient';

export default async function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const { courseId } = await params;

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' }
                    },
                    quizzes: {
                        orderBy: { order: 'asc' },
                        include: {
                            questions: {
                                orderBy: { order: 'asc' }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        return <div className="text-center">Curso no encontrado</div>;
    }

    return <CourseEditorClient initialCourse={course} />;
}
