
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    let email = 'Sergioberro24@gmail.com';
    console.log(`🔍 Investigating User: ${email}`);

    // Try exact match first
    let user = await prisma.user.findUnique({
        where: { email },
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
            certificates: true,
            lessonProgress: true
        }
    });

    if (!user) {
        console.log(`❌ User not found with ${email}. Trying lowercase...`);
        email = email.toLowerCase();
        user = await prisma.user.findUnique({
            where: { email },
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
                certificates: true,
                lessonProgress: true
            }
        });
    }

    if (!user) {
        console.log(`❌ User still not found. Searching by name like 'Sergio'...`);
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: 'sergio', mode: 'insensitive' } },
                    { name: { contains: 'Sergio', mode: 'insensitive' } }
                ]
            },
            take: 5
        });

        if (users.length > 0) {
            console.log(`Found potential matches:`);
            users.forEach(u => console.log(` - ${u.name} (${u.email})`));
            return;
        } else {
            console.log('❌ No users found matching Sergio.');
            return;
        }
    }

    console.log(`✅ User Found: ${user.name} (${user.id})`);

    console.log('\n--- Enrollments ---');
    for (const enrollment of user.enrollments) {
        console.log(`\n📚 Course: ${enrollment.course.title} (ID: ${enrollment.courseId})`);
        console.log(`   Enrolled At: ${enrollment.enrolledAt}`);

        // Calculate progress
        const totalLessons = enrollment.course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

        // Count completed lessons that belong to this course
        const completedLessons = user.lessonProgress.filter(p =>
            p.lessonId &&
            enrollment.course.modules.some(m => m.lessons.some(l => l.id === p.lessonId)) &&
            p.completed
        ).length;

        console.log(`   Progress: ${completedLessons}/${totalLessons}`);

        const cert = user.certificates.find(c => c.courseId === enrollment.courseId);
        if (cert) {
            console.log(`   ✅ Certificate Exists: ${cert.id}`);
            console.log(`      URL: ${cert.certificateUrl}`);
        } else {
            console.log(`   ❌ No Certificate Found`);
        }
    }

}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
