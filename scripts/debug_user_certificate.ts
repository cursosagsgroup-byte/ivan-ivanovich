
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'barrera_gtz@yahoo.com.mx';
    console.log(`🔍 Debugging Dashboard Data for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            enrollments: {
                include: { course: true }
            },
            certificates: true
        }
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log(`Certificates found: ${user.certificates.length}`);
    console.log('--- Certificates ---');
    user.certificates.forEach(c => console.log(`C_ID: ${c.id}, CourseID: ${c.courseId}`));

    console.log('--- Enrollments ---');
    user.enrollments.forEach(e => {
        console.log(`Course: ${e.course.title} (ID: ${e.courseId})`);
        const cert = user.certificates.find(c => c.courseId === e.courseId);
        if (cert) {
            console.log(`✅ MATCH! Certificate ID: ${cert.id}`);
        } else {
            console.log(`❌ NO MATCH.`);
        }
    });

}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
