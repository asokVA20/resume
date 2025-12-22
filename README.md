# Resume Website Generator

A professional resume website generator using modern web technologies. Create a stunning, responsive resume website from your personal data.

## **Features**

### **Website Generation**
- ✅ **Template-based** - Easy to customize with your data
- ✅ **Responsive design** - Works on all devices
- ✅ **Modern UI/UX** - Professional animations and effects
- ✅ **SEO optimized** - Search engine friendly
- ✅ **Fast loading** - Optimized performance
- ✅ **Professional animations** - Typewriter effects, floating cards, scroll animations
- ✅ **Interactive sections** - Hover effects, smooth scrolling
- ✅ **Contact form** - Working contact functionality

## **Quick Start**

### **Development Server (Vite)**
Start the development server with hot module replacement:
```bash
npm run dev
```
This will start Vite dev server on `http://localhost:3000`

### **Build for Production**
Build optimized production files:
```bash
npm run build
```
Output will be in the `dist/` directory.

### **Preview Production Build**
Preview the production build locally:
```bash
npm run preview
```

### **Generate Website from Template**
```bash
npm run generate
```

### **Generate PDF Resume**
```bash
npm run generate-pdf
```

## **Available Commands**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build optimized production files |
| `npm run preview` | Preview production build locally |
| `npm run generate` | Generate resume website from template |
| `npm run generate-pdf` | Generate PDF resume from template |
| `npm run install-deps` | Install dependencies |

## **PDF Resume Features**

### **Professional PDF Output:**
- **A4 format** - Standard resume size
- **Print-optimized** - Perfect for printing and sharing
- **Professional design** - Clean, modern layout
- **All sections included** - Complete resume content
- **Consistent styling** - Enhanced section titles and formatting
- **Page breaks** - Proper section separation

### **Sections Included:**
- **Header** - Contact information and professional links
- **Proven Impact and Achievements** - Key metrics and accomplishments
- **Featured Projects** - Highlighted project showcase
- **Professional Experience** - Detailed work history with achievements
- **Technical Skills** - Comprehensive skills by category
- **Education** - Academic background

## **Website Features**

### **Professional Design:**
- **Modern layout** - Clean, professional appearance
- **Responsive design** - Works on desktop, tablet, and mobile
- **Brand colors** - Indigo, yellow, and red color scheme
- **Typography** - Professional font choices and hierarchy
- **Animations** - Subtle and professional effects

### **Sections Included:**
- **Hero Section** - Name, title, rotating typewriter effect
- **About Me** - Professional summary with stats
- **Featured Projects** - Highlighted project showcase
- **Professional Experience** - Tabbed interface (Freelance, Work, School)
- **Skills** - Categorized technical skills
- **Education** - Academic background
- **Contact** - Contact form and social links

### **Interactive Elements:**
- **Typewriter animation** - Rotating professional titles
- **Floating cards** - Animated background elements
- **Scroll effects** - Elements animate on scroll
- **Hover effects** - Interactive project cards
- **Smooth scrolling** - Navigation between sections
- **Tab switching** - Experience section navigation

## **Project Structure**

```
resume/
├── template.html          # HTML template for website
├── template-pdf.html     # HTML template for PDF
├── personal-data.json    # Your personal data in JSON format
├── generate-website.js   # Website generator script
├── generate-pdf.js       # PDF generator script
├── styles.css            # Website styling
├── styles-pdf.css        # PDF styling
├── script.js             # Website functionality
├── index.html            # Generated website
├── cv-anthony-okala.pdf  # Generated PDF resume
└── package.json          # Project configuration
```

## **Customization**

### **Personal Data (`personal-data.json`)**
- **Personal Info** - Name, title, description
- **Contact Info** - Email, phone, location
- **Social Links** - LinkedIn, GitHub, etc.
- **About Section** - Professional summary and stats
- **Experience** - Work, freelance, and academic experience
- **Skills** - Technical skills by category
- **Education** - Academic background
- **Projects** - Featured project showcase

### **Template System**
- **Mustache-style placeholders** - `{{variable}}` syntax
- **Dynamic content** - All data from JSON file
- **Easy customization** - Modify template or data
- **Reusable** - Use with different personal data

## **Technical Requirements**

- **Node.js** - Version 14.0.0 or higher
- **Vite** - Modern build tool (installed as dev dependency)
- **Modern browser** - For viewing the website
- **Text editor** - For customizing content

## **Tech Stack**

- **Build Tool**: Vite 7+ (fast HMR, optimized builds)
- **JavaScript**: Vanilla ES6+ modules
- **CSS**: Custom CSS with modern features
- **Template Engine**: Custom Node.js template system
- **PDF Generation**: Puppeteer (headless Chrome)

## **Benefits**

- **Professional appearance** - Stand out to recruiters
- **Mobile-friendly** - Works on all devices
- **Fast loading** - Optimized performance
- **SEO optimized** - Better search visibility
- **Easy to update** - Modify JSON data and regenerate
- **Template-based** - Reusable for different people
- **No complex setup** - Simple Node.js script

## **Perfect For**

- **Job seekers** - Professional online presence
- **Freelancers** - Client portfolio showcase
- **Students** - Academic project presentation
- **Professionals** - Career advancement
- **Anyone** - Personal branding and networking

---


**Ready to create your professional resume website and PDF? Run `npm run generate` for the website and `npm run generate-pdf` for the PDF!**

