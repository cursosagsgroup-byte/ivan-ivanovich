
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

console.log('--- Environment Check ---');
console.log('Project Dir:', projectDir);
console.log('DATABASE_URL Present:', process.env.DATABASE_URL ? 'YES' : 'NO');
if (process.env.DATABASE_URL) {
    // Check format but don't log secrets
    const url = process.env.DATABASE_URL;
    console.log('DATABASE_URL Scheme:', url.split(':')[0]);
    console.log('DATABASE_URL Length:', url.length);
}
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
