
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
    console.log('Finding posts with external images...');
    const posts = await prisma.blogPost.findMany({
        where: {
            image: {
                startsWith: 'http'
            }
        }
    });

    console.log(`Found ${posts.length} posts with external images.`);

    const targetDir = path.join(process.cwd(), 'public', 'images', 'blog', 'recovered');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const post of posts) {
        if (!post.image) continue;

        console.log(`Processing: ${post.title}`);
        console.log(`Old Image: ${post.image}`);

        // Generate safe local filename
        const ext = path.extname(post.image.split('?')[0]) || '.jpg';
        const newFilename = `recovered-${post.id}${ext}`;
        const localPath = path.join(targetDir, newFilename);
        const publicPath = `/images/blog/recovered/${newFilename}`;

        // Construct curl command
        // curl -k -L -H "Host: ivanivanovich.com" [URL] -o [Path]
        // We use the IP address in the URL but keep the path
        const oldUrlObj = new URL(post.image);
        // Replace hostname with IP
        const ipUrl = `https://216.246.46.135${oldUrlObj.pathname}${oldUrlObj.search}`;

        const cmd = `curl -k -L -H "Host: ivanivanovich.com" "${ipUrl}" -o "${localPath}"`;

        try {
            console.log(`Downloading...`);
            await execAsync(cmd);

            // Verify file exists and has size
            const stats = fs.statSync(localPath);
            if (stats.size < 1000) {
                console.warn(`Warning: File size small (${stats.size} bytes). Might be error page.`);
            }

            // Update DB
            console.log(`Updating database to: ${publicPath}`);
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { image: publicPath }
            });
            console.log('Success.');

        } catch (error) {
            console.error(`Failed to recover image for post ${post.id}:`, error);
        }
        console.log('---');
    }
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
