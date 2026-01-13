import { initSidebar } from '../modules/sidebar.js';
import { initProfileDropdown, initLogout } from './dashboard.js';
import { initDocumentManagement, showAddDocumentModal, addDocumentToTable, deleteDocument, updateDocumentCount } from './cabinet-view.js';

/**
 * Papers page functionality
 * Handles sidebar, active states, and papers-specific features
 */

/**
 * Initialize papers page
 */
export function initPapers() {
    // Initialize sidebar with collapse functionality
    initSidebar();
    
    // Initialize profile dropdown and logout
    initProfileDropdown();
    initLogout();
    
    // Initialize filter dropdowns and search functionality
    initFilterDropdowns();
    
    // Initialize cabinet view functionality
    initCabinetView();
    
    // Load cabinets from API
    loadCabinets();
    
    // Initialize Add Cabinet button
    initAddCabinetButton();
}

/**
 * Initialize filter dropdowns and search bar visibility
 */
function initFilterDropdowns() {
    const cabinetDropdownBtn = document.getElementById('cabinetDropdownBtn');
    const cabinetDropdown = document.getElementById('cabinetDropdown');
    const cabinetDropdownText = document.getElementById('cabinetDropdownText');
    const statusDropdownBtn = document.getElementById('statusDropdownBtn');
    const statusDropdown = document.getElementById('statusDropdown');
    const statusDropdownText = document.getElementById('statusDropdownText');
    const fileCategoryDropdownBtn = document.getElementById('fileCategoryDropdownBtn');
    const fileCategoryDropdown = document.getElementById('fileCategoryDropdown');
    const fileCategoryDropdownText = document.getElementById('fileCategoryDropdownText');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const pageHeader = document.getElementById('pageHeader');
    
    // Cabinet Dropdown
    if (cabinetDropdownBtn && cabinetDropdown) {
        cabinetDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cabinetDropdown.classList.toggle('hidden');
            // Close status dropdown if open
            if (statusDropdown) {
                statusDropdown.classList.add('hidden');
            }
        });
        
        // Handle cabinet selection - Show documents view or filter/sort by cabinet number
        const cabinetOptions = cabinetDropdown.querySelectorAll('button[data-cabinet]');
        cabinetOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const cabinetValue = option.getAttribute('data-cabinet');
                const cabinetText = option.textContent.trim();
                
                // Update button text
                cabinetDropdownText.textContent = cabinetText;
                
                // Close dropdown
                cabinetDropdown.classList.add('hidden');
                
                // Get main header and filters section
                const mainHeader = document.getElementById('mainHeader');
                const filtersSection = document.getElementById('filtersSection');
                const cabinetsGrid = document.getElementById('cabinetsGrid');
                const documentsView = document.getElementById('documentsView');
                const selectedCabinetName = document.getElementById('selectedCabinetName');
                const searchBarContainer = document.getElementById('searchBarContainer');
                const pageHeader = document.getElementById('pageHeader');
                
                // If "All Cabinets" is selected, show cabinets grid
                if (cabinetValue === 'all') {
                    // Show main header
                    if (mainHeader) {
                        mainHeader.classList.remove('hidden');
                    }
                    
                    // Hide search bar and restore filters section styling
                    if (searchBarContainer) {
                        searchBarContainer.classList.remove('visible');
                        searchBarContainer.classList.add('invisible');
                        // Clear search value
                        const searchInput = document.getElementById('searchPapersInput');
                        if (searchInput) {
                            searchInput.value = '';
                        }
                    }
                    if (filtersSection) {
                        filtersSection.classList.remove('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
                        filtersSection.classList.add('p-6', 'mb-6');
                    }
                    if (pageHeader) {
                        pageHeader.classList.remove('hidden');
                    }
                    
                    // Show cabinets grid and hide documents view
                    if (cabinetsGrid) {
                        cabinetsGrid.classList.remove('hidden');
                    }
                    if (documentsView) {
                        documentsView.classList.add('hidden');
                    }

                    // Reset Cabinet Number filter to "All" for next time user opens documents view
                    setCabinetNumberFilter('all');
                } else {
                    // Hide main header when specific cabinet is selected
                    if (mainHeader) {
                        mainHeader.classList.add('hidden');
                    }
                    
                    // Show search bar and expand filters section
                    if (searchBarContainer) {
                        searchBarContainer.classList.remove('invisible');
                        searchBarContainer.classList.add('visible');
                    }
                    if (filtersSection) {
                        filtersSection.classList.remove('p-6', 'mb-6');
                        filtersSection.classList.add('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
                    }
                    if (pageHeader) {
                        pageHeader.classList.add('hidden');
                    }
                    
                    // Show documents view and hide cabinets grid
                    if (cabinetsGrid) {
                        cabinetsGrid.classList.add('hidden');
                    }
                    if (documentsView) {
                        documentsView.classList.remove('hidden');
                    }
                    if (selectedCabinetName) {
                        selectedCabinetName.textContent = cabinetText;
                    }
                    
                    // Load documents for this cabinet
                    // TODO: Later replace this with backend fetch for the selected Cabinet (Cabinet 1/2/3)
                    loadCabinetDocuments(cabinetValue);

                    // Keep Cabinet Number filter default as "All Cabinet Numbers"
                    // (User can manually choose C1.1 / C2.1 / C3.1 from the filter dropdown)
                    setCabinetNumberFilter('all');
                }
            });
        });
    }
    
    // Status Dropdown
    if (statusDropdownBtn && statusDropdown) {
        statusDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            statusDropdown.classList.toggle('hidden');
            // Close cabinet dropdown if open
            if (cabinetDropdown) {
                cabinetDropdown.classList.add('hidden');
            }
        });
        
        // Handle status selection
        const statusOptions = statusDropdown.querySelectorAll('button[data-status]');
        statusOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const statusValue = option.getAttribute('data-status');
                const statusText = option.textContent.trim();
                
                // Update button text
                statusDropdownText.textContent = statusText;
                
                // Close dropdown
                statusDropdown.classList.add('hidden');
                
                // TODO: Filter by status
                console.log('Selected status:', statusValue);
            });
        });
    }
    
    // File Category Dropdown
    if (fileCategoryDropdownBtn && fileCategoryDropdown) {
        fileCategoryDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileCategoryDropdown.classList.toggle('hidden');
            // Close other dropdowns if open
            if (cabinetDropdown) {
                cabinetDropdown.classList.add('hidden');
            }
            if (statusDropdown) {
                statusDropdown.classList.add('hidden');
            }
        });
        
        // Handle file category selection
        const categoryOptions = fileCategoryDropdown.querySelectorAll('button[data-category]');
        categoryOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryValue = option.getAttribute('data-category');
                const categoryText = option.textContent.trim();
                
                // Update button text
                fileCategoryDropdownText.textContent = categoryText;
                
                // Close dropdown
                fileCategoryDropdown.classList.add('hidden');
                
                // TODO: Filter by file category
                console.log('Selected file category:', categoryValue);
            });
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (cabinetDropdownBtn && !cabinetDropdownBtn.contains(e.target) && cabinetDropdown && !cabinetDropdown.contains(e.target)) {
            cabinetDropdown.classList.add('hidden');
        }
        if (statusDropdownBtn && !statusDropdownBtn.contains(e.target) && statusDropdown && !statusDropdown.contains(e.target)) {
            statusDropdown.classList.add('hidden');
        }
        if (fileCategoryDropdownBtn && !fileCategoryDropdownBtn.contains(e.target) && fileCategoryDropdown && !fileCategoryDropdown.contains(e.target)) {
            fileCategoryDropdown.classList.add('hidden');
        }
    });
}

/**
 * Initialize cabinet view functionality
 */
function initCabinetView() {
    const viewPapersButtons = document.querySelectorAll('.view-papers-btn');
    const cabinetsGrid = document.getElementById('cabinetsGrid');
    const documentsView = document.getElementById('documentsView');
    const backToCabinetsBtn = document.getElementById('backToCabinetsBtn');
    const selectedCabinetName = document.getElementById('selectedCabinetName');
    const addDocumentBtn = document.getElementById('addDocumentBtn');
    const cabinetDropdownText = document.getElementById('cabinetDropdownText');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const pageHeader = document.getElementById('pageHeader');

    // Cabinet Number filter dropdown (C1.1/C1.2/C1.3) inside Documents table header
    initCabinetNumberFilter();
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Handle "View Papers" button clicks (will be re-initialized after dynamic loading)
    viewPapersButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cabinetId = button.getAttribute('data-cabinet-id');
            const cabinetName = button.getAttribute('data-cabinet-name');
            
            // Get main header element
            const mainHeader = document.getElementById('mainHeader');
            const filtersSection = document.getElementById('filtersSection');
            
            // Hide main header (Cabinets Management title, Add Cabinet button, Profile dropdown)
            if (mainHeader) {
                mainHeader.classList.add('hidden');
            }
            
            // Update cabinet dropdown text to match selected cabinet
            if (cabinetDropdownText) {
                cabinetDropdownText.textContent = cabinetName;
            }
            
            // Show search bar and expand filters section
            if (searchBarContainer) {
                searchBarContainer.classList.remove('invisible');
                searchBarContainer.classList.add('visible');
            }
            if (filtersSection) {
                filtersSection.classList.remove('p-6', 'mb-6');
                filtersSection.classList.add('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
            }
            if (pageHeader) {
                pageHeader.classList.add('hidden');
            }
            
            // Show documents view and hide cabinets grid
            if (cabinetsGrid) {
                cabinetsGrid.classList.add('hidden');
            }
            if (documentsView) {
                documentsView.classList.remove('hidden');
            }
            if (selectedCabinetName) {
                selectedCabinetName.textContent = cabinetName;
            }
            
            // Load documents for this cabinet (you can fetch from API here)
            // TODO: Later replace this with backend fetch by cabinetId (e.g., C1.1 / C2.1 / C3.1)
            loadCabinetDocuments(cabinetId);

            // Keep Cabinet Number filter default as "All Cabinet Numbers" when opening the documents view
            setCabinetNumberFilter('all');
        });
    });
    
    // Handle back button
    if (backToCabinetsBtn) {
        backToCabinetsBtn.addEventListener('click', () => {
            // Get main header and filters section
            const mainHeader = document.getElementById('mainHeader');
            const filtersSection = document.getElementById('filtersSection');
            
            // Show main header again
            if (mainHeader) {
                mainHeader.classList.remove('hidden');
            }
            
            // Reset cabinet dropdown to "All Cabinets"
            if (cabinetDropdownText) {
                cabinetDropdownText.textContent = 'Select Cabinet';
            }

            // Reset cabinet number filter to show all documents again
            setCabinetNumberFilter('all');
            
            // Hide search bar and restore filters section styling
            if (searchBarContainer) {
                searchBarContainer.classList.remove('visible');
                searchBarContainer.classList.add('invisible');
                // Clear search value
                const searchInput = document.getElementById('searchPapersInput');
                if (searchInput) {
                    searchInput.value = '';
                }
            }
            if (filtersSection) {
                filtersSection.classList.remove('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
                filtersSection.classList.add('p-6', 'mb-6');
            }
            if (pageHeader) {
                pageHeader.classList.remove('hidden');
            }
            
            // Show cabinets grid and hide documents view
            if (cabinetsGrid) {
                cabinetsGrid.classList.remove('hidden');
            }
            if (documentsView) {
                documentsView.classList.add('hidden');
            }
            
            // Note: File Category dropdown is NOT reset - it only updates when user explicitly selects from it
        });
    }
    
    // Handle add document button
    if (addDocumentBtn) {
        addDocumentBtn.addEventListener('click', () => {
            showAddDocumentModal();
        });
    }
    
    // Initialize document count (counts visible rows)
    updateDocumentCount();
    
    // Initialize delete buttons
    const deleteButtons = document.querySelectorAll('.delete-doc-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const docName = btn.getAttribute('data-doc-name');
            deleteDocument(row, docName);
            // Ensure numbering + count reflects visibility after deletion
            updateRowNumbersAfterFilter();
            updateDocumentCount();
        });
    });
}

// Listen for document added event from cabinet-view.js
window.addEventListener('documentAdded', async (event) => {
    if (event.detail && event.detail.cabinetId) {
        await loadCabinetDocuments(event.detail.cabinetId);
    }
});

/**
 * Load documents for a specific cabinet
 * @param {string|number} cabinetId - Cabinet ID (number) or cabinet number string (e.g., 'C1.1', 'C2.1', 'C3.1')
 * TODO: Backend implementation - Fetch documents from /backend/api/files.php?cabinet_id={cabinetId}
 */
async function loadCabinetDocuments(cabinetId) {
    // Extract cabinet ID if it's a string like "C1.1"
    let actualCabinetId = cabinetId;
    if (typeof cabinetId === 'string' && cabinetId.startsWith('C')) {
        const match = cabinetId.match(/^C(\d+)\./);
        if (match) {
            actualCabinetId = parseInt(match[1], 10);
        }
    }
    
    // Extract cabinet prefix for dropdown
    const prefixMatch = String(cabinetId).match(/^(C\d+)\./);
    const cabinetPrefix = prefixMatch ? prefixMatch[1] : 'C' + actualCabinetId;
    
    try {
        // Fetch documents from API
        const response = await fetch(`/backend/api/files.php?cabinet_id=${actualCabinetId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            // Populate Cabinet Number filter dropdown with numbers for this cabinet
            populateCabinetNumberFilter(cabinetPrefix);
            
            // Render documents from API
            renderDocuments(result.data);
            
            // Update document count
            updateDocumentCount();
        } else {
            console.error('Failed to load documents:', result.message);
            // Show empty state
            const tableBody = document.getElementById('documentsTableBody');
            const emptyStateRow = document.getElementById('emptyStateRow');
            if (tableBody && emptyStateRow) {
                const existingRows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
                existingRows.forEach(row => row.remove());
                emptyStateRow.classList.remove('hidden');
            }
            updateDocumentCount();
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        // Show empty state on error
        const tableBody = document.getElementById('documentsTableBody');
        const emptyStateRow = document.getElementById('emptyStateRow');
        if (tableBody && emptyStateRow) {
            const existingRows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
            existingRows.forEach(row => row.remove());
            emptyStateRow.classList.remove('hidden');
        }
        updateDocumentCount();
    }
}

/**
 * Populate Cabinet Number filter dropdown based on selected cabinet prefix
 * Only shows cabinet numbers that actually exist in the documents table
 * @param {string} cabinetPrefix - Cabinet prefix (e.g., 'C1', 'C2', 'C3')
 * If not provided, will try to detect from selected cabinet
 */
export function populateCabinetNumberFilter(cabinetPrefix) {
    // If prefix not provided, try to detect it
    if (!cabinetPrefix) {
        const selectedCabinetNameEl = document.getElementById('selectedCabinetName');
        const cabinetDropdownTextEl = document.getElementById('cabinetDropdownText');
        
        const cabinetNameToPrefix = {
            'Cabinet 1': 'C1',
            'Cabinet 2': 'C2',
            'Cabinet 3': 'C3'
        };
        
        let cabinetText = '';
        if (selectedCabinetNameEl && selectedCabinetNameEl.textContent.trim()) {
            cabinetText = selectedCabinetNameEl.textContent.trim();
        } else if (cabinetDropdownTextEl && cabinetDropdownTextEl.textContent.trim() && 
                   cabinetDropdownTextEl.textContent.trim() !== 'Select Cabinet' &&
                   cabinetDropdownTextEl.textContent.trim() !== 'All Cabinets') {
            cabinetText = cabinetDropdownTextEl.textContent.trim();
        }
        
        if (cabinetText && cabinetNameToPrefix[cabinetText]) {
            cabinetPrefix = cabinetNameToPrefix[cabinetText];
        } else {
            // Try to extract from cabinet number
            const match = cabinetText.match(/^(C\d+)\./);
            if (match) {
                cabinetPrefix = match[1];
            } else {
                cabinetPrefix = 'C1'; // Default
            }
        }
    }
    const dropdown = document.getElementById('cabinetNumberFilterDropdown');
    if (!dropdown) return;
    
    // Clear existing options (except "All Cabinet Numbers")
    const allButton = dropdown.querySelector('button[data-cabinet-number="all"]');
    dropdown.innerHTML = '';
    if (allButton) {
        dropdown.appendChild(allButton);
    } else {
        // Create "All Cabinet Numbers" button if it doesn't exist
        const allBtn = document.createElement('button');
        allBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
        allBtn.setAttribute('data-cabinet-number', 'all');
        allBtn.textContent = 'All Cabinet Numbers';
        dropdown.appendChild(allBtn);
    }
    
    // TODO: Backend implementation - Fetch actual document numbers from database
    // Example SQL: SELECT DISTINCT cabinet_number FROM documents WHERE cabinet_number LIKE 'C1.%' ORDER BY cabinet_number
    // For now, scan the actual documents in the table to find existing cabinet numbers
    const tableBody = document.getElementById('documentsTableBody');
    const existingCabinetNumbers = new Set();
    
    if (tableBody) {
        const rows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
        rows.forEach(row => {
            const cabinetNumberCell = row.querySelector('td:nth-child(2)');
            if (cabinetNumberCell) {
                const cellText = cabinetNumberCell.textContent.trim();
                // Check if this document belongs to the current cabinet prefix
                if (cellText.startsWith(cabinetPrefix + '.')) {
                    existingCabinetNumbers.add(cellText);
                }
            }
        });
    }
    
    // Convert Set to Array and sort by number (C1.1, C1.2, C1.3, etc.)
    const sortedNumbers = Array.from(existingCabinetNumbers).sort((a, b) => {
        const numA = parseInt(a.split('.')[1], 10);
        const numB = parseInt(b.split('.')[1], 10);
        return numA - numB;
    });
    
    // Create dropdown buttons only for existing cabinet numbers
    sortedNumbers.forEach(cabinetNumber => {
        const button = document.createElement('button');
        button.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
        button.setAttribute('data-cabinet-number', cabinetNumber);
        button.textContent = cabinetNumber;
        dropdown.appendChild(button);
    });
    
    // Re-initialize event listeners for the new buttons
    const options = dropdown.querySelectorAll('button[data-cabinet-number]');
    options.forEach((opt) => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = opt.getAttribute('data-cabinet-number') || 'all';
            setCabinetNumberFilter(value);
            dropdown.classList.add('hidden');
        });
    });
    
    // Update active state for currently selected option
    updateCabinetNumberFilterActiveState();
}

/**
 * Render documents from API data
 * @param {Array} documents - Array of document objects from API
 */
function renderDocuments(documents) {
    const tableBody = document.getElementById('documentsTableBody');
    const emptyStateRow = document.getElementById('emptyStateRow');
    
    if (!tableBody) return;
    
    // Clear existing document rows (keep empty state row if it exists)
    const existingRows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
    existingRows.forEach(row => row.remove());
    
    if (documents.length === 0) {
        // Show empty state
        if (emptyStateRow) {
            emptyStateRow.classList.remove('hidden');
        }
        return;
    }
    
    // Hide empty state row since we have documents
    if (emptyStateRow) {
        emptyStateRow.classList.add('hidden');
    }
    
    // Render documents
    documents.forEach((doc, index) => {
        const row = createDocumentRowFromAPI(doc, index + 1);
        tableBody.appendChild(row);
    });
    
    // Initialize action button event listeners
    initDocumentActionButtons();
}

/**
 * Create a document table row from API data
 * @param {Object} doc - Document object from API
 * @param {number} rowNumber - Row number (NO. column)
 * @returns {HTMLElement} Table row element
 */
function createDocumentRowFromAPI(doc, rowNumber) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    row.setAttribute('data-file-id', doc.id);
    row.setAttribute('data-cabinet-number', doc.cabinet_number);
    row.setAttribute('data-filename', doc.filename);
    
    // Category badge color
    let categoryBadgeClass = 'bg-purple-100 text-purple-800'; // Default for Documents
    if (doc.category === 'Sports') {
        categoryBadgeClass = 'bg-blue-100 text-blue-800';
    } else if (doc.category === 'Objects') {
        categoryBadgeClass = 'bg-orange-100 text-orange-800';
    }
    
    // Status badge color
    let statusBadgeClass = 'bg-green-100 text-green-800';
    if (doc.status === 'borrowed') {
        statusBadgeClass = 'bg-yellow-100 text-yellow-800';
    } else if (doc.status === 'archived') {
        statusBadgeClass = 'bg-gray-100 text-gray-800';
    }
    
    const statusText = doc.status === 'borrowed' ? 'Borrowed' : (doc.status === 'archived' ? 'Archived' : 'Available');
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rowNumber}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-900 font-medium">${doc.cabinet_number}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${doc.filename}</div>
            <div class="text-sm text-gray-500">${doc.description || 'No description'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs rounded-full ${categoryBadgeClass}">${doc.category || 'Documents'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-[#800000] flex items-center justify-center text-white font-semibold text-xs mr-2">
                    ${(doc.added_by || 'A').charAt(0).toUpperCase()}
                </div>
                <span class="text-sm text-gray-900">${doc.added_by || 'Admin'}</span>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass}">${statusText}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center gap-2">
                <button class="view-file-btn text-[#800000] hover:text-[#700000] hover:underline cursor-pointer" data-file-id="${doc.id}">View</button>
                <span class="text-gray-300">|</span>
                <button class="edit-file-btn text-blue-600 hover:text-blue-800 hover:underline cursor-pointer" data-file-id="${doc.id}">Edit</button>
                <span class="text-gray-300">|</span>
                <button class="archive-file-btn text-red-600 hover:text-red-800 hover:underline cursor-pointer" data-file-id="${doc.id}" data-file-name="${doc.filename}">Archive</button>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Create a document table row (legacy function for backward compatibility)
 * @param {number} rowNumber - Row number (NO. column)
 * @param {string} cabinetNumber - Cabinet number (e.g., 'C1.1')
 * @param {string} fileName - File name
 * @param {string} description - File description
 * @param {string} category - Document category
 * @param {string} status - Document status
 * @returns {HTMLElement} Table row element
 */
function createDocumentRow(rowNumber, cabinetNumber, fileName, description, category, status) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    // Category badge color
    let categoryBadgeClass = 'bg-purple-100 text-purple-800'; // Default for Documents
    if (category === 'Sports') {
        categoryBadgeClass = 'bg-blue-100 text-blue-800';
    } else if (category === 'Objects') {
        categoryBadgeClass = 'bg-orange-100 text-orange-800';
    }
    
    // Status badge color
    let statusBadgeClass = 'bg-green-100 text-green-800';
    if (status === 'Borrowed') {
        statusBadgeClass = 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Archived') {
        statusBadgeClass = 'bg-gray-100 text-gray-800';
    }
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rowNumber}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-900 font-medium">${cabinetNumber}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${fileName}</div>
            <div class="text-sm text-gray-500">${description}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 text-xs rounded-full ${categoryBadgeClass}">${category}</span>
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
            <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass}">${status}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center gap-2">
                <button class="text-[#800000] hover:text-[#700000] hover:underline cursor-pointer">View</button>
                <span class="text-gray-300">|</span>
                <button class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">Edit</button>
                <span class="text-gray-300">|</span>
                <button class="text-red-600 hover:text-red-800 hover:underline cursor-pointer delete-doc-btn" data-doc-name="${fileName}">Delete</button>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Cabinet Number dropdown (Documents table header) init
 * This is separate from the "Select Cabinet" dropdown (Cabinet 1/2/3).
 */
function initCabinetNumberFilter() {
    const btn = document.getElementById('cabinetNumberFilterBtn');
    const dropdown = document.getElementById('cabinetNumberFilterDropdown');
    const text = document.getElementById('cabinetNumberFilterText');

    if (!btn || !dropdown || !text) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        // Update active state when dropdown opens
        if (!dropdown.classList.contains('hidden')) {
            updateCabinetNumberFilterActiveState();
        }
    });

    const options = dropdown.querySelectorAll('button[data-cabinet-number]');
    options.forEach((opt) => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = opt.getAttribute('data-cabinet-number') || 'all';
            setCabinetNumberFilter(value);
            dropdown.classList.add('hidden');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

/**
 * Set Cabinet Number filter UI + apply filter to table
 * @param {'all'|'C1.1'|'C1.2'|'C1.3'} cabinetNumber
 */
function setCabinetNumberFilter(cabinetNumber) {
    const text = document.getElementById('cabinetNumberFilterText');
    if (text) {
        text.textContent = cabinetNumber === 'all' ? 'All Cabinet Numbers' : cabinetNumber;
    }
    
    // Update active state in dropdown
    updateCabinetNumberFilterActiveState(cabinetNumber);
    
    // Apply filter to table
    filterDocumentsByCabinetNumber(cabinetNumber);
}

/**
 * Update active/selected state for Cabinet Number filter dropdown options
 * @param {string} selectedValue - Currently selected cabinet number (optional, will read from text if not provided)
 */
function updateCabinetNumberFilterActiveState(selectedValue) {
    const dropdown = document.getElementById('cabinetNumberFilterDropdown');
    const text = document.getElementById('cabinetNumberFilterText');
    
    if (!dropdown) return;
    
    // Get selected value from parameter or from text element
    const currentValue = selectedValue || (text ? text.textContent.trim() : 'all');
    const activeValue = currentValue === 'All Cabinet Numbers' ? 'all' : currentValue;
    
    // Remove active state from all options
    const options = dropdown.querySelectorAll('button[data-cabinet-number]');
    options.forEach(opt => {
        // Remove active classes
        opt.classList.remove('bg-[#800000]', 'text-white', 'font-semibold');
        opt.classList.add('text-gray-700');
        
        // Add checkmark if it exists
        const checkmark = opt.querySelector('.checkmark');
        if (checkmark) {
            checkmark.remove();
        }
    });
    
    // Add active state to selected option
    const selectedOption = dropdown.querySelector(`button[data-cabinet-number="${activeValue}"]`);
    if (selectedOption) {
        selectedOption.classList.remove('text-gray-700', 'hover:bg-gray-100');
        selectedOption.classList.add('bg-[#800000]', 'text-white', 'font-semibold');
        
        // Add checkmark icon
        if (!selectedOption.querySelector('.checkmark')) {
            const checkmark = document.createElement('svg');
            checkmark.className = 'checkmark w-4 h-4 inline-block ml-2';
            checkmark.setAttribute('fill', 'none');
            checkmark.setAttribute('stroke', 'currentColor');
            checkmark.setAttribute('viewBox', '0 0 24 24');
            checkmark.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
            selectedOption.appendChild(checkmark);
        }
    }
}

/**
 * Filter documents by cabinet number
 * This function filters the documents table to show only documents with the specified cabinet number
 * @param {string} cabinetNumber - Cabinet number to filter by (e.g., 'C1.1', 'C1.2', 'C1.3', or 'all')
 */
function filterDocumentsByCabinetNumber(cabinetNumber) {
    const tableBody = document.getElementById('documentsTableBody');
    if (!tableBody) return;
    
    // Get all document rows (excluding empty state row)
    const rows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
    const emptyStateRow = document.getElementById('emptyStateRow');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Get the cabinet number from the second column (Cabinet Number column)
        const cabinetNumberCell = row.querySelector('td:nth-child(2)');
        if (cabinetNumberCell) {
            const cellText = cabinetNumberCell.textContent.trim();
            
            // Show or hide row based on filter
            if (cabinetNumber === 'all' || cellText === cabinetNumber) {
                row.classList.remove('hidden');
                visibleCount++;
            } else {
                row.classList.add('hidden');
            }
        }
    });
    
    // Show/hide empty state
    if (emptyStateRow) {
        if (visibleCount === 0) {
            emptyStateRow.classList.remove('hidden');
        } else {
            emptyStateRow.classList.add('hidden');
        }
    }
    
    // Update row numbers after filtering
    updateRowNumbersAfterFilter();
    
    // Update document count (visible rows only)
    updateDocumentCount();
    
    // TODO: Backend implementation - Sort documents by cabinet number
    // When a cabinet number is selected, the backend should filter/sort documents
    // Example SQL: SELECT * FROM documents WHERE cabinet_number = 'C1.1' ORDER BY created_at DESC
    console.log('Filtering documents by cabinet number:', cabinetNumber);
}

/**
 * Update row numbers after filtering
 */
function updateRowNumbersAfterFilter() {
    const tableBody = document.getElementById('documentsTableBody');
    if (!tableBody) return;
    
    // Get only visible rows (excluding empty state row)
    const visibleRows = Array.from(tableBody.querySelectorAll('tr:not(#emptyStateRow)'))
        .filter(row => !row.classList.contains('hidden'));
    
    visibleRows.forEach((row, index) => {
        const firstCell = row.querySelector('td:first-child');
        if (firstCell) {
            firstCell.textContent = index + 1;
        }
    });
}

/**
 * Load cabinets from API and render them
 * TODO: Backend implementation - Fetch cabinets from /backend/api/cabinets.php
 */
async function loadCabinets() {
    try {
        const response = await fetch('/backend/api/cabinets.php');
        const result = await response.json();
        
        if (result.success && result.data) {
            renderCabinets(result.data);
        } else {
            console.error('Failed to load cabinets:', result.message);
            showEmptyCabinetsState();
        }
    } catch (error) {
        console.error('Error loading cabinets:', error);
        showEmptyCabinetsState();
    }
}

/**
 * Render cabinet cards
 * @param {Array} cabinets - Array of cabinet objects
 */
function renderCabinets(cabinets) {
    const cabinetsGrid = document.getElementById('cabinetsGrid');
    const emptyState = document.getElementById('emptyCabinetsState');
    
    if (!cabinetsGrid) return;
    
    // Clear existing cabinets (except empty state)
    const existingCards = cabinetsGrid.querySelectorAll('.cabinet-card');
    existingCards.forEach(card => card.remove());
    
    if (cabinets.length === 0) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }
    
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    cabinets.forEach(cabinet => {
        const card = createCabinetCard(cabinet);
        cabinetsGrid.appendChild(card);
    });
    
    // Re-initialize View Papers button listeners
    const viewPapersButtons = document.querySelectorAll('.view-papers-btn');
    viewPapersButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cabinetId = button.getAttribute('data-cabinet-id');
            const cabinetName = button.getAttribute('data-cabinet-name');
            
            // Get main header element
            const mainHeader = document.getElementById('mainHeader');
            const filtersSection = document.getElementById('filtersSection');
            
            // Hide main header (Cabinets Management title, Add Cabinet button, Profile dropdown)
            if (mainHeader) {
                mainHeader.classList.add('hidden');
            }
            
            // Update cabinet dropdown text to match selected cabinet
            const cabinetDropdownText = document.getElementById('cabinetDropdownText');
            if (cabinetDropdownText) {
                cabinetDropdownText.textContent = cabinetName;
            }
            
            // Show search bar and expand filters section
            const searchBarContainer = document.getElementById('searchBarContainer');
            if (searchBarContainer) {
                searchBarContainer.classList.remove('invisible');
                searchBarContainer.classList.add('visible');
            }
            if (filtersSection) {
                filtersSection.classList.remove('p-6', 'mb-6');
                filtersSection.classList.add('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
            }
            const pageHeader = document.getElementById('pageHeader');
            if (pageHeader) {
                pageHeader.classList.add('hidden');
            }
            
            // Show documents view and hide cabinets grid
            const cabinetsGrid = document.getElementById('cabinetsGrid');
            const documentsView = document.getElementById('documentsView');
            if (cabinetsGrid) {
                cabinetsGrid.classList.add('hidden');
            }
            if (documentsView) {
                documentsView.classList.remove('hidden');
            }
            const selectedCabinetName = document.getElementById('selectedCabinetName');
            if (selectedCabinetName) {
                selectedCabinetName.textContent = cabinetName;
            }
            
            // Load documents for this cabinet
            // TODO: Backend implementation - Fetch documents from /backend/api/files.php?cabinet_id={cabinetId}
            loadCabinetDocuments(cabinetId);
            
            // Keep Cabinet Number filter default as "All Cabinet Numbers" when opening the documents view
            setCabinetNumberFilter('all');
        });
    });
}

/**
 * Create a cabinet card element
 * @param {Object} cabinet - Cabinet object from API
 * @returns {HTMLElement} Cabinet card element
 */
function createCabinetCard(cabinet) {
    const card = document.createElement('div');
    card.className = 'cabinet-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#800000]';
    
    // Status badge styling
    let statusBadgeClass = 'bg-green-100 text-green-800';
    let statusText = 'Active';
    if (cabinet.status === 'pending') {
        statusBadgeClass = 'bg-orange-100 text-orange-800';
        statusText = 'Pending';
    } else if (cabinet.status === 'archived') {
        statusBadgeClass = 'bg-gray-100 text-gray-800';
        statusText = 'Archived';
    }
    
    const fileCount = cabinet.file_count || 0;
    const cabinetId = 'C' + cabinet.id + '.1'; // First document number for this cabinet
    const cabinetName = cabinet.name || 'Cabinet ' + cabinet.id;
    
    card.innerHTML = `
        <div class="p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass}">${statusText}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${cabinetName}</h3>
            <p class="text-sm text-gray-600 mb-3">${cabinet.description || 'No description'}</p>
            <div class="flex items-center gap-2 mb-4">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-xs text-gray-600 font-medium">${fileCount} Paper${fileCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span></span>
                <button class="view-papers-btn text-[#800000] hover:text-[#700000] hover:bg-[#800000]/10 hover:underline font-medium cursor-pointer px-2 py-1 rounded transition-all duration-200 flex items-center gap-1 group" data-cabinet-id="${cabinet.id}" data-cabinet-name="${cabinetName}">
                    <span>View Papers</span>
                    <svg class="w-3 h-3 transform group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Show empty cabinets state
 */
function showEmptyCabinetsState() {
    const emptyState = document.getElementById('emptyCabinetsState');
    if (emptyState) {
        emptyState.classList.remove('hidden');
    }
}

/**
 * Initialize Add Cabinet button
 */
function initAddCabinetButton() {
    const addCabinetBtn = document.getElementById('addCabinetBtn');
    if (addCabinetBtn) {
        addCabinetBtn.addEventListener('click', () => {
            showAddCabinetModal();
        });
    }
}

/**
 * Show Add Cabinet modal using SweetAlert2
 * TODO: Import SweetAlert2 if not already imported
 */
async function showAddCabinetModal() {
    // Dynamic import SweetAlert2
    const Swal = (await import('sweetalert2')).default;
    
    Swal.fire({
        title: 'Add New Cabinet',
        html: `
            <form id="addCabinetForm" class="text-left">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cabinet Name</label>
                    <input 
                        type="text" 
                        id="cabinetName" 
                        name="cabinetName" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        placeholder="Cabinet 1"
                        value="Cabinet"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <textarea 
                        id="cabinetDescription" 
                        name="cabinetDescription" 
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        placeholder="Enter cabinet description"
                    ></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                        id="cabinetStatus" 
                        name="cabinetStatus" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        required
                    >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add Cabinet',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#800000',
        cancelButtonColor: '#6b7280',
        width: '500px',
        didOpen: () => {
            const firstInput = document.getElementById('cabinetName');
            if (firstInput) {
                firstInput.focus();
            }
        },
        preConfirm: () => {
            const name = document.getElementById('cabinetName')?.value;
            const description = document.getElementById('cabinetDescription')?.value;
            const status = document.getElementById('cabinetStatus')?.value;
            
            if (!name || !status) {
                Swal.showValidationMessage('Please fill in all required fields');
                return false;
            }
            
            return {
                name: name.trim(),
                description: description ? description.trim() : null,
                status
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            try {
                const response = await fetch('/backend/api/cabinets.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result.value)
                });
                
                const apiResult = await response.json();
                
                if (apiResult.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Cabinet Added!',
                        text: `"${result.value.name}" has been added successfully.`,
                        confirmButtonColor: '#800000',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    // Reload cabinets
                    loadCabinets();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: apiResult.message || 'Failed to add cabinet',
                        confirmButtonColor: '#800000'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add cabinet: ' + error.message,
                    confirmButtonColor: '#800000'
                });
            }
        }
    });
}

/**
 * Initialize search functionality
 * TODO: Backend implementation - Search will filter by Cabinet Number or File Name
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchPapersInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Debounce search (wait 300ms after user stops typing)
        searchTimeout = setTimeout(() => {
            if (searchTerm) {
                // Perform client-side search for now
                // TODO: Backend implementation - Call API with search parameter
                // Example: GET /backend/api/files.php?cabinet_id={id}&search={term}
                performSearch(searchTerm);
            } else {
                // Show all documents if search is cleared
                const rows = document.querySelectorAll('#documentsTableBody tr:not(#emptyStateRow)');
                rows.forEach(row => {
                    row.classList.remove('hidden');
                });
                updateRowNumbersAfterFilter();
                updateDocumentCount();
            }
        }, 300);
    });
}

/**
 * Perform search on documents table
 * @param {string} searchTerm - Search term
 */
function performSearch(searchTerm) {
    const tableBody = document.getElementById('documentsTableBody');
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Get cabinet number (column 2) and filename (column 3)
        const cabinetNumberCell = row.querySelector('td:nth-child(2)');
        const fileNameCell = row.querySelector('td:nth-child(3)');
        
        const cabinetNumber = cabinetNumberCell ? cabinetNumberCell.textContent.trim().toLowerCase() : '';
        const fileName = fileNameCell ? fileNameCell.querySelector('.text-sm.font-medium')?.textContent.trim().toLowerCase() || '' : '';
        
        const searchLower = searchTerm.toLowerCase();
        
        // Show row if search term matches cabinet number or filename
        if (cabinetNumber.includes(searchLower) || fileName.includes(searchLower)) {
            row.classList.remove('hidden');
            visibleCount++;
        } else {
            row.classList.add('hidden');
        }
    });
    
    // Update row numbers and count
    updateRowNumbersAfterFilter();
    updateDocumentCount();
    
    // Show/hide empty state
    const emptyStateRow = document.getElementById('emptyStateRow');
    if (emptyStateRow) {
        if (visibleCount === 0) {
            emptyStateRow.classList.remove('hidden');
        } else {
            emptyStateRow.classList.add('hidden');
        }
    }
}

/**
 * Initialize document action buttons (View, Edit, Archive)
 */
function initDocumentActionButtons() {
    // View buttons
    const viewButtons = document.querySelectorAll('.view-file-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const fileId = btn.getAttribute('data-file-id');
            await showViewFileModal(fileId);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-file-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const fileId = btn.getAttribute('data-file-id');
            await showEditFileModal(fileId);
        });
    });
    
    // Archive buttons
    const archiveButtons = document.querySelectorAll('.archive-file-btn');
    archiveButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const fileId = btn.getAttribute('data-file-id');
            const fileName = btn.getAttribute('data-file-name');
            await archiveFile(fileId, fileName);
        });
    });
}

/**
 * Show View File modal using SweetAlert2
 * @param {number} fileId - File ID
 */
async function showViewFileModal(fileId) {
    const Swal = (await import('sweetalert2')).default;
    
    try {
        // Fetch file details from API
        const response = await fetch(`/backend/api/files.php?id=${fileId}`);
        const result = await response.json();
        
        if (!result.success || !result.data) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'File not found',
                confirmButtonColor: '#800000'
            });
            return;
        }
        
        const file = result.data;
        
        // Category badge color
        let categoryBadgeClass = 'bg-purple-100 text-purple-800';
        if (file.category === 'Sports') {
            categoryBadgeClass = 'bg-blue-100 text-blue-800';
        } else if (file.category === 'Objects') {
            categoryBadgeClass = 'bg-orange-100 text-orange-800';
        }
        
        // Status badge color
        let statusBadgeClass = 'bg-green-100 text-green-800';
        if (file.status === 'borrowed') {
            statusBadgeClass = 'bg-yellow-100 text-yellow-800';
        } else if (file.status === 'archived') {
            statusBadgeClass = 'bg-gray-100 text-gray-800';
        }
        
        const statusText = file.status === 'borrowed' ? 'Borrowed' : (file.status === 'archived' ? 'Archived' : 'Available');
        
        Swal.fire({
            title: 'File Details',
            html: `
                <div class="text-left space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Cabinet Number</label>
                        <p class="text-sm text-gray-900">${file.cabinet_number}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                        <p class="text-sm text-gray-900">${file.filename}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p class="text-sm text-gray-600">${file.description || 'No description'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <span class="px-2 py-1 text-xs rounded-full ${categoryBadgeClass}">${file.category || 'Documents'}</span>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass}">${statusText}</span>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Added By</label>
                        <p class="text-sm text-gray-900">${file.added_by || 'Admin'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                        <p class="text-sm text-gray-600">${new Date(file.created_at).toLocaleString()}</p>
                    </div>
                </div>
            `,
            confirmButtonText: 'Close',
            confirmButtonColor: '#800000',
            width: '500px'
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load file details: ' + error.message,
            confirmButtonColor: '#800000'
        });
    }
}

/**
 * Show Edit File modal using SweetAlert2
 * @param {number} fileId - File ID
 */
async function showEditFileModal(fileId) {
    const Swal = (await import('sweetalert2')).default;
    
    try {
        // Fetch file details from API
        const response = await fetch(`/backend/api/files.php?id=${fileId}`);
        const result = await response.json();
        
        if (!result.success || !result.data) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'File not found',
                confirmButtonColor: '#800000'
            });
            return;
        }
        
        const file = result.data;
        
        Swal.fire({
            title: 'Edit Document',
            html: `
                <form id="editFileForm" class="text-left">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">File Name</label>
                        <input 
                            type="text" 
                            id="editFileName" 
                            name="filename" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                            value="${file.filename}"
                            required
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                            id="editFileDescription" 
                            name="description" 
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        >${file.description || ''}</textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select 
                            id="editFileCategory" 
                            name="category" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                            required
                        >
                            <option value="Documents" ${file.category === 'Documents' ? 'selected' : ''}>Documents</option>
                            <option value="Sports" ${file.category === 'Sports' ? 'selected' : ''}>Sports</option>
                            <option value="Objects" ${file.category === 'Objects' ? 'selected' : ''}>Objects</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                            id="editFileStatus" 
                            name="status" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                            required
                        >
                            <option value="available" ${file.status === 'available' ? 'selected' : ''}>Available</option>
                            <option value="borrowed" ${file.status === 'borrowed' ? 'selected' : ''}>Borrowed</option>
                            <option value="archived" ${file.status === 'archived' ? 'selected' : ''}>Archived</option>
                        </select>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Document',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#800000',
            cancelButtonColor: '#6b7280',
            width: '500px',
            didOpen: () => {
                const firstInput = document.getElementById('editFileName');
                if (firstInput) {
                    firstInput.focus();
                }
            },
            preConfirm: () => {
                const filename = document.getElementById('editFileName')?.value;
                const description = document.getElementById('editFileDescription')?.value;
                const category = document.getElementById('editFileCategory')?.value;
                const status = document.getElementById('editFileStatus')?.value;
                
                if (!filename || !category || !status) {
                    Swal.showValidationMessage('Please fill in all required fields');
                    return false;
                }
                
                return {
                    filename: filename.trim(),
                    description: description ? description.trim() : null,
                    category,
                    status
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const response = await fetch(`/backend/api/files.php?id=${fileId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result.value)
                    });
                    
                    const apiResult = await response.json();
                    
                    if (apiResult.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Document Updated!',
                            text: `"${result.value.filename}" has been updated successfully.`,
                            confirmButtonColor: '#800000',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        
                        // Reload documents for current cabinet
                        const selectedCabinetName = document.getElementById('selectedCabinetName');
                        if (selectedCabinetName) {
                            // Get cabinet ID from selected cabinet name or current view
                            const cabinetDropdownText = document.getElementById('cabinetDropdownText');
                            let cabinetId = null;
                            
                            if (cabinetDropdownText && cabinetDropdownText.textContent.trim() !== 'Select Cabinet' && cabinetDropdownText.textContent.trim() !== 'All Cabinets') {
                                // Try to extract from cabinet name or get from data attribute
                                const viewBtn = document.querySelector(`.view-papers-btn[data-cabinet-name="${cabinetDropdownText.textContent.trim()}"]`);
                                if (viewBtn) {
                                    cabinetId = viewBtn.getAttribute('data-cabinet-id');
                                }
                            }
                            
                            if (cabinetId) {
                                loadCabinetDocuments(cabinetId);
                            }
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: apiResult.message || 'Failed to update document',
                            confirmButtonColor: '#800000'
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update document: ' + error.message,
                        confirmButtonColor: '#800000'
                    });
                }
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load file details: ' + error.message,
            confirmButtonColor: '#800000'
        });
    }
}

/**
 * Archive file (soft delete)
 * @param {number} fileId - File ID
 * @param {string} fileName - File name for confirmation message
 */
async function archiveFile(fileId, fileName) {
    const Swal = (await import('sweetalert2')).default;
    
    Swal.fire({
        icon: 'warning',
        title: 'Archive Document?',
        text: `Are you sure you want to archive "${fileName}"?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, archive it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/backend/api/files.php?id=${fileId}`, {
                    method: 'DELETE'
                });
                
                const apiResult = await response.json();
                
                if (apiResult.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Archived!',
                        text: 'Document has been archived.',
                        confirmButtonColor: '#800000',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    // Reload documents for current cabinet
                    const cabinetDropdownText = document.getElementById('cabinetDropdownText');
                    if (cabinetDropdownText && cabinetDropdownText.textContent.trim() !== 'Select Cabinet' && cabinetDropdownText.textContent.trim() !== 'All Cabinets') {
                        const viewBtn = document.querySelector(`.view-papers-btn[data-cabinet-name="${cabinetDropdownText.textContent.trim()}"]`);
                        if (viewBtn) {
                            const cabinetId = viewBtn.getAttribute('data-cabinet-id');
                            loadCabinetDocuments(cabinetId);
                        }
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: apiResult.message || 'Failed to archive document',
                        confirmButtonColor: '#800000'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to archive document: ' + error.message,
                    confirmButtonColor: '#800000'
                });
            }
        }
    });
}
