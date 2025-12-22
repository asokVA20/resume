import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderTemplate } from './generate-website.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('📄 Generating PDF from HTML...\n');
    
    try {
        // Load PDF template and data
        const templatePath = path.join(__dirname, 'template-pdf.html');
        const dataPath = path.join(__dirname, 'personal-data.json');
        
        if (!fs.existsSync(templatePath)) {
            throw new Error('template-pdf.html not found');
        }
        
        if (!fs.existsSync(dataPath)) {
            throw new Error('personal-data.json not found');
        }
        
        const template = fs.readFileSync(templatePath, 'utf8');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Generate HTML from template
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
        
        // Generate PDF
        console.log('📄 Generating PDF...');
        const pdfPath = path.join(__dirname, 'cv-anthony-okala.pdf');
        
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
