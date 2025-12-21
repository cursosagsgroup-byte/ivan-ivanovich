
import fs from 'fs';

const filePath = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/DATA CURSO : ESTUDIANTE/Tutor-Enrolled-Export-2025-December-19-2004 (1).csv';

try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    // Find the index of "Author Email" in the header (first line)
    // The previous view_file showed headers on line 1: ID,Title,...,"Author Email",...
    // We need to parse the CSV line properly to handle quotes, but for a quick check we can try a simple split if no commas in fields, 
    // OR just look for the email column index. 
    // Given the view_file output:
    // 1: ID,Title,...,"Author Email",...

    // A simple regex approach to find emails might be safer than parsing CSV manually without a library if complex.
    // Let's iterate and extract emails.

    const uniqueEmails = new Set<string>();
    let dataRows = 0;

    // Header analysis
    const header = lines[0];
    // "Author Email" seems to be around index 17 based on view_file counting or just close.
    // Let's just regex for emails in each line.

    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const match = line.match(emailRegex);
        if (match) {
            // There might be multiple emails, but "Author Email" matches usually likely unique per row for enrollment.
            // Let's assume the first valid email format is the user email or closely inspect.
            // In the view_file: ...,c.beuvrin@ketingmedia.com,...
            match.forEach(email => uniqueEmails.add(email.toLowerCase()));
            dataRows++;
        }
    }

    console.log(`Total Data Rows Parsed: ${dataRows}`);
    console.log(`Unique Emails Found: ${uniqueEmails.size}`);

    const sample = [...uniqueEmails].slice(0, 5);
    console.log('Sample Emails:', sample);

} catch (error) {
    console.error('Error reading file:', error);
}
