// ========== MOBILE MENU TOGGLE ==========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========== BEFORE/AFTER SLIDER ==========
function initializeComparison() {
    document.querySelectorAll('.before-after-container').forEach(container => {
        const slider = container.querySelector('.comparison-slider');
        const afterImg = container.querySelector('.after-img');
        let isActive = false;

        function updatePosition(e) {
            if (!isActive && e.type !== 'touchstart' && e.type !== 'touchmove') return;

            const rect = container.getBoundingClientRect();
            const x = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - rect.left;
            const width = rect.width;
            const percentage = (x / width) * 100;

            if (percentage >= 0 && percentage <= 100) {
                slider.style.left = percentage + '%';
                afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            }
        }

        slider.addEventListener('mousedown', () => { isActive = true; });
        slider.addEventListener('touchstart', () => { isActive = true; }, false);
        document.addEventListener('mouseup', () => { isActive = false; });
        document.addEventListener('touchend', () => { isActive = false; }, false);
        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('touchmove', updatePosition, false);

        container.addEventListener('click', updatePosition);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComparison);
} else {
    initializeComparison();
}

// ========== FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
            nom: formData.get('nom'),
            tel: formData.get('tel'),
            projet: formData.get('projet'),
            zone: formData.get('zone'),
            message: formData.get('message')
        };

        // Validation basique
        if (!data.nom || !data.tel || !data.projet || !data.zone) {
            alert('Veuillez remplir tous les champs requis.');
            return;
        }

        // Format pour WhatsApp ou email
        const message = `Demande de devis LBP COULEURS\n\nNom: ${data.nom}\nTéléphone: ${data.tel}\nProjet: ${data.projet}\nZone: ${data.zone}\nDescription: ${data.message || 'Non spécifiée'}`;

        // Log pour validation (à adapter avec votre backend)
        console.log('Formulaire soumis:', data);

        // Redirect to WhatsApp
        const whatsappUrl = `https://wa.me/33669121967?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Reset form
        this.reset();
    });
}

// ========== SMOOTH SCROLL BEHAVIOR FALLBACK ==========
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            smoothScroll(href);
        }
    });
});

// ========== LAZY LOADING OPTIMIZATION ==========
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Force reload
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========== PERFORMANCE MONITORING ==========
if ('PerformanceObserver' in window) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('LCP')) {
                    console.log('LCP:', entry.renderTime || entry.loadTime);
                }
            }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        // Fallback pour navigateurs non supportés
    }
}

// ========== PREVENT DOUBLE CLICK ON BUTTONS ==========
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function(e) {
        this.disabled = true;
        this.textContent = 'Envoi en cours...';
        setTimeout(() => {
            this.disabled = false;
            this.textContent = '📧 Demander mon devis';
        }, 2000);
    });
});
