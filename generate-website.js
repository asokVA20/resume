import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple template engine
function renderTemplate(template, data) {
    // First process simple replacements
    let result = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const keys = key.trim().split('.');
        let value = data;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return match; // Return original if key not found
            }
        }
        
        return value !== undefined ? value : match;
    });
    
    // Then process loops recursively
    result = processLoops(result, data);
    
    // Finally process conditionals
    result = processConditionals(result, data);
    
    return result;
}

function processLoops(template, data) {
    return template.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
        const keys = key.trim().split('.');
        let value = data;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return '';
            }
        }
        
        if (Array.isArray(value)) {
            return value.map(item => {
                let itemContent = content;
                
                // Recursively process nested loops in the item context
                itemContent = processLoops(itemContent, item);
                
                // Process conditionals in the item context
                itemContent = processConditionals(itemContent, item);
                
                // Replace item properties - handle special case first
                // Replace {{projectId}}{{title}} pattern before normal replacements
                itemContent = itemContent.replace(/\{\{projectId\}\}\{\{title\}\}/g, () => {
                    return item.projectId || item.title || '';
                });
                
                // Now do normal replacements
                itemContent = itemContent.replace(/\{\{([^}]+)\}\}/g, (itemMatch, itemKey) => {
                    const itemKeys = itemKey.trim().split('.');
                    let itemValue = item;
                    
                    // Handle {{.}} syntax for primitive array items
                    if (itemKeys.length === 1 && itemKeys[0] === '') {
                        return item;
                    }
                    
                    for (const k of itemKeys) {
                        if (k === '' || k === '.') {
                            return item;
                        }
                        if (itemValue && typeof itemValue === 'object' && k in itemValue) {
                            itemValue = itemValue[k];
                        } else {
                            return itemMatch;
                        }
                    }
                    
                    return itemValue !== undefined ? itemValue : itemMatch;
                });
                
                return itemContent;
            }).join('');
        }
        
        return '';
    });
}

function processConditionals(template, data) {
    return template.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g, (match, condition, ifContent, elseContent) => {
        const keys = condition.trim().split('.');
        let value = data;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return '';
            }
        }
        
        if (value && value !== '' && value !== null && value !== undefined) {
            return ifContent;
        } else if (elseContent) {
            return elseContent;
        }
        
        return '';
    });
}

// Export template engine functions for reuse
export { renderTemplate, processLoops, processConditionals };

/**
 * Load personal-data.json and apply all computed fields (same as used for website and PDF).
 * Use this so website and PDF always share the same data source and transformations.
 */
function getPreparedData() {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'personal-data.json'), 'utf8'));

    // SEO: Add computed fields for structured data
    data.personalInfo.sameAsJson = JSON.stringify((data.socialLinks || []).map(s => s.url));
    data.personalInfo.metaDescription = data.personalInfo.metaDescription || data.personalInfo.description;

    // Build YAML-style skills: project_name -> list of skills used
    buildSkillsYaml(data);
    return data;
}

// Build YAML-style skills: project_name -> list of skills used
function toYamlKey(s) {
    const special = { 'c++': 'cpp', 'vba excel': 'vba_excel', 'next.js': 'nextjs', 'express.js': 'expressjs', 'react native': 'react_native', 'react 19': 'react_19', 'tailwind css': 'tailwind_css', 'react hook form': 'react_hook_form', 'tanstack query': 'tanstack_query', 'framer motion': 'framer_motion', 'next-intl': 'next_intl', 'nextauth.js': 'nextauthjs', 'typeorm': 'typeorm', 'oracle sql': 'oracle_sql', 'timescaledb': 'timescaledb', 'neo4j': 'neo4j', 'arangodb': 'arangodb', 'rabbitmq': 'rabbitmq', 'bull queue': 'bull_queue', 'socket.io': 'socketio', 'django channels': 'django_channels', 'gitlab ci/cd': 'gitlab_cicd', 'docker compose': 'docker_compose', 'aws s3': 'aws_s3', 'aws eks': 'aws_eks', 'ci/cd': 'cicd', 'openai api': 'openai_api', 'spring boot': 'spring_boot' };
    const lower = s.toLowerCase().trim();
    if (special[lower]) return special[lower];
    return lower.replace(/\s+&\s+/g, '_').replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '');
}

function buildSkillsYaml(data) {
const projectSkills = new Map(); // projectName -> Set(skill)

function addSkills(projectName, skills) {
    if (!projectName || projectName.length < 2) return;
    const key = projectName.trim();
    if (!projectSkills.has(key)) projectSkills.set(key, new Set());
    (skills || []).forEach(s => { if (s && s.length > 1) projectSkills.get(key).add(s); });
}

// From projects: project title -> project tags
(data.projects || []).forEach(p => {
    addSkills(p.title, p.tags);
});

// From experience: place -> item tags
(data.experienceTabs || []).forEach(tab => {
    const useProjectName = tab.id === 'freelance';
    (tab.items || []).forEach(item => {
        const titlePart = (item.title || '').split(' - ')[0].trim();
        const place = useProjectName ? (titlePart || item.company) : (item.company || titlePart);
        addSkills(place, item.tags);
    });
});

// From education: institution -> skills from Tools
(data.education || []).forEach(edu => {
    const institution = edu.institution || 'TU Clausthal';
    const m = (edu.description || '').match(/Tools?:?\s*([^<]+)/i);
    if (m) addSkills(institution, m[1].split(',').map(s => s.trim()).filter(s => s.length > 1));
});


// Build YAML lines: technical_skills -> project_name -> [skills]
const yamlLines = [];
yamlLines.push({ spaces: '', key: 'technical_skills', colon: true });

// Order: projects first, then experience (by tab order), then education
const projectOrder = [];
(data.projects || []).forEach(p => { if (p.title) projectOrder.push(p.title); });
(data.experienceTabs || []).forEach(tab => {
    (tab.items || []).forEach(item => {
        const titlePart = (item.title || '').split(' - ')[0].trim();
        const place = tab.id === 'freelance' ? (titlePart || item.company) : (item.company || titlePart);
        if (place && !projectOrder.includes(place)) projectOrder.push(place);
    });
});
(data.education || []).forEach(edu => {
    const inst = edu.institution || 'TU Clausthal';
    if (!projectOrder.includes(inst)) projectOrder.push(inst);
});
const rest = [...projectSkills.keys()].filter(k => !projectOrder.includes(k)).sort();
const orderedProjects = [...projectOrder, ...rest];

orderedProjects.forEach(projectName => {
    const skills = [...(projectSkills.get(projectName) || [])].filter(Boolean).sort();
    const key = projectName.includes(' ') || projectName.includes('&') ? `"${projectName}"` : projectName;
    yamlLines.push({ spaces: '  ', key, colon: true });
    skills.forEach(skill => yamlLines.push({ spaces: '    ', type: 'list', value: skill }));
});

data.skillsYamlLines = yamlLines;
}

export { getPreparedData };

// Load template and data (same data used for website and PDF)
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const data = getPreparedData();

// Generate the website
const generatedHTML = renderTemplate(template, data);

// Write the generated HTML
fs.writeFileSync('index.html', generatedHTML);

// Generate robots.txt and sitemap.xml for SEO
const baseUrl = 'https://asokva20.github.io/resume';
fs.writeFileSync('robots.txt', `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);

console.log('Website generated successfully!');
console.log('Files created:');
console.log('- template.html (HTML template)');
console.log('- personal-data.json (Personal data)');
console.log('- generate-website.js (Template engine)');
console.log('- index.html (Generated website)');
