const fs = require('fs');
const { generateCVPDF } = require('./generate-cv-pdf.js');
const { generateEnhancedCVPDF } = require('./generate-cv-pdf-enhanced.js');

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
        
        // 2. Generate basic CV PDF
        console.log('📋 Generating basic CV PDF...');
        generateCVPDF();
        
        // 3. Generate enhanced CV PDF
        console.log('🎨 Generating enhanced CV PDF...');
        generateEnhancedCVPDF();
        
        console.log('\n🎉 All files generated successfully!');
        console.log('\n📁 Generated files:');
        console.log('   - index.html (Website)');
        console.log('   - cv-anthony-okala.pdf (Basic CV)');
        console.log('   - cv-anthony-okala-enhanced.pdf (Enhanced CV)');
        
    } catch (error) {
        console.error('❌ Error during generation:', error.message);
    }
}

// Run if called directly
if (require.main === module) {
    generateAll();
}

module.exports = { generateAll };
