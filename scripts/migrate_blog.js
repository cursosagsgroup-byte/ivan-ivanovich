const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const CSV_FILE = 'Entradas-Export-2025-November-27-0238.csv';
const OUTPUT_JSON = 'app/data/blog-posts.json';
const IMAGE_DIR = 'public/images/blog';

// Helper to parse CSV line respecting quotes
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuote && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// Helper to parse CSV file
function parseCSV(content) {
    const lines = [];
    let currentLine = '';
    let inQuote = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (char === '"') {
            inQuote = !inQuote;
        }
        if (char === '\n' && !inQuote) {
            lines.push(currentLine);
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    if (currentLine) lines.push(currentLine);

    const headers = parseCSVLine(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index];
            });
            result.push(obj);
        }
    }
    return result;
}

// Helper to download image with timeout
function downloadImage(url, filepath, timeout = 30000) {
    return new Promise((resolve, reject) => {
        if (!url) {
            resolve(null);
            return;
        }

        const file = fs.createWriteStream(filepath);
        let timeoutId;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            file.close();
        };

        // Set timeout
        timeoutId = setTimeout(() => {
            cleanup();
            fs.unlink(filepath, () => { });
            console.log(`Timeout downloading ${url}`);
            resolve(null);
        }, timeout);

        const request = https.get(url, (response) => {
            if (response.statusCode !== 200) {
                cleanup();
                // Try to follow redirect or just fail gracefully
                if (response.statusCode === 301 || response.statusCode === 302) {
                    downloadImage(response.headers.location, filepath, timeout).then(resolve).catch(resolve);
                    return;
                }
                console.log(`Failed to download ${url}: ${response.statusCode}`);
                fs.unlink(filepath, () => { });
                resolve(null);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                cleanup();
                resolve(filepath);
            });
        }).on('error', (err) => {
            cleanup();
            fs.unlink(filepath, () => { });
            console.error(`Error downloading ${url}: ${err.message}`);
            resolve(null);
        });

        // Also set timeout on the request itself
        request.setTimeout(timeout, () => {
            request.destroy();
            cleanup();
            fs.unlink(filepath, () => { });
            console.log(`Request timeout for ${url}`);
            resolve(null);
        });
    });
}

async function main() {
    console.log('Reading CSV...');
    const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
    const posts = parseCSV(csvContent);

    console.log(`Found ${posts.length} posts.`);

    // Filter published posts first
    const publishedPosts = posts.filter(post => post['Status'] === 'publish' || post['Status'] === 'future');
    console.log(`Processing ${publishedPosts.length} published posts...`);

    // Process posts in parallel batches
    const BATCH_SIZE = 10;
    const processedPosts = [];

    for (let i = 0; i < publishedPosts.length; i += BATCH_SIZE) {
        const batch = publishedPosts.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(publishedPosts.length / BATCH_SIZE)} (${batch.length} posts)...`);

        const batchResults = await Promise.all(batch.map(async (post) => {
            const slug = post['Slug'] || post['Title'].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const imageUrl = post['Image URL'];
            let localImagePath = null;

            if (imageUrl) {
                const ext = path.extname(imageUrl).split('?')[0] || '.jpg';
                const filename = `${slug}${ext}`;
                const filepath = path.join(IMAGE_DIR, filename);

                if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
                    console.log(`  Skipping existing: ${slug}`);
                    localImagePath = `/images/blog/${filename}`;
                } else {
                    console.log(`  Downloading: ${slug}`);
                    await downloadImage(imageUrl, filepath, 2000);
                    // Check if file exists and has size > 0 after download attempt
                    try {
                        if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
                            localImagePath = `/images/blog/${filename}`;
                        } else {
                            console.log(`  Failed to download image for ${slug}, using placeholder`);
                            localImagePath = null;
                        }
                    } catch (e) {
                        console.log(`  Error checking file for ${slug}: ${e.message}`);
                        localImagePath = null;
                    }
                }
            }

            // Remove embedded images (banners) from content - they are repetitive across all articles
            let content = post['Content'];
            // Remove all img tags from content
            content = content.replace(/<img[^>]*>/g, '');

            return {
                id: post['ID'],
                title: post['Title'],
                slug: slug,
                date: post['Date'],
                excerpt: post['Excerpt'],
                content: content,
                image: localImagePath,
                author: post['Author First Name'] + ' ' + post['Author Last Name']
            };
        }));

        processedPosts.push(...batchResults);
        console.log(`  Completed batch ${Math.floor(i / BATCH_SIZE) + 1}. Total processed: ${processedPosts.length}`);
    }

    console.log('Writing JSON file...');
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(processedPosts, null, 2));
    console.log(`Successfully processed ${processedPosts.length} posts.`);
}

main().catch(console.error);
