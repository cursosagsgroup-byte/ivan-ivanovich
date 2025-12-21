
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const csvFilePath = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/DATA CURSO : ESTUDIANTE/Tutor-Enrolled-Export-2025-December-19-2004 (1).csv';

async function main() {
    console.log('🚀 Starting to add missing students...');

    // 1. Fetch existing emails
    const dbUsers = await prisma.user.findMany({ select: { email: true } });
    const dbEmails = new Set(dbUsers.map(u => u.email.toLowerCase().trim()));

    // 2. Parse CSV for missing users
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = fileContent.split('\n');

    // Header check (approximate indices based on previous view_file)
    // We'll use regex to separate line by comma, handling quotes is tricky with simple split but let's try a regex for the line.
    // Or we can just search for the email in the line and then try to extract name around it?
    // The CSV structure: ..., "email", "First Name", "Last Name", ...
    // Let's use a robust regex to match the email and subsequent fields if possible, or just simple split validation.
    // Since we know the missing emails from the previous run, we can scan the lines for those specific emails to get their details.

    const missingEmails = [
        'javier.espinosa@vw.com.mx',
        'gerardo.cabello@vw.com.mx',
        'abraham.romero@vw.com.mx',
        'raulalvaradogzz01@gmail.com',
        'garcisa@vw.com.mx',
        'javier.granados1@vw.com.mx',
        'jorge.castrovw@gmail.com',
        'vttraining333@gmail.com',
        'brandontecua16@gmail.com',
        'haro08086@hotmail.com',
        'chuchoplatas@gmail.com',
        'pablo.vargas74@hotmail.com',
        'miguel.lopez2@vw.com.mx'
    ];

    const usersToAdd: { email: string, name: string }[] = [];
    const processedEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        for (const missingEmail of missingEmails) {
            if (line.includes(missingEmail) && !processedEmails.has(missingEmail)) {
                // Parsing logic:
                // Expected format part: ...,"email","First Name","Last Name",...
                // But sometimes quotes might be missing if no special chars.
                // Let's try to grab the name.
                // Simple hack: split by the email, look at the text immediately following.

                const parts = line.split(missingEmail);
                if (parts.length > 1) {
                    const afterEmail = parts[1]; // Should start with either ,or ","
                    // Example: ...,"email","Juan","Perez",...
                    // afterEmail: ","Juan","Perez",...

                    const nameParts = afterEmail.split(',');
                    // nameParts[0] might be empty if quoted?
                    // Let's try to clean up quotes.

                    let firstName = nameParts[1]?.replace(/['"]+/g, '').trim() || 'Student';
                    let lastName = nameParts[2]?.replace(/['"]+/g, '').trim() || '';

                    // Fallback if split logic fails (e.g. nested commas), just use email prefix
                    if (firstName.length > 20 || firstName.includes('/')) {
                        firstName = 'Student'; // simple fallback
                    }

                    const fullName = `${firstName} ${lastName}`.trim() || missingEmail.split('@')[0];

                    usersToAdd.push({
                        email: missingEmail,
                        name: fullName
                    });
                    processedEmails.add(missingEmail);
                }
            }
        }
    }

    console.log(`📝 Found details for ${usersToAdd.length} missing students.`);

    // 3. Add to Database
    const defaultPassword = await bcrypt.hash('IvanIvanovich123!', 10);
    let addedCount = 0;

    for (const user of usersToAdd) {
        // Double check not in DB
        if (dbEmails.has(user.email)) {
            console.log(`Skipping ${user.email} - already in DB`);
            continue;
        }

        try {
            await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name,
                    password: defaultPassword,
                    role: 'STUDENT',
                }
            });
            console.log(`✅ Added: ${user.name} (${user.email})`);
            addedCount++;
        } catch (error) {
            console.error(`❌ Error adding ${user.email}:`, error);
        }
    }

    console.log(`\n🎉 Process Complete. Added ${addedCount} new students.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
