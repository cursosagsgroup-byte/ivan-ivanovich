import fs from 'fs';

const jsonData = JSON.parse(fs.readFileSync('temp/9917.json', 'utf-8'));
const courseData = jsonData.data[0].data.course;
const contents = courseData.contents || [];

console.log('Modules in JSON:');
for (const topic of contents) {
    console.log(`- ${topic.post_title}`);
    if (topic.children) {
        console.log(`  (Contains ${topic.children.length} items)`);
    }
}
