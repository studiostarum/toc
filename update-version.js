#!/usr/bin/env node

/**
 * Version Update Script for TOC Project
 * Updates version across all files and creates git tag
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get version from command line argument
const newVersion = process.argv[2];

if (!newVersion) {
    console.error('Usage: node update-version.js <version>');
    console.error('Example: node update-version.js 1.0.1');
    process.exit(1);
}

// Validate version format (semantic versioning)
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(newVersion)) {
    console.error('Error: Version must follow semantic versioning format (e.g., 1.0.1)');
    process.exit(1);
}

console.log(`Updating version to ${newVersion}...`);

// Files to update
const filesToUpdate = [
    {
        path: 'package.json',
        pattern: /"version":\s*"[^"]+"/,
        replacement: `"version": "${newVersion}"`
    },
    {
        path: 'toc-script.js',
        pattern: /Version:\s*\d+\.\d+\.\d+/,
        replacement: `Version: ${newVersion}`
    }
];

// Update files
filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file.path);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(file.pattern, file.replacement);
        fs.writeFileSync(filePath, content);
        console.log(`✓ Updated ${file.path}`);
    } else {
        console.warn(`⚠ File not found: ${file.path}`);
    }
});

// Update CHANGELOG.md
const changelogPath = path.join(__dirname, 'CHANGELOG.md');
if (fs.existsSync(changelogPath)) {
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    
    // Add new version entry
    const today = new Date().toISOString().split('T')[0];
    const newEntry = `## [${newVersion}] - ${today}

### Added
- Version ${newVersion} release

### Changed
- Updated version to ${newVersion}

`;
    
    // Insert after the header
    const headerEnd = changelog.indexOf('## [');
    if (headerEnd !== -1) {
        changelog = changelog.slice(0, headerEnd) + newEntry + changelog.slice(headerEnd);
    } else {
        changelog = changelog + '\n' + newEntry;
    }
    
    fs.writeFileSync(changelogPath, changelog);
    console.log('✓ Updated CHANGELOG.md');
} else {
    console.warn('⚠ CHANGELOG.md not found');
}

// Git operations
try {
    console.log('\nPerforming git operations...');
    
    // Add all changes
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit changes
    execSync(`git commit -m "Bump version to ${newVersion}"`, { stdio: 'inherit' });
    
    // Create and push tag
    execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`, { stdio: 'inherit' });
    
    console.log(`\n✅ Successfully updated to version ${newVersion}`);
    console.log(`📦 Created git tag: v${newVersion}`);
    console.log('\nTo push changes and tags:');
    console.log('  git push');
    console.log('  git push --tags');
    
} catch (error) {
    console.error('❌ Error during git operations:', error.message);
    console.log('\nYou may need to manually commit and tag:');
    console.log(`  git add .`);
    console.log(`  git commit -m "Bump version to ${newVersion}"`);
    console.log(`  git tag -a v${newVersion} -m "Version ${newVersion}"`);
    process.exit(1);
}