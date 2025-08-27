// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const searchInput = document.getElementById('searchInput');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minPriceValue = document.getElementById('minPriceValue');
    const maxPriceValue = document.getElementById('maxPriceValue');
    const compareBtn = document.getElementById('compareBtn');
    const compareCount = document.getElementById('compareCount');
    const comparisonBanner = document.querySelector('.comparison-banner');

    // State
    let currentFilter = 'all';
    let currentSort = 'rating';
    let searchQuery = '';
    let minPrice = 0;
    let maxPrice = 5000;
    let selectedProducts = new Set();
    let allProducts = Array.from(document.querySelectorAll('.product-item'));

    // Initialize
    initializeFilters();
    initializePriceRange();
    initializeComparison();
    
    // Category filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.category;
            updateFilterButtons();
            filterProducts();
        });
    });

    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === currentFilter);
        });
    }

    // Sorting
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        sortProducts();
        filterProducts();
    });

    // Search functionality
    searchInput.addEventListener('input', debounce(function() {
        searchQuery = this.value.toLowerCase().trim();
        filterProducts();
    }, 300));

    // Price range functionality
    function initializePriceRange() {
        updatePriceValues();
        
        [minPriceInput, maxPriceInput].forEach(input => {
            input.addEventListener('input', function() {
                minPrice = parseInt(minPriceInput.value);
                maxPrice = parseInt(maxPriceInput.value);
                
                // Ensure min doesn't exceed max and vice versa
                if (minPrice >= maxPrice) {
                    if (this === minPriceInput) {
                        maxPrice = minPrice + 100;
                        maxPriceInput.value = maxPrice;
                    } else {
                        minPrice = maxPrice - 100;
                        minPriceInput.value = minPrice;
                    }
                }
                
                updatePriceValues();
                filterProducts();
            });
        });
    }

    function updatePriceValues() {
        minPriceValue.textContent = minPrice === 0 ? '$0' : `$${minPrice}`;
        maxPriceValue.textContent = maxPrice >= 5000 ? '$5000+' : `$${maxPrice}`;
    }

    // Filter products based on all criteria
    function filterProducts() {
        const products = Array.from(productsGrid.querySelectorAll('.product-item'));
        let visibleProducts = products.filter(product => {
            const category = product.dataset.category;
            const price = parseInt(product.dataset.price);
            const title = product.querySelector('h3').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            
            const matchesCategory = currentFilter === 'all' || category === currentFilter;
            const matchesPrice = price >= minPrice && price <= maxPrice;
            const matchesSearch = !searchQuery || 
                title.includes(searchQuery) || 
                description.includes(searchQuery) ||
                category.includes(searchQuery);
                
            return matchesCategory && matchesPrice && matchesSearch;
        });

        // Animate products in/out
        products.forEach(product => {
            const isVisible = visibleProducts.includes(product);
            if (isVisible) {
                product.style.display = 'flex';
                setTimeout(() => product.classList.add('fade-in'), 10);
                product.classList.remove('fade-out');
            } else {
                product.classList.add('fade-out');
                product.classList.remove('fade-in');
                setTimeout(() => {
                    if (product.classList.contains('fade-out')) {
                        product.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Show no results message if needed
        showNoResultsMessage(visibleProducts.length === 0);
        
        // Update load more button
        updateLoadMoreButton(visibleProducts.length);
    }

    // Sort products
    function sortProducts() {
        const products = Array.from(productsGrid.querySelectorAll('.product-item'));
        
        products.sort((a, b) => {
            switch (currentSort) {
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'price-low':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-high':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'name':
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameA.localeCompare(nameB);
                default:
                    return 0;
            }
        });

        // Re-append sorted products
        products.forEach(product => productsGrid.appendChild(product));
    }

    // Show/hide no results message
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <h3>No products found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Clear All Filters</button>
            `;
            productsGrid.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Clear all filters
    window.clearAllFilters = function() {
        currentFilter = 'all';
        searchQuery = '';
        minPrice = 0;
        maxPrice = 5000;
        currentSort = 'rating';
        
        searchInput.value = '';
        minPriceInput.value = 0;
        maxPriceInput.value = 5000;
        sortSelect.value = 'rating';
        
        updateFilterButtons();
        updatePriceValues();
        sortProducts();
        filterProducts();
    };

    // Update load more button
    function updateLoadMoreButton(visibleCount) {
        if (visibleCount === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Initialize filters
    function initializeFilters() {
        sortProducts();
        filterProducts();
    }

    // Product comparison functionality
    function initializeComparison() {
        // Add compare checkboxes to product cards
        document.querySelectorAll('.product-actions').forEach(actions => {
            if (!actions.querySelector('.compare-checkbox')) {
                const compareCheckbox = document.createElement('label');
                compareCheckbox.className = 'compare-checkbox';
                compareCheckbox.innerHTML = `
                    <input type="checkbox" class="compare-input">
                    <span class="compare-label">Compare</span>
                `;
                actions.appendChild(compareCheckbox);
            }
        });

        // Handle compare checkbox changes
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('compare-input')) {
                const productItem = e.target.closest('.product-item');
                const productName = productItem.querySelector('h3').textContent;
                
                if (e.target.checked) {
                    if (selectedProducts.size < 3) {
                        selectedProducts.add(productName);
                        productItem.classList.add('compare-selected');
                    } else {
                        e.target.checked = false;
                        alert('You can compare up to 3 products at a time.');
                    }
                } else {
                    selectedProducts.delete(productName);
                    productItem.classList.remove('compare-selected');
                }
                
                updateComparisonBanner();
            }
        });
    }

    function updateComparisonBanner() {
        compareCount.textContent = selectedProducts.size;
        
        if (selectedProducts.size > 0) {
            comparisonBanner.classList.add('active');
            compareBtn.disabled = selectedProducts.size < 2;
        } else {
            comparisonBanner.classList.remove('active');
            compareBtn.disabled = true;
        }
    }

    // Compare button functionality
    compareBtn.addEventListener('click', function() {
        if (selectedProducts.size >= 2) {
            const productNames = Array.from(selectedProducts);
            console.log('Comparing products:', productNames);
            // In a real application, this would navigate to a comparison page
            alert(`Comparing: ${productNames.join(', ')}`);
        }
    });

    // Product card click handlers
    document.querySelectorAll('.product-item').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons or checkboxes
            if (e.target.tagName === 'BUTTON' || 
                e.target.tagName === 'A' || 
                e.target.type === 'checkbox' ||
                e.target.closest('.product-actions')) return;
            
            const link = this.querySelector('h3 a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });

    // Load more functionality
    loadMoreBtn.addEventListener('click', function() {
        this.textContent = 'Loading...';
        this.disabled = true;
        
        // Simulate loading more products
        setTimeout(() => {
            console.log('Loading more products...');
            
            // In a real application, this would fetch and display more products
            this.textContent = 'Load More Products';
            this.disabled = false;
        }, 1000);
    });

    // Wishlist functionality
    document.querySelectorAll('.product-item').forEach(item => {
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        wishlistBtn.title = 'Add to wishlist';
        
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.className = 'fas fa-heart';
                this.title = 'Remove from wishlist';
                showToast('Added to wishlist');
            } else {
                icon.className = 'far fa-heart';
                this.title = 'Add to wishlist';
                showToast('Removed from wishlist');
            }
        });
        
        const productImage = item.querySelector('.product-image');
        productImage.appendChild(wishlistBtn);
    });

    // Toast notifications
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1f2937;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Quick view functionality
    document.querySelectorAll('.view-product-btn').forEach(btn => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'btn btn-secondary quick-view-btn';
        quickViewBtn.textContent = 'Quick View';
        quickViewBtn.style.marginLeft = '0.5rem';
        
        quickViewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productItem = this.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.current-price').textContent;
            const productImage = productItem.querySelector('.product-image img').src;
            const productDescription = productItem.querySelector('.product-description').textContent;
            
            showQuickView({
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription
            });
        });
        
        btn.parentNode.insertBefore(quickViewBtn, btn.nextSibling);
    });

    // Quick view modal
    function showQuickView(product) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="quick-view-info">
                        <h3>${product.name}</h3>
                        <div class="price">${product.price}</div>
                        <p>${product.description}</p>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary" onclick="viewFullDetails('${product.name}')">View Full Details</button>
                            <button class="btn btn-secondary" onclick="addToCompare('${product.name}')">Add to Compare</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles with unique ID
        const style = document.createElement('style');
        style.id = 'quick-view-modal-styles';
        style.textContent = `
            .quick-view-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
            }
            .modal-content {
                position: relative;
                background: white;
                border-radius: 12px;
                max-width: 800px;
                max-height: 90vh;
                overflow: auto;
                margin: 2rem;
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                z-index: 1001;
                color: #6b7280;
            }
            .modal-close:hover {
                color: #374151;
            }
            .quick-view-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            .quick-view-image img {
                width: 100%;
                border-radius: 8px;
            }
            .quick-view-info h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
            .quick-view-info .price {
                font-size: 1.5rem;
                font-weight: 700;
                color: #3b82f6;
                margin-bottom: 1rem;
            }
            .quick-view-info p {
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            .quick-view-actions {
                display: flex;
                gap: 1rem;
            }
            @media (max-width: 768px) {
                .quick-view-content {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Function to close modal
        const closeModal = function() {
            modal.remove();
            const modalStyle = document.getElementById('quick-view-modal-styles');
            if (modalStyle) {
                modalStyle.remove();
            }
            document.removeEventListener('keydown', escHandler);
        };
        
        // Close modal functionality - more specific event binding
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        // Direct click on close button
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
        
        // Click on overlay
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
        
        // Prevent modal close on content click
        modal.querySelector('.modal-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // ESC key to close
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Initialize URL parameters
    function initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const searchParam = urlParams.get('search');
        
        if (categoryParam) {
            currentFilter = categoryParam;
            updateFilterButtons();
        }
        
        if (searchParam) {
            searchQuery = searchParam;
            searchInput.value = searchParam;
        }
        
        filterProducts();
    }
    
    initializeFromURL();
    
    // Global functions for modal buttons
    window.viewFullDetails = function(productName) {
        // Map product names to their detail pages
        const productPages = {
            'MacBook Pro M3 Max 16"': 'product-macbook-pro-m3.html',
            'iPhone 15 Pro': 'product-iphone-15-pro.html',
            'MacBook Air M2': 'product-macbook-air-m2.html',
            'AirPods Pro (2nd Gen)': 'product-airpods-pro-2.html',
            '27" Gaming Monitor 165Hz': 'product-gaming-monitor.html',
            'SteelSeries Arctis 7P': 'product-gaming-headset.html',
            'Dell XPS 13 Plus': 'product-dell-xps-13.html',
            'Magic Keyboard': 'product-keyboard.html',
            'Samsung Galaxy S24': 'product-galaxy-s24.html',
            'Sony WH-1000XM5': 'product-studio-headphones.html'
        };
        
        const pageUrl = productPages[productName];
        if (pageUrl) {
            // Close modal first
            document.querySelector('.quick-view-modal')?.remove();
            const modalStyle = document.getElementById('quick-view-modal-styles');
            if (modalStyle) {
                modalStyle.remove();
            }
            window.location.href = pageUrl;
        } else {
            console.log('Product detail page not found for:', productName);
            showToast('Product details page coming soon!');
        }
    };
    
    window.addToCompare = function(productName) {
        // Find the product item and trigger compare checkbox
        const productItems = document.querySelectorAll('.product-item');
        for (const item of productItems) {
            const itemName = item.querySelector('h3').textContent;
            if (itemName === productName) {
                const checkbox = item.querySelector('.compare-input');
                if (checkbox && !checkbox.checked) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    showToast(`${productName} added to comparison`);
                } else if (checkbox && checkbox.checked) {
                    showToast(`${productName} is already in comparison`);
                } else {
                    showToast('Comparison feature not available');
                }
                break;
            }
        }
        
        // Close modal
        document.querySelector('.quick-view-modal')?.remove();
        const modalStyle = document.getElementById('quick-view-modal-styles');
        if (modalStyle) {
            modalStyle.remove();
        }
    };
});

// Debounce utility function
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

// Add wishlist button styles
const wishlistStyles = document.createElement('style');
wishlistStyles.textContent = `
    .wishlist-btn {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 3;
    }
    
    .wishlist-btn:hover {
        background: white;
        transform: scale(1.1);
    }
    
    .wishlist-btn.active {
        background: #ef4444;
        color: white;
    }
    
    .wishlist-btn i {
        font-size: 1rem;
        transition: color 0.3s ease;
    }
    
    .compare-selected {
        border: 2px solid #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
    
    .compare-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .compare-input {
        width: auto;
        margin: 0;
    }
`;
document.head.appendChild(wishlistStyles);