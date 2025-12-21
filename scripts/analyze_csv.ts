
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const filePath = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/DATA CURSO : ESTUDIANTE/Tutor-Enrolled-Export-2025-December-19-2004 (1).csv';

const users = new Set();
let rowCount = 0;

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        // Check for email column - based on view_file output it is "Author Email"
        const email = row['Author Email'];
        if (email) {
            users.add(email);
        }
        rowCount++;
    })
    .on('end', () => {
        console.log(`Total Rows: ${rowCount}`);
        console.log(`Unique Students (by email): ${users.size}`);
        console.log('Sample Emails:', [...users].slice(0, 5));
    });
