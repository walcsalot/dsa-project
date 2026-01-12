/**
 * Dashboard functionality
 * Handles theme toggle, profile dropdown, mobile menu, and logout
 */

/**
 * Initialize theme toggle functionality (removed - using light mode only)
 */
export function initThemeToggle() {
    // Theme toggle removed - using maroon and white color scheme only
}

/**
 * Initialize profile dropdown functionality
 */
export function initProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (!profileBtn || !profileDropdown) return;
    
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.add('hidden');
        }
    });
}

/**
 * Initialize mobile menu toggle (if needed in future)
 * Currently using Tailwind responsive classes
 */
export function initMobileMenu() {
    // Mobile menu functionality can be added here if needed
    // Currently handled by Tailwind CSS responsive classes
}

/**
 * Initialize logout functionality
 */
export function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');
    
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = '/index.php';
        }
    };
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (profileLogoutBtn) profileLogoutBtn.addEventListener('click', handleLogout);
}

/**
 * Initialize all dashboard functionality
 */
export function initDashboard() {
    initThemeToggle();
    initProfileDropdown();
    initMobileMenu();
    initLogout();
}
