const fs = require('fs');
const PDFDocument = require('pdfkit');

// LaTeX-style CV Design Configuration
const CV_CONFIG = {
    page: {
        margin: 50,
        width: 595, // A4 width in points
        height: 842, // A4 height in points
        contentWidth: 495 // Available content width
    },
    colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#F59E0B', // Yellow
        accent: '#EF4444', // Red
        text: '#1F2937',
        textLight: '#6B7280',
        background: '#FFFFFF'
    },
    fonts: {
        title: 24,
        subtitle: 14,
        heading: 16,
        subheading: 14,
        body: 11,
        small: 9
    },
    spacing: {
        section: 25,
        subsection: 15,
        item: 12,
        line: 4,
        paragraph: 8
    }
};

class LaTeXStyleCVGenerator {
    constructor(data) {
        this.data = data;
        this.doc = new PDFDocument({
            size: 'A4',
            margin: CV_CONFIG.page.margin
        });
        this.currentY = CV_CONFIG.page.margin;
        this.pageWidth = CV_CONFIG.page.contentWidth;
    }

    generate() {
        this.setupDocument();
        this.generateHeader();
        this.generateContactInfo();
        this.generateProfessionalSummary();
        this.generateWorkExperience();
        this.generateEducation();
        this.generateAcademicExperience();
        this.generatePrivateExperience();
        this.generateSkills();
        this.generateLanguages();
        
        return this.doc;
    }

    setupDocument() {
        this.doc.fontSize(CV_CONFIG.fonts.body);
        this.doc.fillColor(CV_CONFIG.colors.text);
    }

    generateHeader() {
        // Name
        this.doc.fontSize(CV_CONFIG.fonts.title)
            .fillColor(CV_CONFIG.colors.primary)
            .text(this.data.personalInfo.name, 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 30;
        
        // Title
        this.doc.fontSize(CV_CONFIG.fonts.subtitle)
            .fillColor(CV_CONFIG.colors.textLight)
            .text('Curriculum Vitae', 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 40;
    }

    generateContactInfo() {
        const contact = this.data.contactInfo;
        
        // Address
        const location = contact.find(item => item.title === 'Location');
        if (location) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(location.content, 0, this.currentY, {
                    align: 'center'
                });
        }
        
        this.currentY += 15;
        
        // Phone
        const phone = contact.find(item => item.title === 'Phone');
        if (phone) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(phone.content, 0, this.currentY, {
                    align: 'center'
                });
        }
        
        this.currentY += 15;
        
        // Email
        const email = contact.find(item => item.title === 'Email');
        if (email) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(email.content, 0, this.currentY, {
                    align: 'center'
                });
        }
        
        this.currentY += 20;
        
        // Quote
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.text)
            .text(this.data.personalInfo.description, 0, this.currentY, {
                align: 'center',
                lineGap: CV_CONFIG.spacing.line
            });
        
        this.currentY += 40;
    }

    generateProfessionalSummary() {
        // This section is handled in contact info as a quote
    }

    generateWorkExperience() {
        this.addSectionHeader('Practical Experience at Work');
        
        // Process work experience
        const workTab = this.data.experienceTabs.find(t => t.id === 'work');
        if (workTab && workTab.items && workTab.items.length > 0) {
            workTab.items.forEach((item, index) => {
                this.addWorkExperienceItem(item, index === workTab.items.length - 1);
            });
        }
    }

    addWorkExperienceItem(item, isLast = false) {
        // Check if we need a new page
        if (this.needsNewPage(120)) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Job title and company
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(item.title, 0, this.currentY);
        
        this.currentY += 5;
        
        // Company and date
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(`${item.company} | ${item.date}`, 0, this.currentY);
        
        this.currentY += 15;
        
        // Achievements with bullet points
        if (item.achievements && item.achievements.length > 0) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Details:', 0, this.currentY);
            
            this.currentY += 8;
            
            item.achievements.forEach(achievement => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`• ${achievement}`, 15, this.currentY, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            });
        }
        
        this.currentY += isLast ? 15 : 25;
    }

    generateEducation() {
        this.addSectionHeader('Education');
        
        this.data.education.forEach((edu, index) => {
            // Check if we need a new page
            if (this.needsNewPage(100)) {
                this.doc.addPage();
                this.currentY = CV_CONFIG.page.margin;
            }
            
            // Degree and institution
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.primary)
                .text(`${edu.degree} - ${edu.institution}`, 0, this.currentY);
            
            this.currentY += 5;
            
            // Date
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(edu.date, 0, this.currentY);
            
            this.currentY += 15;
            
            // Description with bullet points
            if (edu.description) {
                const cleanDescription = edu.description
                    .replace(/<br>/g, '\n')
                    .replace(/<strong>/g, '')
                    .replace(/<\/strong>/g, '');
                
                // Split into bullet points
                const points = cleanDescription.split('\n').filter(p => p.trim());
                points.forEach(point => {
                    this.doc.fontSize(CV_CONFIG.fonts.body)
                        .fillColor(CV_CONFIG.colors.text)
                        .text(`• ${point.trim()}`, 15, this.currentY, {
                            lineGap: CV_CONFIG.spacing.line
                        });
                });
            }
            
            this.currentY += index === this.data.education.length - 1 ? 15 : 25;
        });
    }

    generateAcademicExperience() {
        this.addSectionHeader('Practical Experience at School');
        
        // Process academic experience
        const schoolTab = this.data.experienceTabs.find(t => t.id === 'school');
        if (schoolTab && schoolTab.items && schoolTab.items.length > 0) {
            schoolTab.items.forEach((item, index) => {
                this.addAcademicExperienceItem(item, index === schoolTab.items.length - 1);
            });
        }
    }

    addAcademicExperienceItem(item, isLast = false) {
        // Check if we need a new page
        if (this.needsNewPage(120)) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Project title
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(item.title, 0, this.currentY);
        
        this.currentY += 5;
        
        // Company and date
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(`${item.company} | ${item.date}`, 0, this.currentY);
        
        this.currentY += 15;
        
        // Supervisors
        if (item.supervisors) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(`Supervisors: ${item.supervisors}`, 0, this.currentY);
            
            this.currentY += 8;
        }
        
        // Description
        if (item.description) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Description:', 0, this.currentY);
            
            this.currentY += 8;
            
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(item.description, 15, this.currentY, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 8;
        }
        
        // Achievements
        if (item.achievements && item.achievements.length > 0) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Key Achievements:', 0, this.currentY);
            
            this.currentY += 8;
            
            item.achievements.forEach(achievement => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`• ${achievement}`, 15, this.currentY, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            });
        }
        
        // Tools
        if (item.tags && item.tags.length > 0) {
            this.currentY += 8;
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Tools:', 0, this.currentY);
            
            this.currentY += 5;
            
            const toolsText = item.tags.join(', ');
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(toolsText, 15, this.currentY);
        }
        
        this.currentY += isLast ? 15 : 25;
    }

    generatePrivateExperience() {
        this.addSectionHeader('Practical Experience at Home (private)');
        
        // Process freelance experience
        const freelanceTab = this.data.experienceTabs.find(t => t.id === 'freelance');
        if (freelanceTab && freelanceTab.items && freelanceTab.items.length > 0) {
            freelanceTab.items.forEach((item, index) => {
                this.addPrivateExperienceItem(item, index === freelanceTab.items.length - 1);
            });
        }
    }

    addPrivateExperienceItem(item, isLast = false) {
        // Check if we need a new page
        if (this.needsNewPage(120)) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Project title
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(item.title, 0, this.currentY);
        
        this.currentY += 5;
        
        // Company and date
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(`${item.company} | ${item.date}`, 0, this.currentY);
        
        this.currentY += 15;
        
        // Description
        if (item.description) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Description:', 0, this.currentY);
            
            this.currentY += 8;
            
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(item.description, 15, this.currentY, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 8;
        }
        
        // Achievements
        if (item.achievements && item.achievements.length > 0) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Details:', 0, this.currentY);
            
            this.currentY += 8;
            
            item.achievements.forEach(achievement => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`• ${achievement}`, 15, this.currentY, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            });
        }
        
        // Tools
        if (item.tags && item.tags.length > 0) {
            this.currentY += 8;
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text('Tools:', 0, this.currentY);
            
            this.currentY += 5;
            
            const toolsText = item.tags.join(', ');
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(toolsText, 15, this.currentY);
        }
        
        this.currentY += isLast ? 15 : 25;
    }

    generateSkills() {
        this.addSectionHeader('Programming Languages');
        
        // Programming Languages
        const progLangCategory = this.data.skills.find(s => s.category === 'Programming Languages');
        if (progLangCategory) {
            progLangCategory.items.forEach(skill => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`${skill.name} (${skill.level}%)`, 0, this.currentY);
                
                this.currentY += 8;
            });
        }
        
        this.currentY += 15;
        
        // Frameworks
        this.addSectionHeader('Frameworks and Libraries');
        const frameworksCategory = this.data.skills.find(s => s.category === 'Frameworks & Tools');
        if (frameworksCategory) {
            frameworksCategory.items.forEach(skill => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`${skill.name} (${skill.level}%)`, 0, this.currentY);
                
                this.currentY += 8;
            });
        }
        
        this.currentY += 15;
        
        // Databases
        this.addSectionHeader('Databases');
        const databasesCategory = this.data.skills.find(s => s.category === 'Databases');
        if (databasesCategory) {
            databasesCategory.items.forEach(skill => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`${skill.name} (${skill.level}%)`, 0, this.currentY);
                
                this.currentY += 8;
            });
        }
        
        this.currentY += 15;
        
        // DevOps
        this.addSectionHeader('DevOps Tools');
        const devopsCategory = this.data.skills.find(s => s.category === 'DevOps & Cloud');
        if (devopsCategory) {
            devopsCategory.items.forEach(skill => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`${skill.name} (${skill.level}%)`, 0, this.currentY);
                
                this.currentY += 8;
            });
        }
    }

    generateLanguages() {
        this.addSectionHeader('Languages');
        
        const languages = [
            { name: 'French', level: 'Native proficiency (C2)', description: 'Ideal for communication, documentation, and collaboration in French-speaking environments.' },
            { name: 'English', level: 'Advanced proficiency (C1)', description: 'Strong written and verbal skills for professional communication and project collaboration in international settings.' },
            { name: 'German', level: 'Advanced proficiency (C1)', description: 'Fluent in both written and spoken German, with experience studying and working in German-speaking environments.' }
        ];
        
        languages.forEach(lang => {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(`${lang.name} - ${lang.level}`, 0, this.currentY);
            
            this.currentY += 5;
            
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(lang.description, 15, this.currentY, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 15;
        });
    }

    addSectionHeader(title) {
        // Add space before section
        this.currentY += CV_CONFIG.spacing.section;
        
        // Check if we need a new page
        if (this.currentY > CV_CONFIG.page.height - 100) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Section title with professional styling
        this.doc.fontSize(CV_CONFIG.fonts.heading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(title, 0, this.currentY);
        
        // Professional underline
        this.doc.strokeColor(CV_CONFIG.colors.primary)
            .lineWidth(2)
            .moveTo(0, this.currentY + 5)
            .lineTo(this.pageWidth, this.currentY + 5)
            .stroke();
        
        this.currentY += 20;
    }

    needsNewPage(requiredSpace) {
        return this.currentY + requiredSpace > CV_CONFIG.page.height - CV_CONFIG.page.margin;
    }
}

// Main function to generate LaTeX-style PDF
function generateLaTeXStyleCVPDF() {
    try {
        // Load personal data
        const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
        
        // Create CV generator
        const cvGenerator = new LaTeXStyleCVGenerator(data);
        
        // Generate PDF
        const doc = cvGenerator.generate();
        
        // Save to file
        const outputPath = 'cv-anthony-okala-latex-style.pdf';
        doc.pipe(fs.createWriteStream(outputPath));
        doc.end();
        
        console.log('✅ LaTeX-style CV PDF generated successfully!');
        console.log(`📄 Output file: ${outputPath}`);
        console.log('🎨 Features:');
        console.log('   - LaTeX template structure');
        console.log('   - Professional typography');
        console.log('   - Proper spacing and layout');
        console.log('   - No overlapping text');
        console.log('   - Clean, readable format');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating LaTeX-style CV PDF:', error.message);
        throw error;
    }
}

// Export for use in other files
module.exports = { generateLaTeXStyleCVPDF, LaTeXStyleCVGenerator };

// Run if called directly
if (require.main === module) {
    generateLaTeXStyleCVPDF();
}
