import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lessonId = 'cmiluo3tk0003w2ka6jwt8fqs';

    console.log(`Deleting lesson with ID: ${lessonId}...`);

    try {
        await prisma.lesson.delete({
            where: { id: lessonId }
        });
        console.log(`✅ Lesson deleted successfully.`);
    } catch (error) {
        console.error('❌ Error deleting lesson:', error);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
