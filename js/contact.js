// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    initializeContactForm();
    initializeFAQ();
    initializeNewsletterSignup();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(this)) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        btnText.style.opacity = '0';
        btnLoader.classList.remove('hidden');
        
        // Simulate form submission
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            const successMessage = document.querySelector('.form-success');
            successMessage.classList.remove('hidden');
            
            // Reset form after showing success
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                successMessage.classList.add('hidden');
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                btnText.style.opacity = '1';
                btnLoader.classList.add('hidden');
                
                // Clear any validation errors
                clearValidationErrors();
            }, 5000);
        }, 2000);
    });
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.closest('.form-group').classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const fieldValue = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(formGroup);
    
    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Message length validation
    if (field.name === 'message' && fieldValue.length > 0 && fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    
    // Show error if validation failed
    if (!isValid) {
        showFieldError(formGroup, errorMessage);
    }
    
    return isValid;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(formGroup) {
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const errorGroups = document.querySelectorAll('.form-group.error');
    
    errorElements.forEach(element => element.remove());
    errorGroups.forEach(group => group.classList.remove('error'));
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initializeNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('.newsletter-signup, .newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showToast('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate subscription
            setTimeout(() => {
                showToast('Successfully subscribed to our newsletter!', 'success');
                emailInput.value = '';
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${getToastIcon(type)}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add toast styles
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${getToastColor(type)};
    `;
    
    toast.style.cssText = style;
    
    // Add toast content styles
    const contentStyle = `
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
    `;
    
    toast.querySelector('.toast-content').style.cssText = contentStyle;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Auto remove after 5 seconds
    setTimeout(() => removeToast(toast), 5000);
}

function getToastIcon(type) {
    const icons = {
        success: '<i class="fas fa-check-circle" style="color: #10b981;"></i>',
        error: '<i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>',
        info: '<i class="fas fa-info-circle" style="color: #3b82f6;"></i>',
        warning: '<i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>'
    };
    return icons[type] || icons.info;
}

function getToastColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colors[type] || colors.info;
}

function removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Form auto-save functionality (saves to localStorage)
function initializeAutoSave() {
    const contactForm = document.getElementById('contactForm');
    const formData = 'swiftlyweb_contact_form';
    
    // Load saved data
    const savedData = localStorage.getItem(formData);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = contactForm.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'checkbox') {
                    field.value = data[key];
                } else if (field && field.type === 'checkbox') {
                    field.checked = data[key];
                }
            });
        } catch (e) {
            console.log('Error loading saved form data');
        }
    }
    
    // Save data on input
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            saveFormData();
        }, 500));
        
        if (input.type === 'checkbox') {
            input.addEventListener('change', saveFormData);
        }
    });
    
    function saveFormData() {
        const data = {};
        formInputs.forEach(input => {
            if (input.type === 'checkbox') {
                data[input.name] = input.checked;
            } else {
                data[input.name] = input.value;
            }
        });
        
        localStorage.setItem(formData, JSON.stringify(data));
    }
    
    // Clear saved data on successful submission
    contactForm.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem(formData);
        }, 3000); // Clear after success message shows
    });
}

// Character counter for textarea
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    const maxLength = 1000;
    
    if (messageField) {
        const formGroup = messageField.closest('.form-group');
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: #6b7280;
            text-align: right;
            margin-top: 0.25rem;
        `;
        
        formGroup.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${messageField.value.length}/${maxLength} characters`;
            
            if (remaining < 50) {
                counter.style.color = '#ef4444';
            } else if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#6b7280';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        messageField.setAttribute('maxlength', maxLength);
        updateCounter();
    }
}

// Debounce utility
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

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoSave();
    initializeCharacterCounter();
    
    // Add smooth scrolling for anchor links
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
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const contactForm = document.getElementById('contactForm');
        if (document.activeElement && contactForm.contains(document.activeElement)) {
            e.preventDefault();
            contactForm.dispatchEvent(new Event('submit'));
        }
    }
});