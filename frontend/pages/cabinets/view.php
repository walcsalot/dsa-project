<?php
// Development mode detection
$isDev = !file_exists(__DIR__ . '/../../../dist/index.php');

// Get cabinet ID from query parameter
$cabinetId = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : 'C1.1';
$cabinetName = 'Cabinet - ' . $cabinetId;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $cabinetName; ?> - DSA Project</title>
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
                    <!-- Back Button and Cabinet Number Sort Dropdown -->
                    <div class="flex items-center gap-4">
                        <a href="/frontend/pages/papers.php" class="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </a>
                        <!-- Cabinet Number Sort Dropdown -->
                        <div class="relative">
                            <button id="cabinetNumberSortBtn" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2">
                                <span id="cabinetNumberSortText">Sort by Cabinet Number</span>
                                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            <!-- Cabinet Number Sort Dropdown Menu -->
                            <div id="cabinetNumberSortDropdown" class="hidden absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet-number="all">
                                    All Cabinet Numbers
                                </button>
                                <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet-number="C1.1">
                                    C1.1
                                </button>
                                <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet-number="C1.2">
                                    C1.2
                                </button>
                                <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet-number="C1.3">
                                    C1.3
                                </button>
                            </div>
                        </div>
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
                <!-- Documents Table -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-800">Documents</h3>
                        <span class="text-sm text-gray-500" id="documentCount">0 documents</span>
                    </div>
                    
                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO.</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabinet Number</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody id="documentsTableBody" class="bg-white divide-y divide-gray-200">
                                <!-- Sample Document Row -->
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="text-sm text-gray-900 font-medium"><?php echo $cabinetId; ?></span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">Sample Document 1</div>
                                        <div class="text-sm text-gray-500">Document description or notes</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Documents</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 rounded-full bg-[#800000] flex items-center justify-center text-white font-semibold text-xs mr-2">
                                                A
                                            </div>
                                            <span class="text-sm text-gray-900">Admin</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex items-center gap-2">
                                            <button class="text-[#800000] hover:text-[#700000] hover:underline cursor-pointer">View</button>
                                            <span class="text-gray-300">|</span>
                                            <button class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">Edit</button>
                                            <span class="text-gray-300">|</span>
                                            <button class="text-red-600 hover:text-red-800 hover:underline cursor-pointer">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                                
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
</body>
</html>
