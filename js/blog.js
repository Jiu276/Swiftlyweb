// Blog page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const postsGrid = document.getElementById('postsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const searchInput = document.getElementById('searchInput');
    const paginationBtns = document.querySelectorAll('.page-btn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // State
    let currentFilter = 'all';
    let currentSort = 'date-desc';
    let currentPage = 1;
    let totalPages = 8;
    let searchQuery = '';
    let allPosts = Array.from(document.querySelectorAll('.post-card'));

    // Initialize from URL parameters
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
            
            // Update page title to show search results
            const pageTitle = document.querySelector('.page-header h1');
            if (pageTitle) {
                pageTitle.textContent = `Search Results for "${searchParam}"`;
            }
            
            // Add search results info
            showSearchInfo(searchParam);
        }
        
        filterPosts();
    }
    
    // Show search info
    function showSearchInfo(query) {
        const pageDescription = document.querySelector('.page-header p');
        if (pageDescription) {
            pageDescription.innerHTML = `Showing results for "<strong>${query}</strong>". <a href="blog.html" style="color: #a78bfa; text-decoration: underline;">View all posts</a>`;
        }
    }

    // Category filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.category;
            updateFilterButtons();
            filterPosts();
            updateURL();
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
        sortPosts();
        filterPosts();
    });

    // Search functionality
    searchInput.addEventListener('input', debounce(function() {
        searchQuery = this.value.toLowerCase().trim();
        filterPosts();
        updateURL();
    }, 300));

    // Filter posts based on category and search
    function filterPosts() {
        const posts = Array.from(postsGrid.querySelectorAll('.post-card'));
        let visiblePosts = posts.filter(post => {
            const category = post.dataset.category;
            const title = post.querySelector('h2, h3').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            
            const matchesCategory = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = !searchQuery || 
                title.includes(searchQuery) || 
                content.includes(searchQuery) ||
                category.includes(searchQuery);
                
            return matchesCategory && matchesSearch;
        });

        // Hide/show posts with animation
        posts.forEach(post => {
            const isVisible = visiblePosts.includes(post);
            if (isVisible) {
                post.style.display = 'flex';
                setTimeout(() => post.classList.add('fade-in'), 10);
                post.classList.remove('fade-out');
            } else {
                post.classList.add('fade-out');
                post.classList.remove('fade-in');
                setTimeout(() => {
                    if (post.classList.contains('fade-out')) {
                        post.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Show no results message if needed
        showNoResultsMessage(visiblePosts.length === 0);
        
        // Update pagination
        updatePaginationVisibility(visiblePosts.length);
    }

    // Sort posts
    function sortPosts() {
        const posts = Array.from(postsGrid.querySelectorAll('.post-card'));
        
        posts.sort((a, b) => {
            switch (currentSort) {
                case 'date-desc':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case 'date-asc':
                    return new Date(a.dataset.date) - new Date(b.dataset.date);
                case 'popular':
                    return parseInt(b.dataset.popularity) - parseInt(a.dataset.popularity);
                case 'title':
                    const titleA = a.querySelector('h2, h3').textContent;
                    const titleB = b.querySelector('h2, h3').textContent;
                    return titleA.localeCompare(titleB);
                default:
                    return 0;
            }
        });

        // Re-append sorted posts
        posts.forEach(post => postsGrid.appendChild(post));
    }

    // Show/hide no results message
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or filters to find what you're looking for.</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            `;
            postsGrid.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Clear all filters
    window.clearFilters = function() {
        currentFilter = 'all';
        searchQuery = '';
        searchInput.value = '';
        sortSelect.value = 'date-desc';
        currentSort = 'date-desc';
        
        updateFilterButtons();
        sortPosts();
        filterPosts();
        updateURL();
    };

    // Update pagination visibility
    function updatePaginationVisibility(visiblePostsCount) {
        const pagination = document.getElementById('pagination');
        const loadMoreContainer = document.querySelector('.load-more-container');
        
        if (visiblePostsCount === 0) {
            pagination.style.display = 'none';
            loadMoreContainer.style.display = 'none';
        } else {
            pagination.style.display = 'flex';
            loadMoreContainer.style.display = 'block';
        }
    }

    // Pagination
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            navigateToPage(page);
        });
    });

    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            navigateToPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            navigateToPage(currentPage + 1);
        }
    });

    function navigateToPage(page) {
        currentPage = page;
        updatePaginationUI();
        
        // Scroll to top of posts
        document.querySelector('.blog-posts').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // In a real application, this would fetch new posts
        console.log(`Loading page ${page}`);
    }

    function updatePaginationUI() {
        // Update page buttons
        paginationBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === currentPage);
        });
        
        // Update prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Load More functionality
    loadMoreBtn.addEventListener('click', function() {
        this.textContent = 'Loading...';
        this.disabled = true;
        
        // Simulate loading
        setTimeout(() => {
            // In a real application, this would load more posts
            console.log('Loading more posts...');
            
            this.textContent = 'Load More Articles';
            this.disabled = false;
        }, 1000);
    });

    // Update URL without reload
    function updateURL() {
        const params = new URLSearchParams();
        
        if (currentFilter !== 'all') {
            params.set('category', currentFilter);
        }
        
        if (searchQuery) {
            params.set('search', searchQuery);
        }
        
        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newURL);
    }

    // Article click handlers
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a link
            if (e.target.tagName === 'A') return;
            
            const link = this.querySelector('h2 a, h3 a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });

    // Advanced search functionality
    function advancedSearch() {
        const posts = allPosts.filter(post => {
            const category = post.dataset.category;
            const title = post.querySelector('h2, h3').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            const author = post.querySelector('.author-name').textContent.toLowerCase();
            const date = post.dataset.date;
            
            if (searchQuery) {
                const searchTerms = searchQuery.split(' ').filter(term => term.length > 0);
                return searchTerms.every(term => 
                    title.includes(term) || 
                    content.includes(term) || 
                    author.includes(term) ||
                    category.includes(term)
                );
            }
            
            return currentFilter === 'all' || category === currentFilter;
        });
        
        return posts;
    }

    // Initialize page
    sortPosts();
    initializeFromURL();
    updatePaginationUI();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchQuery = '';
            filterPosts();
            updateURL();
        }
    });

    // Infinite scroll (optional)
    let isLoading = false;
    window.addEventListener('scroll', debounce(function() {
        if (isLoading) return;
        
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            isLoading = true;
            
            // Simulate loading more content
            setTimeout(() => {
                console.log('Auto-loading more posts...');
                isLoading = false;
            }, 1000);
        }
    }, 250));
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