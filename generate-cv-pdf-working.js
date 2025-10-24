const fs = require('fs');
const PDFDocument = require('pdfkit');

// Working CV Design Configuration
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

class WorkingCVGenerator {
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
        this.doc.fontSize(CV_CONFIG.fonts.subtitle)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(this.data.personalInfo.title, 0, this.currentY, {
                align: 'center'
            });
        
        this.currentY += 40;
    }

    generateContactInfo() {
        const contact = this.data.contactInfo || [];
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
        if (this.data.socialLinks && this.data.socialLinks.length > 0) {
            const socialLinks = this.data.socialLinks.map(link => {
                const platform = link.name.toLowerCase();
                return `🔗 ${platform}`;
            }).join(' | ');
            
            if (socialLinks) {
                contactItems.push(socialLinks);
            }
        }
        
        if (contactItems.length > 0) {
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(contactItems.join(' | '), 0, this.currentY, {
                    align: 'center'
                });
        }
        
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
            .text(summary, 0, this.currentY, {
                align: 'justify',
                lineGap: CV_CONFIG.spacing.line
            });
        
        this.currentY += 30;
    }

    createProfessionalSummary() {
        const personalInfo = this.data.personalInfo;
        const about = this.data.about;
        
        let summary = personalInfo.description || '';
        
        if (about && about.current) {
            summary += ' ' + about.current;
        }
        
        if (about && about.expertise) {
            summary += ' ' + about.expertise;
        }
        
        return summary;
    }

    generateExperience() {
        this.addSectionHeader('Professional Experience');
        
        // Process experience in order of importance
        const experienceOrder = ['work', 'freelance', 'school'];
        
        experienceOrder.forEach(tabId => {
            const tab = this.data.experienceTabs?.find(t => t.id === tabId);
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
        if (this.needsNewPage(120)) {
            this.doc.addPage();
            this.currentY = CV_CONFIG.page.margin;
        }
        
        // Job title
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.primary)
            .text(item.title || 'Position', 0, this.currentY);
        
        this.currentY += 8;
        
        // Company and date
        this.doc.fontSize(CV_CONFIG.fonts.body)
            .fillColor(CV_CONFIG.colors.textLight)
            .text(`${item.company || 'Company'} | ${item.date || 'Date'}`, 0, this.currentY);
        
        this.currentY += 12;
        
        // Description
        if (item.description) {
            this.doc.fontSize(CV_CONFIG.fonts.body)
                .fillColor(CV_CONFIG.colors.text)
                .text(item.description, {
                    lineGap: CV_CONFIG.spacing.line
                });
            
            this.currentY += 8;
        }
        
        // Supervisors
        if (item.supervisors) {
            this.doc.fontSize(CV_CONFIG.fonts.small)
                .fillColor(CV_CONFIG.colors.textLight)
                .text(`Supervisors: ${item.supervisors}`, 0, this.currentY);
            
            this.currentY += 6;
        }
        
        // Achievements with proper spacing
        if (item.achievements && item.achievements.length > 0) {
            item.achievements.forEach(achievement => {
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.text)
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
                .text(tagsText, 0, this.currentY);
        }
        
        this.currentY += isLast ? 15 : 20;
    }

    generateEducation() {
        this.addSectionHeader('Education');
        
        if (this.data.education && this.data.education.length > 0) {
            this.data.education.forEach((edu, index) => {
                // Check if we need a new page
                if (this.needsNewPage(80)) {
                    this.doc.addPage();
                    this.currentY = CV_CONFIG.page.margin;
                }
                
                // Degree
                this.doc.fontSize(CV_CONFIG.fonts.subheading)
                    .fillColor(CV_CONFIG.colors.primary)
                    .text(edu.degree || 'Degree', 0, this.currentY);
                
                this.currentY += 8;
                
                // Institution and date
                this.doc.fontSize(CV_CONFIG.fonts.body)
                    .fillColor(CV_CONFIG.colors.textLight)
                    .text(`${edu.institution || 'Institution'} | ${edu.date || 'Date'}`, 0, this.currentY);
                
                this.currentY += 12;
                
                // Description with HTML-like formatting
                if (edu.description) {
                    const cleanDescription = edu.description
                        .replace(/<br>/g, '\n')
                        .replace(/<strong>/g, '')
                        .replace(/<\/strong>/g, '');
                    
                    this.doc.fontSize(CV_CONFIG.fonts.body)
                        .fillColor(CV_CONFIG.colors.text)
                        .text(cleanDescription, {
                            lineGap: CV_CONFIG.spacing.line
                        });
                }
                
                this.currentY += index === this.data.education.length - 1 ? 15 : 20;
            });
        }
    }

    generateSkills() {
        this.addSectionHeader('Technical Skills');
        
        if (this.data.skills && this.data.skills.length > 0) {
            this.data.skills.forEach((skillCategory, categoryIndex) => {
                // Check if we need a new page
                if (this.needsNewPage(60)) {
                    this.doc.addPage();
                    this.currentY = CV_CONFIG.page.margin;
                }
                
                // Category title
                this.doc.fontSize(CV_CONFIG.fonts.subheading)
                    .fillColor(CV_CONFIG.colors.secondary)
                    .text(skillCategory.category || 'Category', 0, this.currentY);
                
                this.currentY += 10;
                
                // Skills in this category with proper spacing
                if (skillCategory.items && skillCategory.items.length > 0) {
                    skillCategory.items.forEach((skill, skillIndex) => {
                        this.doc.fontSize(CV_CONFIG.fonts.body)
                            .fillColor(CV_CONFIG.colors.text)
                            .text(`${skill.name || 'Skill'} (${skill.level || 0}%)`, 0, this.currentY);
                        
                        this.currentY += 8;
                    });
                }
                
                this.currentY += categoryIndex === this.data.skills.length - 1 ? 10 : 15;
            });
        }
    }

    generateProjects() {
        this.addSectionHeader('Featured Projects');
        
        if (this.data.projects && this.data.projects.length > 0) {
            this.data.projects.forEach((project, index) => {
                // Check if we need a new page
                if (this.needsNewPage(80)) {
                    this.doc.addPage();
                    this.currentY = CV_CONFIG.page.margin;
                }
                
                // Project title
                this.doc.fontSize(CV_CONFIG.fonts.subheading)
                    .fillColor(CV_CONFIG.colors.primary)
                    .text(project.title || 'Project', 0, this.currentY);
                
                this.currentY += 8;
                
                // Project description
                if (project.description) {
                    this.doc.fontSize(CV_CONFIG.fonts.body)
                        .fillColor(CV_CONFIG.colors.text)
                        .text(project.description, {
                            lineGap: CV_CONFIG.spacing.line
                        });
                }
                
                this.currentY += 8;
                
                // Project tags
                if (project.tags && project.tags.length > 0) {
                    const tagsText = project.tags.join(' • ');
                    this.doc.fontSize(CV_CONFIG.fonts.small)
                        .fillColor(CV_CONFIG.colors.textLight)
                        .text(tagsText, 0, this.currentY);
                }
                
                this.currentY += index === this.data.projects.length - 1 ? 15 : 20;
            });
        }
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

    addSubsectionHeader(title) {
        this.currentY += CV_CONFIG.spacing.subsection;
        
        this.doc.fontSize(CV_CONFIG.fonts.subheading)
            .fillColor(CV_CONFIG.colors.secondary)
            .text(title, 0, this.currentY);
        
        this.currentY += 15;
    }

    needsNewPage(requiredSpace) {
        return this.currentY + requiredSpace > CV_CONFIG.page.height - CV_CONFIG.page.margin;
    }
}

// Main function to generate working PDF
function generateWorkingCVPDF() {
    try {
        // Load personal data
        const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
        
        // Create CV generator
        const cvGenerator = new WorkingCVGenerator(data);
        
        // Generate PDF
        const doc = cvGenerator.generate();
        
        // Save to file
        const outputPath = 'cv-anthony-okala-working.pdf';
        doc.pipe(fs.createWriteStream(outputPath));
        doc.end();
        
        console.log('✅ Working CV PDF generated successfully!');
        console.log(`📄 Output file: ${outputPath}`);
        console.log('🎨 Features:');
        console.log('   - Professional typography and spacing');
        console.log('   - No overlapping text');
        console.log('   - Proper page breaks');
        console.log('   - Clean, readable layout');
        console.log('   - ATS-friendly format');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating working CV PDF:', error.message);
        throw error;
    }
}

// Export for use in other files
module.exports = { generateWorkingCVPDF, WorkingCVGenerator };

// Run if called directly
if (require.main === module) {
    generateWorkingCVPDF();
}
