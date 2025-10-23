const fs = require('fs');
const path = require('path');

// Simple template engine
function renderTemplate(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
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
    }).replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
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
                // Replace item properties
                itemContent = itemContent.replace(/\{\{([^}]+)\}\}/g, (itemMatch, itemKey) => {
                    const itemKeys = itemKey.trim().split('.');
                    let itemValue = item;
                    
                    for (const k of itemKeys) {
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

// Load template and data
const template = fs.readFileSync('template.html', 'utf8');
const data = JSON.parse(fs.readFileSync('personal-data.json', 'utf8'));

// Generate the website
const generatedHTML = renderTemplate(template, data);

// Write the generated HTML
fs.writeFileSync('index.html', generatedHTML);

console.log('Website generated successfully!');
console.log('Files created:');
console.log('- template.html (HTML template)');
console.log('- personal-data.json (Personal data)');
console.log('- generate-website.js (Template engine)');
console.log('- index.html (Generated website)');
