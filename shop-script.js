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

// Shop Filtering and Search
class ShopFilters {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.filterAccounts();
            });
        });

        // Search input
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAccounts();
            });
        }

        // Sort select
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortAccounts(e.target.value);
            });
        }
    }

    setActiveFilter(button) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        this.currentFilter = button.dataset.filter;
    }

    filterAccounts() {
        const accounts = document.querySelectorAll('.account-card');
        
        accounts.forEach(account => {
            const categories = account.dataset.category.split(' ');
            const title = account.querySelector('.card-title').textContent.toLowerCase();
            const stats = account.querySelector('.card-stats').textContent.toLowerCase();
            
            let shouldShow = true;
            
            // Apply filter
            if (this.currentFilter !== 'all') {
                shouldShow = categories.includes(this.currentFilter);
            }
            
            // Apply search
            if (shouldShow && this.searchTerm) {
                shouldShow = title.includes(this.searchTerm) || stats.includes(this.searchTerm);
            }
            
            // Show/hide account
            if (shouldShow) {
                account.style.display = 'block';
                account.classList.add('fade-in');
                setTimeout(() => {
                    account.classList.add('visible');
                }, 100);
            } else {
                account.style.display = 'none';
                account.classList.remove('visible');
            }
        });
        
        // Show/hide load more button based on visible accounts
        this.updateLoadMoreButton();
    }

    sortAccounts(sortType) {
        const accountsGrid = document.querySelector('.accounts-grid');
        const accounts = Array.from(accountsGrid.children);
        
        accounts.sort((a, b) => {
            const priceA = this.extractPrice(a);
            const priceB = this.extractPrice(b);
            const levelA = this.extractLevel(a);
            const levelB = this.extractLevel(b);
            
            switch (sortType) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'level':
                    return levelB - levelA;
                case 'newest':
                default:
                    return 0; // Keep original order
            }
        });
        
        // Re-append sorted accounts
        accounts.forEach(account => {
            accountsGrid.appendChild(account);
        });
    }

    extractPrice(accountCard) {
        const priceText = accountCard.querySelector('.price').textContent;
        return parseInt(priceText.replace(/[^\d]/g, ''));
    }

    extractLevel(accountCard) {
        const levelText = accountCard.querySelector('.stat').textContent;
        const match = levelText.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }

    updateLoadMoreButton() {
        const visibleAccounts = document.querySelectorAll('.account-card[style*="block"], .account-card:not([style*="none"])');
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (loadMoreBtn) {
            if (visibleAccounts.length < 8) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
            }
        }
    }
}

// Quick View Modal
class QuickViewModal {
    constructor() {
        this.modal = document.getElementById('quickViewModal');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Quick view buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-btn')) {
                e.preventDefault();
                this.showModal(e.target.closest('.account-card'));
            }
        });

        // Close modal
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            this.hideModal();
        });

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }

    showModal(accountCard) {
        const image = accountCard.querySelector('.card-image img').src;
        const title = accountCard.querySelector('.card-title').textContent;
        const stats = accountCard.querySelectorAll('.stat');
        const skins = stats[0]?.textContent || '';
        const dances = stats[1]?.textContent || '';
        const pickaxes = stats[2]?.textContent || '';
        const created = stats[3]?.textContent.replace('تاريخ الإنشاء: ', '') || '2018';
        const price = accountCard.querySelector('.price').textContent;
        const originalPrice = accountCard.querySelector('.original-price')?.textContent || '';
        const isRental = accountCard.dataset.category.includes('rental');

        this.modal.querySelector('#modalImage').src = image;
        this.modal.querySelector('#modalTitle').textContent = title;
        this.modal.querySelector('#modalSkins').textContent = skins.replace('السكنات: ', '');
        this.modal.querySelector('#modalDances').textContent = dances.replace('الرقصات: ', '');
        this.modal.querySelector('#modalPickaxes').textContent = pickaxes.replace('البيكاكسات: ', '');
        this.modal.querySelector('#modalCreated').textContent = created;
        this.modal.querySelector('#modalPrice').textContent = price;
        if (originalPrice) {
            this.modal.querySelector('#modalOriginalPrice').textContent = originalPrice;
            this.modal.querySelector('#modalOriginalPrice').style.display = 'inline';
        } else {
            this.modal.querySelector('#modalOriginalPrice').style.display = 'none';
        }
        const features = this.getFeaturesForAccount(accountCard);
        const featuresList = this.modal.querySelector('#modalFeatures');
        featuresList.innerHTML = features.map(feature => `<li>${feature}</li>`).join('');
        const modalBtn = this.modal.querySelector('.modal-footer .btn-primary');
        if (isRental) {
            modalBtn.textContent = 'احجز الآن';
        } else {
            modalBtn.textContent = 'اشتري الآن';
        }
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    getFeaturesForAccount(accountCard) {
        const categories = accountCard.dataset.category;
        const features = ['حساب آمن وموثق', 'ضمان استرداد كامل', 'دعم فني 24/7'];
        
        if (categories.includes('og')) {
            features.push('سكنات OG نادرة');
        }
        if (categories.includes('rare')) {
            features.push('عناصر نادرة');
        }
        if (categories.includes('high-level')) {
            features.push('مستوى عالي');
            features.push('إنجازات متقدمة');
        }
        if (categories.includes('rental')) {
            features.push('إيجار مرن');
            features.push('تسجيل دخول آمن');
        }
        if (categories.includes('purchase')) {
            features.push('ملكية كاملة');
            features.push('تحويل فوري');
        }
        
        return features;
    }
}

// Rental Terms Modal
class RentalTermsModal {
    constructor() {
        this.modal = document.getElementById('rentalTermsModal');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Close modal
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            this.hideModal();
        });

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });

        // Agree to terms button
        const agreeBtn = this.modal.querySelector('.btn-primary');
        agreeBtn.addEventListener('click', () => {
            this.hideModal();
            this.showNotification('تم الاتفاق على الشروط! سيتم التواصل معك قريباً.', 'success');
        });
    }

    showModal() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

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

// Interactive Features
class InteractiveFeatures {
    constructor() {
        this.rentalTermsModal = new RentalTermsModal();
        this.init();
    }

    init() {
        this.addScrollEffects();
        this.addHoverEffects();
        this.addPurchaseHandling();
        this.addLoadMoreFunctionality();
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

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed', 'visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.account-card, .scroll-reveal, .fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    addHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.account-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addPurchaseHandling() {
        // Buy/Book buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                e.preventDefault();
                this.handlePurchase(e.target);
            }
        });

        // Details buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('details-btn')) {
                e.preventDefault();
                this.showAccountDetails(e.target);
            }
        });
    }

    handlePurchase(button) {
        const card = button.closest('.account-card');
        const accountName = card.querySelector('.card-title').textContent;
        const price = card.querySelector('.price').textContent;
        const isRental = card.dataset.category.includes('rental');
        
        if (isRental) {
            // Show rental terms modal
            this.rentalTermsModal.showModal();
        } else {
            // Handle purchase
            this.showNotification(`جاري معالجة طلب شراء ${accountName} مقابل ${price}`, 'info');
            
            // Simulate purchase process
            setTimeout(() => {
                this.showNotification('تم إتمام عملية الشراء بنجاح! سيتم التواصل معك عبر الواتساب.', 'success');
            }, 3000);
        }
    }

    showAccountDetails(button) {
        const card = button.closest('.account-card');
        const accountName = card.querySelector('.card-title').textContent;
        const isRental = card.dataset.category.includes('rental');
        
        if (isRental) {
            // Show rental terms for rental accounts
            this.rentalTermsModal.showModal();
        } else {
            // Create detailed modal for purchase accounts
            this.createDetailedModal(accountName, card);
        }
    }

    createDetailedModal(accountName, accountCard) {
        const modal = document.createElement('div');
        modal.className = 'detailed-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>تفاصيل كاملة: ${accountName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="account-gallery">
                        <img src="${accountCard.querySelector('.card-image img').src}" alt="${accountName}">
                        <div class="gallery-thumbnails">
                            <img src="images/Fortnite-skin-Galaxy.jpg" alt="Screenshot 1">
                            <img src="images/what-are-the-rarest-fortnite-skins-in-2023-23030903-1200x675.webp" alt="Screenshot 2">
                            <img src="images/98bfa4af-44ae-433e-9115-ed809cd3b6de-1000x1000-Q9NHyvPpNWucWo1Hyu3CQBg4mcQaFilt4zJVOBIB.webp" alt="Screenshot 3">
                        </div>
                    </div>
                    <div class="account-details">
                        <div class="detail-section">
                            <h4>معلومات الحساب</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="label">المستوى:</span>
                                    <span class="value">${this.extractLevel(accountCard)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">عدد السكنات:</span>
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
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>المميزات</h4>
                            <ul class="features-list">
                                <li>حساب آمن وموثق</li>
                                <li>ضمان استرداد كامل</li>
                                <li>دعم فني 24/7</li>
                                <li>تسليم فوري</li>
                            </ul>
                        </div>
                        <div class="detail-section">
                            <h4>طريقة الدفع</h4>
                            <div class="payment-methods">
                                <span class="payment-method">بطاقة ائتمان</span>
                                <span class="payment-method">PayPal</span>
                                <span class="payment-method">تحويل بنكي</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="price-section">
                        <span class="price">${accountCard.querySelector('.price').textContent}</span>
                        ${accountCard.querySelector('.original-price') ? `<span class="original-price">${accountCard.querySelector('.original-price').textContent}</span>` : ''}
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-primary">اشتري الآن</button>
                        <button class="btn btn-outline">تواصل معنا</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .detailed-modal {
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
            .detailed-modal .modal-content {
                background: var(--card-bg);
                border-radius: 20px;
                max-width: 900px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                border: 1px solid rgba(139, 92, 246, 0.2);
                box-shadow: var(--shadow-card);
            }
            .account-gallery {
                margin-bottom: 2rem;
            }
            .account-gallery img {
                width: 100%;
                border-radius: 15px;
                margin-bottom: 1rem;
            }
            .gallery-thumbnails {
                display: flex;
                gap: 1rem;
            }
            .gallery-thumbnails img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .gallery-thumbnails img:hover {
                transform: scale(1.1);
            }
            .detail-section {
                margin-bottom: 2rem;
            }
            .detail-section h4 {
                color: var(--neon-purple);
                margin-bottom: 1rem;
            }
            .detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            .features-list {
                list-style: none;
                padding: 0;
            }
            .features-list li {
                padding: 0.5rem 0;
                color: var(--text-secondary);
                position: relative;
                padding-right: 1.5rem;
            }
            .features-list li::before {
                content: '✓';
                position: absolute;
                right: 0;
                color: var(--neon-green);
                font-weight: bold;
            }
            .payment-methods {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .payment-method {
                padding: 0.5rem 1rem;
                background: rgba(139, 92, 246, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 20px;
                color: var(--text-primary);
                font-size: 0.9rem;
            }
            .price-section {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .action-buttons {
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

    extractLevel(accountCard) {
        const levelText = accountCard.querySelector('.stat').textContent;
        const match = levelText.match(/\d+/);
        return match ? match[0] : '0';
    }

    addLoadMoreFunctionality() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreAccounts();
            });
        }
    }

    loadMoreAccounts() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        loadMoreBtn.textContent = 'جاري التحميل...';
        loadMoreBtn.disabled = true;

        // Simulate loading more accounts
        setTimeout(() => {
            this.showNotification('تم تحميل المزيد من الحسابات!', 'success');
            loadMoreBtn.textContent = 'تحميل المزيد';
            loadMoreBtn.disabled = false;
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

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
    new ShopFilters();
    new QuickViewModal();
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