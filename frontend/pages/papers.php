<?php
// Development mode detection
$isDev = !file_exists(__DIR__ . '/../../dist/index.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Cabinets - DSA Project (v2.0)</title>
    
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
                        <a href="/frontend/pages/papers.php" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
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
            <header id="mainHeader" class="bg-transparent shadow-sm border-b border-gray-200">
                <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
                    <!-- Page Title -->
                    <h2 class="text-xl font-semibold text-gray-800">Cabinets Management</h2>
                    
                    <!-- Right Side Actions -->
                    <div class="flex items-center gap-4">
                        <!-- Add Cabinet Button -->
                        <button id="addCabinetBtn" class="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#700000] transition-colors flex items-center gap-2 cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Add Cabinet</span>
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
            <main class="flex-1 overflow-y-auto p-4 sm:p-4 lg:p-6 bg-gray-50">
                <!-- Filters and Search -->
                <div id="filtersSection" class="mb-4">
                    <div class="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
                        <div id="searchBarContainer" class="relative flex-1 w-full md:w-auto invisible">
                            <input type="text" id="searchPapersInput" placeholder="Search papers..." 
                                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none text-sm">
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        
                        <!-- Filter Buttons -->
                        <div class="flex flex-wrap gap-2 ml-auto">
                            <!-- Cabinet Dropdown -->
                            <div class="relative">
                                <button id="cabinetDropdownBtn" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2">
                                    <span id="cabinetDropdownText">Select Cabinet</span>
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Cabinet Dropdown Menu -->
                                <div id="cabinetDropdown" class="hidden absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet="all">
                                        All Cabinets
                                    </button>
                                    <!-- Dynamically populated via JavaScript -->
                                </div>
                            </div>
                            
                            <!-- Status Dropdown - Updated v2.0 with Archive Support -->
                            <div class="relative">
                                <button id="statusDropdownBtn" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2">
                                    <span id="statusDropdownText">All Cabinets</span>
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <!-- Status Dropdown Menu - INCLUDES ARCHIVED OPTION -->
                                <div id="statusDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium" data-status="all">
                                        📋 All Cabinets
                                    </button>
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-status="active">
                                        ✓ Active
                                    </button>
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-status="pending">
                                        ⏳ Pending
                                    </button>
                                    <div class="border-t border-gray-200 my-1"></div>
                                    <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium" data-status="archived">
                                        📦 Archived
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Documents Table View (Hidden by default) -->
                <div id="documentsView" class="hidden">
                    <div class="mb-6 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <button id="backToCabinetsBtn" class="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                            </button>
                            <div class="flex items-center gap-3">
                                <div>
                                    <h2 id="selectedCabinetName" class="text-2xl font-bold text-gray-800"></h2>
                                    <p class="text-gray-600">View and manage documents in this cabinet</p>
                                </div>
                                <button id="editSelectedCabinetBtn" class="p-2 rounded-lg hover:bg-gray-100 transition-colors group" title="Edit Cabinet">
                                    <svg class="w-5 h-5 text-gray-400 group-hover:text-[#800000] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button id="addDocumentBtn" class="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#700000] transition-colors flex items-center gap-2 cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Add Document</span>
                        </button>
                    </div>
                    
                    <!-- Documents Table -->
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-800">Documents</h3>
                            <div class="flex items-center gap-3">
                                <!-- Cabinet Number filter (for testing sort/filter across C1.1/C1.2/C1.3) -->
                                <div class="relative">
                                    <button id="cabinetNumberFilterBtn" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center gap-2">
                                        <span id="cabinetNumberFilterText">All Cabinet Numbers</span>
                                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div id="cabinetNumberFilterDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <!-- Dynamically populated via JavaScript based on selected cabinet -->
                                        <button class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700" data-cabinet-number="all">
                                            All Cabinet Numbers
                                        </button>
                                    </div>
                                </div>

                                <span class="text-sm text-gray-500" id="documentCount">0 documents</span>
                            </div>
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
                                    <!-- Documents will be dynamically generated via JavaScript based on selected cabinet -->
                                    <!-- Example Document Row Structure (for reference):
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">C1.1</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Document Name</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Category Name</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Admin User</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Available</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                                            <div class="flex items-center gap-2">
                                                <button class="edit-document-btn p-1.5 rounded-lg hover:bg-gray-100 transition-colors group" data-document-id="1" title="Edit Document">
                                                    <svg class="w-4 h-4 text-gray-400 group-hover:text-[#800000] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </button>
                                                <button class="view-document-btn p-1.5 rounded-lg hover:bg-gray-100 transition-colors group" data-document-id="1" title="View Details">
                                                    <svg class="w-4 h-4 text-gray-400 group-hover:text-[#800000] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                </button>
                                                <button class="delete-document-btn p-1.5 rounded-lg hover:bg-red-50 transition-colors group" data-document-id="1" title="Delete Document">
                                                    <svg class="w-4 h-4 text-gray-400 group-hover:text-red-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    -->
                                    
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
                </div>
                
                <!-- Cabinets Grid -->
                <div id="cabinetsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Cabinets will be dynamically loaded via JavaScript -->
                    <!-- Example Cabinet Card Structure (for reference):
                    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1">
                                    <h3 class="text-lg font-semibold text-gray-800">Cabinet Name</h3>
                                    <p class="text-sm text-gray-500 mt-1">Description</p>
                                </div>
                                <button class="edit-cabinet-btn p-2 rounded-lg hover:bg-gray-100 transition-colors group" data-cabinet-id="1" title="Edit Cabinet">
                                    <svg class="w-5 h-5 text-gray-400 group-hover:text-[#800000] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600">0 documents</span>
                                <button class="view-cabinet-btn text-[#800000] hover:text-[#600000] font-medium cursor-pointer" data-cabinet-id="1">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                    -->
                    
                    <!-- Empty State (shown when no cabinets) -->
                    <div id="emptyCabinetsState" class="hidden col-span-full text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No cabinets</h3>
                        <p class="mt-1 text-sm text-gray-500">Get started by adding a new cabinet.</p>
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
