/**
 * Sidebar functionality
 * Handles active states, collapse/expand, and navigation
 */

/**
 * Initialize sidebar functionality
 */
export function initSidebar() {
    initActiveState();
    initCollapseToggle();
    initSmoothNavigation();
    initPageTransition();
}

/**
 * Initialize active state for navigation links
 */
function initActiveState() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('#sidebar nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if link matches current page
        if (href && href !== '#' && currentPath.includes(href.replace(/^#/, '').replace(/^\//, ''))) {
            // Add active class
            link.classList.remove('hover:bg-white/10');
            link.classList.add('bg-white/10', 'hover:bg-white/20');
        } else {
            // Remove active class
            link.classList.remove('bg-white/10', 'hover:bg-white/20');
            if (!link.classList.contains('bg-white/10')) {
                link.classList.add('hover:bg-white/10');
            }
        }
    });
}

/**
 * Initialize sidebar collapse/expand functionality
 */
function initCollapseToggle() {
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const collapseIcon = collapseBtn?.querySelector('svg');
    const mainContent = document.querySelector('.flex-1');
    
    if (!sidebar || !mainContent) return;
    
    // Always prevent horizontal overflow
    sidebar.classList.add('overflow-hidden');
    
    // Check for saved collapse state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('w-16');
        sidebar.classList.remove('w-64');
        mainContent.classList.add('transition-all', 'duration-300');
        if (collapseIcon) {
            collapseIcon.classList.add('rotate-180');
        }
        // Apply collapsed state
        toggleSidebarText(sidebar, true);
    }
    
    // Toggle collapse on button click
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            const currentlyCollapsed = sidebar.classList.contains('w-16');
            
            if (currentlyCollapsed) {
                // Expand
                sidebar.classList.remove('w-16');
                sidebar.classList.add('w-64');
                localStorage.setItem('sidebarCollapsed', 'false');
                if (collapseIcon) {
                    collapseIcon.classList.remove('rotate-180');
                }
                toggleSidebarText(sidebar, false);
            } else {
                // Collapse
                sidebar.classList.remove('w-64');
                sidebar.classList.add('w-16');
                localStorage.setItem('sidebarCollapsed', 'true');
                if (collapseIcon) {
                    collapseIcon.classList.add('rotate-180');
                }
                toggleSidebarText(sidebar, true);
            }
        });
    }
}

/**
 * Toggle text visibility in sidebar when collapsed
 */
function toggleSidebarText(sidebar, isCollapsed) {
    const textElements = sidebar.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6');
    const navItems = sidebar.querySelectorAll('nav li');
    const sidebarHeaderContent = sidebar.querySelector('.p-6 > div:first-child');
    const sidebarHeader = sidebar.querySelector('.p-6.border-b');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Hide/show text elements
    textElements.forEach(element => {
        // Skip collapse button SVG
        if (element.closest('#sidebarCollapseBtn')) return;
        
        if (isCollapsed) {
            element.style.display = 'none';
        } else {
            element.style.display = '';
        }
    });
    
    // Center icons when collapsed
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            if (isCollapsed) {
                link.classList.add('justify-center');
                link.classList.remove('gap-3');
            } else {
                link.classList.remove('justify-center');
                link.classList.add('gap-3');
            }
        }
    });
    
    // Hide/show sidebar header content when collapsed
    if (sidebarHeaderContent) {
        if (isCollapsed) {
            sidebarHeaderContent.style.display = 'none';
        } else {
            sidebarHeaderContent.style.display = '';
        }
    }
    
    // Adjust sidebar header container to center collapse button when collapsed
    if (sidebarHeader) {
        if (isCollapsed) {
            sidebarHeader.classList.remove('justify-between');
            sidebarHeader.classList.add('justify-center');
            if (collapseBtn) {
                collapseBtn.classList.remove('p-2');
                collapseBtn.classList.add('mx-auto');
            }
        } else {
            sidebarHeader.classList.remove('justify-center');
            sidebarHeader.classList.add('justify-between');
            if (collapseBtn) {
                collapseBtn.classList.remove('mx-auto');
                collapseBtn.classList.add('p-2');
            }
        }
    }
    
    // Adjust logout button to center icon when collapsed
    if (logoutBtn) {
        if (isCollapsed) {
            logoutBtn.classList.remove('gap-3', 'text-left');
            logoutBtn.classList.add('justify-center');
        } else {
            logoutBtn.classList.remove('justify-center');
            logoutBtn.classList.add('gap-3', 'text-left');
        }
    }
}

/**
 * Initialize smooth navigation transitions
 */
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('#sidebar nav a');
    const mainContent = document.querySelector('main');
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'nav-loading-overlay';
    loadingOverlay.innerHTML = '<div class="nav-loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only handle internal navigation links
        if (href && href !== '#' && !href.startsWith('http') && !href.startsWith('mailto:')) {
            link.addEventListener('click', (e) => {
                // Don't prevent default if it's the current page
                const currentPath = window.location.pathname;
                if (currentPath.includes(href.replace(/^#/, '').replace(/^\//, ''))) {
                    return; // Already on this page
                }
                
                e.preventDefault();
                
                // Save navigation state to localStorage
                saveNavigationState();
                
                // Fade out main content
                if (mainContent) {
                    mainContent.style.opacity = '0';
                    mainContent.style.transform = 'translateY(-10px)';
                }
                
                // Show loading overlay
                loadingOverlay.classList.add('active');
                
                // Navigate after a short delay for smooth transition
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            });
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        initPageTransition();
    });
}

/**
 * Initialize page transition on load
 */
function initPageTransition() {
    const mainContent = document.querySelector('main');
    const body = document.body;
    
    // Check if we're coming from a navigation (has navigation state)
    const hasNavState = localStorage.getItem('navTransitioning') === 'true';
    
    if (hasNavState) {
        // Clear the flag
        localStorage.removeItem('navTransitioning');
        
        // Start with content hidden
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(10px)';
        }
        
        // Fade in after a short delay
        setTimeout(() => {
            if (mainContent) {
                mainContent.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }
        }, 50);
    } else {
        // Normal page load - fade in immediately
        if (mainContent) {
            mainContent.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }
    }
    
    // Add loaded class to body for any additional transitions
    body.classList.add('page-loaded');
}

/**
 * Save navigation state before transitioning
 */
function saveNavigationState() {
    // Save current scroll position
    const scrollPosition = window.scrollY || window.pageYOffset;
    localStorage.setItem('lastScrollPosition', scrollPosition.toString());
    
    // Mark that we're transitioning
    localStorage.setItem('navTransitioning', 'true');
    
    // Save current page
    localStorage.setItem('lastPage', window.location.pathname);
}

/**
 * Restore navigation state after page load
 */
export function restoreNavigationState() {
    const lastScrollPosition = localStorage.getItem('lastScrollPosition');
    const lastPage = localStorage.getItem('lastPage');
    const currentPage = window.location.pathname;
    
    // Only restore scroll if we're on the same page (back/forward navigation)
    if (lastPage === currentPage && lastScrollPosition) {
        // Restore scroll position after page loads
        setTimeout(() => {
            window.scrollTo(0, parseInt(lastScrollPosition));
        }, 100);
    }
}
