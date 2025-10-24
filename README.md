# Resume Website & CV Generator

A professional resume website and CV generator using modern web technologies and JasperReports for enterprise-grade PDF generation.

## 🎯 **Features**

### **Website Generation**
- ✅ **Template-based** - Easy to customize with your data
- ✅ **Responsive design** - Works on all devices
- ✅ **Modern UI/UX** - Professional animations and effects
- ✅ **SEO optimized** - Search engine friendly
- ✅ **Fast loading** - Optimized performance

### **CV Generation with JasperReports**
- ✅ **Professional layout** - No overlapping text issues
- ✅ **Enterprise-grade** - Used by Fortune 500 companies
- ✅ **Template-based design** - Visual designer support
- ✅ **Data-driven content** - Dynamic from JSON data
- ✅ **High-quality output** - Professional document standards
- ✅ **Automatic page breaks** - Smart content flow

## 🚀 **Quick Start**

### **1. Setup JasperReports (One-time)**
```bash
npm run setup-jasperreports
```

### **2. Generate Website**
```bash
npm run generate
```

### **3. Generate Professional CV**
```bash
npm run generate-cv
```

### **4. Generate Everything**
```bash
npm run generate-all
```

## 📋 **Available Commands**

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate resume website from template |
| `npm run generate-cv` | Generate professional CV with JasperReports |
| `npm run setup-jasperreports` | Setup JasperReports (one-time) |
| `npm run generate-all` | Generate both website and CV |
| `npm run install-deps` | Install dependencies |

## 🎨 **CV Generation Features**

### **Why JasperReports?**
- **Professional Layout Engine** - No overlapping text issues
- **Template-Based Design** - Visual designer for layouts
- **Data Binding** - Direct JSON integration
- **Enterprise-Grade** - Professional document standards
- **Automatic Page Breaks** - Smart content flow
- **High-Quality Typography** - Professional fonts and spacing

### **Generated CV Includes:**
- ✅ **Professional Summary** - Generated from your data
- ✅ **Work Experience** - All professional positions
- ✅ **Education** - Complete academic background
- ✅ **Technical Skills** - Categorized competencies
- ✅ **Featured Projects** - Key work examples
- ✅ **Contact Information** - All contact details

## 📁 **Project Structure**

```
resume/
├── template.html              # Website template
├── personal-data.json         # Your personal data
├── generate-website.js        # Website generator
├── generate-cv-jasperreports.js # CV generator
├── CVGenerator.java           # Java CV generator
├── cv-template.jrxml          # JasperReports template
├── setup-jasperreports.sh     # Setup script
├── generate-all.js            # Combined generator
├── styles.css                 # Website styles
├── script.js                  # Website scripts
└── jasperreports/             # JasperReports installation
```

## 🔧 **Customization**

### **Website Customization:**
1. Edit `personal-data.json` with your information
2. Modify `template.html` for layout changes
3. Update `styles.css` for styling
4. Run `npm run generate`

### **CV Customization:**
1. Edit `cv-template.jrxml` for layout changes
2. Modify `CVGenerator.java` for data handling
3. Update styles and colors in template
4. Run `npm run generate-cv`

## 📊 **Data Structure**

Your `personal-data.json` should include:
- `personalInfo` - Name, title, description
- `contactInfo` - Email, phone, location
- `experienceTabs` - Work, freelance, academic experience
- `education` - Academic background
- `skills` - Technical competencies
- `projects` - Featured work examples

## 🎯 **Output Files**

After generation, you'll get:
- `index.html` - Your resume website
- `cv-anthony-okala-jasper.pdf` - Professional CV
- `styles.css` - Website styles
- `script.js` - Website scripts

## 🚀 **Deployment**

### **Website Deployment:**
- Upload `index.html`, `styles.css`, and `script.js` to your web server
- Or use services like Netlify, Vercel, or GitHub Pages

### **CV Usage:**
- Use the generated PDF for job applications
- Share via email or LinkedIn
- Print for in-person interviews

## 🔧 **Technical Requirements**

- **Node.js** 14.0.0 or higher
- **Java** 11 or higher (for JasperReports)
- **Modern web browser** (for website)

## 📈 **Benefits**

### **Website Benefits:**
- **Professional online presence**
- **Easy to share and update**
- **Mobile-friendly design**
- **SEO optimized**

### **CV Benefits:**
- **No overlapping text issues**
- **Professional layout**
- **Enterprise-grade quality**
- **Template-based design**
- **Data-driven content**

## 🎉 **Success!**

This solution provides:
- ✅ **Professional website** - Modern, responsive design
- ✅ **Enterprise-grade CV** - No overlapping text issues
- ✅ **Template-based** - Easy to customize
- ✅ **Data-driven** - Dynamic content generation
- ✅ **High-quality output** - Professional standards

**Ready to generate your professional resume website and CV!** 🚀