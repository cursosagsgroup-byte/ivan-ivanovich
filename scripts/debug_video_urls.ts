
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'jlsanba19@gmail.com';
    console.log(`Checking video URLs for: ${email}...`);

    const user = await prisma.user.findUnique({
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
            }
        }
    });

    if (!user) return;

    user.enrollments.forEach(e => {
        console.log(`Course: ${e.course.title}`);
        e.course.modules.forEach(m => {
            m.lessons.forEach(l => {
                if (l.videoUrl) {
                    console.log(`  - Lesson: ${l.title} | URL: ${l.videoUrl}`);
                }
            });
        });
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
