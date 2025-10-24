const fs = require('fs');
const { generateWorkingCVPDF } = require('./generate-cv-pdf-working.js');

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
        
            // 2. Generate professional CV
            console.log('📋 Generating professional CV...');
            await generateWorkingCVPDF();
        
        console.log('\n🎉 All files generated successfully!');
        console.log('\n📁 Generated files:');
        console.log('   - index.html (Website)');
        console.log('   - cv-anthony-okala-working.pdf (Professional CV)');
        console.log('\n🎨 Features:');
        console.log('   - Professional layout with no overlapping text');
        console.log('   - Clean, readable format');
        console.log('   - All sections included');
        console.log('   - Data-driven content');
        console.log('   - High-quality typography');
        
    } catch (error) {
        console.error('❌ Error during generation:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    generateAll();
}

module.exports = { generateAll };
