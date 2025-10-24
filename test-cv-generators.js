const fs = require('fs');
const path = require('path');

// Test script to validate and test CV generators
function testCVGenerators() {
    console.log('🧪 Testing CV PDF Generators...\n');
    
    // Check if personal-data.json exists
    if (!fs.existsSync('personal-data.json')) {
        console.error('❌ personal-data.json not found!');
        return false;
    }
    
    console.log('✅ personal-data.json found');
    
    // Check if PDFKit is installed
    try {
        require('pdfkit');
        console.log('✅ PDFKit is installed');
    } catch (error) {
        console.error('❌ PDFKit not installed. Run: npm install');
        return false;
    }
    
    // Test data structure
    try {
        const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
        console.log('✅ personal-data.json is valid JSON');
        
        // Check required fields
        const requiredFields = ['personalInfo', 'contactInfo', 'experienceTabs', 'education', 'skills', 'projects'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
            return false;
        }
        
        console.log('✅ All required fields present');
        console.log(`   - Personal Info: ${data.personalInfo.name}`);
        console.log(`   - Experience Tabs: ${data.experienceTabs.length}`);
        console.log(`   - Education: ${data.education.length}`);
        console.log(`   - Skills: ${data.skills.length}`);
        console.log(`   - Projects: ${data.projects.length}`);
        
    } catch (error) {
        console.error('❌ Error reading personal-data.json:', error.message);
        return false;
    }
    
    // Test each generator file
    const generators = [
        { 
            name: 'Fixed Proper CV Generator', 
            file: 'generate-cv-pdf-fixed-proper.js', 
            command: 'npm run generate-cv-fixed-proper',
            description: 'Recommended - No overlapping text, professional layout'
        },
        { 
            name: 'Proper CV Generator', 
            file: 'generate-cv-pdf-proper.js', 
            command: 'npm run generate-cv-proper',
            description: 'Professional layout with proper spacing'
        },
        { 
            name: 'LaTeX-Style CV Generator', 
            file: 'generate-cv-pdf-latex-style.js', 
            command: 'npm run generate-cv-latex',
            description: 'Most professional - LaTeX template structure'
        },
        { 
            name: 'Simple CV Generator', 
            file: 'generate-cv-pdf-simple.js', 
            command: 'npm run generate-cv-simple',
            description: 'Fallback option - guaranteed to work'
        },
        { 
            name: 'Fixed CV Generator', 
            file: 'generate-cv-pdf-fixed.js', 
            command: 'npm run generate-cv-fixed',
            description: 'Fixed version with metadata handling'
        }
    ];
    
    console.log('\n📋 Available Generators:');
    generators.forEach(generator => {
        if (fs.existsSync(generator.file)) {
            console.log(`✅ ${generator.name}`);
            console.log(`   Command: ${generator.command}`);
            console.log(`   Description: ${generator.description}`);
        } else {
            console.log(`❌ ${generator.name} - File missing`);
        }
        console.log('');
    });
    
    console.log('🚀 Recommended Commands:');
    console.log('npm run generate-cv-fixed-proper    # Best option - Fixed overlapping text');
    console.log('npm run generate-cv-proper         # Professional layout');
    console.log('npm run generate-cv-latex          # LaTeX-style (most professional)');
    console.log('npm run generate-cv-simple         # Simple fallback');
    
    return true;
}

// Run the test
testCVGenerators();
