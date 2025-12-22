import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { generateMarkdownCV } from './generate-cv-md.js';
import { generatePDF } from './generate-pdf.js';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);

// Main generator script
async function generateAll() {
    console.log('🚀 Starting Resume Website & CV Generation...\n');
    
    try {
        // 1. Generate website
        console.log('📄 Generating website...');
        try {
            const { stdout, stderr } = await execAsync('node generate-website.js');
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            console.log('✅ Website generated successfully!');
        } catch (error) {
            console.error('❌ Website generation error:', error.message);
            throw error;
        }
        
        // 2. Generate Markdown CV
        console.log('\n📝 Generating Markdown CV...');
        await generateMarkdownCV();
        
        // 3. Generate PDF
        console.log('\n📄 Generating PDF...');
        await generatePDF();
        
        console.log('\n🎉 All files generated successfully!');
        console.log('\n📁 Generated files:');
        console.log('   - index.html (Website)');
        console.log('   - cv-anthony-okala.md (Markdown CV)');
        console.log('   - cv-anthony-okala.pdf (PDF Resume)');
        console.log('\n🎨 Features:');
        console.log('   - Professional website with animations');
        console.log('   - Clean Markdown CV format');
        console.log('   - Professional PDF resume (A4 format)');
        console.log('   - GitHub/GitLab compatible');
        console.log('   - Easy to edit and maintain');
        console.log('   - All sections included');
        console.log('   - Data-driven content');
        
    } catch (error) {
        console.error('❌ Error during generation:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-all.js')) {
    generateAll();
}
