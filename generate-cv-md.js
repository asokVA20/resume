const fs = require('fs');

class MarkdownCVGenerator {
    constructor(data) {
        this.data = data;
        this.outputFile = 'cv-anthony-okala.md';
    }

    generate() {
        try {
            console.log('📝 Generating Markdown CV...');
            
            let markdown = this.createHeader();
            markdown += this.createContactInfo();
            markdown += this.createProfessionalSummary();
            markdown += this.createExperience();
            markdown += this.createEducation();
            markdown += this.createSkills();
            markdown += this.createProjects();
            markdown += this.createFooter();
            
            // Write to file
            fs.writeFileSync(this.outputFile, markdown, 'utf8');
            
            console.log('✅ Markdown CV generated successfully!');
            console.log(`📄 Output file: ${this.outputFile}`);
            console.log('🎨 Features:');
            console.log('   - Clean, readable format');
            console.log('   - Professional structure');
            console.log('   - All sections included');
            console.log('   - GitHub/GitLab compatible');
            console.log('   - Easy to edit and maintain');
            
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

${personalInfo.description || ''}

---
`;
    }

    createContactInfo() {
        const contact = this.data.contactInfo || [];
        const socialLinks = this.data.socialLinks || [];
        
        let contactSection = '## 📞 Contact Information\n\n';
        
        // Email
        const email = contact.find(item => item.title === 'Email');
        if (email) {
            contactSection += `- **Email:** ${email.content}\n`;
        }
        
        // Phone
        const phone = contact.find(item => item.title === 'Phone');
        if (phone) {
            contactSection += `- **Phone:** ${phone.content}\n`;
        }
        
        // Location
        const location = contact.find(item => item.title === 'Location');
        if (location) {
            contactSection += `- **Location:** ${location.content}\n`;
        }
        
        // Social Links
        if (socialLinks.length > 0) {
            contactSection += '\n### 🌐 Social Links\n\n';
            socialLinks.forEach(link => {
                contactSection += `- **${link.name}:** [${link.url}](${link.url})\n`;
            });
        }
        
        contactSection += '\n---\n\n';
        return contactSection;
    }

    createProfessionalSummary() {
        const about = this.data.about;
        
        if (!about) return '';
        
        let summary = '## 👨‍💼 Professional Summary\n\n';
        
        if (about.current) {
            summary += `${about.current}\n\n`;
        }
        
        if (about.expertise) {
            summary += `${about.expertise}\n\n`;
        }
        
        // Add stats if available
        if (about.stats && about.stats.length > 0) {
            summary += '### 📊 Key Statistics\n\n';
            about.stats.forEach(stat => {
                summary += `- **${stat.label}:** ${stat.value}\n`;
            });
            summary += '\n';
        }
        
        summary += '---\n\n';
        return summary;
    }

    createExperience() {
        let experience = '## 💼 Professional Experience\n\n';
        
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
        
        let education = '## 🎓 Education\n\n';
        
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
        
        let skills = '## 🛠️ Technical Skills\n\n';
        
        this.data.skills.forEach((skillCategory, categoryIndex) => {
            skills += `### ${skillCategory.category || 'Category'}\n\n`;
            
            if (skillCategory.items && skillCategory.items.length > 0) {
                skillCategory.items.forEach((skill, skillIndex) => {
                    const level = skill.level ? ` (${skill.level}%)` : '';
                    skills += `- **${skill.name || 'Skill'}**${level}\n`;
                });
            }
            
            skills += '\n';
        });
        
        skills += '---\n\n';
        return skills;
    }

    createProjects() {
        if (!this.data.projects || this.data.projects.length === 0) {
            return '';
        }
        
        let projects = '## 🚀 Featured Projects\n\n';
        
        this.data.projects.forEach((project, index) => {
            projects += `### ${project.title || 'Project'}\n\n`;
            
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
