<?php
// Development mode detection
$isDev = !file_exists(__DIR__ . '/../../../dist/index.php');

// Get cabinet ID from query parameter (numeric ID, e.g., ?cabinet_id=1)
$cabinetId = isset($_GET['cabinet_id']) ? intval($_GET['cabinet_id']) : null;
$cabinetName = $cabinetId ? 'Cabinet ' . $cabinetId : 'Cabinet';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $cabinetName; ?> - DSA Project</title>
    
    <!-- Inline critical CSS to prevent FOUC -->
    <style>
        html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            min-height: 100vh;
        }
        body {
            opacity: 0;
            transition: opacity 0.15s ease-in;
        }
        body.loaded {
            opacity: 1;
        }
        a {
            color: inherit;
            text-decoration: none;
        }
        #sidebar {
            position: relative;
        }
    </style>
    
    <?php if ($isDev): ?>
        <!-- Vite HMR Client - Must be loaded first for auto-refresh -->
        <script type="module">
            import('/@vite/client').catch(err => console.error('Vite client error:', err));
        </script>
    <?php endif; ?>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Main Container -->
    <div class="flex h-screen overflow-hidden">
        
        <!-- Sidebar Navigation -->
        <aside id="sidebar" class="bg-[#800000] text-white w-64 flex-shrink-0 hidden lg:flex flex-col transition-all duration-300">
            <!-- Sidebar Header -->
            <div class="p-6 border-b border-[#700000] flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">DSA Project</h1>
                    <p class="text-sm text-white/80 mt-1">Document Management</p>
                </div>
                <!-- Collapse Button -->
                <button id="sidebarCollapseBtn" class="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Navigation Menu -->
            <nav class="flex-1 overflow-y-auto p-4">
                <ul class="space-y-2">
                    <!-- Dashboard -->
                    <li>
                        <a href="/frontend/dashboard.php" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    
                    <!-- Papers -->
                    <li>
                        <a href="/frontend/pages/papers.php" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Papers</span>
                        </a>
                    </li>
                    
                    <!-- Settings -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <!-- Sidebar Footer -->
            <div class="p-4 border-t border-[#700000]">
                <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left cursor-pointer">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
        
        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            
            <!-- Header -->
            <header class="bg-transparent shadow-sm border-b border-gray-200">
                <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                    <!-- Back Button -->
                    <div class="flex items-center gap-4">
                        <a href="/frontend/pages/papers.php" class="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </a>
                    </div>
                    
                    <!-- Right Side Actions -->
                    <div class="flex items-center gap-4">
                        <!-- Add Document Button -->
                        <button id="addDocumentBtn" class="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#700000] transition-colors flex items-center gap-2 cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Add Document</span>
                        </button>
                        
                        <!-- Profile Dropdown -->
                        <div class="relative">
                            <button id="profileBtn" class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div class="w-8 h-8 rounded-full bg-[#800000] flex items-center justify-center text-white font-semibold">
                                    A
                                </div>
                                <svg class="w-4 h-4 text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div id="profileDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div class="px-4 py-3 border-b border-gray-200">
                                    <p class="text-sm font-semibold text-gray-800">Admin</p>
                                    <p class="text-xs text-gray-500">admin@dsa-project.com</p>
                                </div>
                                <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors">
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    <span class="text-sm text-gray-700">Profile</span>
                                </a>
                                <a href="#" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors">
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span class="text-sm text-gray-700">Settings</span>
                                </a>
                                <div class="border-t border-gray-200 my-2"></div>
                                <button id="profileLogoutBtn" class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left cursor-pointer">
                                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    <span class="text-sm text-red-600 cursor-pointer">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                <!-- Cabinet Header (will be updated by JavaScript) -->
                <div class="mb-6">
                    <h2 id="cabinetViewTitle" class="text-2xl font-bold text-gray-800"><?php echo $cabinetName; ?></h2>
                    <p class="text-gray-600">View and manage documents in this cabinet</p>
                </div>
                
                <!-- Search Bar and Filters -->
                <div class="mb-6">
                    <div class="flex flex-col md:flex-row gap-3">
                        <!-- Search Input -->
                        <div class="relative flex-1">
                            <input 
                                type="text" 
                                id="searchDocumentsInput" 
                                placeholder="Search documents by file name or category..." 
                                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none text-sm"
                            >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        
                        <!-- Filter Buttons -->
                        <div class="flex flex-wrap gap-2">
                            <!-- Cabinet Number Dropdown -->
                            <div class="relative">
                                <button id="cabinetNumberSortBtn" class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <span id="cabinetNumberSortText">All Numbers</span>
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Cabinet Number Sort Dropdown Menu -->
                                <div id="cabinetNumberSortDropdown" class="hidden absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet-number="all">
                                        All Cabinet Numbers
                                    </button>
                                    <!-- Dynamically populated via JavaScript -->
                                </div>
                            </div>
                            
                            <!-- Category Dropdown -->
                            <div class="relative">
                                <button id="categorySortBtn" class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <span id="categorySortText">All Categories</span>
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Category Sort Dropdown Menu -->
                                <div id="categorySortDropdown" class="hidden absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-category="all">
                                        All Categories
                                    </button>
                                    <!-- Dynamically populated via JavaScript -->
                                </div>
                            </div>
                            
                            <!-- Status Dropdown -->
                            <div class="relative">
                                <button id="statusSortBtn" class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <span id="statusSortText">All Status</span>
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Status Sort Dropdown Menu -->
                                <div id="statusSortDropdown" class="hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-status="all">
                                        All Status
                                    </button>
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-status="available">
                                        Available
                                    </button>
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-status="borrowed">
                                        Borrowed
                                    </button>
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-status="archived">
                                        Archived
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Documents Table -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-800">Documents</h3>
                        <span class="text-sm text-gray-500" id="documentCount">0 documents</span>
                    </div>
                    
                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-[#800000]">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">NO.</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cabinet Number</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">File Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Added By</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody id="documentsTableBody" class="bg-white divide-y divide-gray-200">
                                <!-- Documents will be loaded dynamically via JavaScript API -->
                                
                                <!-- Empty State (will be shown when no documents) -->
                                <tr id="emptyStateRow" class="hidden">
                                    <td colspan="7" class="px-6 py-12 text-center">
                                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <h3 class="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                                        <p class="mt-1 text-sm text-gray-500">Get started by adding a new document.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <?php if ($isDev): ?>
        <!-- Load your JavaScript entry point -->
        <script type="module" src="/backend/js/main.js"></script>
    <?php else: ?>
        <!-- Production: Load built assets -->
        <script type="module" src="/dist/backend/js/main.js"></script>
    <?php endif; ?>
    
    <!-- Celebration Effect on Page Load -->
    <script type="module">
        // Wait for page to be fully loaded
        window.addEventListener('load', async () => {
            // Small delay for smooth transition from papers.php animation
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Dynamic import of canvas-confetti
            const confetti = await import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm')
                .then(module => module.default)
                .catch(() => null);
            
            if (confetti) {
                // First burst - from left
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: ['#800000', '#a00000', '#600000', '#FFD700', '#FFA500']
                });
                
                // Second burst - from right
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: ['#800000', '#a00000', '#600000', '#FFD700', '#FFA500']
                });
                
                // Center burst after a small delay
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#800000', '#a00000', '#600000', '#FFD700', '#FFA500']
                    });
                }, 200);
                
                // Final sparkle burst
                setTimeout(() => {
                    confetti({
                        particleCount: 30,
                        spread: 360,
                        ticks: 50,
                        gravity: 0,
                        decay: 0.94,
                        startVelocity: 30,
                        colors: ['#FFD700', '#FFA500', '#FF6347'],
                        origin: { x: 0.5, y: 0.5 }
                    });
                }, 400);
            } else {
                // Fallback: Simple CSS animation if confetti library fails to load
                const celebrationOverlay = document.createElement('div');
                celebrationOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 9999;
                    background: radial-gradient(circle at center, rgba(128, 0, 0, 0.2) 0%, transparent 70%);
                    animation: celebrationPulse 0.8s ease-out;
                `;
                
                // Add CSS animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes celebrationPulse {
                        0% { opacity: 0; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.05); }
                        100% { opacity: 0; transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
                document.body.appendChild(celebrationOverlay);
                
                setTimeout(() => {
                    celebrationOverlay.remove();
                }, 800);
            }
            
            // Add subtle scale-in animation to main content
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.style.animation = 'scaleIn 0.5s ease-out';
                const scaleInStyle = document.createElement('style');
                scaleInStyle.textContent = `
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    @keyframes slideInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideOutUp {
                        from {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateY(-100px);
                        }
                    }
                `;
                document.head.appendChild(scaleInStyle);
            }
            
            // Show welcome toast notification
            const welcomeToast = document.createElement('div');
            welcomeToast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #800000 0%, #a00000 100%);
                color: white;
                padding: 16px 32px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(128, 0, 0, 0.3);
                z-index: 10000;
                font-weight: 600;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideInDown 0.5s ease-out;
                pointer-events: none;
            `;
            
            welcomeToast.innerHTML = `
                <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Cabinet Opened Successfully! 🎉</span>
            `;
            
            document.body.appendChild(welcomeToast);
            
            // Remove toast after 2.5 seconds
            setTimeout(() => {
                welcomeToast.style.animation = 'slideOutUp 0.5s ease-in';
                setTimeout(() => {
                    welcomeToast.remove();
                }, 500);
            }, 2500);
        });
    </script>
</body>
</html>
