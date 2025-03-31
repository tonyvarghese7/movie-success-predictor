const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between sign-up and sign-in
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Form Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}

function showError(fieldId, errorId, message) {
    document.getElementById(fieldId).classList.add('error');
    document.getElementById(fieldId).classList.remove('valid');
    document.getElementById(errorId).textContent = message;
    document.getElementById(errorId).style.display = 'block';
}

function showSuccess(fieldId, errorId) {
    document.getElementById(fieldId).classList.add('valid');
    document.getElementById(fieldId).classList.remove('error');
    document.getElementById(errorId).style.display = 'none';
}

// Login Form (Updated with backend verification)
document.querySelector('.sign-in form').addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    // Clear previous errors
    document.getElementById('login-email-error').textContent = '';
    document.getElementById('login-password-error').textContent = '';

    // Validation
    if (!loginEmail) {
        showError('login-email', 'login-email-error', 'Email is required');
        isValid = false;
    } else if (!validateEmail(loginEmail)) {
        showError('login-email', 'login-email-error', 'Please enter a valid email');
        isValid = false;
    } else {
        showSuccess('login-email', 'login-email-error');
    }

    if (!loginPassword) {
        showError('login-password', 'login-password-error', 'Password is required');
        isValid = false;
    } else {
        showSuccess('login-password', 'login-password-error');
    }

    if (isValid) {
        // Send login data to Flask backend
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sessionStorage.setItem('loggedIn', 'true');
                window.location.href = '/'; // Redirect to home page
            } else {
                showError('login-email', 'login-email-error', data.message);
                showError('login-password', 'login-password-error', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login');
        });
    }
});

// Signup Form
document.querySelector('.sign-up form').addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    const signupName = document.getElementById('signup-name').value;
    const signupEmail = document.getElementById('signup-email').value;
    const signupPassword = document.getElementById('signup-password').value;

    // Clear previous errors
    document.getElementById('signup-name-error').textContent = '';
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';

    // Validation
    if (!signupName) {
        showError('signup-name', 'signup-name-error', 'Name is required');
        isValid = false;
    } else {
        showSuccess('signup-name', 'signup-name-error');
    }

    if (!signupEmail) {
        showError('signup-email', 'signup-email-error', 'Email is required');
        isValid = false;
    } else if (!validateEmail(signupEmail)) {
        showError('signup-email', 'signup-email-error', 'Please enter a valid email');
        isValid = false;
    } else {
        showSuccess('signup-email', 'signup-email-error');
    }

    if (!signupPassword) {
        showError('signup-password', 'signup-password-error', 'Password is required');
        isValid = false;
    } else if (!validatePassword(signupPassword)) {
        showError('signup-password', 'signup-password-error', 
            'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
        isValid = false;
    } else {
        showSuccess('signup-password', 'signup-password-error');
    }

    if (isValid) {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: signupName,
                email: signupEmail,
                password: signupPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Signup successful! You can now log in.');
                this.reset();
                container.classList.remove("active");
            } else {
                if (data.message.includes('Email already exists')) {
                    showError('signup-email', 'signup-email-error', 'Email already registered');
                } else {
                    alert('Signup failed: ' + data.message);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during signup');
        });
    }
});

// Forgot Password System
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const modal = document.getElementById('forgotPasswordModal');
const closeBtn = document.querySelector('.close');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetSuccess = document.getElementById('resetSuccess');
const demoResetLink = document.getElementById('demoResetLink');

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    resetSuccess.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
    forgotPasswordForm.reset();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        resetSuccess.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
        forgotPasswordForm.reset();
    }
});

forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const errorElement = document.getElementById('reset-email-error');
    
    if (!email) {
        errorElement.textContent = 'Email is required';
        errorElement.style.display = 'block';
        return;
    } else if (!validateEmail(email)) {
        errorElement.textContent = 'Please enter a valid email';
        errorElement.style.display = 'block';
        return;
    } else {
        errorElement.style.display = 'none';
    }
    
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('resetToken', token);
    localStorage.setItem('resetEmail', email);
    const resetLink = `/reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;
    console.log('Password reset link:', resetLink);
    demoResetLink.href = resetLink;
    forgotPasswordForm.style.display = 'none';
    resetSuccess.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
        resetSuccess.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
        forgotPasswordForm.reset();
    }, 15000);
});

// Real-time validation
document.getElementById('signup-password').addEventListener('input', function() {
    const password = this.value;
    const errorElement = document.getElementById('signup-password-error');
    if (!validatePassword(password)) {
        this.classList.add('error');
        this.classList.remove('valid');
        errorElement.textContent = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        errorElement.style.display = 'block';
    } else {
        this.classList.add('valid');
        this.classList.remove('error');
        errorElement.style.display = 'none';
    }
});

document.getElementById('signup-email').addEventListener('input', function() {
    const email = this.value;
    const errorElement = document.getElementById('signup-email-error');
    if (!validateEmail(email)) {
        this.classList.add('error');
        this.classList.remove('valid');
        errorElement.textContent = 'Please enter a valid email';
        errorElement.style.display = 'block';
    } else {
        this.classList.add('valid');
        this.classList.remove('error');
        errorElement.style.display = 'none';
    }
});