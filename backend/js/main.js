// Main entry point for Vite
import '../../frontend/css/styles.css';
import { processLogin } from './auth.js';
import { initDashboard } from './dashboard.js';

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    // Login form handler (for index.php)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            await processLogin(formData);
        });
    }
    
    // Dashboard functionality (for dashboard.php)
    initDashboard();
});
