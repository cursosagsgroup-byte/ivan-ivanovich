
import { PrismaClient } from '@prisma/client';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const prisma = new PrismaClient();

async function main() {
    const courseId = 'cml1dc7d60000piral5rrf0to';
    console.log(`🔍 Searching for course with ID: "${courseId}"...`);

    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                topics: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        if (course) {
            console.log('✅ Course found in DB!');
            console.log(`ID: ${course.id}`);
            console.log(`Title: ${course.title}`);
        } else {
            console.log('❌ Course NOT found in database!');
        }

    } catch (e: any) {
        console.error('Error querying:', e.message);
        if (e.code) console.error('Error code:', e.code);
        if (e.meta) console.error('Error meta:', e.meta);
        console.error('Stack:', e.stack);
    } finally {
        await prisma.$disconnect();
    }
}

main();
