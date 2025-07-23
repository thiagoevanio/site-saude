// ===== CALCULATOR UTILITIES =====

// Global utilities object
window.calculatorUtils = {
    // Form validation
    validateForm: function(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    },
    
    // Show field error
    showFieldError: function(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    },
    
    // Clear field error
    clearFieldError: function(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    },
    
    // Copy to clipboard
    copyToClipboard: function(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Resultado copiado para a área de transferência!', 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    },
    
    // Fallback copy method
    fallbackCopyToClipboard: function(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Resultado copiado para a área de transferência!', 'success');
        } catch (err) {
            this.showToast('Erro ao copiar resultado', 'error');
        }
        
        document.body.removeChild(textArea);
    },
    
    // Show toast notification
    showToast: function(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast__content">
                <i class="fas ${this.getToastIcon(type)} toast__icon"></i>
                <span class="toast__message">${message}</span>
            </div>
            <button class="toast__close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    },
    
    // Get toast icon based on type
    getToastIcon: function(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    },
    
    // Format number for display
    formatNumber: function(number, decimals = 1) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    },
    
    // Format date for display
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    },
    
    // Validate email
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate phone number (Brazilian format)
    validatePhone: function(phone) {
        const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
        return phoneRegex.test(phone);
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Smooth scroll to element
    scrollToElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    // Get URL parameters
    getUrlParameter: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    // Set URL parameter
    setUrlParameter: function(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },
    
    // Local storage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        }
    }
};

// ===== GLOBAL EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Add form validation styles
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            display: block;
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white-color);
            border-radius: var(--radius-lg);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1000;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        }
        
        .toast--success {
            border-left: 4px solid #10b981;
        }
        
        .toast--error {
            border-left: 4px solid #ef4444;
        }
        
        .toast--warning {
            border-left: 4px solid #f59e0b;
        }
        
        .toast--info {
            border-left: 4px solid #3b82f6;
        }
        
        .toast__content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .toast__icon {
            font-size: 1.25rem;
        }
        
        .toast--success .toast__icon {
            color: #10b981;
        }
        
        .toast--error .toast__icon {
            color: #ef4444;
        }
        
        .toast--warning .toast__icon {
            color: #f59e0b;
        }
        
        .toast--info .toast__icon {
            color: #3b82f6;
        }
        
        .toast__message {
            color: var(--dark-color);
            font-weight: 500;
        }
        
        .toast__close {
            background: none;
            border: none;
            color: var(--gray-500);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: var(--radius-sm);
            transition: all 0.3s ease;
        }
        
        .toast__close:hover {
            background: var(--gray-100);
            color: var(--dark-color);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .toast {
                left: 20px;
                right: 20px;
                min-width: auto;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Clear form errors on input
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, select, textarea')) {
            window.calculatorUtils.clearFieldError(e.target);
        }
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.matches('.calculator__form')) {
            // Form validation is handled by individual calculator scripts
            // This is just a fallback
            if (!window.calculatorUtils.validateForm(e.target)) {
                e.preventDefault();
            }
        }
    });
});

// ===== ANALYTICS HELPERS =====
window.calculatorUtils.analytics = {
    // Track calculator usage
    trackCalculatorUse: function(calculatorName) {
        // This would integrate with Google Analytics or other analytics services
        console.log(`Calculator used: ${calculatorName}`);
    },
    
    // Track result copy
    trackResultCopy: function(calculatorName) {
        console.log(`Result copied: ${calculatorName}`);
    }
};

// ===== ACCESSIBILITY HELPERS =====
window.calculatorUtils.a11y = {
    // Announce to screen readers
    announce: function(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },
    
    // Focus management
    focusElement: function(element) {
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

// Add screen reader only styles
const srOnlyStyle = document.createElement('style');
srOnlyStyle.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(srOnlyStyle);

