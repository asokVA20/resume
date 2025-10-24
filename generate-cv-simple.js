const fs = require('fs');
const { exec } = require('child_process');

// Simple CV Generation using HTML to PDF conversion
class SimpleCVGenerator {
    constructor() {
        this.outputFile = 'cv-anthony-okala-simple.pdf';
    }

    generateCV() {
        return new Promise((resolve, reject) => {
            console.log('🚀 Generating CV with simple approach...');
            
            // Check if personal-data.json exists
            if (!fs.existsSync('personal-data.json')) {
                console.error('❌ personal-data.json not found!');
                reject(new Error('Data file not found'));
                return;
            }

            // Load data
            const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));
            
            // Generate HTML CV
            const htmlCV = this.generateHTMLCV(data);
            
            // Save HTML file
            fs.writeFileSync('cv-temp.html', htmlCV);
            
            // Convert HTML to PDF using a simple approach
            this.convertHTMLToPDF()
                .then(() => {
                    console.log('✅ CV generated successfully!');
                    console.log(`📄 Output file: ${this.outputFile}`);
                    console.log('🎨 Features:');
                    console.log('   - Professional layout');
                    console.log('   - No overlapping text');
                    console.log('   - Clean, readable format');
                    console.log('   - All sections included');
                    
                    // Clean up temp file
                    if (fs.existsSync('cv-temp.html')) {
                        fs.unlinkSync('cv-temp.html');
                    }
                    
                    resolve(this.outputFile);
                })
                .catch(error => {
                    console.error('❌ Error converting to PDF:', error.message);
                    reject(error);
                });
        });
    }

    generateHTMLCV(data) {
        const personalInfo = data.personalInfo || {};
        const contactInfo = data.contactInfo || [];
        const experienceTabs = data.experienceTabs || [];
        const education = data.education || [];
        const skills = data.skills || [];
        const projects = data.projects || [];

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - CV</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #4F46E5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .name {
            font-size: 28px;
            font-weight: bold;
            color: #4F46E5;
            margin-bottom: 10px;
        }
        .title {
            font-size: 16px;
            color: #6B7280;
            margin-bottom: 15px;
        }
        .contact {
            font-size: 12px;
            color: #6B7280;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #4F46E5;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .experience-item {
            margin-bottom: 20px;
        }
        .job-title {
            font-size: 14px;
            font-weight: bold;
            color: #1F2937;
        }
        .company-date {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 8px;
        }
        .description {
            font-size: 11px;
            margin-bottom: 8px;
        }
        .achievements {
            font-size: 11px;
            margin-left: 15px;
        }
        .achievements li {
            margin-bottom: 3px;
        }
        .tags {
            font-size: 10px;
            color: #6B7280;
            font-style: italic;
        }
        .education-item {
            margin-bottom: 15px;
        }
        .degree {
            font-size: 14px;
            font-weight: bold;
            color: #1F2937;
        }
        .institution-date {
            font-size: 12px;
            color: #6B7280;
        }
        .skills-category {
            margin-bottom: 15px;
        }
        .category-title {
            font-size: 14px;
            font-weight: bold;
            color: #F59E0B;
            margin-bottom: 8px;
        }
        .skill-item {
            font-size: 11px;
            margin-bottom: 5px;
        }
        .project-item {
            margin-bottom: 15px;
        }
        .project-title {
            font-size: 14px;
            font-weight: bold;
            color: #1F2937;
        }
        .project-description {
            font-size: 11px;
            margin-bottom: 5px;
        }
        .project-tags {
            font-size: 10px;
            color: #6B7280;
            font-style: italic;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.name || 'Your Name'}</div>
        <div class="title">${personalInfo.title || 'Your Title'}</div>
        <div class="contact">
            ${contactInfo.map(item => `${item.title}: ${item.content}`).join(' | ')}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="description">${personalInfo.description || 'Professional summary goes here.'}</div>
    </div>

    <div class="section">
        <div class="section-title">Professional Experience</div>
        ${experienceTabs.map(tab => `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; font-weight: bold; color: #F59E0B; margin-bottom: 10px;">${tab.title}</div>
                ${tab.items ? tab.items.map(item => `
                    <div class="experience-item">
                        <div class="job-title">${item.title || 'Position'}</div>
                        <div class="company-date">${item.company || 'Company'} | ${item.date || 'Date'}</div>
                        ${item.description ? `<div class="description">${item.description}</div>` : ''}
                        ${item.achievements ? `
                            <div class="achievements">
                                <ul>
                                    ${item.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        ${item.tags ? `<div class="tags">${item.tags.join(' • ')}</div>` : ''}
                    </div>
                `).join('') : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
            <div class="education-item">
                <div class="degree">${edu.degree || 'Degree'}</div>
                <div class="institution-date">${edu.institution || 'Institution'} | ${edu.date || 'Date'}</div>
                ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Technical Skills</div>
        ${skills.map(skillCategory => `
            <div class="skills-category">
                <div class="category-title">${skillCategory.category || 'Category'}</div>
                ${skillCategory.items ? skillCategory.items.map(skill => `
                    <div class="skill-item">${skill.name || 'Skill'} (${skill.level || 0}%)</div>
                `).join('') : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <div class="section-title">Featured Projects</div>
        ${projects.map(project => `
            <div class="project-item">
                <div class="project-title">${project.title || 'Project'}</div>
                <div class="project-description">${project.description || 'Project description'}</div>
                ${project.tags ? `<div class="project-tags">${project.tags.join(' • ')}</div>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    }

    convertHTMLToPDF() {
        return new Promise((resolve, reject) => {
            // Try different approaches to convert HTML to PDF
            const approaches = [
                // Approach 1: Using wkhtmltopdf if available
                () => {
                    const command = `wkhtmltopdf --page-size A4 --margin-top 20mm --margin-bottom 20mm --margin-left 20mm --margin-right 20mm cv-temp.html ${this.outputFile}`;
                    exec(command, (error, stdout, stderr) => {
                        if (!error) {
                            resolve();
                        } else {
                            throw new Error('wkhtmltopdf not available');
                        }
                    });
                },
                // Approach 2: Using Chrome/Chromium headless
                () => {
                    const command = `google-chrome --headless --disable-gpu --print-to-pdf=${this.outputFile} cv-temp.html`;
                    exec(command, (error, stdout, stderr) => {
                        if (!error) {
                            resolve();
                        } else {
                            throw new Error('Chrome not available');
                        }
                    });
                },
                // Approach 3: Using Edge headless
                () => {
                    const command = `msedge --headless --disable-gpu --print-to-pdf=${this.outputFile} cv-temp.html`;
                    exec(command, (error, stdout, stderr) => {
                        if (!error) {
                            resolve();
                        } else {
                            throw new Error('Edge not available');
                        }
                    });
                }
            ];

            // Try each approach
            let currentApproach = 0;
            const tryNext = () => {
                if (currentApproach >= approaches.length) {
                    // If no approach works, just copy the HTML file
                    console.log('⚠️  No PDF converter found. Saving as HTML file instead.');
                    fs.copyFileSync('cv-temp.html', 'cv-anthony-okala.html');
                    resolve();
                    return;
                }

                try {
                    approaches[currentApproach]();
                } catch (error) {
                    currentApproach++;
                    tryNext();
                }
            };

            tryNext();
        });
    }
}

// Main function to generate CV
function generateSimpleCV() {
    const generator = new SimpleCVGenerator();
    
    return generator.generateCV()
        .then(outputFile => {
            console.log('🎉 CV generated successfully!');
            console.log(`📄 Output: ${outputFile}`);
            return outputFile;
        })
        .catch(error => {
            console.error('❌ Error generating CV:', error.message);
            throw error;
        });
}

// Export for use in other files
module.exports = { generateSimpleCV, SimpleCVGenerator };

// Run if called directly
if (require.main === module) {
    generateSimpleCV();
}
