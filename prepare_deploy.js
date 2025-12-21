const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m"
};

console.log(`${colors.cyan}=== Preparing files for cPanel Deployment ===${colors.reset}\n`);

const sourceDir = path.join(__dirname, '.next', 'standalone');
const destDir = path.join(__dirname, 'deploy');
const publicDir = path.join(__dirname, 'public');
const staticDir = path.join(__dirname, '.next', 'static');

if (!fs.existsSync(sourceDir)) {
    console.error(`${colors.red}Error: .next/standalone directory not found.${colors.reset}`);
    console.error(`Please run ${colors.yellow}npm run build${colors.reset} first.`);
    process.exit(1);
}

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            console.log(`Copying file: ${srcPath} -> ${destPath}`);
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Function to move files from src to dest
function moveDir(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        console.log(`Moving: ${srcPath} -> ${destPath}`);
        fs.renameSync(srcPath, destPath);
    }
}

// 1. Create deploy folder
console.log(`1. Creating 'deploy' folder...`);
if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir);

// 2. Initial copy of standalone build (might contain nested paths)
console.log(`2. Copying standalone build...`);
copyDir(sourceDir, destDir);

// 3. Check for nested structure and flatten
console.log(`3. Checking and flattening directory structure...`);
// The goal is to find where 'package.json' or 'server.js' lives inside 'deploy'
// and move everything from there to 'deploy' root.

// Helper to find project root by looking for package.json
function findProjectRoot(startPath) {
    if (fs.existsSync(path.join(startPath, 'package.json')) &&
        fs.existsSync(path.join(startPath, 'server.js'))) {
        return startPath;
    }

    const entries = fs.readdirSync(startPath, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'node_modules') {
            const found = findProjectRoot(path.join(startPath, entry.name));
            if (found) return found;
        }
    }
    return null;
}

const realRoot = findProjectRoot(destDir);

if (realRoot && realRoot !== destDir) {
    console.log(`${colors.yellow}Found nested project root at: ${realRoot}${colors.reset}`);
    console.log(`Flattening files to ${destDir}...`);

    // Move contents of realRoot to a temporary folder outside, then back to destDir?
    // Easier: Validate if we can move directly. 
    // If realRoot is deeply nested, moving up is fine.

    // Move contents to a temp dir first to avoid conflicts during traversal
    const tempDir = path.join(__dirname, 'deploy_temp');
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.renameSync(realRoot, tempDir);

    // Clear the original deploy folder (it only had the nested path)
    fs.rmSync(destDir, { recursive: true, force: true });
    fs.mkdirSync(destDir);

    // Move from temp to deploy
    moveDir(tempDir, destDir);

    // Cleanup temp
    fs.rmSync(tempDir, { recursive: true, force: true });

} else {
    console.log(`Project root appears to be correct.`);
}


// 4. Copy public folder
console.log(`4. Copying public assets...`);
const destPublic = path.join(destDir, 'public');
copyDir(publicDir, destPublic);

// 5. Copy static assets (.next/static) -> .next/static is needed in standalone/web/.next/static
console.log(`5. Copying static chunks...`);
const destStatic = path.join(destDir, '.next', 'static');
copyDir(staticDir, destStatic);

console.log(`\n${colors.green}SUCCESS! Files are ready in the 'deploy' folder.${colors.reset}`);
console.log(`\n${colors.yellow}INSTRUCTIONS FOR CPANEL:${colors.reset}`);
console.log(`1. Compress the contents of the ${colors.cyan}'deploy'${colors.reset} folder.`);
console.log(`2. Upload zip to cPanel.`);
console.log(`3. 'server.js' and 'package.json' should be in the root of your app folder.`);
