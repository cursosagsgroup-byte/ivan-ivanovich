
import fs from 'fs';
import path from 'path';

const jsonPath = path.join(process.cwd(), 'temp', '17283.json');
const rawData = fs.readFileSync(jsonPath, 'utf-8');
const courseData = JSON.parse(rawData);

console.log('Top level keys:', Object.keys(courseData));
if (courseData.data && Array.isArray(courseData.data)) {
    console.log('Data array length:', courseData.data.length);
    courseData.data.forEach((item: any, index: number) => {
        console.log(`\nItem ${index}: content_type = ${item.content_type}`);
        if (item.data) {
            if (item.data.course && item.data.course.contents) {
                console.log('Found course.contents! Length:', item.data.course.contents.length);
                if (item.data.course.contents.length > 0) {
                    // Check if contents are topics/modules
                    console.log('First Content Item post_type:', item.data.course.contents[0].post_type);
                    console.log('First Content Item title:', item.data.course.contents[0].post_title);
                    if (item.data.course.contents[0].children) {
                        console.log('--- Inspecting Children of First Topic ---');
                        item.data.course.contents[0].children.forEach((child: any, idx: number) => {
                            console.log(`Child ${idx} Type: ${child.post_type}`);
                            if (child.post_type === 'lesson') {
                                if (idx === 0) { // Inspect first lesson only
                                    console.log('   Lesson Title:', child.post_title);
                                    console.log('   Lesson Content (First 500 chars):', child.post_content.substring(0, 500));
                                    // Search for vimeo link in content
                                    const vimeoMatch = child.post_content.match(/vimeo\.com\/\d+/);
                                    if (vimeoMatch) console.log('   Found vimeo link in content:', vimeoMatch[0]);
                                    console.log('   Lesson Meta Keys:', Object.keys(child.meta || {}));
                                    console.log('   Lesson Meta Values:', JSON.stringify(child.meta || {}, null, 2));
                                }
                            }
                        });
                    }

                    // Scan all topics for any quiz type
                    console.log('--- Scanning ALL topics for Quizzes ---');
                    let quizFound = false;
                    item.data.course.contents.forEach((topic: any) => {
                        if (topic.children) {
                            topic.children.forEach((child: any) => {
                                if (child.post_type !== 'lesson') {
                                    console.log(`Found non-lesson child: ${child.post_type} - ${child.post_title}`);
                                    quizFound = true;
                                }
                            });
                        }
                    });
                    if (!quizFound) console.log('No non-lesson children found in any topic.');

                }
            }
        }
    });
}
