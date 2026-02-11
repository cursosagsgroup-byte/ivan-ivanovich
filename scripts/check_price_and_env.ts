
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("--- Checking Database Price ---");
    const courseId = 'cml1dc7d60000piral5rrf0to';
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (course) {
            console.log(`Course Found: ${course.title}`);
            console.log(`Current Price in DB: ${course.price}`);
            console.log(`Course ID: ${course.id}`);
        } else {
            console.log("Course NOT found!");
        }

        console.log("--- Environment Info ---");
        // Mask the password/user, show host/db
        const dbUrl = process.env.DATABASE_URL || '';
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
        console.log(`DATABASE_URL (masked): ${maskedUrl}`);

    } catch (e) {
        console.error("Error connecting to DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
