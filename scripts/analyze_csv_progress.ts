
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const CSV_PATH = './DATA CURSO : ESTUDIANTE/31 dic/u.csv';

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
    console.log('📊 FAST Analyzing CSV Data vs Database...');
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = fileContent.split('\n').filter(l => l.trim() !== '');
    const data = lines.slice(1).map(parseCSVLine);
    console.log(`📂 CSV Records: ${data.length}`);

    // Batch load all users and enrollments
    console.log('   Loading DB data...');
    const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
    const userMap = new Map(allUsers.map(u => [u.email.toLowerCase(), u.id]));

    const allCourses = await prisma.course.findMany({ select: { id: true, title: true } });
    const courseMap = new Map(allCourses.map(c => [c.title, c.id]));

    // Manual course alias
    if (courseMap.has("Contravigilancia Para Protección Ejecutiva")) {
        // Ensure "Counter Surveillance" maps if needed, or other variations
    }

    const allEnrollments = await prisma.enrollment.findMany({
        select: { userId: true, courseId: true, progress: true }
    });
    const enrollmentMap = new Map<string, number>(); // "${userId}_${courseId}" -> progress
    allEnrollments.forEach(e => enrollmentMap.set(`${e.userId}_${e.courseId}`, e.progress));

    console.log(`   Loaded ${allUsers.length} users, ${allCourses.length} courses, ${allEnrollments.length} enrollments.`);

    let validRows = 0;
    let missingUsers = 0;
    let missingEnrollments = 0;
    let alreadyComplete = 0;
    let notComplete = 0;
    const coursesFound = new Set<string>();

    for (const row of data) {
        if (row.length < 4) continue;
        const email = row[1]?.toLowerCase();
        const courseName = row[2];

        if (!email || !courseName) continue;

        const userId = userMap.get(email);
        const courseId = courseMap.get(courseName);

        if (!userId) {
            // console.log(`Missing User: ${email}`);
            missingUsers++;
            continue;
        }

        if (!courseId) {
            // console.log(`Missing Course: ${courseName}`);
            continue;
        }
        coursesFound.add(courseName);

        const key = `${userId}_${courseId}`;
        const progress = enrollmentMap.get(key);

        if (progress === undefined) {
            missingEnrollments++;
        } else {
            validRows++;
            if (progress === 100) {
                alreadyComplete++;
            } else {
                notComplete++;
            }
        }
    }

    console.log('\n📈 ANALYSIS REPORT:');
    console.log(`   ✅ Matched Users & Enrollments: ${validRows}`);
    console.log(`   ❌ Users NOT in DB: ${missingUsers}`);
    console.log(`   ⚠️ Enrollments NOT in DB (but user exists): ${missingEnrollments}`);
    console.log('   -----------------------------------');
    console.log(`   🟢 Already 100% Completed: ${alreadyComplete}`);
    console.log(`   🔴 Less than 100% (Candidates for auto-completion): ${notComplete}`);

    console.log('\n   Courses Identified in CSV:');
    coursesFound.forEach(c => console.log(`   - ${c}`));
}

main().catch(console.error);
