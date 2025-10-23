# Resume Website Template

A modern, responsive resume website template that can be easily customized with personal data.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Elements**: Rotating titles, floating cards, tabbed experience section
- **Template System**: Easy to customize with JSON data
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Fast Loading**: Optimized CSS and JavaScript

## File Structure

```
├── template.html          # HTML template with placeholders
├── personal-data.json     # Personal data in JSON format
├── generate-website.js    # Template engine script
├── styles.css            # CSS styles
├── script.js             # JavaScript functionality
├── index.html            # Generated website (after running generator)
└── README.md             # This file
```

## Quick Start

1. **Clone or download** the template files
2. **Edit `personal-data.json`** with your personal information
3. **Run the generator**:
   ```bash
   node generate-website.js
   ```
4. **Open `index.html`** in your browser

## Customization Guide

### 1. Personal Information

Edit the `personalInfo` section in `personal-data.json`:

```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "subtitle": "Your Subtitle",
    "description": "Your professional description",
    "cvDownload": "path/to/your/cv.pdf"
  }
}
```

### 2. Rotating Titles

Update the `rotatingTitles` array with your professional titles:

```json
{
  "rotatingTitles": [
    "Software Engineer",
    "Full-Stack Developer",
    "Data Scientist"
  ]
}
```

### 3. Floating Cards

Customize the floating cards in the hero section:

```json
{
  "floatingCards": [
    {
      "index": 1,
      "icon": "fas fa-code",
      "text": "JavaScript"
    }
  ]
}
```

### 4. About Section

Update your about information:

```json
{
  "about": {
    "subtitle": "Your subtitle",
    "description": "Your description",
    "expertise": "Your expertise",
    "stats": [
      {
        "number": "5+",
        "label": "Years Experience"
      }
    ],
    "expertiseItems": [
      {
        "icon": "fas fa-code",
        "title": "Web Development"
      }
    ]
  }
}
```

### 5. Projects

Add your featured projects:

```json
{
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "icon": "fas fa-globe",
      "tags": ["React", "Node.js"],
      "liveUrl": "https://project-url.com"
    }
  ]
}
```

### 6. Experience

Structure your experience in three categories:

- **Freelance Work**: Personal projects and freelance work
- **Professional Work**: Full-time employment
- **Academic Work**: Research, thesis, and academic projects

### 7. Skills

Define your technical skills:

```json
{
  "skills": [
    {
      "category": "Programming Languages",
      "items": [
        {"name": "JavaScript", "level": 90},
        {"name": "Python", "level": 85}
      ]
    }
  ]
}
```

### 8. Education

Add your educational background:

```json
{
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "date": "2018 - 2022",
      "icon": "fas fa-graduation-cap",
      "details": [
        {"key": "GPA", "value": "3.8/4.0"},
        {"key": "Relevant Coursework", "value": "Data Structures, Algorithms"}
      ]
    }
  ]
}
```

### 9. Contact Information

Update your contact details:

```json
{
  "contact": {
    "cards": [
      {
        "icon": "fas fa-envelope",
        "title": "Email",
        "value": "your.email@example.com"
      }
    ]
  },
  "socialLinks": [
    {
      "icon": "fab fa-linkedin",
      "url": "https://linkedin.com/in/yourprofile"
    }
  ]
}
```

## Template Syntax

The template uses a simple syntax:

- `{{variable}}` - Simple variable replacement
- `{{#array}}...{{/array}}` - Loop through arrays
- `{{#if condition}}...{{/if}}` - Conditional rendering

## Styling

The website uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-indigo: #4f46e5;
  --secondary-yellow: #f59e0b;
  --accent-red: #ef4444;
  /* ... more variables */
}
```

## JavaScript Features

- **Rotating Titles**: Typewriter effect for hero titles
- **Floating Cards**: Animated floating elements
- **Tab Switching**: Interactive experience tabs
- **Smooth Scrolling**: Navigation between sections
- **Form Handling**: Contact form functionality

## Deployment

1. **Static Hosting**: Upload all files to any static hosting service
2. **GitHub Pages**: Push to a GitHub repository and enable Pages
3. **Netlify**: Drag and drop the folder to Netlify
4. **Vercel**: Connect your repository to Vercel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This template is free to use for personal and commercial projects.

## Support

For questions or issues, please check the documentation or create an issue in the repository.

---

**Happy coding!** 🚀