// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initActiveNavLink();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initScrollIndicator();
    initFloatingElements();
    initScrollToTop();
});

// Navbar functionality
function initNavbar() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Active nav link on scroll - highlights current section in navigation
function initActiveNavLink() {
    const sections = ['home', 'achievements', 'about', 'projects', 'experience', 'skills', 'education', 'contact'];
    
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const updateActiveLink = (sectionId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveLink(id);
            }
        });
    }, observerOptions);
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) observer.observe(section);
    });
    
    // Set Home as active on initial load
    if (window.scrollY < 100) {
        updateActiveLink('home');
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.about-card, .timeline-item, .skill-category, .project-card, .education-item, .contact-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Add staggered animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Add staggered animation to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form functionality
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Scroll indicator functionality
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Hide scroll indicator when scrolling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// Floating elements animation
function initFloatingElements() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random movement with different intervals for each card
        const baseInterval = 3000 + index * 300; // Reduced stagger for more cards
        const randomDelay = Math.random() * 1500; // Reduced random delay
        
        setTimeout(() => {
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 12; // Further reduced movement range
                const randomY = (Math.random() - 0.5) * 12;
                const randomRotation = (Math.random() - 0.5) * 8; // Reduced rotation
                
                card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
            }, baseInterval);
        }, randomDelay);
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.1) rotate(5deg)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0deg)';
            card.style.zIndex = '1';
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typewriter effect for rotating titles
function initRotatingTitles() {
    const titles = [
        // 'IT / RPA Consultant',
        '{Software Engineer}',
        '{Cross-Platform Engineer}',
        '</Full-Stack Engineer>',
        '{AI-Driven Solutions Engineer}', 
        '</Automation Specialist>',
        'DevOps / GitOps Engineer'
    ];
    
    const titleElement = document.getElementById('rotating-title');
    if (!titleElement) return;
    
    let currentIndex = 0;
    let isTyping = false;
    let typeInterval;
    
    function typeText(text, callback) {
        if (isTyping) return;
        isTyping = true;
        
        titleElement.textContent = '';
        let charIndex = 0;
        
        typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                titleElement.textContent += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                isTyping = false;
                if (callback) callback();
            }
        }, 100); // Typing speed: 100ms per character
    }
    
    function eraseText(callback) {
        if (isTyping) return;
        isTyping = true;
        
        const currentText = titleElement.textContent;
        let charIndex = currentText.length;
        
        typeInterval = setInterval(() => {
            if (charIndex > 0) {
                titleElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                clearInterval(typeInterval);
                isTyping = false;
                if (callback) callback();
            }
        }, 50); // Erasing speed: 50ms per character (faster than typing)
    }
    
    function rotateTitle() {
        if (isTyping) return;
        
        const currentTitle = titles[currentIndex];
        
        // First erase current text
        eraseText(() => {
            // Then type new text
            typeText(currentTitle, () => {
                // Wait a bit before starting to erase again
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % titles.length;
                    rotateTitle();
                }, 2000); // Display time: 2 seconds
            });
        });
    }
    
    // Start with first title
    typeText(titles[currentIndex], () => {
        // Start rotation after initial typing is complete
        setTimeout(() => {
            currentIndex = 1;
            rotateTitle();
        }, 2000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tab functionality for experience section
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Function to switch to specific tab (for project links)
function switchToTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to target button and content
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    const targetContent = document.getElementById(tabName);
    
    if (targetButton && targetContent) {
        targetButton.classList.add('active');
        targetContent.classList.add('active');
    }
}

// Toggle achievements visibility
function toggleAchievements(id) {
    // Escape special characters for querySelector
    const escapedId = id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
    const achievementsList = document.querySelector(`[data-achievements-id="${escapedId}"]`);
    const toggleButton = achievementsList?.querySelector('.toggle-achievements');
    const toggleText = toggleButton?.querySelector('.toggle-text');
    const title = achievementsList?.querySelector('.achievements-title');
    
    if (!achievementsList) return;
    
    const isCollapsed = achievementsList.classList.contains('collapsed');
    
    if (isCollapsed) {
        achievementsList.classList.remove('collapsed');
        if (toggleText) toggleText.textContent = 'Show Less';
        if (toggleButton) toggleButton.classList.add('expanded');
        if (title) title.classList.add('expanded');
    } else {
        achievementsList.classList.add('collapsed');
        if (toggleText) toggleText.textContent = 'Show More';
        if (toggleButton) toggleButton.classList.remove('expanded');
        if (title) title.classList.remove('expanded');
    }
}

// Make toggleAchievements available globally
window.toggleAchievements = toggleAchievements;

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initialize rotating titles after page load
    setTimeout(initRotatingTitles, 500);
    
    // Initialize experience tabs
    initExperienceTabs();
    
    // Auto-expand first achievement list in each tab (optional - can be removed if too many are expanded)
    // Uncomment if you want first item expanded by default
    // const activeTab = document.querySelector('.tab-content.active');
    // if (activeTab) {
    //     const firstAchievements = activeTab.querySelector('.achievements-list');
    //     if (firstAchievements) {
    //         toggleAchievements(firstAchievements.getAttribute('data-achievements-id'));
    //     }
    // }
});

// Add CSS for loading animation
const loadingStyles = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-content i {
        font-size: 18px;
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.about-card, .project-card, .timeline-content, .education-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4F46E5, #F59E0B);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
initScrollProgress();

// Scroll-to-top button - appears after scrolling down
function initScrollToTop() {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Check on load

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Add particle effect to hero section
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    hero.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(79, 70, 229, 0.3);
            border-radius: 50%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particleContainer.appendChild(particle);
    }
}

// Initialize particle effect
initParticleEffect();

// Add CSS for particle animation
const particleStyles = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
    }
`;

const particleStyleSheet = document.createElement('style');
particleStyleSheet.textContent = particleStyles;
document.head.appendChild(particleStyleSheet);
