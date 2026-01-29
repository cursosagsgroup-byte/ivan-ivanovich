
import fs from 'fs';

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

const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = fileContent.split('\n').filter(l => l.trim() !== '');
const quizzes = new Set<string>();

lines.slice(1).forEach(l => {
    const row = parseCSVLine(l);
    if (row[3]) quizzes.add(row[3]);
});

console.log('Unique Quizzes in CSV:');
Array.from(quizzes).sort().forEach(q => console.log(`"${q}"`));
