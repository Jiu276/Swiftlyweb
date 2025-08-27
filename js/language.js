// Multi-language support for Swiftlyweb
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.translations = {};
        this.loadTranslations();
        this.initializeLanguageSelector();
    }

    // Translation data
    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                'nav-home': 'Home',
                'nav-blog': 'Blog', 
                'nav-products': 'Products',
                'nav-about': 'About',
                'nav-contact': 'Contact',
                
                // Search
                'search-placeholder': 'Search articles and products...',
                
                // Hero section
                'hero-title': 'Discover the Best Tech Products',
                'hero-description': 'Expert reviews, in-depth comparisons, and honest recommendations for the latest technology products and platforms.',
                'btn-latest-reviews': 'Latest Reviews',
                'btn-browse-products': 'Browse Products',
                
                // Featured Articles
                'featured-articles-title': 'Featured Articles',
                'article-category-review': 'Review',
                'article-category-guide': 'Guide',
                'article-category-platform': 'Platform',
                'read-time': 'min read',
                
                // Products
                'product-recommendations': 'Top Product Recommendations',
                'view-details': 'View Details',
                'add-to-compare': 'Add to Compare',
                
                // Categories
                'explore-categories': 'Explore Categories',
                'category-laptops': 'Laptops',
                'category-smartphones': 'Smartphones', 
                'category-audio': 'Audio',
                'category-gaming': 'Gaming',
                'laptops-desc': 'From ultrabooks to gaming machines',
                'smartphones-desc': 'Latest mobile technology reviews',
                'audio-desc': 'Headphones, speakers, and more',
                'gaming-desc': 'Gaming gear and accessories',
                'explore-btn': 'Explore',
                
                // Footer
                'footer-description': 'Your trusted source for technology reviews and recommendations.',
                'quick-links': 'Quick Links',
                'categories': 'Categories',
                'newsletter': 'Newsletter',
                'newsletter-desc': 'Stay updated with our latest reviews and recommendations.',
                'email-placeholder': 'Enter your email',
                'subscribe': 'Subscribe',
                'copyright': '© 2025 Swiftlyweb. All rights reserved.'
            },
            zh: {
                // Navigation  
                'nav-home': '首页',
                'nav-blog': '博客',
                'nav-products': '产品',
                'nav-about': '关于',
                'nav-contact': '联系',
                
                // Search
                'search-placeholder': '搜索文章和产品...',
                
                // Hero section
                'hero-title': '发现最佳科技产品',
                'hero-description': '专业评测、深度比较，为您推荐最新科技产品和平台的诚实建议。',
                'btn-latest-reviews': '最新评测',
                'btn-browse-products': '浏览产品',
                
                // Featured Articles
                'featured-articles-title': '精选文章',
                'article-category-review': '评测',
                'article-category-guide': '指南',
                'article-category-platform': '平台',
                'read-time': '分钟阅读',
                
                // Products
                'product-recommendations': '热门产品推荐',
                'view-details': '查看详情',
                'add-to-compare': '添加对比',
                
                // Categories
                'explore-categories': '探索分类',
                'category-laptops': '笔记本电脑',
                'category-smartphones': '智能手机',
                'category-audio': '音频设备',
                'category-gaming': '游戏设备',
                'laptops-desc': '从超极本到游戏本',
                'smartphones-desc': '最新移动技术评测',
                'audio-desc': '耳机、音箱等音频产品',
                'gaming-desc': '游戏装备和配件',
                'explore-btn': '探索',
                
                // Footer
                'footer-description': '您值得信赖的科技评测和推荐源。',
                'quick-links': '快速链接',
                'categories': '分类',
                'newsletter': '订阅通讯',
                'newsletter-desc': '获取我们最新的评测和推荐资讯。',
                'email-placeholder': '输入您的邮箱',
                'subscribe': '订阅',
                'copyright': '© 2025 Swiftlyweb. 版权所有。'
            },
            es: {
                // Navigation
                'nav-home': 'Inicio',
                'nav-blog': 'Blog',
                'nav-products': 'Productos',
                'nav-about': 'Acerca de',
                'nav-contact': 'Contacto',
                
                // Search  
                'search-placeholder': 'Buscar artículos y productos...',
                
                // Hero section
                'hero-title': 'Descubre los Mejores Productos Tecnológicos',
                'hero-description': 'Reseñas expertas, comparaciones profundas y recomendaciones honestas para los últimos productos y plataformas tecnológicas.',
                'btn-latest-reviews': 'Últimas Reseñas',
                'btn-browse-products': 'Ver Productos',
                
                // Featured Articles
                'featured-articles-title': 'Artículos Destacados',
                'article-category-review': 'Reseña',
                'article-category-guide': 'Guía',
                'article-category-platform': 'Plataforma',
                'read-time': 'min de lectura',
                
                // Products
                'product-recommendations': 'Mejores Recomendaciones de Productos',
                'view-details': 'Ver Detalles',
                'add-to-compare': 'Agregar a Comparar',
                
                // Categories
                'explore-categories': 'Explorar Categorías',
                'category-laptops': 'Portátiles',
                'category-smartphones': 'Smartphones',
                'category-audio': 'Audio',
                'category-gaming': 'Gaming',
                'laptops-desc': 'Desde ultrabooks hasta máquinas gaming',
                'smartphones-desc': 'Reseñas de la última tecnología móvil',
                'audio-desc': 'Auriculares, altavoces y más',
                'gaming-desc': 'Equipo y accesorios gaming',
                'explore-btn': 'Explorar',
                
                // Footer
                'footer-description': 'Tu fuente confiable de reseñas y recomendaciones tecnológicas.',
                'quick-links': 'Enlaces Rápidos',
                'categories': 'Categorías',
                'newsletter': 'Boletín',
                'newsletter-desc': 'Mantente actualizado con nuestras últimas reseñas y recomendaciones.',
                'email-placeholder': 'Ingresa tu email',
                'subscribe': 'Suscribirse',
                'copyright': '© 2025 Swiftlyweb. Todos los derechos reservados.'
            },
            fr: {
                // Navigation
                'nav-home': 'Accueil',
                'nav-blog': 'Blog',
                'nav-products': 'Produits',
                'nav-about': 'À propos',
                'nav-contact': 'Contact',
                
                // Search
                'search-placeholder': 'Rechercher des articles et produits...',
                
                // Hero section
                'hero-title': 'Découvrez les Meilleurs Produits Tech',
                'hero-description': 'Avis d\'experts, comparaisons approfondies et recommandations honnêtes pour les derniers produits et plateformes technologiques.',
                'btn-latest-reviews': 'Derniers Avis',
                'btn-browse-products': 'Parcourir les Produits',
                
                // Featured Articles
                'featured-articles-title': 'Articles en Vedette',
                'article-category-review': 'Avis',
                'article-category-guide': 'Guide',
                'article-category-platform': 'Plateforme',
                'read-time': 'min de lecture',
                
                // Products
                'product-recommendations': 'Meilleures Recommandations de Produits',
                'view-details': 'Voir Détails',
                'add-to-compare': 'Ajouter à Comparer',
                
                // Categories
                'explore-categories': 'Explorer les Catégories',
                'category-laptops': 'Ordinateurs Portables',
                'category-smartphones': 'Smartphones',
                'category-audio': 'Audio',
                'category-gaming': 'Gaming',
                'laptops-desc': 'Des ultrabooks aux machines gaming',
                'smartphones-desc': 'Avis sur les dernières technologies mobiles',
                'audio-desc': 'Casques, haut-parleurs et plus',
                'gaming-desc': 'Équipement et accessoires gaming',
                'explore-btn': 'Explorer',
                
                // Footer
                'footer-description': 'Votre source fiable d\'avis et de recommandations technologiques.',
                'quick-links': 'Liens Rapides',
                'categories': 'Catégories',
                'newsletter': 'Newsletter',
                'newsletter-desc': 'Restez informé de nos derniers avis et recommandations.',
                'email-placeholder': 'Entrez votre email',
                'subscribe': 'S\'abonner',
                'copyright': '© 2025 Swiftlyweb. Tous droits réservés.'
            }
        };
    }

    // Initialize language selector functionality
    initializeLanguageSelector() {
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const currentLangSpan = document.getElementById('currentLang');
        
        if (!languageBtn || !languageDropdown || !currentLangSpan) return;

        // Set initial language display
        currentLangSpan.textContent = this.getLanguageCode(this.currentLanguage).toUpperCase();
        
        // Toggle dropdown
        languageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            languageDropdown.classList.remove('active');
        });

        // Language selection
        languageDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.target.tagName === 'A') {
                const selectedLang = e.target.dataset.lang;
                if (selectedLang && selectedLang !== this.currentLanguage) {
                    this.changeLanguage(selectedLang);
                }
                languageDropdown.classList.remove('active');
            }
        });
        
        // Apply initial translations
        this.applyTranslations();
    }

    // Change language
    changeLanguage(languageCode) {
        this.currentLanguage = languageCode;
        localStorage.setItem('selectedLanguage', languageCode);
        
        // Update language display
        const currentLangSpan = document.getElementById('currentLang');
        if (currentLangSpan) {
            currentLangSpan.textContent = this.getLanguageCode(languageCode).toUpperCase();
        }
        
        this.applyTranslations();
    }

    // Get language code for display
    getLanguageCode(languageCode) {
        const codes = {
            'en': 'EN',
            'zh': '中文',
            'es': 'ES', 
            'fr': 'FR'
        };
        return codes[languageCode] || 'EN';
    }

    // Apply translations to the page
    applyTranslations() {
        const translations = this.translations[this.currentLanguage] || this.translations.en;
        
        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });

        // Update document language attribute
        document.documentElement.lang = this.getLanguageCode(this.currentLanguage).toLowerCase();
    }

    // Get translation by key
    translate(key) {
        const translations = this.translations[this.currentLanguage] || this.translations.en;
        return translations[key] || key;
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});