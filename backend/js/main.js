// Main entry point for Vite
import '../../frontend/css/styles.css';
import { processLogin } from './modules/auth.js';
import { initDashboard } from './pages/dashboard.js';
import { initPapers } from './pages/papers.js';
import { initCabinetView } from './pages/cabinet-view.js';
import { initSidebar, restoreNavigationState } from './modules/sidebar.js';
import { initProfileDropdown, initLogout } from './pages/dashboard.js';

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    
    // Login form handler (for index.php)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            await processLogin(formData);
        });
        return; // Don't initialize other functionality on login page
    }
    
    // Check if page has sidebar (dashboard, papers, template, or any frontend page)
    const hasSidebar = document.getElementById('sidebar');
    
    if (hasSidebar) {
        // Restore navigation state (scroll position, etc.)
        restoreNavigationState();
        
        // Specific page handlers - these pages have their own init functions
        if (currentPath.includes('/pages/cabinets/view.php')) {
            initCabinetView();
        }
        else if (currentPath.includes('/pages/papers.php')) {
            initPapers();
        }
        else if (currentPath.includes('/dashboard.php')) {
            initDashboard();
        }
        // Auto-initialize for any other frontend PHP file with sidebar
        // This includes template.php and any future pages
        else if (currentPath.includes('/frontend/')) {
            // Initialize basic functionality (sidebar, profile, logout) for any frontend page
            initSidebar();
            initProfileDropdown();
            initLogout();
        }
    }
});
