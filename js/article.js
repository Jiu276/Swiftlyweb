// Article page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Table of Contents functionality
    initializeTableOfContents();
    
    // Share functionality
    initializeShareButtons();
    
    // Comment form
    initializeCommentForm();
    
    // Reading progress bar
    initializeReadingProgress();
    
    // Lazy loading for images
    initializeLazyLoading();
    
    // Smooth scrolling for TOC links
    initializeSmoothScrolling();
});

function initializeTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const headings = document.querySelectorAll('.main-content h2, .main-content h3');
    
    // Add IDs to headings if they don't have them
    headings.forEach((heading, index) => {
        if (!heading.id) {
            const text = heading.textContent.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            heading.id = text || `heading-${index}`;
        }
    });
    
    // Update TOC links to match heading IDs
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetHeading = document.getElementById(targetId);
            if (!targetHeading) {
                // Try to find heading by text content
                const linkText = link.textContent.toLowerCase();
                const matchingHeading = Array.from(headings).find(h => 
                    h.textContent.toLowerCase().includes(linkText) ||
                    linkText.includes(h.textContent.toLowerCase())
                );
                if (matchingHeading) {
                    link.setAttribute('href', `#${matchingHeading.id}`);
                }
            }
        }
    });
    
    // Highlight active TOC item on scroll
    function updateTOCHighlight() {
        let currentSection = '';
        const scrollPos = window.scrollY + 100;
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY;
            
            if (offsetTop <= scrollPos) {
                currentSection = heading.id;
            }
        });
        
        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Throttled scroll listener
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateTOCHighlight);
            ticking = true;
            setTimeout(() => ticking = false, 10);
        }
    }
    
    window.addEventListener('scroll', requestTick);
    updateTOCHighlight(); // Initial call
}

function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const currentURL = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList[1]; // twitter, facebook, etc.
            let shareURL = '';
            
            switch(platform) {
                case 'twitter':
                    shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentURL)}`;
                    break;
                case 'facebook':
                    shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
                    break;
                case 'linkedin':
                    shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}`;
                    break;
                case 'copy':
                    copyToClipboard(currentURL);
                    showCopyFeedback(this);
                    return;
            }
            
            if (shareURL) {
                window.open(shareURL, '_blank', 'width=600,height=400');
            }
        });
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }
}

function showCopyFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '#6b7280';
    }, 2000);
}

function initializeCommentForm() {
    const commentForm = document.querySelector('.comment-form form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const comment = this.querySelector('textarea').value;
            
            if (name && email && comment) {
                // Simulate comment submission
                showCommentSuccess();
                this.reset();
            }
        });
    }
    
    // Reply button functionality
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentContent = this.closest('.comment-content');
            const authorName = commentContent.querySelector('h5').textContent;
            const commentTextarea = document.querySelector('.comment-form textarea');
            
            if (commentTextarea) {
                commentTextarea.value = `@${authorName} `;
                commentTextarea.focus();
                commentTextarea.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function showCommentSuccess() {
    const form = document.querySelector('.comment-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'comment-success';
    successMessage.innerHTML = `
        <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <i class="fas fa-check-circle"></i> Thank you for your comment! It has been submitted for moderation.
        </div>
    `;
    
    form.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    
    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .reading-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #10b981);
            transition: width 0.1s ease;
            width: 0%;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.reading-progress-fill');
    const article = document.querySelector('.main-content');
    
    function updateProgress() {
        if (!article) return;
        
        const articleRect = article.getBoundingClientRect();
        const articleTop = articleRect.top + window.scrollY;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        const startReading = articleTop - windowHeight;
        const finishReading = articleTop + articleHeight;
        const totalReadingDistance = finishReading - startReading;
        const currentReadingDistance = scrollTop - startReading;
        
        const progress = Math.max(0, Math.min(100, (currentReadingDistance / totalReadingDistance) * 100));
        progressFill.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                // When image loads, fade it in
                img.onload = function() {
                    this.style.opacity = '1';
                };
                
                // If image is already cached, show it immediately
                if (img.complete) {
                    img.style.opacity = '1';
                }
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

function initializeSmoothScrolling() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Newsletter subscription in sidebar
document.addEventListener('DOMContentLoaded', function() {
    const sidebarNewsletter = document.querySelector('.sidebar-newsletter');
    
    if (sidebarNewsletter) {
        sidebarNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const button = this.querySelector('button');
            const originalButtonText = button.textContent;
            
            if (emailInput.value) {
                button.textContent = 'Subscribing...';
                button.disabled = true;
                
                // Simulate subscription
                setTimeout(() => {
                    button.textContent = 'Subscribed!';
                    button.style.background = '#10b981';
                    emailInput.value = '';
                    
                    setTimeout(() => {
                        button.textContent = originalButtonText;
                        button.style.background = '#3b82f6';
                        button.disabled = false;
                    }, 3000);
                }, 1000);
            }
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Esc to close any modals or overlays
    if (e.key === 'Escape') {
        // Close search if open
        const searchBar = document.querySelector('.search-bar');
        if (searchBar && searchBar.classList.contains('active')) {
            searchBar.classList.remove('active');
        }
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        const searchBar = document.querySelector('.search-bar');
        
        if (searchInput && searchBar) {
            searchBar.classList.add('active');
            searchInput.focus();
        }
    }
});

// Print functionality
function printArticle() {
    // Create print-specific styles
    const printStyles = `
        @media print {
            .header, .footer, .sidebar, .share-section, .comments-section {
                display: none !important;
            }
            .content-wrapper {
                grid-template-columns: 1fr !important;
            }
            .main-content {
                max-width: 100% !important;
            }
            body {
                font-size: 12pt !important;
                line-height: 1.5 !important;
            }
            .article-title {
                font-size: 24pt !important;
            }
            h2 {
                font-size: 18pt !important;
            }
            h3 {
                font-size: 16pt !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    window.print();
    
    // Remove print styles after printing
    setTimeout(() => {
        document.head.removeChild(styleSheet);
    }, 1000);
}

// Export functionality for sharing
window.shareArticle = {
    print: printArticle,
    copyLink: () => copyToClipboard(window.location.href),
    scrollToComments: () => {
        const commentsSection = document.querySelector('.comments-section');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
};