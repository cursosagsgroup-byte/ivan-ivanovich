
import fs from 'fs';
import path from 'path';

const translations: Record<string, any> = {
    "3919": {}, "3893": {}, "3877": {}, "3865": {}, "3833": {},
    "3744": {}, "3635": {}, "3438": {}, "3357": {}, "3333": {},
    "2908": {}, "2641": {}, "2086": {}, "2085": {}, "2084": {},
    "2083": {}, "2082": {}, "17279": {}, "1": {}, "327": {},
    "356": {}, "382": {}, "413": {}, "466": {}, "483": {},
    "724": {}, "765": {}, "770": {}, "777": {}, "798": {},
    "847": {}, "870": {}, "908": {}
};

const jsonPath = path.join(process.cwd(), 'app', 'data', 'blog-posts.json');
const fileContent = fs.readFileSync(jsonPath, 'utf-8');
const allPosts = JSON.parse(fileContent);

const missing = allPosts.filter((p: any) => !translations[p.id]).map((p: any) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt
}));

console.log(JSON.stringify(missing, null, 2));
