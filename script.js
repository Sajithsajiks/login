// Valid credentials for demo
const validCredentials = {
    username: 'keerthi',
    email: 'keerthianand@gmail.com',
    password: 'password123'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        initializeLoginPage();
    }
    
    // Check if user is already logged in and redirect accordingly
    checkAuthenticationStatus();
});

// Initialize login page functionality
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Real-time validation listeners
    addInputValidationListeners();
}

// Handle login form submission
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Reset previous errors
    clearErrors();
    
    let isValid = true;
    
    // Validate username
    if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Check credentials
    if (username === validCredentials.username && 
        email === validCredentials.email && 
        password === validCredentials.password) {
        
        // Successful login
        showToast('Login successful! Welcome back.', 'success');
        
        // Store login status
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        
        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
        
    } else {
        // Failed login
        showToast('Invalid credentials. Please check your username, email, and password.', 'error');
        
        // Show individual field errors for better UX
        if (username !== validCredentials.username) {
            showError('username', 'Invalid username');
        }
        if (email !== validCredentials.email) {
            showError('email', 'Invalid email address');
        }
        if (password !== validCredentials.password) {
            showError('password', 'Invalid password');
        }
    }
}

// Show error message for specific field
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('input');
    
    errorElements.forEach(element => {
        element.classList.remove('show');
    });
    
    inputElements.forEach(element => {
        element.classList.remove('error');
    });
}

// Add real-time input validation
function addInputValidationListeners() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            if (this.classList.contains('error') && this.value.length >= 3) {
                this.classList.remove('error');
                document.getElementById('usernameError').classList.remove('show');
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.classList.contains('error') && emailRegex.test(this.value)) {
                this.classList.remove('error');
                document.getElementById('emailError').classList.remove('show');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.classList.contains('error') && this.value.length >= 6) {
                this.classList.remove('error');
                document.getElementById('passwordError').classList.remove('show');
            }
        });
    }
}

// Show toast notification
function showToast(message, type) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Logout functionality
function logout() {
    showToast('Logging out...', 'success');
    
    // Clear session storage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    
    // Redirect to login page after short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Scroll to features section
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Check authentication status
function checkAuthenticationStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is not logged in and trying to access home page
    if (!isLoggedIn && currentPage === 'home.html') {
        showToast('Please login to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
    
    // If user is logged in and on login page, redirect to home
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === '')) {
        window.location.href = 'home.html';
    }
    
    // Update welcome message on home page
    if (isLoggedIn && currentPage === 'home.html') {
        const username = sessionStorage.getItem('username');
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && username) {
            heroTitle.textContent = `Welcome back, ${username}!`;
        }
    }
}

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        checkAuthenticationStatus();
    }
});

// Add smooth scrolling for navigation links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});