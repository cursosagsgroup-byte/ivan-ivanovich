
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CSV_PATH = '/Users/carlosbeuvrin/Documents/KETING MEDIA/NUEVOS PROYECTOS ANTIGRAVITY/IVAN CODIGO/Entradas-Export-2025-November-27-0238.csv';

async function main() {
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync(CSV_PATH, { encoding: 'utf-8' });

    console.log('Parsing CSV...');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
    });

    console.log(`Found ${records.length} records in CSV.`);

    // Create a map of Slug -> Image URL
    const slugToImageMap = new Map<string, string>();

    // Also create a map of Title -> Image URL as a fallback, 
    // because sometimes slugs might slightly differ (e.g. generated ones)
    const titleToImageMap = new Map<string, string>();

    for (const record of records) {
        const slug = record['Slug'];
        const imageUrl = record['Image URL'];
        const title = record['Title'];

        if (slug && imageUrl) {
            slugToImageMap.set(slug, imageUrl);
        }
        if (title && imageUrl) {
            // Normalize title for better matching (lowercase, trim)
            titleToImageMap.set(title.toLowerCase().trim(), imageUrl);
        }
    }

    console.log(`Loaded ${slugToImageMap.size} slugs with images.`);

    // Get all blog posts with missing images
    const postsMissingImages = await prisma.blogPost.findMany({
        where: {
            OR: [
                { image: null },
                { image: '' }
            ]
        }
    });

    console.log(`Found ${postsMissingImages.length} blog posts missing images in DB.`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const post of postsMissingImages) {
        let imageUrl = slugToImageMap.get(post.slug);

        if (!imageUrl && post.slug.endsWith('-en')) {
            // Try matching by removing '-en' suffix for spanish content mapped to english slug
            const baseSlug = post.slug.replace(/-en$/, '');
            imageUrl = slugToImageMap.get(baseSlug);
        }

        // If still no image, try by title
        if (!imageUrl) {
            imageUrl = titleToImageMap.get(post.title.toLowerCase().trim());
        }

        if (imageUrl) {
            // Validate if it's a real URL or just a placeholder? 
            // The CSV snippet showed valid URLs.

            console.log(`Updating post "${post.title}" (slug: ${post.slug}) with image: ${imageUrl}`);

            await prisma.blogPost.update({
                where: { id: post.id },
                data: { image: imageUrl }
            });
            updatedCount++;
        } else {
            console.log(`No image found in CSV for post "${post.title}" (slug: ${post.slug})`);
            skippedCount++;
        }
    }

    console.log('--------------------------------------------------');
    console.log(`Process Complete.`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
