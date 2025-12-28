
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
    const failedIds = [
        'cminqfe9i000h13jcdt4yljp8',
        'cminqfe9j000j13jcovohq92c'
    ];

    console.log(`Attempting to recover ${failedIds.length} failed images...`);

    const posts = await prisma.blogPost.findMany({
        where: { id: { in: failedIds } }
    });

    const targetDir = path.join(process.cwd(), 'public', 'images', 'blog', 'recovered');

    for (const post of posts) {
        if (!post.image) continue;

        console.log(`Processing: ${post.title}`);
        console.log(`Current Image Path (db): ${post.image}`);

        // We know the ORIGINAL URL was replaced in DB. Need to find it or reconstruct it?
        // Wait, the previous script UPDATED the DB even if download failed. 
        // So post.image now points to local file which is 59 bytes.
        // I need the original URL.

        // Hardcoded original URLs based on previous logs:
        // "https://ivanivanovich.com/wp-content/uploads/2022/01/¿Cuál-es-la-realidad-de-la-Protección-Ejecutiva.jpeg"

        const originalUrl = "https://ivanivanovich.com/wp-content/uploads/2022/01/¿Cuál-es-la-realidad-de-la-Protección-Ejecutiva.jpeg";

        // Generate safe local filename (reuse existing name to overwrite bad file)
        const ext = '.jpeg';
        const newFilename = `recovered-${post.id}${ext}`;
        const localPath = path.join(targetDir, newFilename);

        // Encode the path parts
        const urlObj = new URL(originalUrl);
        // split pathname by / and encode each component, but NOT the slashes
        // Or just encodeURI logic?
        // encodeURI does NOT encode ?, #, etc which is good. But it might not handle the specific unicode combination perfectly for the server if it expects specific encoding.
        // Let's try regular encodeURI.

        const encodedPath = encodeURI(urlObj.pathname);
        const ipUrl = `https://216.246.46.135${encodedPath}${urlObj.search}`;

        console.log(`Encoded URL: ${ipUrl}`);

        const cmd = `curl -k -L -H "Host: ivanivanovich.com" "${ipUrl}" -o "${localPath}"`;

        try {
            console.log(`Downloading...`);
            await execAsync(cmd);

            const stats = fs.statSync(localPath);
            console.log(`New size: ${stats.size} bytes`);

            if (stats.size > 1000) {
                console.log('Success!');
            } else {
                console.log('Still failed.');
            }

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
