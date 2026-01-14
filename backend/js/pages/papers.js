import { initSidebar } from '../modules/sidebar.js';
import { initProfileDropdown, initLogout } from './dashboard.js';
import { initDocumentManagement, showAddDocumentModal, addDocumentToTable, deleteDocument, updateDocumentCount } from './cabinet-view.js';

/**
 * Papers page functionality
 * Handles sidebar, active states, and papers-specific features
 */

// Store current status filter state
let currentStatusFilter = null;

// Store all cabinets for filtering
let allCabinets = [];

/**
 * Initialize papers page
 * Version: 2.0 - With Archive Support
 */
export function initPapers() {
    console.log('📦 Papers page initialized - Version 2.0 with Archive Support');
    
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
    const searchBarContainer = document.getElementById('searchBarContainer');
    
    // ⚡ FORCE ADD ARCHIVE OPTION TO STATUS DROPDOWN (Dynamic injection to bypass cache)
    if (statusDropdown) {
        console.log('🔧 Checking status dropdown for Archive option...');
        
        // Check if Archive option already exists
        const existingArchiveOption = statusDropdown.querySelector('button[data-status="archived"]');
        
        if (!existingArchiveOption) {
            console.log('⚠️ Archive option NOT found in HTML! Adding dynamically...');
            
            // Create separator
            const separator = document.createElement('div');
            separator.className = 'border-t border-gray-200 my-1';
            
            // Create Archive button
            const archiveButton = document.createElement('button');
            archiveButton.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium';
            archiveButton.setAttribute('data-status', 'archived');
            archiveButton.innerHTML = '📦 Archived';
            
            // Append to dropdown
            statusDropdown.appendChild(separator);
            statusDropdown.appendChild(archiveButton);
            
            console.log('✅ Archive option added dynamically!');
        } else {
            console.log('✅ Archive option already exists in HTML');
        }
    }
    
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
        
        // Use event delegation for dynamically added cabinet options
        cabinetDropdown.addEventListener('click', (e) => {
            const option = e.target.closest('button[data-cabinet]');
            if (!option) return;
            
                e.stopPropagation();
                const cabinetValue = option.getAttribute('data-cabinet');
                const cabinetText = option.textContent.trim();
            const cabinetId = option.getAttribute('data-cabinet-id');
                
                // Update button text
            if (cabinetDropdownText) {
                cabinetDropdownText.textContent = cabinetText;
            }
                
                // Close dropdown
                cabinetDropdown.classList.add('hidden');
                
                // Get main header and filters section
                const mainHeader = document.getElementById('mainHeader');
                const filtersSection = document.getElementById('filtersSection');
                const cabinetsGrid = document.getElementById('cabinetsGrid');
                const documentsView = document.getElementById('documentsView');
                const selectedCabinetName = document.getElementById('selectedCabinetName');
                
                // If "All Cabinets" is selected, show cabinets grid
                if (cabinetValue === 'all') {
                    // Show main header
                    if (mainHeader) {
                        mainHeader.classList.remove('hidden');
                    }
                    
                    // Reset status dropdown to "Select Status" and show all cabinets
                    const statusDropdownText = document.getElementById('statusDropdownText');
                    if (statusDropdownText) {
                        statusDropdownText.textContent = 'Select Status';
                    }
                    
                    // Show all cabinets (reset any status filter)
                    if (allCabinets && allCabinets.length > 0) {
                        renderCabinets(allCabinets);
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
                
                // Update URL to remove cabinet_id parameter
                const url = new URL(window.location);
                url.searchParams.delete('cabinet_id');
                window.history.pushState({}, '', url);
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
                    filtersSection.classList.remove('mb-6');
                        filtersSection.classList.add('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
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
                    
                // Load documents for this cabinet using numeric ID
                const numericCabinetId = cabinetId || parseInt(cabinetValue);
                loadCabinetDocuments(numericCabinetId);

                    // Keep Cabinet Number filter default as "All Cabinet Numbers"
                    setCabinetNumberFilter('all');
                
                // Update URL with cabinet_id parameter
                const url = new URL(window.location);
                url.searchParams.set('cabinet_id', numericCabinetId);
                window.history.pushState({}, '', url);
                }
        });
    }
    
    // Status Dropdown
    if (statusDropdownBtn && statusDropdown) {
        statusDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = statusDropdown.classList.contains('hidden');
            statusDropdown.classList.toggle('hidden');
            
            if (!isHidden) {
                console.log('📊 Status dropdown closed');
            } else {
                console.log('📊 Status dropdown opened - Options available:');
                const options = statusDropdown.querySelectorAll('button[data-status]');
                options.forEach(opt => {
                    console.log('   -', opt.textContent.trim(), '(data-status="' + opt.getAttribute('data-status') + '")');
                });
            }
            
            // Close cabinet dropdown if open
            if (cabinetDropdown) {
                cabinetDropdown.classList.add('hidden');
            }
        });
        
        // Handle status selection with event delegation (for dynamically added options)
        statusDropdown.addEventListener('click', async (e) => {
            const option = e.target.closest('button[data-status]');
            if (!option) return;
            
            e.stopPropagation();
            const statusValue = option.getAttribute('data-status');
            const statusText = option.textContent.trim();
            
            // Update button text
            if (statusDropdownText) {
                statusDropdownText.textContent = statusText;
            }
            
            // Close dropdown
            statusDropdown.classList.add('hidden');
            
            // Check if we're on the cabinet grid view or document view
            const cabinetsGrid = document.getElementById('cabinetsGrid');
            const documentsView = document.getElementById('documentsView');
            const isOnCabinetGrid = cabinetsGrid && !cabinetsGrid.classList.contains('hidden');
            const isOnDocumentView = documentsView && !documentsView.classList.contains('hidden');
            
            if (isOnCabinetGrid) {
                // Filter cabinets by status
                filterCabinetsByStatus(statusValue);
            } else if (isOnDocumentView) {
                // Store current status filter
                currentStatusFilter = statusValue === 'uses' ? 'uses' : statusValue;
                
                // Get current cabinet ID from URL parameter (primary source)
                const urlParams = new URLSearchParams(window.location.search);
                let cabinetId = urlParams.get('cabinet_id');
                
                // If no URL param, check if documents view is visible (meaning a cabinet is selected)
                if (!cabinetId) {
                    const cabinetDropdownText = document.getElementById('cabinetDropdownText');
                    if (cabinetDropdownText && 
                        cabinetDropdownText.textContent !== 'Select Cabinet' && 
                        cabinetDropdownText.textContent !== 'All Cabinets') {
                        // Find matching option in dropdown
                        const options = cabinetDropdown.querySelectorAll('button[data-cabinet-id]');
                        for (const opt of options) {
                            if (opt.textContent.trim() === cabinetDropdownText.textContent.trim()) {
                                cabinetId = opt.getAttribute('data-cabinet-id');
                                break;
                            }
                        }
                    }
                }
                
                if (cabinetId && statusValue !== 'uses') {
                    // Filter documents by status
                    await loadCabinetDocuments(parseInt(cabinetId, 10), statusValue);
                } else if (cabinetId && statusValue === 'uses') {
                    // Load uses list
                    await loadFileUses(parseInt(cabinetId, 10));
                } else {
                    // Reset status filter if no cabinet selected
                    currentStatusFilter = null;
                    if (!cabinetId && statusDropdownText) {
                        statusDropdownText.textContent = 'Select Status';
                    }
                }
            } else {
                // On cabinet grid view without cabinet selected - filter cabinets
                filterCabinetsByStatus(statusValue);
            }
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
    });
}

/**
 * Initialize cabinet view functionality
 */
function initCabinetView() {
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
    
    // Note: Cabinet cards now navigate directly to view.php with animation
    // No need for view-papers-btn event listeners as cards are clickable
    
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
            
            // Reset status dropdown to "Select Status"
            const statusDropdownText = document.getElementById('statusDropdownText');
            if (statusDropdownText) {
                statusDropdownText.textContent = 'Select Status';
            }
            
            // Show all cabinets (reset any status filter)
            if (allCabinets && allCabinets.length > 0) {
                renderCabinets(allCabinets);
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
            
            // Remove cabinet_id parameter from URL
            const url = new URL(window.location);
            url.searchParams.delete('cabinet_id');
            window.history.pushState({}, '', url);
            
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
 * @param {string} status - Optional status filter (available, borrowed, archived)
 */
async function loadCabinetDocuments(cabinetId, status = null) {
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
        // Build API URL with optional status parameter
        let apiUrl = `/backend/api/files.php?cabinet_id=${actualCabinetId}`;
        const statusToUse = status || currentStatusFilter;
        if (statusToUse && statusToUse !== 'uses' && ['available', 'borrowed', 'archived'].includes(statusToUse)) {
            apiUrl += `&status=${statusToUse}`;
        }
        
        // Fetch documents from API
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.success && result.data) {
            // Extract unique cabinet numbers from API response
            const uniqueCabinetNumbers = [...new Set(result.data.map(doc => doc.cabinet_number).filter(Boolean))].sort((a, b) => {
                const numA = parseInt(a.split('.')[1], 10);
                const numB = parseInt(b.split('.')[1], 10);
                return numA - numB;
            });
            
            // Populate Cabinet Number filter dropdown with numbers from API
            populateCabinetNumberFilter(cabinetPrefix, uniqueCabinetNumbers);
            
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
 * Load file uses for a specific cabinet
 * @param {number} cabinetId - Cabinet ID
 */
async function loadFileUses(cabinetId) {
    try {
        const response = await fetch(`/backend/api/file_uses.php?cabinet_id=${cabinetId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            // Map file uses to document format
            const mappedDocuments = result.data.map(use => ({
                id: use.file_id,
                cabinet_number: use.cabinet_number || '',
                filename: use.filename || 'Unknown File',
                description: use.description || '',
                category: use.category || 'Documents',
                status: use.status || 'available',
                added_by: use.uses_by || use.borrow_by || use.archived_by || 'Unknown'
            }));
            
            // Extract unique cabinet numbers from API response
            const uniqueCabinetNumbers = [...new Set(mappedDocuments.map(doc => doc.cabinet_number).filter(Boolean))].sort((a, b) => {
                const numA = parseInt(a.split('.')[1], 10);
                const numB = parseInt(b.split('.')[1], 10);
                return numA - numB;
            });
            
            // Get cabinet prefix from cabinet ID
            const cabinetPrefix = 'C' + cabinetId;
            
            // Populate Cabinet Number filter dropdown with numbers from API
            populateCabinetNumberFilter(cabinetPrefix, uniqueCabinetNumbers);
            
            // Render file uses entries using the same table structure
            renderDocuments(mappedDocuments);
            
            // Update document count
            updateDocumentCount();
        } else {
            console.error('Failed to load file uses:', result.message);
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
        console.error('Error loading file uses:', error);
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
 * Populate Cabinet Number filter dropdown based on cabinet numbers from API
 * @param {string} cabinetPrefix - Cabinet prefix (e.g., 'C1', 'C2', 'C3')
 * @param {Array<string>} cabinetNumbers - Array of cabinet numbers from API response (e.g., ['C1.1', 'C1.2', 'C1.3'])
 */
export function populateCabinetNumberFilter(cabinetPrefix, cabinetNumbers = []) {
    const dropdown = document.getElementById('cabinetNumberFilterDropdown');
    if (!dropdown) return;
    
    // Clear existing options
    dropdown.innerHTML = '';
    
    // Create "All Cabinet Numbers" button
    const allBtn = document.createElement('button');
    allBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
    allBtn.setAttribute('data-cabinet-number', 'all');
    allBtn.textContent = 'All Cabinet Numbers';
    dropdown.appendChild(allBtn);
    
    // Create dropdown buttons for cabinet numbers from API
    if (cabinetNumbers && cabinetNumbers.length > 0) {
        cabinetNumbers.forEach(cabinetNumber => {
            // Verify cabinet number belongs to the current cabinet prefix
            if (cabinetNumber && cabinetNumber.startsWith(cabinetPrefix + '.')) {
                const button = document.createElement('button');
                button.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
                button.setAttribute('data-cabinet-number', cabinetNumber);
                button.textContent = cabinetNumber;
                dropdown.appendChild(button);
            }
        });
    }
    
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
                <span class="text-sm text-gray-900">${doc.added_by || 'Admin'}</span>
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
 * Also populates the cabinet dropdown
 */
async function loadCabinets(includeArchived = false) {
    try {
        const url = includeArchived ? '/backend/api/cabinets.php?include_archived=true' : '/backend/api/cabinets.php';
        console.log('Loading cabinets from:', url);
        
        const response = await fetch(url);
        const result = await response.json();
        
        console.log('API Response:', result);
        
        if (result.success && result.data) {
            // Store all cabinets for filtering
            allCabinets = result.data;
            
            console.log('Stored cabinets in allCabinets:', allCabinets);
            
            renderCabinets(result.data);
            populateCabinetDropdown(result.data);
            
            // Populate status dropdown with unique statuses
            populateStatusDropdown(result.data);
            
            // Check URL parameter for cabinet_id
            const urlParams = new URLSearchParams(window.location.search);
            const cabinetIdParam = urlParams.get('cabinet_id');
            if (cabinetIdParam) {
                const cabinetId = parseInt(cabinetIdParam, 10);
                const cabinet = result.data.find(c => c.id === cabinetId);
                if (cabinet) {
                    // Auto-select this cabinet
                    const cabinetDropdown = document.getElementById('cabinetDropdown');
                    const cabinetDropdownText = document.getElementById('cabinetDropdownText');
                    if (cabinetDropdown && cabinetDropdownText) {
                        cabinetDropdownText.textContent = cabinet.name || `Cabinet ${cabinet.id}`;
                        
                        // Trigger the cabinet selection logic
                        const mainHeader = document.getElementById('mainHeader');
                        const filtersSection = document.getElementById('filtersSection');
                        const cabinetsGrid = document.getElementById('cabinetsGrid');
                        const documentsView = document.getElementById('documentsView');
                        const selectedCabinetName = document.getElementById('selectedCabinetName');
                        const searchBarContainer = document.getElementById('searchBarContainer');
                        
                        if (mainHeader) mainHeader.classList.add('hidden');
                        if (searchBarContainer) {
                            searchBarContainer.classList.remove('invisible');
                            searchBarContainer.classList.add('visible');
                        }
                        if (filtersSection) {
                            filtersSection.classList.remove('mb-6');
                            filtersSection.classList.add('p-8', 'mb-8', 'bg-white', 'rounded-lg', 'shadow-md');
                        }
                        if (cabinetsGrid) cabinetsGrid.classList.add('hidden');
                        if (documentsView) documentsView.classList.remove('hidden');
                        if (selectedCabinetName) {
                            selectedCabinetName.textContent = cabinet.name || `Cabinet ${cabinet.id}`;
                        }
                        
                        loadCabinetDocuments(cabinetId);
                        setCabinetNumberFilter('all');
                    }
                }
            }
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
 * Populate cabinet dropdown with cabinets from API
 * @param {Array} cabinets - Array of cabinet objects
 */
function populateCabinetDropdown(cabinets) {
    const cabinetDropdown = document.getElementById('cabinetDropdown');
    if (!cabinetDropdown) return;
    
    // Keep the "All Cabinets" button, remove others
    const allButton = cabinetDropdown.querySelector('button[data-cabinet="all"]');
    cabinetDropdown.innerHTML = '';
    if (allButton) {
        cabinetDropdown.appendChild(allButton);
    } else {
        // Create "All Cabinets" button if it doesn't exist
        const allBtn = document.createElement('button');
        allBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
        allBtn.setAttribute('data-cabinet', 'all');
        allBtn.textContent = 'All Cabinets';
        cabinetDropdown.appendChild(allBtn);
    }
    
    // Add each cabinet as a dropdown option
    cabinets.forEach(cabinet => {
        const button = document.createElement('button');
        button.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
        button.setAttribute('data-cabinet', `cabinet_${cabinet.id}`);
        button.setAttribute('data-cabinet-id', cabinet.id.toString());
        button.textContent = cabinet.name || `Cabinet ${cabinet.id}`;
        cabinetDropdown.appendChild(button);
    });
}

/**
 * Populate status dropdown with unique cabinet statuses from API
 * Always includes Active, Pending, and Archived options
 * @param {Array} cabinets - Array of cabinet objects
 */
function populateStatusDropdown(cabinets) {
    const statusDropdown = document.getElementById('statusDropdown');
    if (!statusDropdown) return;
    
    // Clear existing options
    statusDropdown.innerHTML = '';
    
    // Add "All Cabinets" option first (matching HTML structure)
    const allStatusBtn = document.createElement('button');
    allStatusBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium';
    allStatusBtn.setAttribute('data-status', 'all');
    allStatusBtn.textContent = '📋 All Cabinets';
    statusDropdown.appendChild(allStatusBtn);
    
    // Always add Active option
    const activeBtn = document.createElement('button');
    activeBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
    activeBtn.setAttribute('data-status', 'active');
    activeBtn.textContent = '✓ Active';
    statusDropdown.appendChild(activeBtn);
    
    // Always add Pending option
    const pendingBtn = document.createElement('button');
    pendingBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700';
    pendingBtn.setAttribute('data-status', 'pending');
    pendingBtn.textContent = '⏳ Pending';
    statusDropdown.appendChild(pendingBtn);
    
    // Add separator (matching HTML structure)
    const separator = document.createElement('div');
    separator.className = 'border-t border-gray-200 my-1';
    statusDropdown.appendChild(separator);
    
    // Always add Archived option (matching HTML structure)
    const archivedBtn = document.createElement('button');
    archivedBtn.className = 'w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium';
    archivedBtn.setAttribute('data-status', 'archived');
    archivedBtn.textContent = '📦 Archived';
    statusDropdown.appendChild(archivedBtn);
}

/**
 * Render cabinet cards
 * @param {Array} cabinets - Array of cabinet objects
 */
function renderCabinets(cabinets) {
    const cabinetsGrid = document.getElementById('cabinetsGrid');
    const emptyState = document.getElementById('emptyCabinetsState');
    
    if (!cabinetsGrid) return;
    
    console.log('Rendering cabinets:', cabinets);
    
    // Clear existing cabinets (except empty state)
    const existingCards = cabinetsGrid.querySelectorAll('.cabinet-card');
    existingCards.forEach(card => card.remove());
    
    if (cabinets.length === 0) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
            // Reset empty state message to default if needed
            const emptyTitle = emptyState.querySelector('h3');
            const emptyText = emptyState.querySelector('p');
            if (emptyTitle && !emptyTitle.textContent.includes('archived')) {
                emptyTitle.textContent = 'No cabinets';
                if (emptyText) emptyText.textContent = 'Get started by adding a new cabinet.';
            }
        }
        return;
    }
    
    if (emptyState) {
        emptyState.classList.add('hidden');
        // Reset empty state message to default
        const emptyTitle = emptyState.querySelector('h3');
        const emptyText = emptyState.querySelector('p');
        if (emptyTitle) emptyTitle.textContent = 'No cabinets';
        if (emptyText) emptyText.textContent = 'Get started by adding a new cabinet.';
    }
    
    cabinets.forEach(cabinet => {
        const card = createCabinetCard(cabinet);
        cabinetsGrid.appendChild(card);
    });
    
    console.log(`Rendered ${cabinets.length} cabinet(s)`);
    
    // Note: Cabinet cards now have click event listeners attached in createCabinetCard()
    // They navigate directly to view.php with animation
}

/**
 * Create a cabinet card element
 * @param {Object} cabinet - Cabinet object from API
 * @returns {HTMLElement} Cabinet card element
 */
function createCabinetCard(cabinet) {
    const card = document.createElement('div');
    card.className = 'cabinet-card group cursor-pointer';
    
    // Status badge styling and colors
    let statusBadgeClass = 'bg-emerald-500';
    let statusText = 'Active';
    let cabinetBg = 'bg-emerald-50';
    let cabinetBorder = 'border-emerald-200';
    let drawerColor = 'bg-emerald-100';
    let handleColor = 'bg-emerald-600';
    let hoverHintBg = 'bg-emerald-600';
    let hoverHintText = 'text-white';
    
    if (cabinet.status === 'pending') {
        statusBadgeClass = 'bg-amber-500';
        statusText = 'Pending';
        cabinetBg = 'bg-amber-50';
        cabinetBorder = 'border-amber-200';
        drawerColor = 'bg-amber-100';
        handleColor = 'bg-amber-600';
        hoverHintBg = 'bg-amber-600';
        hoverHintText = 'text-white';
    } else if (cabinet.status === 'archived') {
        statusBadgeClass = 'bg-gray-400';
        statusText = 'Archived';
        cabinetBg = 'bg-gray-50';
        cabinetBorder = 'border-gray-200';
        drawerColor = 'bg-gray-100';
        handleColor = 'bg-gray-500';
        hoverHintBg = 'bg-gray-600';
        hoverHintText = 'text-white';
    }
    
    const fileCount = cabinet.file_count || 0;
    const cabinetName = cabinet.name || 'Cabinet ' + cabinet.id;
    const description = cabinet.description || 'Document storage';
    
    card.innerHTML = `
        <div class="cabinet-container relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-visible border-2 ${cabinetBorder}" data-cabinet-id="${cabinet.id}" data-cabinet-name="${cabinetName}">
            <!-- Status Badge (Top Right Corner, Middle of Border) - Editable -->
            <div class="status-section absolute -top-3 right-4 z-20">
                <!-- View Mode -->
                <button class="status-badge-view px-2.5 py-1 text-xs font-semibold rounded-full ${statusBadgeClass} text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1" title="Click to change status">
                    ${statusText}
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                
                <!-- Edit Mode (Dropdown) -->
                <div class="status-edit-dropdown hidden absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 transition-colors ${cabinet.status === 'active' ? 'bg-emerald-100 font-semibold' : ''}" data-status="active">
                        <span class="text-emerald-600">● Active</span>
                    </button>
                    <button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors ${cabinet.status === 'pending' ? 'bg-amber-100 font-semibold' : ''}" data-status="pending">
                        <span class="text-amber-600">● Pending</span>
                    </button>
                    <button class="status-option w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${cabinet.status === 'archived' ? 'bg-gray-100 font-semibold' : ''}" data-status="archived">
                        <span class="text-gray-600">● Archived</span>
                    </button>
                </div>
            </div>
            
            <!-- Cabinet Body -->
            <div class="cabinet-body p-6 ${cabinetBg} transition-all duration-300 relative">
                <!-- Metal Top Trim -->
                <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-xl shadow-inner"></div>
                
                <!-- Cabinet Header (Editable Area) - Label Holder -->
                <div class="bg-white rounded-lg p-4 mb-4 shadow-md border-2 ${cabinetBorder} relative overflow-hidden" style="margin-top: 0.5rem;">
                    <!-- Metallic Frame Effect -->
                    <div class="absolute inset-0 border-4 border-gray-300 rounded-lg pointer-events-none opacity-50"></div>
                    
                    <!-- Cabinet Name - Editable -->
                    <div class="name-section mb-2 relative z-10">
                        <!-- View Mode -->
                        <div class="name-view-mode group cursor-pointer" title="Click to edit name">
                            <h3 class="cabinet-name text-lg font-bold text-gray-800 truncate hover:text-[#800000] transition-colors">
                                ${cabinetName}
                            </h3>
                        </div>
                        
                        <!-- Edit Mode -->
                        <div class="name-edit-mode hidden">
                            <div class="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    class="cabinet-name-input flex-1 px-2 py-1 text-lg font-bold text-gray-800 border-2 border-[#800000] rounded focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                                    value="${cabinetName}"
                                />
                                <button class="save-name-btn p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Save">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </button>
                                <button class="cancel-name-btn p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Cancel">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Cabinet Description - Editable -->
                    <div class="description-section relative z-10">
                        <!-- View Mode -->
                        <div class="description-view-mode group cursor-pointer" title="Click to edit description">
                            <p class="cabinet-description text-sm text-gray-600 truncate hover:text-[#800000] transition-colors">
                                ${description}
                            </p>
                        </div>
                        
                        <!-- Edit Mode -->
                        <div class="description-edit-mode hidden">
                            <div class="flex items-start gap-2">
                                <textarea 
                                    class="cabinet-description-input flex-1 px-2 py-1 text-sm text-gray-600 border-2 border-[#800000] rounded focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none resize-none"
                                    rows="2"
                                >${description}</textarea>
                                <div class="flex flex-col gap-1">
                                    <button class="save-description-btn p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Save">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </button>
                                    <button class="cancel-description-btn p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Cancel">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Drawer 1 (Large Top Drawer) -->
                <div class="drawer-1 relative ${drawerColor} rounded-md p-5 mb-3 border-3 border-gray-400 transition-all duration-700 shadow-lg" style="box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Drawer Handle -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                        <!-- Handle Mounting Screws -->
                        <div class="w-1 h-1 rounded-full bg-gray-600 absolute -left-10 top-1/2 -translate-y-1/2"></div>
                        <div class="w-1 h-1 rounded-full bg-gray-600 absolute -right-10 top-1/2 -translate-y-1/2"></div>
                        <!-- Main Handle -->
                        <div class="${handleColor} w-20 h-3 rounded-full shadow-lg relative" style="box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3);">
                            <!-- Handle Shine -->
                            <div class="absolute top-0 left-2 right-2 h-1 bg-white/40 rounded-full"></div>
                        </div>
                    </div>
                    <!-- Drawer Lines for Depth -->
                    <div class="absolute inset-2 border border-gray-300/50 rounded-sm pointer-events-none"></div>
                </div>
                
                <!-- Drawer 2 (Middle Drawer) -->
                <div class="drawer-2 relative ${drawerColor} rounded-md p-4 mb-3 border-3 border-gray-400 transition-all duration-700 shadow-lg" style="box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Drawer Handle -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                        <!-- Handle Mounting Screws -->
                        <div class="w-1 h-1 rounded-full bg-gray-600 absolute -left-8 top-1/2 -translate-y-1/2"></div>
                        <div class="w-1 h-1 rounded-full bg-gray-600 absolute -right-8 top-1/2 -translate-y-1/2"></div>
                        <!-- Main Handle -->
                        <div class="${handleColor} w-16 h-2.5 rounded-full shadow-lg relative" style="box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3);">
                            <!-- Handle Shine -->
                            <div class="absolute top-0 left-2 right-2 h-0.5 bg-white/40 rounded-full"></div>
                        </div>
                    </div>
                    <!-- Drawer Lines for Depth -->
                    <div class="absolute inset-2 border border-gray-300/50 rounded-sm pointer-events-none"></div>
                </div>
                
                <!-- Drawer 3 (Bottom Drawer) -->
                <div class="drawer-3 relative ${drawerColor} rounded-md p-4 mb-3 border-3 border-gray-400 transition-all duration-700 shadow-lg" style="box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Drawer Handle -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                        <!-- Handle Mounting Screws -->
                        <div class="w-1 h-1 rounded-full bg-gray-600 absolute -left-8 top-1/2 -translate-y-1/2"></div>
                        <div class="w-1 h-1 rounded-full bg-gray-600 absolute -right-8 top-1/2 -translate-y-1/2"></div>
                        <!-- Main Handle -->
                        <div class="${handleColor} w-16 h-2.5 rounded-full shadow-lg relative" style="box-shadow: 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3);">
                            <!-- Handle Shine -->
                            <div class="absolute top-0 left-2 right-2 h-0.5 bg-white/40 rounded-full"></div>
                        </div>
                    </div>
                    <!-- Drawer Lines for Depth -->
                    <div class="absolute inset-2 border border-gray-300/50 rounded-sm pointer-events-none"></div>
                </div>
                
                <!-- Metal Bottom Trim -->
                <div class="h-1 bg-gradient-to-t from-gray-400 to-gray-500 rounded-b-sm shadow-inner mb-2"></div>
                
                <!-- Cabinet Legs -->
                <div class="flex justify-between px-4 -mb-2">
                    <div class="w-3 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-sm shadow-md"></div>
                    <div class="w-3 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-sm shadow-md"></div>
                    <div class="w-3 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-sm shadow-md"></div>
                    <div class="w-3 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-sm shadow-md"></div>
                </div>
                
                <!-- File Count Badge -->
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border-2 ${cabinetBorder} rounded-full px-3 py-1 shadow-md flex items-center gap-2">
                    <svg class="w-4 h-4 ${cabinet.status === 'archived' ? 'text-gray-600' : 'text-gray-700'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-xs font-bold ${cabinet.status === 'archived' ? 'text-gray-700' : 'text-gray-800'}">${fileCount} Document${fileCount !== 1 ? 's' : ''}</span>
                </div>
            </div>
            
            <!-- Click hint (appears on hover at bottom, only when not editing) -->
            <div class="click-hint absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-end justify-center pb-4 pointer-events-none rounded-xl">
                <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 ${hoverHintBg} ${hoverHintText} px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                    </svg>
                    <span class="text-sm font-semibold">Click to Open Cabinet</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click event listener to the cabinet card
    const cabinetContainer = card.querySelector('.cabinet-container');
    const clickHint = card.querySelector('.click-hint');
    
    cabinetContainer.addEventListener('click', (e) => {
        // Don't open if clicking on editable elements or dropdowns
        if (e.target.closest('.status-section') || 
            e.target.closest('.name-section') || 
            e.target.closest('.description-section') ||
            e.target.closest('.status-edit-dropdown')) {
            return;
        }
        e.preventDefault();
        openCabinetWithAnimation(cabinet.id, cabinetContainer);
    });
    
    // Status Badge Editing
    const statusBadgeView = card.querySelector('.status-badge-view');
    const statusDropdown = card.querySelector('.status-edit-dropdown');
    const statusOptions = card.querySelectorAll('.status-option');
    
    if (statusBadgeView && statusDropdown) {
        statusBadgeView.addEventListener('click', (e) => {
            e.stopPropagation();
            statusDropdown.classList.toggle('hidden');
        });
        
        statusOptions.forEach(option => {
            option.addEventListener('click', async (e) => {
                e.stopPropagation();
                const newStatus = option.getAttribute('data-status');
                
                if (newStatus === cabinet.status) {
                    statusDropdown.classList.add('hidden');
                    return;
                }
                
                try {
                    const response = await fetch(`/backend/api/cabinets.php?id=${cabinet.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            status: newStatus
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        const Swal = (await import('sweetalert2')).default;
                        
                        // Determine message based on status change
                        let messageText = `Cabinet status changed to ${newStatus}`;
                        if (newStatus === 'archived') {
                            messageText = 'Cabinet archived successfully';
                        } else if (cabinet.status === 'archived' && newStatus !== 'archived') {
                            messageText = 'Cabinet restored successfully';
                        }
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Status Updated!',
                            text: messageText,
                            confirmButtonColor: '#800000',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        
                        // Check if we're currently filtering by archived status
                        const statusDropdownText = document.getElementById('statusDropdownText');
                        const isViewingArchived = statusDropdownText && statusDropdownText.textContent.includes('Archived');
                        
                        // Reload cabinets with appropriate filter
                        if (isViewingArchived) {
                            // If viewing archived cabinets, reload with archived included
                            await loadCabinets(true);
                            const archivedCabinets = allCabinets.filter(c => c.status === 'archived');
                            renderCabinets(archivedCabinets);
                        } else {
                            // Otherwise reload without archived
                            await loadCabinets(false);
                            renderCabinets(allCabinets);
                        }
                    } else {
                        throw new Error(result.message || 'Failed to update status');
                    }
                } catch (error) {
                    const Swal = (await import('sweetalert2')).default;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update status: ' + error.message,
                        confirmButtonColor: '#800000'
                    });
                }
                
                statusDropdown.classList.add('hidden');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.status-section')) {
                statusDropdown.classList.add('hidden');
            }
        });
    }
    
    // Cabinet Name Editing
    const nameViewMode = card.querySelector('.name-view-mode');
    const nameEditMode = card.querySelector('.name-edit-mode');
    const cabinetNameEl = card.querySelector('.cabinet-name');
    const nameInput = card.querySelector('.cabinet-name-input');
    const saveNameBtn = card.querySelector('.save-name-btn');
    const cancelNameBtn = card.querySelector('.cancel-name-btn');
    
    if (nameViewMode && nameEditMode) {
        nameViewMode.addEventListener('click', (e) => {
            e.stopPropagation();
            nameViewMode.classList.add('hidden');
            nameEditMode.classList.remove('hidden');
            clickHint.style.display = 'none';
            nameInput.focus();
            nameInput.select();
        });
        
        saveNameBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const newName = nameInput.value.trim();
            
            if (!newName) {
                const Swal = (await import('sweetalert2')).default;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cabinet name cannot be empty',
                    confirmButtonColor: '#800000'
                });
                return;
            }
            
            try {
                const response = await fetch(`/backend/api/cabinets.php?id=${cabinet.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newName
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    cabinetNameEl.textContent = newName;
                    cabinet.name = newName;
                    
                    nameViewMode.classList.remove('hidden');
                    nameEditMode.classList.add('hidden');
                    clickHint.style.display = '';
                    
                    const Swal = (await import('sweetalert2')).default;
                    Swal.fire({
                        icon: 'success',
                        title: 'Saved!',
                        text: 'Cabinet name updated successfully',
                        confirmButtonColor: '#800000',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error(result.message || 'Failed to update name');
                }
            } catch (error) {
                const Swal = (await import('sweetalert2')).default;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update name: ' + error.message,
                    confirmButtonColor: '#800000'
                });
            }
        });
        
        cancelNameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nameInput.value = cabinet.name;
            nameViewMode.classList.remove('hidden');
            nameEditMode.classList.add('hidden');
            clickHint.style.display = '';
        });
        
        // Save on Enter key
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveNameBtn.click();
            } else if (e.key === 'Escape') {
                cancelNameBtn.click();
            }
        });
    }
    
    // Cabinet Description Editing
    const descViewMode = card.querySelector('.description-view-mode');
    const descEditMode = card.querySelector('.description-edit-mode');
    const cabinetDescEl = card.querySelector('.cabinet-description');
    const descInput = card.querySelector('.cabinet-description-input');
    const saveDescBtn = card.querySelector('.save-description-btn');
    const cancelDescBtn = card.querySelector('.cancel-description-btn');
    
    if (descViewMode && descEditMode) {
        descViewMode.addEventListener('click', (e) => {
            e.stopPropagation();
            descViewMode.classList.add('hidden');
            descEditMode.classList.remove('hidden');
            clickHint.style.display = 'none';
            descInput.focus();
        });
        
        saveDescBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const newDescription = descInput.value.trim();
            
            try {
                const response = await fetch(`/backend/api/cabinets.php?id=${cabinet.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        description: newDescription
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    cabinetDescEl.textContent = newDescription;
                    cabinet.description = newDescription;
                    
                    descViewMode.classList.remove('hidden');
                    descEditMode.classList.add('hidden');
                    clickHint.style.display = '';
                    
                    const Swal = (await import('sweetalert2')).default;
                    Swal.fire({
                        icon: 'success',
                        title: 'Saved!',
                        text: 'Description updated successfully',
                        confirmButtonColor: '#800000',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error(result.message || 'Failed to update description');
                }
            } catch (error) {
                const Swal = (await import('sweetalert2')).default;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update description: ' + error.message,
                    confirmButtonColor: '#800000'
                });
            }
        });
        
        cancelDescBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            descInput.value = cabinet.description;
            descViewMode.classList.remove('hidden');
            descEditMode.classList.add('hidden');
            clickHint.style.display = '';
        });
        
        // Save on Ctrl+Enter
        descInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                saveDescBtn.click();
            } else if (e.key === 'Escape') {
                cancelDescBtn.click();
            }
        });
    }
    
    return card;
}

/**
 * Open cabinet with drawer animation
 * @param {number} cabinetId - Cabinet ID
 * @param {HTMLElement} cabinetElement - The cabinet card element
 */
function openCabinetWithAnimation(cabinetId, cabinetElement) {
    // Disable pointer events to prevent multiple clicks
    cabinetElement.style.pointerEvents = 'none';
    
    // Get drawers and cabinet body
    const drawer1 = cabinetElement.querySelector('.drawer-1');
    const drawer2 = cabinetElement.querySelector('.drawer-2');
    const drawer3 = cabinetElement.querySelector('.drawer-3');
    const cabinetBody = cabinetElement.querySelector('.cabinet-body');
    
    // Open top drawer first (pulls forward towards viewer smoothly)
    setTimeout(() => {
        if (drawer1) {
            drawer1.style.transform = 'translateZ(50px) translateY(-5px) scale(1.05)';
            drawer1.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.35)';
            drawer1.style.zIndex = '10';
        }
    }, 100);
    
    // Open middle drawer slightly
    setTimeout(() => {
        if (drawer2) {
            drawer2.style.transform = 'translateZ(30px) scale(1.03)';
            drawer2.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.25)';
            drawer2.style.zIndex = '9';
        }
    }, 250);
    
    // Open bottom drawer slightly
    setTimeout(() => {
        if (drawer3) {
            drawer3.style.transform = 'translateZ(20px) scale(1.02)';
            drawer3.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            drawer3.style.zIndex = '8';
        }
    }, 400);
    
    // Subtle cabinet body background fade
    setTimeout(() => {
        if (cabinetBody) {
            cabinetBody.style.opacity = '0.85';
        }
    }, 350);
    
    // After drawers open, fade out entire card
    setTimeout(() => {
        cabinetElement.style.transform = 'scale(0.95)';
        cabinetElement.style.opacity = '0';
    }, 700);
    
    // Navigate to the page after animation completes
    setTimeout(() => {
        window.location.href = `/frontend/pages/cabinets/view.php?cabinet_id=${cabinetId}`;
    }, 1000);
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
 * Filter cabinets by status
 * @param {string} status - Status to filter by ('all', 'active', 'pending', 'archived')
 */
async function filterCabinetsByStatus(status) {
    console.log('Filtering by status:', status);
    
    // If filtering by archived, reload cabinets with archived included
    if (status === 'archived') {
        console.log('Loading archived cabinets...');
        await loadCabinets(true);
        console.log('All cabinets loaded:', allCabinets);
        
        const cabinetsGrid = document.getElementById('cabinetsGrid');
        const emptyState = document.getElementById('emptyCabinetsState');
        
        // Clear existing cards
        if (cabinetsGrid) {
            const existingCards = cabinetsGrid.querySelectorAll('.cabinet-card');
            existingCards.forEach(card => card.remove());
        }
        
        // Filter to show only archived cabinets
        if (allCabinets && allCabinets.length > 0) {
            const archivedCabinets = allCabinets.filter(cabinet => cabinet.status === 'archived');
            console.log('Archived cabinets found:', archivedCabinets);
            
            if (archivedCabinets.length === 0) {
                // Show empty state if no archived cabinets
                if (emptyState) {
                    emptyState.classList.remove('hidden');
                    const emptyTitle = emptyState.querySelector('h3');
                    const emptyText = emptyState.querySelector('p');
                    if (emptyTitle) emptyTitle.textContent = 'No archived cabinets';
                    if (emptyText) emptyText.textContent = 'You have no archived cabinets at the moment.';
                }
            } else {
                // Hide empty state and render archived cabinets
                if (emptyState) {
                    emptyState.classList.add('hidden');
                }
                renderCabinets(archivedCabinets);
            }
        } else {
            // No cabinets at all - show empty state
            if (emptyState) {
                emptyState.classList.remove('hidden');
                const emptyTitle = emptyState.querySelector('h3');
                const emptyText = emptyState.querySelector('p');
                if (emptyTitle) emptyTitle.textContent = 'No archived cabinets';
                if (emptyText) emptyText.textContent = 'You have no archived cabinets at the moment.';
            }
        }
        return;
    }
    
    // For other statuses, reload without archived
    if (status === 'all' || status === 'active' || status === 'pending') {
        await loadCabinets(false);
    }
    
    if (!allCabinets || allCabinets.length === 0) {
        console.log('No cabinets available');
        return;
    }
    
    let filteredCabinets = allCabinets;
    
    // Filter cabinets if status is not 'all'
    if (status !== 'all') {
        filteredCabinets = allCabinets.filter(cabinet => {
            const cabinetStatus = cabinet.status || 'active';
            return cabinetStatus === status;
        });
    }
    
    console.log('Filtered cabinets:', filteredCabinets);
    
    // Re-render the filtered cabinets
    renderCabinets(filteredCabinets);
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
                                const cabinetCard = document.querySelector(`.cabinet-container[data-cabinet-name="${cabinetDropdownText.textContent.trim()}"]`);
                                if (cabinetCard) {
                                    cabinetId = cabinetCard.getAttribute('data-cabinet-id');
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
                        const cabinetCard = document.querySelector(`.cabinet-container[data-cabinet-name="${cabinetDropdownText.textContent.trim()}"]`);
                        if (cabinetCard) {
                            const cabinetId = cabinetCard.getAttribute('data-cabinet-id');
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
