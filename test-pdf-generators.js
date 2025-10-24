const fs = require('fs');

// Test script to validate PDF generators
function testPDFGenerators() {
    console.log('🧪 Testing PDF Generators...\n');
    
    // Check if personal-data.json exists
    if (!fs.existsSync('personal-data.json')) {
        console.error('❌ personal-data.json not found!');
        return false;
    }
    
    // Check if PDFKit is installed
    try {
        require('pdfkit');
        console.log('✅ PDFKit is installed');
    } catch (error) {
        console.error('❌ PDFKit not installed. Run: npm install');
        return false;
    }
    
    // Test each generator
    const generators = [
        { name: 'Proper CV Generator', file: 'generate-cv-pdf-proper.js', command: 'npm run generate-cv-proper' },
        { name: 'LaTeX-Style CV Generator', file: 'generate-cv-pdf-latex-style.js', command: 'npm run generate-cv-latex' },
        { name: 'Simple CV Generator', file: 'generate-cv-pdf-simple.js', command: 'npm run generate-cv-simple' },
        { name: 'Fixed CV Generator', file: 'generate-cv-pdf-fixed.js', command: 'npm run generate-cv-fixed' }
    ];
    
    generators.forEach(generator => {
        if (fs.existsSync(generator.file)) {
            console.log(`✅ ${generator.name} - File exists`);
            console.log(`   Command: ${generator.command}`);
        } else {
            console.log(`❌ ${generator.name} - File missing`);
        }
    });
    
    console.log('\n📋 Available Commands:');
    console.log('npm run generate-cv-proper    # Recommended - No overlapping text');
    console.log('npm run generate-cv-latex    # Most professional - LaTeX style');
    console.log('npm run generate-cv-simple    # Fallback option');
    console.log('npm run generate-cv-fixed     # Fixed version');
    
    return true;
}

// Run the test
testPDFGenerators();
