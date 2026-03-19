import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun
} from 'docx';
import { getPreparedData } from './generate-website.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBSITE_ACHIEVEMENTS = [
    {
        number: '80%',
        label: 'Automation Achieved',
        description: 'Reduced manual effort by 80% with goal to reach 99% automation at DB Regio AG'
    },
    {
        number: '25+',
        label: 'Projects Delivered',
        description: 'Successfully completed projects for clients including Volkswagen AG and DB Regio AG'
    },
    {
        number: '25+',
        label: 'Technologies Mastered',
        description: 'Expert in Java, Python, JavaScript, TypeScript, React, Django, Spring Boot, Laravel, and more'
    },
    {
        number: '3',
        label: 'Languages',
        description: 'Fluent in English, German, and French - enabling global collaboration'
    },
    {
        number: '10+',
        label: 'Years Experience',
        description: 'Extensive expertise in automation, software development, and safety-critical systems'
    }
];

function heading(text, level = HeadingLevel.HEADING_2) {
    return new Paragraph({
        text,
        heading: level,
        spacing: { before: 240, after: 120 }
    });
}

function bullet(text) {
    return new Paragraph({
        text,
        bullet: { level: 0 },
        spacing: { after: 60 }
    });
}

function normalizeText(value) {
    return String(value ?? '')
        .replace(/<br\s*\/?>(\s*)/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function getWebsiteSkillsPlainLines(data) {
    const lines = data.skillsYamlLines || [];
    const result = [];
    let currentKey = '';
    let currentSkills = [];

    for (const line of lines) {
        if (line?.spaces === '' && line?.key === 'technical_skills') {
            continue;
        }

        if (line?.spaces === '  ' && line?.colon) {
            if (currentKey) {
                result.push(`${currentKey}: ${currentSkills.join(', ')}`);
            }
            currentKey = normalizeText(String(line.key || '')).replace(/^"|"$/g, '');
            currentSkills = [];
            continue;
        }

        if (line?.spaces === '    ' && line?.type === 'list') {
            const skill = normalizeText(line.value || '');
            if (skill) currentSkills.push(skill);
        }
    }

    if (currentKey) {
        result.push(`${currentKey}: ${currentSkills.join(', ')}`);
    }

    return result;
}

async function generateDOCX() {
    console.log('📝 Generating Word (.docx) resume...\n');

    const data = getPreparedData();
    const children = [];

    // Header (contact details are kept; only website "contact section" is excluded)
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: data.personalInfo.name, bold: true, size: 36 })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: data.personalInfo.title, italics: true, size: 24 })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: `${data.personalInfo.email} | ${data.personalInfo.telephone} | ${data.personalInfo.location}`,
                    size: 20
                })
            ]
        })
    );

    children.push(heading('Professional Summary'));
    children.push(
        new Paragraph({
            text: normalizeText(data.personalInfo.description),
            spacing: { after: 120 }
        })
    );

    children.push(heading('Proven Impact & Achievements'));
    WEBSITE_ACHIEVEMENTS.forEach((item) => {
        children.push(
            bullet(`${item.number} ${item.label}: ${item.description}`)
        );
    });

    children.push(heading('About'));
    children.push(new Paragraph({ text: normalizeText(data.about?.journey || ''), spacing: { after: 80 } }));
    children.push(new Paragraph({ text: normalizeText(data.about?.current || ''), spacing: { after: 80 } }));
    children.push(new Paragraph({ text: normalizeText(data.about?.expertise || ''), spacing: { after: 80 } }));

    children.push(heading('Professional Experience'));
    (data.experienceTabs || []).forEach((tab) => {
        children.push(
            new Paragraph({
                text: tab.title,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 140, after: 80 }
            })
        );

        (tab.items || []).forEach((item) => {
            children.push(
                new Paragraph({
                    spacing: { before: 120, after: 40 },
                    children: [
                        new TextRun({ text: normalizeText(item.title || ''), bold: true }),
                        new TextRun({ text: ` (${normalizeText(item.date || '')})` })
                    ]
                }),
                new Paragraph({
                    text: normalizeText(item.company || ''),
                    spacing: { after: 40 }
                })
            );

            if (item.description) {
                children.push(
                    new Paragraph({
                        text: normalizeText(item.description),
                        spacing: { after: 40 }
                    })
                );
            }

            (item.achievements || []).forEach((achievement) => {
                children.push(bullet(normalizeText(achievement)));
            });

            if (item.tags?.length) {
                children.push(
                    new Paragraph({
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: 'Tech: ', bold: true }),
                            new TextRun({ text: item.tags.join(', ') })
                        ]
                    })
                );
            }
        });
    });

    children.push(heading('Technical Skills'));
    const skillsLines = getWebsiteSkillsPlainLines(data);
    skillsLines.forEach((line) => {
        children.push(
            new Paragraph({
                text: line,
                spacing: { after: 60 }
            })
        );
    });

    children.push(heading('Education'));
    (data.education || []).forEach((item) => {
        children.push(
            new Paragraph({
                spacing: { before: 100, after: 40 },
                children: [
                    new TextRun({ text: normalizeText(item.degree || ''), bold: true }),
                    new TextRun({ text: ` (${normalizeText(item.date || '')})` })
                ]
            }),
            new Paragraph({
                text: normalizeText(item.institution || ''),
                spacing: { after: 40 }
            })
        );

        const description = normalizeText(item.description || '');
        if (description) {
            children.push(
                new Paragraph({
                    text: description,
                    spacing: { after: 80 }
                })
            );
        }
    });

    children.push(heading('Professional Links'));
    (data.socialLinks || []).forEach((link) => {
        children.push(
            bullet(`${normalizeText(link.name || 'Link')}: ${normalizeText(link.url || '')}`)
        );
    });

    const doc = new Document({
        sections: [
            {
                properties: {},
                children
            }
        ]
    });

    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const docxPath = path.join(downloadsDir, 'cv-anthony-okala.docx');
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docxPath, buffer);

    console.log('✅ Word file generated successfully!');
    console.log(`📄 Output: ${docxPath}`);

    return docxPath;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('generate-docx.js')) {
    generateDOCX().catch((error) => {
        console.error('❌ Error generating DOCX:', error.message);
        console.error(error.stack);
        process.exit(1);
    });
}

export { generateDOCX };
