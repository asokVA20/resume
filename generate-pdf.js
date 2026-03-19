import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Prepare the page so the PDF matches the website exactly:
 * - Show all experience tabs (Freelance, Work, Academic) so full content is in the PDF
 * - Expand all "Show More" achievement lists
 * - Inject print-only CSS so backgrounds and layout render correctly
 */
async function preparePageForPDF(page) {
    // 1. Show all experience tab contents (website shows one at a time; for PDF we want all)
    await page.evaluate(() => {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach((el) => el.classList.add('active'));
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach((btn) => btn.classList.add('active'));
    });

    // 2. Expand all collapsed achievement lists
    await page.evaluate(() => {
        const collapsed = document.querySelectorAll('.achievements-list.collapsed');
        collapsed.forEach((el) => {
            el.classList.remove('collapsed');
            const toggleText = el.querySelector('.toggle-achievements .toggle-text');
            if (toggleText) toggleText.textContent = 'Show Less';
            const toggleBtn = el.querySelector('.toggle-achievements');
            if (toggleBtn) toggleBtn.classList.add('expanded');
            const title = el.querySelector('.achievements-title');
            if (title) title.classList.add('expanded');
        });
    });

    // 3. Inject print/PDF-only CSS (no changes to website files)
    await page.addStyleTag({
        content: `
            /* Remove non-resume sections in PDF only */
            .navbar,
            .footer,
            #home,
            #projects,
            #contact,
            .scroll-indicator {
                display: none !important;
            }
            /* Show all experience tab panels */
            .tab-content { display: block !important; }
            /* Expand all achievement lists */
            .achievements-list.collapsed { max-height: none !important; overflow: visible !important; }
            .achievements-list.collapsed::after { display: none !important; }
            /* Ensure backgrounds and colors print */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        `
    });
}

async function generatePDF() {
    console.log('📄 Generating PDF from website (index.html)...\n');

    try {
        const indexPath = path.join(__dirname, 'index.html');
        if (!fs.existsSync(indexPath)) {
            throw new Error('index.html not found. Run the website generator first.');
        }

        // Use pathToFileURL so file:// works on Windows and other OSes
        const fileUrl = pathToFileURL(indexPath).href;

        console.log('🚀 Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Match desktop layout (website is responsive; this matches typical desktop)
        await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });

        console.log('📂 Loading website...');
        await page.goto(fileUrl, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        // Wait for fonts and any JS-driven layout
        await new Promise((resolve) => setTimeout(resolve, 1500));

        await preparePageForPDF(page);

        // Short delay after DOM/CSS changes
        await new Promise((resolve) => setTimeout(resolve, 300));

        const downloadsDir = path.join(__dirname, 'downloads');
        if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });
        const pdfPath = path.join(downloadsDir, 'cv-anthony-okala.pdf');

        console.log('📄 Generating PDF...');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            },
            preferCSSPageSize: false
        });

        await browser.close();

        console.log('✅ PDF generated successfully!');
        console.log(`📄 Output: ${pdfPath}`);

        return pdfPath;
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-pdf.js')) {
    generatePDF();
}

export { generatePDF };
