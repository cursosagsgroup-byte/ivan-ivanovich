
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.join(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const geminiMatch = envFile.match(/^GEMINI_API_KEY=(.*)$/m);
let API_KEY = geminiMatch ? geminiMatch[1].replace(/['"]/g, '') : '';

if (!API_KEY) {
    console.error("❌ No se encontró GEMINI_API_KEY en el archivo .env.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const prisma = new PrismaClient();
const COURSE_ID = 'cmiq7oga703zjkvegaq8v1ir4'; // Counter Surveillance for Exec Protection (en)

async function translateText(text: string, isHtml = false) {
    if (!text || text.trim() === '') return text;
    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let prompt = "";
    if (isHtml) {
        prompt = `You are a professional translator specializing in security, military, and executive protection terminology. 
Translate the following text from Spanish to English. 
IMPORTANT:
- The text contains HTML tags. You MUST keep the exact same HTML tags, classes, and structure intact.
- Do NOT wrap the output in markdown code blocks like \`\`\`html. 
- Return ONLY the translated HTML content.

Here is the HTML to translate:
${text}`;
    } else {
        prompt = `Translate the following course title/heading from Spanish to English. 
Maintain a professional tone related to executive protection and counter-surveillance.
Do not add any quotes, markdown, or extra explanations. Output ONLY the translated text:
${text}`;
    }

    try {
        const result = await model.generateContent(prompt);
        const translatedContent = result.response.text().trim();
        // clean up possible markdown blocks from bad responses
        return translatedContent.replace(/^```html|^```\n|```$/gm, '').trim();
    } catch (error) {
        console.error("🚨 Error traduciendo texto:", text.substring(0, 30));
        console.error(error);
        return text; // Return original if failed
    }
}

async function startTranslation() {
    console.log("🔍 Iniciando traducción del curso...");

    const course = await prisma.course.findUnique({
        where: { id: COURSE_ID }
    });

    if (!course || course.language !== 'en') {
        console.error("❌ Curso no encontrado o no está catalogado como en inglés.");
        return;
    }

    console.log(`✅ Traducción confirmada para el curso: ${course.title}`);

    // Fetch modules
    const modules = await prisma.module.findMany({
        where: { courseId: COURSE_ID },
        orderBy: { order: 'asc' }
    });

    console.log(`📌 Se encontraron ${modules.length} módulos.`);

    for (const mod of modules) {
        console.log(`\n⏳ Traduciendo Módulo ${mod.order}: ${mod.title}`);
        
        // Translate Module title
        const translatedModuleTitle = await translateText(mod.title, false);
        
        await prisma.module.update({
            where: { id: mod.id },
            data: { title: translatedModuleTitle }
        });

        console.log(`   ✔️ Nuevo título: ${translatedModuleTitle}`);

        // Get lessons for this module
        const lessons = await prisma.lesson.findMany({
            where: { moduleId: mod.id },
            orderBy: { order: 'asc' }
        });

        for (const lesson of lessons) {
            console.log(`     -> Lección: ${lesson.title}`);
            const translatedLessonTitle = await translateText(lesson.title, false);
            const translatedContent = lesson.content ? await translateText(lesson.content, true) : null;

            await prisma.lesson.update({
                where: { id: lesson.id },
                data: {
                    title: translatedLessonTitle,
                    content: translatedContent
                }
            });

            console.log(`        ✔️ Traducido a: ${translatedLessonTitle}`);
            
            // Wait 1 sec to avoid hitting rate limits
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Wait 1 sec before next module
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`\n🎉 Traducción completamente finalizada.`);
    await prisma.$disconnect();
}

startTranslation().catch(console.error);
