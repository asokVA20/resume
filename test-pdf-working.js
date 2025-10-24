const fs = require('fs');

// Test if we can create a simple PDF
try {
    const PDFDocument = require('pdfkit');
    
    console.log('✅ PDFKit is available');
    
    // Create a simple test PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('test-simple.pdf'));
    
    doc.fontSize(20)
       .text('Test PDF Generation', 100, 100);
    
    doc.text('This is a test to verify PDFKit is working.', 100, 150);
    
    doc.end();
    
    console.log('✅ Test PDF created: test-simple.pdf');
    console.log('📄 You should now have a working PDF file!');
    
} catch (error) {
    console.error('❌ PDFKit error:', error.message);
    console.log('💡 Try running: npm install');
}
