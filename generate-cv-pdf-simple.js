const fs = require('fs');
const PDFDocument = require('pdfkit');

// Simple CV Design Configuration
const CV_CONFIG = {
    page: {
        margin: 50,
        width: 595, // A4 width in points
        height: 842 // A4 height in points
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
        heading: 18,
        subheading: 16,
        body: 12,
        small: 10
    },
    spacing: {
        section: 20,
        item: 8,
        line: 4
    }
};

class SimpleCVGenerator {
    constructor(data) {
        this.data = data;
        this.doc = new PDFDocument({
            size: 'A4',
            margin: CV_CONFIG.page.margin
        });
        this.currentY = CV_CONFIG.page.margin;
        this.pageWidth = CV_CONFIG.page.width - (CV_CONFIG.page.margin * 2);
    }

    generate() {
        this.setupDocument();
        this.generateHeader();
        this.generateContactInfo();
        this.generateProfessionalSummary();
        this.generateExperience();
        this.generateEducation();
        this.generateSkills();
        this.generateProjects();
        
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
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(this.data.personalInfo.title, 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 40;
    }

    generateContactInfo() {
        const contact = this.data.contactInfo;
        const contactItems = [];
        
        contact.forEach(item => {
            if (item.title !== 'Resume') {
                contactItems.push(item.content);
            }
        });
        
        // Social links
        const socialLinks = this.data.socialLinks.map(link => link.url).join(' | ');
        if (socialLinks) {
            contactItems.push(socialLinks);
        }
        
        this.doc.fontSize(CV_CONFIG.fonts.small)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(contactItems.join(' | '), 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 30;
    }

    generateProfessionalSummary() {
        this.addSectionHeader('Professional Summary');
        
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.text)
            .text(this.data.personalInfo.description, {
                align: 'justify',
                lineGap: CV_CONFIG.spacing.line
            });
        
        this.currentY += 20;
    }

    generateExperience() {
        this.addSectionHeader('Professional Experience');
        
        // Process all experience tabs
        this.data.experienceTabs.forEach(tab => {
            if (tab.items && tab.items.length > 0) {
                this.addSubsectionHeader(tab.title);
                
                tab.items.forEach(item => {
                    this.addExperienceItem(item);
                });
            }
        });
    }

    addExperienceItem(item) {
        // Job title and company
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(item.title, 0, this.currentY);
        
        this.currentY += 5;
        
        // Company and date
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(`${item.company} | ${item.date}`, 0, this.currentY);
        
        this.currentY += 10;
        
        // Description
        if (item.description) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(item.description, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 10;
        }
        
        // Supervisors
        if (item.supervisors) {
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(`Supervisors: ${item.supervisors}`, 0, this.currentY);
            
            this.currentY += 5;
        }
        
        // Achievements
        if (item.achievements && item.achievements.length > 0) {
            item.achievements.forEach(achievement => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(`• ${achievement}`, 20, this.currentY, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            });
        }
        
        // Tags
        if (item.tags && item.tags.length > 0) {
            this.currentY += 5;
            const tagsText = item.tags.join(' • ');
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(tagsText, 0, this.currentY);
        }
        
        this.currentY += 20;
    }

    generateEducation() {
        this.addSectionHeader('Education');
        
        this.data.education.forEach(edu => {
            // Degree
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.primary)
                .text(edu.degree, 0, this.currentY);
            
            this.currentY += 5;
            
            // Institution and date
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(`${edu.institution} | ${edu.date}`, 0, this.currentY);
            
            this.currentY += 10;
            
            // Description
            if (edu.description) {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .text(edu.description, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            }
            
            this.currentY += 20;
        });
    }

    generateSkills() {
        this.addSectionHeader('Technical Skills');
        
        this.data.skills.forEach(skillCategory => {
            // Category title
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.primary)
                .text(skillCategory.category, 0, this.currentY);
            
            this.currentY += 10;
            
            // Skills in this category
            const skillsText = skillCategory.items.map(skill => 
                `${skill.name} (${skill.level}%)`
            ).join(' • ');
            
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(skillsText, 0, this.currentY, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 20;
        });
    }

    generateProjects() {
        this.addSectionHeader('Featured Projects');
        
        this.data.projects.forEach(project => {
            // Project title
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.primary)
                .text(project.title, 0, this.currentY);
            
            this.currentY += 5;
            
            // Project description
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(project.description, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 5;
            
            // Project tags
            if (project.tags && project.tags.length > 0) {
                const tagsText = project.tags.join(' • ');
                this.doc.fontSize(CV_CONFIG.fonts.small)
                    .fillColor(CV_CONFIG.colors.textLight)
                    .text(tagsText, 0, this.currentY);
            }
            
            this.currentY += 15;
        });
    }

    addSectionHeader(title) {
        // Add some space before section
        this.currentY += CV_CONFIG.spacing.section;
        
        // Check if we need a new page
        if (this.currentY > CV_CONFIG.page.height - 100) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Section title with underline
        this.doc.fontSize(CV_CONFIG.fonts.heading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(title, 0, this.currentY);
        
        // Underline
        this.doc.strokeColor(CV_CONFIG.colors.primary)
            .lineWidth(2)
            .moveTo(0, this.currentY + 5)
            .lineTo(this.pageWidth, this.currentY + 5)
            .stroke();
        
        this.currentY += 20;
    }

    addSubsectionHeader(title) {
        this.currentY += 10;
        
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.secondary)
            .text(title, 0, this.currentY);
        
        this.currentY += 15;
    }
}

// Main function to generate simple PDF
function generateSimpleCVPDF() {
    try {
        // Load personal data
        const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
        
        // Create CV generator
        const cvGenerator = new SimpleCVGenerator(data);
        
        // Generate PDF
        const doc = cvGenerator.generate();
        
        // Save to file
        const outputPath = 'cv-anthony-okala-simple.pdf';
        doc.pipe(fs.createWriteStream(outputPath));
        doc.end();
        
        console.log('✅ Simple CV PDF generated successfully!');
        console.log(`📄 Output file: ${outputPath}`);
        console.log('📋 CV includes:');
        console.log('   - Professional Summary');
        console.log('   - Experience (Freelance, Professional, Academic)');
        console.log('   - Education');
        console.log('   - Technical Skills');
        console.log('   - Featured Projects');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating simple CV PDF:', error.message);
        throw error;
    }
}

// Export for use in other files
module.exports = { generateSimpleCVPDF, SimpleCVGenerator };

// Run if called directly
if (require.main === module) {
    generateSimpleCVPDF();
}
