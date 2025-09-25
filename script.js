// Initialize EmailJS
emailjs.init({
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY', // Replace with your EmailJS Public Key
});

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const downloadResumeBtn = document.getElementById('download-resume');

// Navbar functionality
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        backToTopBtn.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        backToTopBtn.classList.remove('visible');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate progress bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.progress-fill');
                const progress = progressBar.getAttribute('data-progress');
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 300);
            }
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Contact form functionality
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Validate form
    let isValid = true;
    
    if (!name) {
        showError('name-error', 'Name is required');
        isValid = false;
    }
    
    if (!email) {
        showError('email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email-error', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!message) {
        showError('message-error', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('message-error', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send email using EmailJS
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'Your Name',
        });
        
        // Show success message
        showSuccessMessage('Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
        
    } catch (error) {
        console.error('Email send failed:', error);
        showErrorMessage('Failed to send message. Please try again or contact me directly.');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Resume download functionality
downloadResumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Create a temporary link to download the resume
    // In a real implementation, you would link to your actual resume file
  //  const link = document.createElement('a');
   // link.href = './Assets/cv.pdf'; // Replace with your actual resume file path
  //  link.download = 'cv_sukhdeep_singh.pdf'; // Desired file name
  //  document.body.appendChild(link);
  //  link.click();
   // document.body.removeChild(link);
    
    // Show notification
    showNotification('Resume download started!');
});

// Helper functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        marginLeft: '1rem'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification();
    }, 5000);
    
    // Manual close
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification();
    });
    
    function removeNotification() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Particle effect for hero section (optional enhancement)
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles if canvas exists
const particleCanvas = document.getElementById('particles');
if (particleCanvas) {
    new ParticleSystem(particleCanvas);
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add smooth reveal animation for timeline items
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Initialize timeline animations
document.addEventListener('DOMContentLoaded', animateTimeline);

// // Add interactive cursor effect (optional)
// function createCursorEffect() {
//     const cursor = document.createElement('div');
//     cursor.className = 'custom-cursor';
//     cursor.style.cssText = `
//         position: fixed;
//         width: 20px;
//         height: 20px;
//         background: rgba(59, 130, 246, 0.5);
//         border-radius: 50%;
//         pointer-events: none;
//         z-index: 10000;
//         transform: translate(-50%, -50%);
//         transition: all 0.1s ease;
//         display: none;
//     `;
    
//     document.body.appendChild(cursor);
    
//     document.addEventListener('mousemove', (e) => {
//         cursor.style.left = e.clientX + 'px';
//         cursor.style.top = e.clientY + 'px';
//         cursor.style.display = 'block';
//     });
    
//     document.addEventListener('mouseenter', () => {
//         cursor.style.display = 'block';
//     });
    
//     document.addEventListener('mouseleave', () => {
//         cursor.style.display = 'none';
//     });
    
//     // Scale cursor on hover over interactive elements
//     const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
//     interactiveElements.forEach(el => {
//         el.addEventListener('mouseenter', () => {
//             cursor.style.transform = 'translate(-50%, -50%) scale(2)';
//             cursor.style.background = 'rgba(139, 92, 246, 0.5)';
//         });
        
//         el.addEventListener('mouseleave', () => {
//             cursor.style.transform = 'translate(-50%, -50%) scale(1)';
//             cursor.style.background = 'rgba(59, 130, 246, 0.5)';
//         });
//     });
// }

// // Initialize cursor effect on desktop only
// if (window.innerWidth > 768) {
//     createCursorEffect();
// }
