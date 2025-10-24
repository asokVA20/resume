const fs = require('fs');
const { generateMarkdownCV } = require('./generate-cv-md.js');

// Main generator script
async function generateAll() {
    console.log('🚀 Starting Resume Website & CV Generation...\n');
    
    try {
        // 1. Generate website
        console.log('📄 Generating website...');
        const { exec } = require('child_process');
        
        exec('node generate-website.js', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Website generation error:', error);
                return;
            }
            console.log('✅ Website generated successfully!');
        });
        
        // 2. Generate Markdown CV
        console.log('📝 Generating Markdown CV...');
        await generateMarkdownCV();
        
        console.log('\n🎉 All files generated successfully!');
        console.log('\n📁 Generated files:');
        console.log('   - index.html (Website)');
        console.log('   - cv-anthony-okala.md (Markdown CV)');
        console.log('\n🎨 Features:');
        console.log('   - Professional website with animations');
        console.log('   - Clean Markdown CV format');
        console.log('   - GitHub/GitLab compatible');
        console.log('   - Easy to edit and maintain');
        console.log('   - All sections included');
        console.log('   - Data-driven content');
        
    } catch (error) {
        console.error('❌ Error during generation:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    generateAll();
}
