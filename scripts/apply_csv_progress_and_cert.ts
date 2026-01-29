
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const CSV_PATH = './DATA CURSO : ESTUDIANTE/31 dic/u2.csv';

// MAPPING: Course Title -> Final Quiz Title
const FINAL_QUIZZES: Record<string, string> = {
    "Team Leader en Protección Ejecutiva": "Principios operativos en los tiempos Post Covid",
    "Contravigilancia Para Protección Ejecutiva": "Contravigilancia",
    "Team Leader in Executive Protection": "Dynamic use of the security vehicle.",
    "Counter Surveillance for Executive Protection": "Counter-surveillance"
};

function parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(s => s.replace(/^"|"$/g, '').trim());
}

async function main() {
    console.log('🚀 Applying CSV Progress & Certifications...');

    // 1. Load Data
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = fileContent.split('\n').filter(l => l.trim() !== '');
    const data = lines.slice(1).map(parseCSVLine);

    // 2. Load DB Maps
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    const userMap = new Map(allUsers.map(u => [u.email.toLowerCase(), u.id]));

    const allCourses = await prisma.course.findMany({ select: { id: true, title: true } });
    const courseMap = new Map(allCourses.map(c => [c.title, c.id]));

    // Quizzes: CourseID -> QuizTitle -> QuizID
    const allQuizzes = await prisma.quiz.findMany({ include: { module: true } });
    const quizMap = new Map<string, Map<string, string>>();
    allQuizzes.forEach(q => {
        const cId = q.module.courseId;
        if (!quizMap.has(cId)) quizMap.set(cId, new Map());
        quizMap.get(cId)!.set(q.title.trim(), q.id);
    });

    let updatedQuizzes = 0;
    let certifiedUsers = 0;

    for (const row of data) {
        if (row.length < 4) continue;
        const email = row[1]?.toLowerCase();
        const courseName = row[2];
        const lastQuizTitle = row[3]?.trim();

        if (!email || !courseName || !lastQuizTitle) continue;

        const userId = userMap.get(email);
        const courseId = courseMap.get(courseName);

        if (!userId || !courseId) continue;

        // 1. Mark this specific quiz as passed
        const quizzesForCourse = quizMap.get(courseId);
        const quizId = quizzesForCourse?.get(lastQuizTitle);

        if (quizId) {
            // Check if attempt exists
            const existingAttempt = await prisma.quizAttempt.findFirst({
                where: { userId, quizId }
            });

            if (!existingAttempt) {
                await prisma.quizAttempt.create({
                    data: {
                        userId,
                        quizId,
                        score: 100, // Force full score
                        passed: true,
                        answers: JSON.stringify({ source: 'csv_migration_31dec' }),
                        attemptedAt: new Date()
                    }
                });
                updatedQuizzes++;
            } else if (!existingAttempt.passed) {
                await prisma.quizAttempt.update({
                    where: { id: existingAttempt.id },
                    data: { passed: true, score: 100 }
                });
                updatedQuizzes++;
            }
        }

        // 2. Check for Certification (Is this the Final Quiz?)
        const finalQuizTitle = FINAL_QUIZZES[courseName];

        // Strict match required to avoid "Contravigilancia" matching "Why criminals fear Contravigilancia..."
        const isFinal = finalQuizTitle && (lastQuizTitle === finalQuizTitle);


        if (isFinal) {
            // Ensure enrollment exists
            const enrollment = await prisma.enrollment.findUnique({
                where: { userId_courseId: { userId, courseId } }
            });

            if (!enrollment) {
                console.log(`   ⚠️ Creating missing enrollment for ${email} in ${courseName}`);
                await prisma.enrollment.create({
                    data: {
                        userId,
                        courseId,
                        progress: 100,
                        completedAt: new Date(),
                        enrolledAt: new Date()
                    }
                });
                certifiedUsers++;
            } else {
                if (enrollment.progress < 100) {
                    await prisma.enrollment.update({
                        where: { id: enrollment.id },
                        data: {
                            progress: 100,
                            completedAt: new Date()
                        }
                    });
                    certifiedUsers++;
                }
            }
        }
    }

    console.log('\n✅ UPDATE COMPLETE');
    console.log(`   quizzes_marked_passed: ${updatedQuizzes}`);
    console.log(`   users_certified_complete: ${certifiedUsers}`);
}

main().catch(console.error);
