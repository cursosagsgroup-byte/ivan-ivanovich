
import fetch from 'node-fetch';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/^GEMINI_API_KEY=(.*)$/m);
const API_KEY = match ? match[1].replace(/['"]/g, '') : '';

async function models() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  const r = await fetch(url);
  const data = await r.json();
  const valid = data.models.filter((m: any) => m.supportedGenerationMethods.includes('generateContent')).map((m: any) => m.name);
  console.log('Valid models:', valid);
}
models();
