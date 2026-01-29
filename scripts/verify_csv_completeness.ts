
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const CSV_PATH = './DATA CURSO : ESTUDIANTE/31 dic/u2.csv';

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
    console.log('🔍 Verifying Completeness of CSV Import...');

    // 1. Load Data
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = fileContent.split('\n').filter(l => l.trim() !== '');
    const data = lines.slice(1).map(parseCSVLine);
    console.log(`📂 CSV Records: ${data.length}`);

    // 2. Fetch all enrollments
    const enrollments = await prisma.enrollment.findMany({
        include: { user: true, course: true }
    });

    const enrollmentMap = new Map<string, number>(); // email_courseTitle -> progress
    enrollments.forEach(e => {
        enrollmentMap.set(`${e.user.email.toLowerCase()}_${e.course.title}`, e.progress);
    });

    let verifiedComplete = 0; // In CSV as complete, and In DB as 100
    let verifiedIncomplete = 0; // In CSV as incomplete, and In DB < 100 (Correct)
    let missingUpdate = 0; // In CSV as complete, but In DB < 100 (ERROR)
    let missingEnrollment = 0; // User/Course not found in DB

    const errors: string[] = [];

    for (const row of data) {
        if (row.length < 4) continue;
        const email = row[1]?.toLowerCase();
        const courseName = row[2];
        const lastQuizTitle = row[3]?.trim();

        if (!email || !courseName || !lastQuizTitle) continue;

        // Is this user SUPPOSED to be 100%?
        const finalQuizTitle = FINAL_QUIZZES[courseName];
        const shouldBeComplete = finalQuizTitle && (lastQuizTitle === finalQuizTitle);

        const key = `${email}_${courseName}`;
        const dbProgress = enrollmentMap.get(key);

        if (dbProgress === undefined) {
            missingEnrollment++;
            // detailed log for the first few
            if (missingEnrollment <= 5) errors.push(`Missing Enrollment: ${email} in ${courseName}`);
        } else {
            if (shouldBeComplete) {
                if (dbProgress === 100) {
                    verifiedComplete++;
                } else {
                    missingUpdate++;
                    if (missingUpdate <= 10) errors.push(`❌ FAILED UPDATE: ${email} in ${courseName} (DB: ${dbProgress}%, Expected: 100%) [Quiz: ${lastQuizTitle}]`);
                }
            } else {
                verifiedIncomplete++;
            }
        }
    }

    console.log('\n📊 COMPLETENESS REPORT:');
    console.log(`   ✅ Correctly Complete (100%): ${verifiedComplete}`);
    console.log(`   ✅ Correctly Incomplete (<100%): ${verifiedIncomplete}`);
    console.log(`   ❌ MISSING UPDATES (Should be 100% but aren't): ${missingUpdate}`);
    console.log(`   ⚠️ MISSING ENROLLMENTS (Not in DB): ${missingEnrollment}`);

    if (missingUpdate > 0 || missingEnrollment > 0) {
        console.log('\n   Sample Errors:');
        errors.forEach(e => console.log(`   ${e}`));
    } else {
        console.log('\n   🎉 ALL RECORDS MATCH EXPECTATIONS!');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
