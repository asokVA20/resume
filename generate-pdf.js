import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderTemplate, getPreparedData } from './generate-website.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('📄 Generating PDF from HTML...\n');
    
    try {
        // Load PDF template (same data as website via getPreparedData)
        const templatePath = path.join(__dirname, 'template-pdf.html');
        
        if (!fs.existsSync(templatePath)) {
            throw new Error('template-pdf.html not found');
        }
        
        const template = fs.readFileSync(templatePath, 'utf8');
        const data = getPreparedData();
        
        // Generate HTML from template (design from template-pdf.html, data matches website)
        console.log('📝 Rendering template...');
        const html = renderTemplate(template, data);
        
        // Write temporary HTML file
        const tempHtmlPath = path.join(__dirname, 'index-pdf.html');
        fs.writeFileSync(tempHtmlPath, html);
        
        // Launch Puppeteer
        console.log('🚀 Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Load the HTML file
        const fileUrl = `file://${tempHtmlPath}`;
        await page.goto(fileUrl, {
            waitUntil: 'networkidle0'
        });
        
        // Wait for fonts and styles to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate PDF (output to downloads/ to match website download link)
        console.log('📄 Generating PDF...');
        const downloadsDir = path.join(__dirname, 'downloads');
        if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });
        const pdfPath = path.join(downloadsDir, 'cv-anthony-okala.pdf');
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '12mm',
                right: '10mm',
                bottom: '12mm',
                left: '10mm'
            },
            preferCSSPageSize: true
        });
        
        await browser.close();
        
        // Clean up temporary HTML file
        fs.unlinkSync(tempHtmlPath);
        
        console.log('✅ PDF generated successfully!');
        console.log(`📄 Output: ${pdfPath}`);
        
        return pdfPath;
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-pdf.js')) {
    generatePDF();
}

export { generatePDF };
