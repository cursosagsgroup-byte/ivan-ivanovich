import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, Mail, User as UserIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import StudentSearch from '@/components/dashboard/StudentSearch';

const STUDENTS_PER_PAGE = 50;

async function getStudents(page: number = 1, search?: string) {
    try {
        const skip = (page - 1) * STUDENTS_PER_PAGE;

        if (search && search.trim()) {
            // Use raw SQL for SQLite case-insensitive search
            const searchTerm = `%${search.trim()}%`;

            const students = await prisma.$queryRaw<any[]>`
                SELECT 
                    u.*,
                    (SELECT COUNT(*) FROM Enrollment WHERE userId = u.id) as enrollmentCount
                FROM User u
                WHERE u.role = 'STUDENT' 
                AND (u.name LIKE ${searchTerm} COLLATE NOCASE OR u.email LIKE ${searchTerm} COLLATE NOCASE)
                ORDER BY u.createdAt DESC
                LIMIT ${STUDENTS_PER_PAGE} OFFSET ${skip}
            `;

            const totalCountResult = await prisma.$queryRaw<[{ count: number }]>`
                SELECT COUNT(*) as count
                FROM User u
                WHERE u.role = 'STUDENT' 
                AND (u.name LIKE ${searchTerm} COLLATE NOCASE OR u.email LIKE ${searchTerm} COLLATE NOCASE)
            `;

            const totalCount = Number(totalCountResult[0].count);

            // Format students to match expected structure
            const formattedStudents = students.map((student: any) => ({
                ...student,
                _count: {
                    enrollments: Number(student.enrollmentCount)
                }
            }));

            return { students: formattedStudents, totalCount };
        } else {
            // No search - use regular Prisma query
            const [students, totalCount] = await Promise.all([
                prisma.user.findMany({
                    where: {
                        role: 'STUDENT'
                    },
                    include: {
                        _count: {
                            select: { enrollments: true }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: STUDENTS_PER_PAGE
                }),
                prisma.user.count({
                    where: {
                        role: 'STUDENT'
                    }
                })
            ]);

            return { students, totalCount };
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        return { students: [], totalCount: 0 };
    }
}

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    // Authorization check - only admins can access
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/admin/dashboard');
    }

    // Await searchParams in Next.js 15+
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const searchTerm = params.search || '';
    const { students, totalCount } = await getStudents(currentPage, searchTerm);
    const totalPages = Math.ceil(totalCount / STUDENTS_PER_PAGE);

    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * STUDENTS_PER_PAGE, totalCount);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Estudiantes</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {searchTerm ? (
                            <>Resultados de búsqueda: {totalCount} estudiante{totalCount !== 1 ? 's' : ''}</>
                        ) : (
                            <>Mostrando {startIndex} - {endIndex} de {totalCount} estudiantes</>
                        )}
                    </p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[400px]">
                    <StudentSearch />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Contacto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Cursos
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Fecha Registro
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Ver</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                                    No se encontraron estudiantes.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center">
                                                {student.image ? (
                                                    <img className="h-10 w-10 rounded-full" src={student.image} alt="" />
                                                ) : (
                                                    <UserIcon className="h-6 w-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{student.name || 'Sin nombre'}</div>
                                                <div className="text-sm text-slate-500">ID: ...{student.id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-slate-400" />
                                            {student.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {student._count.enrollments} {student._count.enrollments === 1 ? 'Curso' : 'Cursos'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {format(new Date(student.createdAt), 'dd MMM, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/students/${student.id}`}
                                            className="text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border bg-white px-4 py-3 sm:px-6 rounded-xl">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Link
                            href={`/admin/students?page=${currentPage - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === 1
                                ? 'pointer-events-none bg-slate-100 text-slate-400'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                                }`}
                        >
                            Anterior
                        </Link>
                        <Link
                            href={`/admin/students?page=${currentPage + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                            className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === totalPages
                                ? 'pointer-events-none bg-slate-100 text-slate-400'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                                }`}
                        >
                            Siguiente
                        </Link>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Mostrando <span className="font-medium">{startIndex}</span> a{' '}
                                <span className="font-medium">{endIndex}</span> de{' '}
                                <span className="font-medium">{totalCount}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <Link
                                    href={`/admin/students?page=${currentPage - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                        }`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </Link>

                                {/* Page numbers */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/admin/students?page=${pageNum}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum
                                                ? 'z-10 bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                                : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}

                                <Link
                                    href={`/admin/students?page=${currentPage + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                                        }`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
