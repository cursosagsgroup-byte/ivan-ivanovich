import Link from 'next/link';
import { Plus, MoreVertical, Edit, Trash, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function CoursesPage() {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { enrollments: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
                <Link
                    href="/admin/courses/create"
                    className="flex items-center rounded-md bg-[#B70126] px-4 py-2 text-sm font-medium text-white hover:bg-red-800 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">No courses</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating a new course.</p>
                    <div className="mt-6">
                        <Link
                            href="/admin/courses/create"
                            className="inline-flex items-center rounded-md bg-[#B70126] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            New Course
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.map((course) => (
                        <div key={course.id} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md flex flex-col">
                            <div className="aspect-video w-full bg-slate-200 relative">
                                {course.image ? (
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                        <BookOpen className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-medium text-slate-900 line-clamp-2 min-h-[3.5rem]" title={course.title}>
                                        {course.title}
                                    </h3>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-bold text-slate-900">${course.price.toFixed(2)}</span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {course.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border pt-4">
                                        <span className="text-sm text-slate-500">{course._count.enrollments} Students</span>
                                        <div className="flex space-x-2">
                                            <Link href={`/admin/courses/${course.id}/edit`} className="flex items-center gap-1 p-1 text-slate-500 hover:text-[#B70126] transition-colors">
                                                <Edit className="h-4 w-4" />
                                                <span className="text-xs font-medium">Editar</span>
                                            </Link>
                                            {/* Delete functionality would require a client component or server action */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
