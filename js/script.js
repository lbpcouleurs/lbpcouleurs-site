// ==================== NAVIGATION MOBILE MENU ==================== 
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
});

// ==================== NAVBAR SCROLL EFFECT ==================== 
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== BEFORE/AFTER SLIDER ==================== 
function initBeforeAfterSlider() {
    const beforeAfterContainers = document.querySelectorAll('.before-after');

    beforeAfterContainers.forEach(container => {
        const afterImage = container.querySelector('.after-image');
        const handle = container.querySelector('.slider-handle');
        let isActive = false;

        container.addEventListener('mousedown', function(e) {
            isActive = true;
        });

        document.addEventListener('mouseup', function() {
            isActive = false;
        });

        container.addEventListener('mousemove', function(e) {
            if (!isActive) return;
            updateSlider(e);
        });

        container.addEventListener('touchstart', function() {
            isActive = true;
        });

        document.addEventListener('touchend', function() {
            isActive = false;
        });

        container.addEventListener('touchmove', function(e) {
            if (!isActive) return;
            updateSlider(e.touches[0]);
        });

        function updateSlider(e) {
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left;

            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;

            afterImage.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
            handle.style.left = percentage + '%';
        }
    });
}

initBeforeAfterSlider();

// ==================== SCROLL ANIMATIONS ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .stat-card, .gallery-item, .review-card').forEach(el => {
    observer.observe(el);
});

// ==================== FORM HANDLING ==================== 
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!nom || !telephone || !email || !message) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        // Phone validation (basic)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(telephone) || telephone.replace(/\D/g, '').length < 10) {
            alert('Veuillez entrer un numéro de téléphone valide.');
            return;
        }

        // Submit to Formspree
        this.submit();
    });
}

// ==================== SMOOTH SCROLL FOR CTA BUTTONS ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ==================== PAGE LOAD ANIMATIONS ==================== 
window.addEventListener('load', function() {
    // Animate service cards on load
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `slideUp 0.6s ease-out 0.${index * 1}s backwards`;
        }, index * 50);
    });
});

// ==================== KEYBOARD ACCESSIBILITY ==================== 
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const menuToggle = document.getElementById('menuToggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

// ==================== PERFORMANCE OPTIMIZATION ==================== 
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}
