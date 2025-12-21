import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listStudents() {
    console.log('🔍 Listing student accounts...\n');

    const students = await prisma.user.findMany({
        where: {
            role: 'STUDENT'
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            enrollments: {
                include: {
                    course: {
                        select: {
                            title: true
                        }
                    }
                }
            }
        }
    });

    console.log(`Found ${students.length} student accounts:\n`);

    for (const student of students) {
        console.log(`📧 Email: ${student.email}`);
        console.log(`   Name: ${student.name || 'N/A'}`);
        console.log(`   ID: ${student.id}`);
        console.log(`   Enrolled in ${student.enrollments.length} course(s):`);
        student.enrollments.forEach(e => {
            console.log(`     - ${e.course.title}`);
        });
        console.log('');
    }

    await prisma.$disconnect();
}

listStudents().catch(console.error);
