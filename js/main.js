// ===== MAIN JAVASCRIPT =====

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// ===== NAVIGATION =====
// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener("click", () => {
        const navList = navMenu.querySelector(".nav__list");
        navList.classList.toggle("show");
        
        // Change hamburger icon
        const icon = navToggle.querySelector("i");
        if (navList.classList.contains("show")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const navList = navMenu.querySelector(".nav__list");
        navList.classList.remove("show");
        
        // Reset hamburger icon
        const icon = navToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    });
});

// ===== SMOOTH SCROLLING =====
// Handle smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION =====
// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// ===== HEADER SCROLL EFFECT =====
// Add shadow to header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// ===== CATEGORY NAVIGATION =====
// Function to open calculator categories
function openCategory(category) {
    // Store the selected category in localStorage for the calculator page
    localStorage.setItem('selectedCategory', category);
    
    // Navigate to the calculator page
    window.location.href = `calculadoras/${category}.html`;
}

// ===== ANIMATIONS =====
// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.category-card, .stat, .feature');
    animatedElements.forEach(el => observer.observe(el));
});

// ===== UTILITY FUNCTIONS =====
// Format numbers with proper locale
function formatNumber(number, decimals = 1) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

// Validate numeric input
function validateNumericInput(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Show loading state
function showLoading(element) {
    element.classList.add('loading');
}

// Hide loading state
function hideLoading(element) {
    element.classList.remove('loading');
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast__close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                z-index: 1001;
                transform: translateX(100%);
                transition: transform 0.3s ease-in-out;
                max-width: 400px;
                border-left: 4px solid var(--primary-color);
            }
            .toast--success { border-left-color: var(--secondary-color); }
            .toast--error { border-left-color: #ef4444; }
            .toast.show { transform: translateX(0); }
            .toast__content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: var(--gray-700);
            }
            .toast__content i {
                color: var(--primary-color);
            }
            .toast--success .toast__content i { color: var(--secondary-color); }
            .toast--error .toast__content i { color: #ef4444; }
            .toast__close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                color: var(--gray-400);
                cursor: pointer;
                padding: 0.25rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Close button functionality
    toast.querySelector('.toast__close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Resultado copiado para a área de transferência!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Resultado copiado para a área de transferência!', 'success');
    }
}

// ===== FORM VALIDATION =====
// Generic form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentElement.querySelector('.error-message');
        
        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }
        input.classList.remove('error');
        
        // Check if empty
        if (!value) {
            showFieldError(input, 'Este campo é obrigatório');
            isValid = false;
            return;
        }
        
        // Check numeric inputs
        if (input.type === 'number') {
            const num = parseFloat(value);
            const min = parseFloat(input.min) || 0;
            const max = parseFloat(input.max) || Infinity;
            
            if (isNaN(num)) {
                showFieldError(input, 'Digite um número válido');
                isValid = false;
            } else if (num < min) {
                showFieldError(input, `Valor deve ser maior que ${min}`);
                isValid = false;
            } else if (num > max) {
                showFieldError(input, `Valor deve ser menor que ${max}`);
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(input, message) {
    input.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
}

// ===== EXPORT FUNCTIONS =====
// Make functions available globally
window.calculatorUtils = {
    formatNumber,
    validateNumericInput,
    showLoading,
    hideLoading,
    showToast,
    copyToClipboard,
    validateForm,
    openCategory
};

