
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const csvFilePath = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/DATA CURSO : ESTUDIANTE/Tutor-Enrolled-Export-2025-December-19-2004 (1).csv';

async function main() {
    console.log('🔄 Starting Student Comparison...');

    // 1. Extract Emails from CSV
    const csvEmails = new Set<string>();
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = fileContent.split('\n');
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const match = line.match(emailRegex);
        if (match) {
            match.forEach(email => csvEmails.add(email.toLowerCase().trim()));
        }
    }
    console.log(`📊 CSV Analysis: Found ${csvEmails.size} unique students.`);

    // 2. Fetch All User Emails from Database
    const dbUsers = await prisma.user.findMany({
        select: { email: true }
    });
    const dbEmails = new Set(dbUsers.map(u => u.email.toLowerCase().trim()));
    console.log(`📊 Database Analysis: Found ${dbEmails.size} existing users.`);

    // 3. Compare
    const missingInDb: string[] = [];
    const presentInDb: string[] = [];

    csvEmails.forEach(email => {
        if (!dbEmails.has(email)) {
            missingInDb.push(email);
        } else {
            presentInDb.push(email);
        }
    });

    console.log('\n🔎 Comparison Results:');
    console.log(`✅ Present in DB: ${presentInDb.length}`);
    console.log(`❌ Missing in DB: ${missingInDb.length}`);

    if (missingInDb.length > 0) {
        console.log('\n⚠️  List of Missing Emails (First 20):');
        console.log(missingInDb.slice(0, 20));

        // Save full missing list to a file for the user
        const missingLogPath = 'missing_students_report.txt';
        fs.writeFileSync(missingLogPath, missingInDb.join('\n'));
        console.log(`\n📄 Full list of missing students saved to: ${missingLogPath}`);
    } else {
        console.log('\n✨ Great news! All students from the CSV are already in the database.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
