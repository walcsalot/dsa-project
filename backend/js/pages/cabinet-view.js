import { initSidebar } from '../modules/sidebar.js';
import { initProfileDropdown, initLogout } from './dashboard.js';
import { populateCabinetNumberFilter } from './papers.js';
import Swal from 'sweetalert2';

/**
 * Cabinet View page functionality
 * Handles document table, add document modal, and cabinet-specific features
 */

/**
 * Initialize cabinet view page
 */
export function initCabinetView() {
    // Initialize sidebar with collapse functionality
    initSidebar();
    
    // Initialize profile dropdown and logout
    initProfileDropdown();
    initLogout();
    
    // Initialize document management
    initDocumentManagement();
    
    // Initialize cabinet number sort dropdown
    initCabinetNumberSort();
}

/**
 * Initialize document management functionality
 */
export function initDocumentManagement() {
    const addDocumentBtn = document.getElementById('addDocumentBtn');
    
    if (addDocumentBtn) {
        addDocumentBtn.addEventListener('click', () => {
            showAddDocumentModal();
        });
    }
    
    // Initialize document count
    updateDocumentCount();
}

/**
 * Initialize cabinet number sort dropdown functionality
 * This allows sorting/filtering documents by cabinet number in the cabinet view page
 */
function initCabinetNumberSort() {
    const sortBtn = document.getElementById('cabinetNumberSortBtn');
    const sortDropdown = document.getElementById('cabinetNumberSortDropdown');
    const sortText = document.getElementById('cabinetNumberSortText');
    
    if (!sortBtn || !sortDropdown) return;
    
    // Toggle dropdown
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortDropdown.classList.toggle('hidden');
    });
    
    // Handle cabinet number selection
    const sortOptions = sortDropdown.querySelectorAll('button[data-cabinet-number]');
    sortOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const cabinetNumber = option.getAttribute('data-cabinet-number');
            const optionText = option.textContent.trim();
            
            // Update button text
            if (sortText) {
                sortText.textContent = optionText;
            }
            
            // Close dropdown
            sortDropdown.classList.add('hidden');
            
            // Sort/filter documents by cabinet number
            sortDocumentsByCabinetNumber(cabinetNumber);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (sortBtn && !sortBtn.contains(e.target) && sortDropdown && !sortDropdown.contains(e.target)) {
            sortDropdown.classList.add('hidden');
        }
    });
}

/**
 * Sort/filter documents by cabinet number
 * This function filters the documents table to show only documents with the specified cabinet number
 * @param {string} cabinetNumber - Cabinet number to filter by (e.g., 'C1.1', 'C1.2', 'C1.3', or 'all')
 */
function sortDocumentsByCabinetNumber(cabinetNumber) {
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
    updateRowNumbersAfterSort();
    
    // Update document count
    updateDocumentCount();
    
    // TODO: Backend implementation - Sort documents by cabinet number
    // When a cabinet number is selected, the backend should filter/sort documents
    // Example SQL: SELECT * FROM documents WHERE cabinet_number = 'C1.1' ORDER BY created_at DESC
    console.log('Sorting documents by cabinet number:', cabinetNumber);
}

/**
 * Update row numbers after sorting/filtering
 */
function updateRowNumbersAfterSort() {
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
 * Show Add Document modal using SweetAlert2
 */
export function showAddDocumentModal() {
    Swal.fire({
        title: 'Add New Document',
        html: `
            <form id="addDocumentForm" class="text-left">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                    <input 
                        type="text" 
                        id="documentName" 
                        name="documentName" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        placeholder="Enter document name"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Category</label>
                    <select 
                        id="documentCategory" 
                        name="documentCategory" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Documents">Documents</option>
                        <option value="Sports">Sports</option>
                        <option value="Objects">Objects</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                        id="documentDescription" 
                        name="documentDescription" 
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        placeholder="Enter document description or notes"
                    ></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                        id="documentStatus" 
                        name="documentStatus" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        required
                    >
                        <option value="available">Available</option>
                        <option value="borrowed">Borrowed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add Document',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#800000',
        cancelButtonColor: '#6b7280',
        width: '500px',
        didOpen: () => {
            // Focus on first input
            const firstInput = document.getElementById('documentName');
            if (firstInput) {
                firstInput.focus();
            }
        },
        preConfirm: () => {
            const name = document.getElementById('documentName')?.value;
            const category = document.getElementById('documentCategory')?.value;
            const description = document.getElementById('documentDescription')?.value;
            const status = document.getElementById('documentStatus')?.value;
            
            if (!name || !category || !status) {
                Swal.showValidationMessage('Please fill in all required fields');
                return false;
            }
            
            return {
                name,
                category,
                description: description || '',
                status
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            // Get current cabinet ID
            const selectedCabinetName = document.getElementById('selectedCabinetName');
            const cabinetDropdownText = document.getElementById('cabinetDropdownText');
            
            let cabinetId = null;
            
            // Try to get cabinet ID from view button
            if (cabinetDropdownText && cabinetDropdownText.textContent.trim() !== 'Select Cabinet' && cabinetDropdownText.textContent.trim() !== 'All Cabinets') {
                const viewBtn = document.querySelector(`.view-papers-btn[data-cabinet-name="${cabinetDropdownText.textContent.trim()}"]`);
                if (viewBtn) {
                    cabinetId = viewBtn.getAttribute('data-cabinet-id');
                }
            }
            
            if (!cabinetId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to determine cabinet. Please select a cabinet first.',
                    confirmButtonColor: '#800000'
                });
                return;
            }
            
            try {
                // TODO: Backend implementation - POST to /backend/api/files.php
                const response = await fetch('/backend/api/files.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cabinet_id: parseInt(cabinetId, 10),
                        filename: result.value.name,
                        description: result.value.description || null,
                        category: result.value.category,
                        status: result.value.status.toLowerCase()
                    })
                });
                
                const apiResult = await response.json();
                
                if (apiResult.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Document Added!',
                        text: `"${result.value.name}" has been added successfully.`,
                        confirmButtonColor: '#800000',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    // Reload documents for current cabinet
                    // Trigger custom event that papers.js listens to, or reload directly
                    const event = new CustomEvent('documentAdded', { detail: { cabinetId: parseInt(cabinetId, 10) } });
                    window.dispatchEvent(event);
                    
                    // Also reload documents directly
                    await reloadDocumentsForCabinet(parseInt(cabinetId, 10));
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: apiResult.message || 'Failed to add document',
                        confirmButtonColor: '#800000'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add document: ' + error.message,
                    confirmButtonColor: '#800000'
                });
            }
        }
    });
}

/**
 * Add document to the table
 * @param {Object} docData - Document data object containing name, cabinetNumber, description, status
 */
export function addDocumentToTable(docData) {
    const tableBody = document.getElementById('documentsTableBody');
    const emptyStateRow = document.getElementById('emptyStateRow');
    
    if (!tableBody) return;
    
    // Hide empty state if it exists
    if (emptyStateRow) {
        emptyStateRow.classList.add('hidden');
    }
    
    // Create new row
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    // Format date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Status badge color
    let statusBadgeClass = 'bg-green-100 text-green-800';
    if (docData.status === 'Borrowed') {
        statusBadgeClass = 'bg-yellow-100 text-yellow-800';
    } else if (docData.status === 'Archived') {
        statusBadgeClass = 'bg-gray-100 text-gray-800';
    }
    
    // Get current row count for numbering
    const existingRows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
    const rowNumber = existingRows.length + 1;
    
    // Map cabinet name to cabinet prefix (C1, C2, C3)
    // TODO: Backend implementation - Replace with backend API call to fetch cabinet prefix
    // Backend should return the cabinet prefix based on the selected cabinet
    // Example backend table: cabinets(id, display_name, cabinet_prefix)
    // Format: Cabinet 1 → C1, Cabinet 2 → C2, Cabinet 3 → C3
    const cabinetNameToPrefix = {
        'Cabinet 1': 'C1',
        'Cabinet 2': 'C2',
        'Cabinet 3': 'C3'
    };
    
    // Get cabinet prefix from URL parameter (for cabinets/view.php) or selected cabinet name (for papers.php)
    // This determines which cabinet the document belongs to (for the Cabinet Number column)
    // The prefix (C1, C2, C3) is the unique ID, and the number after the dot (1, 2, 3, ...) auto-increments
    let cabinetPrefix = 'C1'; // Default
    
    // First, try to get from URL parameter (for cabinet view page)
    const urlParams = new URLSearchParams(window.location.search);
    const cabinetIdFromUrl = urlParams.get('id');
    if (cabinetIdFromUrl) {
        // Extract prefix from URL (e.g., C1.1 → C1, C2.1 → C2, C3.1 → C3)
        const prefixMatch = cabinetIdFromUrl.match(/^(C\d+)\./);
        if (prefixMatch) {
            cabinetPrefix = prefixMatch[1];
        }
    } else {
        // Otherwise, try to get from selected cabinet name (for papers page)
        // Check multiple sources to ensure we get the correct cabinet
        const selectedCabinetNameEl = document.getElementById('selectedCabinetName');
        const cabinetDropdownTextEl = document.getElementById('cabinetDropdownText');
        
        let cabinetText = '';
        
        // Priority 1: Check selectedCabinetName (set when viewing a specific cabinet)
        if (selectedCabinetNameEl && selectedCabinetNameEl.textContent.trim()) {
            cabinetText = selectedCabinetNameEl.textContent.trim();
        }
        // Priority 2: Check cabinetDropdownText (set when selecting from dropdown)
        else if (cabinetDropdownTextEl && cabinetDropdownTextEl.textContent.trim() && 
                 cabinetDropdownTextEl.textContent.trim() !== 'Select Cabinet' &&
                 cabinetDropdownTextEl.textContent.trim() !== 'All Cabinets') {
            cabinetText = cabinetDropdownTextEl.textContent.trim();
        }
        
        if (cabinetText) {
            // Check if it's a cabinet name (Cabinet 1, Cabinet 2, etc.)
            if (cabinetNameToPrefix[cabinetText]) {
                cabinetPrefix = cabinetNameToPrefix[cabinetText];
            } else {
                // Try to extract cabinet prefix directly from cabinet number (C1.1 → C1)
                const match = cabinetText.match(/^(C\d+)\./);
                if (match) {
                    cabinetPrefix = match[1];
                }
            }
        }
    }
    
    // Count existing documents with the same cabinet prefix to determine the next number
    // TODO: Backend implementation - Count documents by cabinet prefix
    // Example SQL: SELECT MAX(CAST(SUBSTRING(cabinet_number, 4) AS UNSIGNED)) FROM documents WHERE cabinet_number LIKE 'C1.%'
    // This will determine the next document number (e.g., if C1.1, C1.2 exist, next is C1.3)
    // IMPORTANT: Only count documents that match the current cabinet prefix (C1, C2, or C3)
    let maxNumber = 0;
    existingRows.forEach(row => {
        // Skip hidden rows (they might be filtered out)
        if (row.classList.contains('hidden')) {
            return;
        }
        
        const cabinetNumberCell = row.querySelector('td:nth-child(2)');
        if (cabinetNumberCell) {
            const cellText = cabinetNumberCell.textContent.trim();
            // Check if this document belongs to the same cabinet prefix
            // Example: If cabinetPrefix is "C1", match "C1.1", "C1.2", "C1.3", etc.
            if (cellText.startsWith(cabinetPrefix + '.')) {
                // Extract the number after the prefix (e.g., C1.3 → 3)
                const numberMatch = cellText.match(new RegExp('^' + cabinetPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\.(\\d+)'));
                if (numberMatch) {
                    const docNumber = parseInt(numberMatch[1], 10);
                    if (!isNaN(docNumber) && docNumber > maxNumber) {
                        maxNumber = docNumber;
                    }
                }
            }
        }
    });
    
    // Assign the next cabinet number (e.g., C1.1, C1.2, C1.3, etc.)
    // The prefix (C1, C2, C3) stays the same for the selected cabinet
    // Only the number after the dot increments: C1.1 → C1.2 → C1.3 → C1.4, etc.
    const nextNumber = maxNumber + 1;
    const cabinetNumber = `${cabinetPrefix}.${nextNumber}`;
    
    // Debug log (remove in production)
    console.log('Adding document:', {
        cabinetPrefix: cabinetPrefix,
        maxNumber: maxNumber,
        nextNumber: nextNumber,
        cabinetNumber: cabinetNumber
    });
    
    // Get category from document data (from form submission)
    const category = docData.category || 'Documents';
    
    // Category badge color
    let categoryBadgeClass = 'bg-purple-100 text-purple-800'; // Default for Documents
    if (category === 'Sports') {
        categoryBadgeClass = 'bg-blue-100 text-blue-800';
    } else if (category === 'Objects') {
        categoryBadgeClass = 'bg-orange-100 text-orange-800';
    }
    
    // TODO: Backend implementation - Sort documents by specific cabinet number
    // When a cabinet is selected from the dropdown, the backend should filter/sort documents
    // based on the cabinet number (C1.1, C1.2, C1.3) stored in the database
    // Example SQL: SELECT * FROM documents WHERE cabinet_number = 'C1.1' ORDER BY created_at DESC
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rowNumber}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-900 font-medium">${cabinetNumber}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${docData.name}</div>
            <div class="text-sm text-gray-500">${docData.description || 'No description'}</div>
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
            <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass}">${docData.status}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center gap-2">
                <button class="text-[#800000] hover:text-[#700000] hover:underline cursor-pointer view-doc-btn" data-doc-name="${docData.name}">View</button>
                <span class="text-gray-300">|</span>
                <button class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer edit-doc-btn" data-doc-name="${docData.name}">Edit</button>
                <span class="text-gray-300">|</span>
                <button class="text-red-600 hover:text-red-800 hover:underline cursor-pointer delete-doc-btn" data-doc-name="${docData.name}">Delete</button>
            </div>
        </td>
    `;
    
    // Insert at the beginning of the table
    tableBody.insertBefore(row, tableBody.firstChild);
    
    // Add event listeners for action buttons
    const deleteBtn = row.querySelector('.delete-doc-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteDocument(row, docData.name);
        });
    }
    
    // Update document count
    updateDocumentCount();
    
    // Update Cabinet Number filter dropdown to include the new document
    // This ensures the dropdown shows all existing cabinet numbers
    if (typeof populateCabinetNumberFilter === 'function') {
        populateCabinetNumberFilter();
    }
}

/**
 * Reload documents for a specific cabinet
 * @param {number} cabinetId - Cabinet ID
 */
async function reloadDocumentsForCabinet(cabinetId) {
    try {
        const response = await fetch(`/backend/api/files.php?cabinet_id=${cabinetId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const tableBody = document.getElementById('documentsTableBody');
            const emptyStateRow = document.getElementById('emptyStateRow');
            
            if (!tableBody) return;
            
            // Clear existing document rows
            const existingRows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
            existingRows.forEach(row => row.remove());
            
            if (result.data.length === 0) {
                if (emptyStateRow) {
                    emptyStateRow.classList.remove('hidden');
                }
            } else {
                if (emptyStateRow) {
                    emptyStateRow.classList.add('hidden');
                }
                
                // Render documents
                result.data.forEach((doc, index) => {
                    const row = createDocumentRowFromAPI(doc, index + 1);
                    tableBody.appendChild(row);
                });
                
                // Initialize action buttons
                if (typeof initDocumentActionButtons === 'function') {
                    initDocumentActionButtons();
                }
            }
            
            // Update document count
            updateDocumentCount();
            
            // Update Cabinet Number filter dropdown
            const prefixMatch = String(cabinetId).match(/^(C\d+)\./);
            const cabinetPrefix = prefixMatch ? prefixMatch[1] : 'C' + cabinetId;
            if (typeof populateCabinetNumberFilter === 'function') {
                populateCabinetNumberFilter(cabinetPrefix);
            }
        }
    } catch (error) {
        console.error('Error reloading documents:', error);
    }
}

/**
 * Create a document table row from API data (helper function for cabinet-view.js)
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
    let categoryBadgeClass = 'bg-purple-100 text-purple-800';
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
 * Delete document from table
 */
export function deleteDocument(row, documentName) {
    Swal.fire({
        icon: 'warning',
        title: 'Delete Document?',
        text: `Are you sure you want to delete "${documentName}"?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            row.remove();
            updateDocumentCount();
            
            // Check if table is empty and show empty state
            const tableBody = document.getElementById('documentsTableBody');
            const emptyStateRow = document.getElementById('emptyStateRow');
            const existingRows = tableBody.querySelectorAll('tr:not(#emptyStateRow)');
            
            if (tableBody && emptyStateRow && existingRows.length === 0) {
                emptyStateRow.classList.remove('hidden');
            }
            
            // Update row numbers after deletion
            updateRowNumbers();
            
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Document has been deleted.',
                confirmButtonColor: '#800000',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

/**
 * Update document count display
 */
export function updateDocumentCount() {
    const tableBody = document.getElementById('documentsTableBody');
    const documentCount = document.getElementById('documentCount');
    
    if (!tableBody || !documentCount) return;
    
    // Count visible document rows only (exclude empty state row and filtered/hidden rows)
    const rows = tableBody.querySelectorAll('tr:not(#emptyStateRow):not(.hidden)');
    const count = rows.length;
    
    documentCount.textContent = `${count} document${count !== 1 ? 's' : ''}`;
    
    // Update row numbers
    updateRowNumbers();
}

/**
 * Update row numbers in the table
 */
function updateRowNumbers() {
    const tableBody = document.getElementById('documentsTableBody');
    if (!tableBody) return;
    
    // Only renumber visible rows (so filtering doesn't create confusing numbering)
    const rows = tableBody.querySelectorAll('tr:not(#emptyStateRow):not(.hidden)');
    rows.forEach((row, index) => {
        const firstCell = row.querySelector('td:first-child');
        if (firstCell) {
            firstCell.textContent = index + 1;
        }
    });
}
