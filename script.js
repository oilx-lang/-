// Language Toggle Functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'ar';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateLanguage('ar');
    }

    bindEvents() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.updateLanguage(lang);
            });
        });
    }

    updateLanguage(lang) {
        this.currentLang = lang;
        
        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        // Update document direction
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Update all translatable elements
        this.updateTexts(lang);
    }

    updateTexts(lang) {
        const translatableElements = document.querySelectorAll('[data-ar][data-en]');
        translatableElements.forEach(element => {
            const text = lang === 'ar' ? element.dataset.ar : element.dataset.en;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Smooth Scrolling
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            this.checkScroll();
        });
    }

    checkScroll() {
        const elements = document.querySelectorAll('.scroll-reveal, .fade-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed', 'visible');
            }
        });
    }
}

// Interactive Features
class InteractiveFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollEffects();
        this.addHoverEffects();
        this.addFormHandling();
        this.addAccountCardInteractions();
    }

    addScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    addHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.category-card, .account-card, .trust-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addFormHandling() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Show success message
            this.showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    addAccountCardInteractions() {
        const buyButtons = document.querySelectorAll('.account-card .btn-primary');
        buyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePurchase(e.target);
            });
        });

        const detailButtons = document.querySelectorAll('.account-card .btn-outline');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAccountDetails(e.target);
            });
        });
    }

    handlePurchase(button) {
        const card = button.closest('.account-card');
        const accountName = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        
        this.showNotification(`جاري معالجة طلب شراء ${accountName} مقابل ${price}`, 'info');
        
        // Simulate purchase process
        setTimeout(() => {
            this.showNotification('تم إتمام عملية الشراء بنجاح! سيتم التواصل معك عبر الديسكورد.', 'success');
        }, 3000);
    }

    showAccountDetails(button) {
        const card = button.closest('.account-card');
        const accountName = card.querySelector('h3').textContent;
        
        // Create modal with account details
        this.createAccountModal(accountName);
    }

    createAccountModal(accountName) {
        const modal = document.createElement('div');
        modal.className = 'account-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>تفاصيل الحساب: ${accountName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="account-details">
                        <div class="detail-item">
                            <span class="label">المستوى:</span>
                            <span class="value">250</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">عدد الجلود:</span>
                            <span class="value">150+</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">الإنجازات:</span>
                            <span class="value">85%</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">تاريخ الإنشاء:</span>
                            <span class="value">2018</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">الحالة:</span>
                            <span class="value status-verified">موثق</span>
                        </div>
                    </div>
                    <div class="account-features">
                        <h4>المميزات:</h4>
                        <ul>
                            <li>جلود OG نادرة</li>
                            <li>إنجازات متقدمة</li>
                            <li>حساب آمن وموثق</li>
                            <li>ضمان استرداد كامل</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">اشتري الآن</button>
                    <button class="btn btn-secondary">تواصل معنا</button>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .account-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: var(--card-bg);
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid rgba(139, 92, 246, 0.2);
                box-shadow: var(--shadow-card);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(139, 92, 246, 0.1);
            }
            .modal-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-close:hover {
                color: var(--neon-purple);
            }
            .modal-body {
                padding: 1.5rem;
            }
            .account-details {
                margin-bottom: 2rem;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(139, 92, 246, 0.1);
            }
            .detail-item .label {
                color: var(--text-secondary);
            }
            .detail-item .value {
                color: var(--text-primary);
                font-weight: 600;
            }
            .status-verified {
                color: var(--neon-green) !important;
            }
            .account-features h4 {
                color: var(--neon-purple);
                margin-bottom: 1rem;
            }
            .account-features ul {
                list-style: none;
                padding: 0;
            }
            .account-features li {
                padding: 0.5rem 0;
                color: var(--text-secondary);
                position: relative;
                padding-right: 1.5rem;
            }
            .account-features li::before {
                content: '✓';
                position: absolute;
                right: 0;
                color: var(--neon-green);
                font-weight: bold;
            }
            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid rgba(139, 92, 246, 0.1);
                display: flex;
                gap: 1rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-info {
                background: var(--neon-blue);
            }
            .notification-success {
                background: var(--neon-green);
            }
            .notification-error {
                background: #ef4444;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
    new MobileNavigation();
    new SmoothScroller();
    new ScrollAnimations();
    new InteractiveFeatures();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Add floating particles effect
class ParticleEffect {
    constructor() {
        this.init();
    }

    init() {
        this.createParticles();
    }

    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        
        // Add particle styles
        const style = document.createElement('style');
        style.textContent = `
            .particle-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            }
            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--neon-purple);
                border-radius: 50%;
                opacity: 0.3;
                animation: float-particle 20s infinite linear;
            }
            @keyframes float-particle {
                0% {
                    transform: translateY(100vh) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100px) translateX(100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particleContainer.appendChild(particle);
        }

        document.body.appendChild(particleContainer);
    }
}

// Initialize particle effect
new ParticleEffect(); 