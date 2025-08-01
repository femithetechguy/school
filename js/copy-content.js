// js/copy-content.js

/**
 * This file adds functionality to copy the current tab's content
 * It provides a floating copy button on both desktop and mobile views
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the copy button functionality
    initCopyButton();
});

/**
 * Initialize the copy button functionality
 */
function initCopyButton() {
    // Create the copy button element
    createCopyButton();
    
    // Setup event listeners for content changes
    setupContentChangeListeners();
}

/**
 * Create the copy button element and add it to the DOM
 */
function createCopyButton() {
    // Check if the button already exists
    if (document.getElementById('copy-content-button')) {
        return;
    }
    
    // Create the button element
    const copyButton = document.createElement('button');
    copyButton.id = 'copy-content-button';
    copyButton.className = 'hidden fixed z-50 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 ease-in-out transform hover:scale-110';
    copyButton.setAttribute('aria-label', 'Copy content');
    copyButton.setAttribute('title', 'Copy content to clipboard');
    
    // Add the icon (using inline SVG for better compatibility)
    copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="copy-feedback hidden absolute top-full mt-2 bg-gray-800 text-white text-xs rounded px-2 py-1">Copied!</span>
    `;
    
    // Position the button in the bottom right corner
    copyButton.style.right = '20px';
    copyButton.style.bottom = '20px';
    
    // Add click event listener
    copyButton.addEventListener('click', copyCurrentContent);
    
    // Add the button to the DOM
    document.body.appendChild(copyButton);
}

/**
 * Setup event listeners for content changes to show/hide the copy button
 */
function setupContentChangeListeners() {
    // Listen for custom event when resource content is loaded
    document.addEventListener('resourceContentLoaded', function(e) {
        const copyButton = document.getElementById('copy-content-button');
        if (copyButton) {
            // Store reference to the current content
            copyButton.setAttribute('data-content-id', e.detail.contentId);
            copyButton.setAttribute('data-content-title', e.detail.title);
            
            // Show the button
            copyButton.classList.remove('hidden');
            
            // Position differently for mobile popup
            if (window.innerWidth <= 768 && document.querySelector('.mobile-popup-overlay')) {
                copyButton.style.bottom = '80px';
                copyButton.style.right = '20px';
            } else {
                copyButton.style.bottom = '20px';
                copyButton.style.right = '20px';
            }
        }
    });
    
    // Handle window resize to reposition the button
    window.addEventListener('resize', function() {
        const copyButton = document.getElementById('copy-content-button');
        if (copyButton && !copyButton.classList.contains('hidden')) {
            if (window.innerWidth <= 768 && document.querySelector('.mobile-popup-overlay')) {
                copyButton.style.bottom = '80px';
            } else {
                copyButton.style.bottom = '20px';
            }
        }
    });
    
    // Hide button when mobile popup is closed
    document.addEventListener('mobilePopupClosed', function() {
        const copyButton = document.getElementById('copy-content-button');
        if (copyButton) {
            copyButton.classList.add('hidden');
        }
    });
}

/**
 * Copy the current content to the clipboard
 */
function copyCurrentContent() {
    const copyButton = document.getElementById('copy-content-button');
    if (!copyButton) return;
    
    // Get content based on mobile or desktop view
    let contentToClean;
    
    if (window.innerWidth <= 768 && document.querySelector('.mobile-popup-overlay')) {
        // For mobile popup view
        contentToClean = document.querySelector('.mobile-popup-body').innerHTML;
    } else {
        // For desktop view
        const contentWrapper = document.getElementById('resource-content-wrapper');
        if (contentWrapper) {
            contentToClean = contentWrapper.innerHTML;
        }
    }
    
    if (!contentToClean) return;
    
    // Get the title of the content
    const title = copyButton.getAttribute('data-content-title') || 'Resource Content';
    
    // Clean HTML to get plain text (preserve formatting but remove HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentToClean;
    
    // Extract text content with basic formatting preserved
    let plainText = title + '\n\n';
    plainText += extractFormattedText(tempDiv);
    
    // Copy to clipboard
    navigator.clipboard.writeText(plainText)
        .then(() => {
            // Show feedback animation
            const feedback = copyButton.querySelector('.copy-feedback');
            feedback.classList.remove('hidden');
            
            // Hide feedback after a short delay
            setTimeout(() => {
                feedback.classList.add('hidden');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy content. ' + err.message);
        });
}

/**
 * Extract formatted text from HTML elements, preserving basic structure
 * @param {HTMLElement} element - The element to extract text from
 * @param {number} level - Current indentation level (for nested lists, etc.)
 * @returns {string} - Formatted plain text
 */
function extractFormattedText(element, level = 0) {
    let text = '';
    const indent = '  '.repeat(level);
    
    // Process child nodes
    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Text node - add its content
            const content = node.textContent.trim();
            if (content) text += content + ' ';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Element node - handle based on tag type
            const tagName = node.tagName.toLowerCase();
            
            switch (tagName) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    // Headings - add with line breaks
                    text += '\n\n' + indent + extractFormattedText(node, level) + '\n\n';
                    break;
                    
                case 'p':
                    // Paragraphs - add with line breaks
                    text += '\n' + indent + extractFormattedText(node, level) + '\n';
                    break;
                    
                case 'ul':
                case 'ol':
                    // Lists - process list items with indentation
                    text += '\n';
                    text += extractFormattedText(node, level + 1);
                    text += '\n';
                    break;
                    
                case 'li':
                    // List items - add bullet or number
                    text += '\n' + indent + '• ' + extractFormattedText(node, level);
                    break;
                    
                case 'table':
                    // Tables - process with basic formatting
                    text += '\n\n' + extractTableText(node) + '\n\n';
                    break;
                    
                case 'br':
                    // Line breaks
                    text += '\n' + indent;
                    break;
                    
                case 'strong':
                case 'b':
                    // Bold text
                    text += extractFormattedText(node, level);
                    break;
                    
                case 'em':
                case 'i':
                    // Italic text
                    text += extractFormattedText(node, level);
                    break;
                    
                case 'code':
                case 'pre':
                    // Code blocks - preserve formatting
                    text += '\n\n```\n' + node.textContent.trim() + '\n```\n\n';
                    break;
                    
                default:
                    // Default handling for other elements
                    text += extractFormattedText(node, level);
                    break;
            }
        }
    }
    
    // Clean up extra spaces and line breaks
    return text.replace(/\s+/g, ' ').replace(/\n\s+/g, '\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Extract text from a table with basic formatting
 * @param {HTMLElement} tableElement - The table element
 * @returns {string} - Formatted table text
 */
function extractTableText(tableElement) {
    let tableText = '';
    
    // Process rows
    const rows = tableElement.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('th, td');
        const rowContent = [];
        
        cells.forEach(cell => {
            rowContent.push(cell.textContent.trim());
        });
        
        tableText += rowContent.join(' | ') + '\n';
        
        // Add separator row after header
        if (rowIndex === 0 && row.querySelectorAll('th').length > 0) {
            tableText += rowContent.map(() => '---').join(' | ') + '\n';
        }
    });
    
    return tableText;
}
