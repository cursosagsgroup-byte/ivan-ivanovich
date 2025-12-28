
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_PATH = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/DATA CURSO : ESTUDIANTE/Tutor-Enrolled-Export-2025-December-19-2004 (1).csv';

// Map Legacy Slugs/IDs to New CUIDs
const COURSE_MAPPING: Record<string, string> = {
    // Team Leader en Protección Ejecutiva (Español)
    'team-leader-en-proteccion-ejecutiva': 'cmio13v7r000064w1fs838sgw',
    '883': 'cmio13v7r000064w1fs838sgw',

    // Contravigilancia Para Protección Ejecutiva (Español)  
    'contravigilancia-para-proteccion-ejecutiva': 'cmio13v7u000164w1bhkqj8ej',
    '884': 'cmio13v7u000164w1bhkqj8ej',

    // Team Leader in Executive Protection (English)
    'team-leader-in-executive-protection': 'cmiq7oga203zikveg3jbf8p8u',
    '9917': 'cmiq7oga203zikveg3jbf8p8u',

    // Counter Surveillance for Executive Protection (English)
    'counter-surveillance-for-executive-protection': 'cmiq7oga703zjkvegaq8v1ir4',
    '11496': 'cmiq7oga703zjkvegaq8v1ir4',

    // Additional legacy IDs (if they correspond to one of the above courses)
    '868': 'cmio13v7r000064w1fs838sgw', // Assuming this is Team Leader
    '17283': 'cmiq7oga703zjkvegaq8v1ir4', // Assuming this is Counter Surveillance
    '1843': 'cmio13v7u000164w1bhkqj8ej', // Assuming this is Contravigilancia
};

async function main() {
    console.log('--- STARTING CSV DATA IMPORT ---');

    if (!fs.existsSync(CSV_PATH)) {
        console.error(`File not found at: ${CSV_PATH}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(`Found ${records.length} records in CSV.`);

    let success = 0;
    let skipped = 0;
    let errors = 0;
    let userNotFound = 0;
    let unknownCourse = 0;

    // Cache user lookups to speed up
    const knownEmails = new Set();

    // Pre-fetch all student emails
    const allStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        select: { email: true }
    });
    const dbEmails = new Set(allStudents.map(u => u.email.toLowerCase()));

    let processedCount = 0;

    for (const row of records) {
        processedCount++;
        if (processedCount % 50 === 0) {
            console.log(`Processing ${processedCount}/${records.length} | New: ${success} | Skipped: ${skipped} | Errors: ${errors}`);
        }

        const email = row['Author Email']?.toLowerCase().trim();
        const parentSlug = row['Parent Slug'];
        const parentId = row['Parent'];
        const status = row['Status'];
        const dateStr = row['Post Modified Date']; // e.g. 2021-06-09

        if (status !== 'completed') continue; // Only import completed enrollments? Or pending too?

        // Determine target course ID
        let courseId = COURSE_MAPPING[parentSlug] || COURSE_MAPPING[parentId];

        // Fallback logic if needed or log unknown
        if (!courseId) {
            // console.log(`Unknown course mapping: ID ${parentId}, Slug ${parentSlug}`);
            unknownCourse++;
            continue;
        }

        // Check if user exists in DB
        if (!dbEmails.has(email)) {
            // console.log(`User not found in DB: ${email}`);
            userNotFound++;
            continue;
        }

        // Check if enrollment exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) continue; // Should be covered by set check but good for safety

        try {
            const existing = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                }
            });

            if (!existing) {
                await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId,
                        enrolledAt: new Date(dateStr) || new Date(),
                        progress: 0, // Default to 0, or we could assume 100 if "completed" in CSV? 
                        // But "completed" in CSV might just mean "purchase completed".
                    }
                });
                success++;
                // console.log(`Imported: ${email} for course ${parentSlug}`);
            } else {
                skipped++;
            }
        } catch (e) {
            console.error(`Error importing ${email}: ${e}`);
            errors++;
        }
    }

    console.log('\n--- IMPORT SUMMARY ---');
    console.log(`Total Records Processed: ${records.length}`);
    console.log(`New Enrollments Created: ${success}`);
    console.log(`Skipped (Already Existed): ${skipped}`);
    console.log(`Users Not Found in DB: ${userNotFound}`);
    console.log(`Unknown Course Mappings (Skipped): ${unknownCourse}`);
    console.log(`Errors: ${errors}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
