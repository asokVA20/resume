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

// Load template and data
const template = fs.readFileSync('template.html', 'utf8');
const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));

// SEO: Add computed fields for structured data
data.personalInfo.sameAsJson = JSON.stringify((data.socialLinks || []).map(s => s.url));
data.personalInfo.metaDescription = data.personalInfo.metaDescription || data.personalInfo.description;

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
