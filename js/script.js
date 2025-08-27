// Main JavaScript functionality for Swiftlyweb
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.getElementById('searchInput');
    
    searchToggle?.addEventListener('click', function() {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    mobileMenuToggle?.addEventListener('click', function() {
        navigation.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
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

    // Article card click handlers
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            let articleUrl = '';
            
            // Map article titles to their corresponding pages
            if (title.includes('MacBook Pro M3')) {
                articleUrl = 'pages/article-macbook-pro-m3.html';
            } else if (title.includes('Gaming Monitors')) {
                articleUrl = 'pages/article-gaming-monitors.html';
            } else if (title.includes('VS Code vs JetBrains')) {
                articleUrl = 'pages/article-vs-code-jetbrains.html';
            } else if (title.includes('Project Management Tools')) {
                articleUrl = 'pages/article-project-management.html';
            }
            
            if (articleUrl) {
                window.location.href = articleUrl;
            } else {
                console.log('Navigate to article:', title);
            }
        });
    });

    // Product card click handlers
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            // In a real application, this would navigate to the product page
            console.log('Navigate to product:', this.querySelector('h4').textContent);
        });
    });

    // Category card click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('.category-link');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    });

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        if (email) {
            alert('Thank you for subscribing! We\'ll keep you updated with our latest reviews.');
            this.querySelector('input[type="email"]').value = '';
        }
    });

    // Search functionality
    const searchForm = document.getElementById('searchForm');
    const searchButton = document.querySelector('.search-bar button');
    
    // Handle form submission
    searchForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Handle button click
    searchButton?.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Handle Enter key in search input
    searchInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput?.value.trim();
        if (query) {
            console.log('Searching for:', query);
            
            // Visual feedback
            const button = searchButton || document.querySelector('.search-bar button');
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    // Close search bar
                    searchBar?.classList.remove('active');
                    // Navigate to blog page with search query
                    if (window.location.pathname.includes('pages/')) {
                        window.location.href = `blog.html?search=${encodeURIComponent(query)}`;
                    } else {
                        window.location.href = `pages/blog.html?search=${encodeURIComponent(query)}`;
                    }
                }, 500);
            } else {
                // Fallback without animation
                searchBar?.classList.remove('active');
                if (window.location.pathname.includes('pages/')) {
                    window.location.href = `blog.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = `pages/blog.html?search=${encodeURIComponent(query)}`;
                }
            }
        } else {
            // Shake animation for empty search
            searchInput?.classList.add('shake');
            setTimeout(() => searchInput?.classList.remove('shake'), 500);
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.article-card, .product-card, .category-card').forEach(el => {
        observer.observe(el);
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Social media link handlers
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').classList[1].split('-')[1];
            console.log(`Navigate to ${platform} social media page`);
            // In a real application, these would be actual social media URLs
        });
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Lazy loading images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}