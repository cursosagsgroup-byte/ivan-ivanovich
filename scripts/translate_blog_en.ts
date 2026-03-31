import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Parse .env manually to get API Key
const envPath = path.join(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const geminiMatch = envFile.match(/^GEMINI_API_KEY=(.*)$/m);
let API_KEY = geminiMatch ? geminiMatch[1].replace(/['"]/g, '') : '';

if (!API_KEY) {
    console.error("❌ No GEMINI_API_KEY found in .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const prisma = new PrismaClient();

async function translateHtml(text: string, attempt = 1): Promise<string> {
    if (!text || text.trim() === '') return text;
    
    // Quick heuristic to check if it's already English (only for very early check)
    if (attempt === 1) {
        const spanishWords = [' de ', ' la ', ' el ', ' con ', ' para ', ' los ', ' las '];
        const containsSpanish = spanishWords.some(word => text.toLowerCase().includes(word));
        if (!containsSpanish && text.toLowerCase().includes(' the ')) {
            return text;
        }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `You are a professional translator specializing in security, military, and executive protection terminology. 
Translate the following blog post content from Spanish to English. 
IMPORTANT:
- The text contains HTML tags. You MUST keep the exact same HTML tags, classes, and structure intact.
- Keep all internal links and banner structures as they are.
- Return ONLY the translated HTML content without markdown wrappers.

Here is the HTML to translate:
${text}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();
        return response.replace(/^```html|^```\n|```$/gm, '').trim();
    } catch (error: any) {
        if (attempt <= 3 && (error.status === 503 || error.status === 429)) {
            console.log(`   ⚠️ API Error (${error.status}). Retrying attempt ${attempt + 1}/3 after wait...`);
            await new Promise(r => setTimeout(r, 5000 * attempt)); // Wait longer on each retry
            return translateHtml(text, attempt + 1);
        }
        console.error(`🚨 Final error translating content after ${attempt} attempts:`, error.message);
        return text; 
    }
}

async function startBlogTranslation() {
    console.log("🔍 Checking for missing or untranslated English blog posts...");

    const allPosts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const esPosts = allPosts.filter(p => p.language === 'es');
    const enPosts = allPosts.filter(p => p.language === 'en');

    console.log(`📌 Found ${esPosts.length} Spanish posts and ${enPosts.length} English posts.`);
    let processed = 0;

    // 1. Process existing English posts (already marked as EN)
    for (const post of enPosts) {
        processed++;
        process.stdout.write(`\r⏳ Progress: [${processed}/${enPosts.length + esPosts.length}] Checking: ${post.title.substring(0, 40)}... `);
        const translatedContent = await translateHtml(post.content);
        
        if (translatedContent !== post.content) {
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { content: translatedContent }
            });
            console.log(`   ✅ Content updated.`);
        }
        
        // Wait to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // 2. Create missing English versions for Spanish posts
    for (const esPost of esPosts) {
        const expectedEnSlug = `${esPost.slug}-en`;
        const existingEn = enPosts.find(p => p.slug === expectedEnSlug);

        if (!existingEn) {
            console.log(`\n🆕 Creating missing EN version for: ${esPost.title}`);
            
            const translatedTitle = await translateHtml(esPost.title);
            const translatedExcerpt = esPost.excerpt ? await translateHtml(esPost.excerpt) : null;
            const translatedContent = await translateHtml(esPost.content);

            await prisma.blogPost.create({
                data: {
                    title: translatedTitle,
                    slug: expectedEnSlug,
                    excerpt: translatedExcerpt,
                    content: translatedContent,
                    image: esPost.image,
                    published: esPost.published,
                    pinned: esPost.pinned,
                    language: 'en',
                    authorId: esPost.authorId,
                    createdAt: esPost.createdAt // Keep same date
                }
            });

            console.log(`   ✅ Created: ${translatedTitle}`);
            
            // Wait to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
    }

    console.log(`\n🎉 Blog content synchronization and translation finished.`);
    await prisma.$disconnect();
}

startBlogTranslation().catch(console.error);
