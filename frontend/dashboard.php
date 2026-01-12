<?php
// Development mode detection
$isDev = !file_exists(__DIR__ . '/../dist/index.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Management - DSA Project</title>
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
            <div class="p-6 border-b border-[#700000]">
                <h1 class="text-2xl font-bold">DSA Project</h1>
                <p class="text-sm text-white/80 mt-1">Document Management</p>
            </div>
            
            <!-- Navigation Menu -->
            <nav class="flex-1 overflow-y-auto p-4">
                <ul class="space-y-2">
                    <!-- Dashboard -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    
                    <!-- Documents -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Documents</span>
                        </a>
                    </li>
                    
                    <!-- Papers -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Papers</span>
                        </a>
                    </li>
                    
                    <!-- Categories -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                            <span>Categories</span>
                        </a>
                    </li>
                    
                    <!-- Search -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <span>Search</span>
                        </a>
                    </li>
                    
                    <!-- Settings -->
                    <li>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
        
        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                    <!-- Page Title -->
                    <h2 class="text-xl font-semibold text-gray-800">Document Management Dashboard</h2>
                    
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
                                <button id="profileLogoutBtn" class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left">
                                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    <span class="text-sm text-red-600">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Total Documents Card -->
                    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#800000]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Total Documents</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">1,234</p>
                            </div>
                            <div class="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-xs text-green-600 mt-2">+12% from last month</p>
                    </div>
                    
                    <!-- Total Papers Card -->
                    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#800000]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Total Papers</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">856</p>
                            </div>
                            <div class="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-xs text-green-600 mt-2">+8% from last month</p>
                    </div>
                    
                    <!-- Pending Documents Card -->
                    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#800000]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Pending Review</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">45</p>
                            </div>
                            <div class="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-xs text-orange-600 mt-2">Requires attention</p>
                    </div>
                    
                    <!-- Archived Documents Card -->
                    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#800000]">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Archived</p>
                                <p class="text-2xl font-bold text-gray-800 mt-1">378</p>
                            </div>
                            <div class="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-xs text-gray-600 mt-2">Stored documents</p>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Documents vs Papers Pie Chart -->
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Documents vs Papers Distribution</h3>
                        <div class="h-64 flex items-center justify-center">
                            <!-- Pie Chart Placeholder -->
                            <div class="relative w-48 h-48">
                                <!-- Pie Chart SVG -->
                                <svg class="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                                    <!-- Documents (60%) -->
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#800000" stroke-width="20" 
                                            stroke-dasharray="251.2 418.67" stroke-dashoffset="0" />
                                    <!-- Papers (40%) -->
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a574" stroke-width="20" 
                                            stroke-dasharray="167.47 418.67" stroke-dashoffset="-251.2" />
                                </svg>
                                <!-- Center Text -->
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-gray-800">2,090</p>
                                        <p class="text-xs text-gray-600">Total Items</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Legend -->
                        <div class="flex justify-center gap-6 mt-4">
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 rounded-full bg-[#800000]"></div>
                                <span class="text-sm text-gray-700">Documents (60%)</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 rounded-full bg-[#d4a574]"></div>
                                <span class="text-sm text-gray-700">Papers (40%)</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Document Statistics Chart -->
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Document Statistics</h3>
                        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div class="w-full space-y-4">
                                <!-- Bar Chart Representation -->
                                <div class="space-y-3">
                                    <div>
                                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Active Documents</span>
                                            <span>1,234</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-4">
                                            <div class="bg-[#800000] h-4 rounded-full" style="width: 85%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Pending Review</span>
                                            <span>45</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-4">
                                            <div class="bg-orange-500 h-4 rounded-full" style="width: 15%"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Archived</span>
                                            <span>378</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-4">
                                            <div class="bg-gray-400 h-4 rounded-full" style="width: 25%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Documents Table -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">Recent Documents</h3>
                        <!-- Search Bar -->
                        <div class="flex items-center gap-2">
                            <div class="relative">
                                <input type="text" placeholder="Search documents..." 
                                       class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none text-sm">
                                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Name</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Added</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 text-sm text-gray-800">Research Paper 2024</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">Paper</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">Research</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">2024-01-15</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <button class="text-[#800000] hover:text-[#700000] text-sm">View</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 text-sm text-gray-800">Meeting Minutes Q1</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">Document</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">Meeting</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">2024-01-14</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Pending</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <button class="text-[#800000] hover:text-[#700000] text-sm">View</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 text-sm text-gray-800">Project Proposal</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">Document</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">Project</td>
                                    <td class="px-4 py-3 text-sm text-gray-600">2024-01-13</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <button class="text-[#800000] hover:text-[#700000] text-sm">View</button>
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
