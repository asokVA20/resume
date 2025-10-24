const fs = require('fs');
const PDFDocument = require('pdfkit');

// Enhanced CV Design Configuration following best practices
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
        background: '#FFFFFF',
        sectionBg: '#F9FAFB'
    },
    fonts: {
        title: 28,
        subtitle: 16,
        heading: 18,
        subheading: 14,
        body: 11,
        small: 9
    },
    spacing: {
        section: 25,
        subsection: 15,
        item: 10,
        line: 3
    }
};

class EnhancedCVGenerator {
    constructor(data) {
        this.data = data;
        this.doc = new PDFDocument({
            size: 'A4',
            margin: CV_CONFIG.page.margin
        });
        this.currentY = CV_CONFIG.page.margin;
        this.pageWidth = CV_CONFIG.page.width - (CV_CONFIG.page.margin * 2);
        this.leftColumn = 0;
        this.rightColumn = this.pageWidth * 0.6;
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
        
        // Add metadata
        this.doc.info = {
            Title: `${this.data.personalInfo.name} - CV`,
            Author: this.data.personalInfo.name,
            Subject: 'Professional CV',
            Keywords: this.data.personalInfo.keywords || 'CV, Resume, Professional'
        };
    }

    generateHeader() {
        // Name with professional styling
        this.doc.fontSize(CV_CONFIG.fonts.title)
            .fillColor(CV_CONFIG.colors.primary)
            .font('Helvetica-Bold')
            .text(this.data.personalInfo.name, 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 35;
        
        // Professional title
        this.doc.fontSize(CV_CONFIG.fonts.subtitle)
            .fillColor(CV_CONFIG.colors.textLight)
            .font('Helvetica')
            .text(this.data.personalInfo.title, 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 40;
    }

    generateContactInfo() {
        const contact = this.data.contactInfo;
        const contactItems = [];
        
        // Email
        const email = contact.find(item => item.title === 'Email');
        if (email) contactItems.push(`📧 ${email.content}`);
        
        // Phone
        const phone = contact.find(item => item.title === 'Phone');
        if (phone) contactItems.push(`📞 ${phone.content}`);
        
        // Location
        const location = contact.find(item => item.title === 'Location');
        if (location) contactItems.push(`📍 ${location.content}`);
        
        // Social links
        const socialLinks = this.data.socialLinks.map(link => {
            const platform = link.name.toLowerCase();
            return `🔗 ${platform}`;
        }).join(' | ');
        
        if (socialLinks) {
            contactItems.push(socialLinks);
        }
        
        this.doc.fontSize(CV_CONFIG.fonts.small)
            .fillColor(CV_CONFIG.colors.textLight)
            .font('Helvetica')
            .text(contactItems.join(' | '), 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 30;
        
        // Add a subtle line separator
        this.doc.strokeColor(CV_CONFIG.colors.textLight)
            .lineWidth(0.5)
            .moveTo(0, this.currentY)
            .lineTo(this.pageWidth, this.currentY)
            .stroke();
        
        this.currentY += 20;
    }

    generateProfessionalSummary() {
        this.addSectionHeader('Professional Summary');
        
        // Create a professional summary from the data
        const summary = this.createProfessionalSummary();
        
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.text)
            .font('Helvetica')
            .text(summary, 0, this.currentY, {
                align: 'justify',
                lineGap: CV_CONFIG.spacing.line
            });
        
        this.currentY += 30;
    }

    createProfessionalSummary() {
        const personalInfo = this.data.personalInfo;
        const about = this.data.about;
        
        return `${personalInfo.description} ${about.current} ${about.expertise}`;
    }

    generateExperience() {
        this.addSectionHeader('Professional Experience');
        
        // Process experience in order of importance
        const experienceOrder = ['work', 'freelance', 'school'];
        
        experienceOrder.forEach(tabId => {
            const tab = this.data.experienceTabs.find(t => t.id === tabId);
            if (tab && tab.items && tab.items.length > 0) {
                this.addSubsectionHeader(tab.title);
                
                tab.items.forEach((item, index) => {
                    this.addExperienceItem(item, index === tab.items.length - 1);
                });
            }
        });
    }

    addExperienceItem(item, isLast = false) {
        // Check if we need a new page
        if (this.needsNewPage(80)) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Job title
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.primary)
            .font('Helvetica-Bold')
            .text(item.title, 0, this.currentY);
        
        this.currentY += 8;
        
        // Company and date
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.textLight)
            .font('Helvetica')
            .text(`${item.company} | ${item.date}`, 0, this.currentY);
        
        this.currentY += 12;
        
        // Description
        if (item.description) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .font('Helvetica')
                .text(item.description, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 8;
        }
        
        // Supervisors
        if (item.supervisors) {
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .font('Helvetica-Oblique')
                .text(`Supervisors: ${item.supervisors}`, 0, this.currentY);
            
            this.currentY += 6;
        }
        
        // Achievements with better formatting
        if (item.achievements && item.achievements.length > 0) {
            item.achievements.forEach(achievement => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .font('Helvetica')
                    .text(`• ${achievement}`, 15, this.currentY, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            });
            
            this.currentY += 8;
        }
        
        // Tags with better styling
        if (item.tags && item.tags.length > 0) {
            const tagsText = item.tags.join(' • ');
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .font('Helvetica')
                .text(tagsText, 0, this.currentY);
        }
        
        this.currentY += isLast ? 15 : 20;
    }

    generateEducation() {
        this.addSectionHeader('Education');
        
        this.data.education.forEach((edu, index) => {
            // Check if we need a new page
            if (this.needsNewPage(60)) {
                this.doc.addPage();
                this.currentY = CV_CONFIG.page.margin;
            }
            
            // Degree
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.primary)
                .font('Helvetica-Bold')
                .text(edu.degree, 0, this.currentY);
            
            this.currentY += 8;
            
            // Institution and date
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.textLight)
                .font('Helvetica')
                .text(`${edu.institution} | ${edu.date}`, 0, this.currentY);
            
            this.currentY += 12;
            
            // Description with HTML-like formatting
            if (edu.description) {
                const cleanDescription = edu.description
                    .replace(/<br>/g, '\n')
                    .replace(/<strong>/g, '')
                    .replace(/<\/strong>/g, '');
                
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .font('Helvetica')
                    .text(cleanDescription, {
                        lineGap: CV_CONFIG.spacing.line
                    });
            }
            
            this.currentY += index === this.data.education.length - 1 ? 15 : 20;
        });
    }

    generateSkills() {
        this.addSectionHeader('Technical Skills');
        
        this.data.skills.forEach((skillCategory, categoryIndex) => {
            // Check if we need a new page
            if (this.needsNewPage(40)) {
                this.doc.addPage();
                this.currentY = CV_CONFIG.page.margin;
            }
            
            // Category title
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.secondary)
                .font('Helvetica-Bold')
                .text(skillCategory.category, 0, this.currentY);
            
            this.currentY += 10;
            
            // Skills in this category with progress indicators
            skillCategory.items.forEach(skill => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
                    .font('Helvetica')
                    .text(`${skill.name}`, 0, this.currentY);
                
                // Add a simple progress bar representation
                const progressWidth = (parseInt(skill.level) / 100) * 100;
                this.doc.rect(0, this.currentY + 2, progressWidth, 3)
                    .fillColor(CV_CONFIG.colors.primary)
                    .fill();
                
                this.currentY += 8;
            });
            
            this.currentY += categoryIndex === this.data.skills.length - 1 ? 10 : 15;
        });
    }

    generateProjects() {
        this.addSectionHeader('Featured Projects');
        
        this.data.projects.forEach((project, index) => {
            // Check if we need a new page
            if (this.needsNewPage(60)) {
                this.doc.addPage();
                this.currentY = CV_CONFIG.page.margin;
            }
            
            // Project title
            this.doc.fontSize(CV_CONFIG.fonts.subheading)
                .fillColor(CV_CONFIG.colors.primary)
                .font('Helvetica-Bold')
                .text(project.title, 0, this.currentY);
            
            this.currentY += 8;
            
            // Project description
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .font('Helvetica')
                .text(project.description, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 8;
            
            // Project tags
            if (project.tags && project.tags.length > 0) {
                const tagsText = project.tags.join(' • ');
                this.doc.fontSize(CV_CONFIG.fonts.small)
                    .fillColor(CV_CONFIG.colors.textLight)
                    .font('Helvetica')
                    .text(tagsText, 0, this.currentY);
            }
            
            this.currentY += index === this.data.projects.length - 1 ? 15 : 20;
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
            .font('Helvetica-Bold')
            .text(title, 0, this.currentY);
        
        // Professional underline
        this.doc.strokeColor(CV_CONFIG.colors.primary)
            .lineWidth(2)
            .moveTo(0, this.currentY + 5)
            .lineTo(this.pageWidth, this.currentY + 5)
            .stroke();
        
        this.currentY += 20;
    }

    addSubsectionHeader(title) {
        this.currentY += CV_CONFIG.spacing.subsection;
        
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.secondary)
            .font('Helvetica-Bold')
            .text(title, 0, this.currentY);
        
        this.currentY += 15;
    }

    needsNewPage(requiredSpace) {
        return this.currentY + requiredSpace > CV_CONFIG.page.height - CV_CONFIG.page.margin;
    }
}

// Main function to generate enhanced PDF
function generateEnhancedCVPDF() {
    try {
        // Load personal data
        const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
        
        // Create enhanced CV generator
        const cvGenerator = new EnhancedCVGenerator(data);
        
        // Generate PDF
        const doc = cvGenerator.generate();
        
        // Save to file
        const outputPath = 'cv-anthony-okala-enhanced.pdf';
        doc.pipe(fs.createWriteStream(outputPath));
        doc.end();
        
        console.log('✅ Enhanced CV PDF generated successfully!');
        console.log(`📄 Output file: ${outputPath}`);
        console.log('🎨 Features:');
        console.log('   - Professional typography and spacing');
        console.log('   - Color-coded sections');
        console.log('   - Progress indicators for skills');
        console.log('   - Optimized page breaks');
        console.log('   - Clean, ATS-friendly format');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating enhanced CV PDF:', error.message);
        throw error;
    }
}

// Export for use in other files
module.exports = { generateEnhancedCVPDF, EnhancedCVGenerator };

// Run if called directly
if (require.main === module) {
    generateEnhancedCVPDF();
}
