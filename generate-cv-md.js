const fs = require('fs');

class MarkdownCVGenerator {
    constructor(data) {
        this.data = data;
        this.outputFile = 'cv-anthony-okala.md';
    }

    generate() {
        try {
            console.log('📝 Generating Professional Markdown CV...');
            
            let markdown = this.createHeader();
            markdown += this.createContactInfo();
            markdown += this.createProfessionalSummary();
            markdown += this.createFeaturedProjects();
            markdown += this.createExperience();
            markdown += this.createSkills();
            markdown += this.createEducation();
            markdown += this.createFooter();
            
            // Write to file
            fs.writeFileSync(this.outputFile, markdown, 'utf8');
            
            console.log('✅ Professional Markdown CV generated successfully!');
            console.log(`📄 Output file: ${this.outputFile}`);
            console.log('🎨 Features:');
            console.log('   - Professional CV design best practices');
            console.log('   - Complete data from personal-data.json');
            console.log('   - Template structure matching HTML');
            console.log('   - GitHub/GitLab compatible');
            console.log('   - ATS-friendly format');
            console.log('   - Clean, readable layout');
            
            return this.outputFile;
            
        } catch (error) {
            console.error('❌ Error generating Markdown CV:', error.message);
            throw error;
        }
    }

    createHeader() {
        const personalInfo = this.data.personalInfo;
        
        return `# ${personalInfo.name}
## ${personalInfo.title}

> ${personalInfo.subtitle}

${personalInfo.description}

---
`;
    }

    createContactInfo() {
        const contact = this.data.contactInfo || [];
        const socialLinks = this.data.socialLinks || [];
        
        let contactSection = '## Contact Information\n\n';
        contactSection += '| Field | Information |\n';
        contactSection += '|-------|-------------|\n';
        
        // Email
        const email = contact.find(item => item.title === 'Email');
        if (email) {
            contactSection += `| Email | ${email.content} |\n`;
        }
        
        // Phone
        const phone = contact.find(item => item.title === 'Phone');
        if (phone) {
            contactSection += `| Phone | ${phone.content} |\n`;
        }
        
        // Location
        const location = contact.find(item => item.title === 'Location');
        if (location) {
            contactSection += `| Location | ${location.content} |\n`;
        }
        
        // Social Links
        if (socialLinks.length > 0) {
            const socialText = socialLinks.map(link => `[${link.name}](${link.url})`).join(', ');
            contactSection += `| Social Links | ${socialText} |\n`;
        }
        
        contactSection += '\n---\n\n';
        return contactSection;
    }

    createProfessionalSummary() {
        const about = this.data.about;
        
        if (!about) return '';
        
        let summary = '## Professional Summary\n\n';
        
        if (about.journey) {
            summary += `${about.journey}\n\n`;
        }
        
        if (about.current) {
            summary += `${about.current}\n\n`;
        }
        
        if (about.expertise) {
            summary += `${about.expertise}\n\n`;
        }
        
        // Add expertise items
        if (about.expertiseItems && about.expertiseItems.length > 0) {
            summary += '### Core Expertise\n\n';
            summary += '| Expertise Area |\n';
            summary += '|----------------|\n';
            about.expertiseItems.forEach(item => {
                summary += `| **${item.title}** |\n`;
            });
            summary += '\n';
        }
        
        // Add stats if available
        if (about.stats && about.stats.length > 0) {
            summary += '### Key Statistics\n\n';
            summary += '| Metric | Value |\n';
            summary += '|--------|-------|\n';
            about.stats.forEach(stat => {
                summary += `| **${stat.label}** | ${stat.number} |\n`;
            });
            summary += '\n';
        }
        
        summary += '---\n\n';
        return summary;
    }

    createFeaturedProjects() {
        if (!this.data.projects || this.data.projects.length === 0) {
            return '';
        }
        
        let projects = '## Featured Projects\n\n';
        
        this.data.projects.forEach((project, index) => {
            // Add future/highlighted badge
            if (project.future || project.highlighted) {
                projects += `### ⭐ ${project.title} ${project.future ? '*(Future Project)*' : ''}\n\n`;
            } else {
                projects += `### ${project.title}\n\n`;
            }
            
            if (project.description) {
                projects += `${project.description}\n\n`;
            }
            
            if (project.tags && project.tags.length > 0) {
                projects += `**Technologies:** ${project.tags.join(', ')}\n\n`;
            }
            
            if (index < this.data.projects.length - 1) {
                projects += '---\n\n';
            }
        });
        
        projects += '---\n\n';
        return projects;
    }

    createExperience() {
        let experience = '## Professional Experience\n\n';
        
        // Process experience in order of importance
        const experienceOrder = ['work', 'freelance', 'school'];
        
        experienceOrder.forEach(tabId => {
            const tab = this.data.experienceTabs?.find(t => t.id === tabId);
            if (tab && tab.items && tab.items.length > 0) {
                experience += `### ${tab.title}\n\n`;
                
                tab.items.forEach((item, index) => {
                    experience += this.createExperienceItem(item, index === tab.items.length - 1);
                });
                
                experience += '\n';
            }
        });
        
        experience += '---\n\n';
        return experience;
    }

    createExperienceItem(item, isLast = false) {
        let itemText = `#### ${item.title || 'Position'}\n`;
        itemText += `**${item.company || 'Company'}** | ${item.date || 'Date'}\n\n`;
        
        if (item.description) {
            itemText += `${item.description}\n\n`;
        }
        
        if (item.supervisors) {
            itemText += `**Supervisors:** ${item.supervisors}\n\n`;
        }
        
        if (item.achievements && item.achievements.length > 0) {
            itemText += '**Key Achievements:**\n';
            item.achievements.forEach(achievement => {
                itemText += `- ${achievement}\n`;
            });
            itemText += '\n';
        }
        
        if (item.tags && item.tags.length > 0) {
            itemText += `**Technologies:** ${item.tags.join(', ')}\n\n`;
        }
        
        if (!isLast) {
            itemText += '---\n\n';
        }
        
        return itemText;
    }

    createEducation() {
        if (!this.data.education || this.data.education.length === 0) {
            return '';
        }
        
        let education = '## Education\n\n';
        
        this.data.education.forEach((edu, index) => {
            education += `### ${edu.degree || 'Degree'}\n`;
            education += `**${edu.institution || 'Institution'}** | ${edu.date || 'Date'}\n\n`;
            
            if (edu.description) {
                // Clean HTML tags from description
                const cleanDescription = edu.description
                    .replace(/<br>/g, '\n')
                    .replace(/<strong>/g, '**')
                    .replace(/<\/strong>/g, '**')
                    .replace(/<em>/g, '*')
                    .replace(/<\/em>/g, '*');
                
                education += `${cleanDescription}\n\n`;
            }
            
            if (index < this.data.education.length - 1) {
                education += '---\n\n';
            }
        });
        
        education += '---\n\n';
        return education;
    }

    createSkills() {
        if (!this.data.skills || this.data.skills.length === 0) {
            return '';
        }
        
        let skills = '## Technical Skills\n\n';
        
        this.data.skills.forEach((skillCategory, categoryIndex) => {
            skills += `### ${skillCategory.category || 'Category'}\n\n`;
            
            if (skillCategory.items && skillCategory.items.length > 0) {
                skills += '| Skill | Level |\n';
                skills += '|-------|-------|\n';
                skillCategory.items.forEach((skill, skillIndex) => {
                    const level = skill.level ? `${skill.level}%` : 'N/A';
                    skills += `| **${skill.name || 'Skill'}** | ${level} |\n`;
                });
            }
            
            skills += '\n';
        });
        
        skills += '---\n\n';
        return skills;
    }


    createFooter() {
        const personalInfo = this.data.personalInfo;
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `---

*This CV was generated on ${currentDate}*

**${personalInfo.name}** - ${personalInfo.title}
`;
    }
}

// Main function to generate Markdown CV
function generateMarkdownCV() {
    try {
        // Load personal data
        const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
        
        // Create CV generator
        const cvGenerator = new MarkdownCVGenerator(data);
        
        // Generate Markdown CV
        const outputFile = cvGenerator.generate();
        
        return outputFile;
        
    } catch (error) {
        console.error('❌ Error generating Markdown CV:', error.message);
        throw error;
    }
}

// Export for use in other files
module.exports = { generateMarkdownCV, MarkdownCVGenerator };

// Run if called directly
if (require.main === module) {
    generateMarkdownCV();
}
