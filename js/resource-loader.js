// js/resource-loader.js

document.addEventListener('DOMContentLoaded', function() {
    renderResourcesTabs();
    
    // Close popup when escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobilePopup();
        }
    });
});

// Function to open content in a mobile popup
function openMobilePopup(content, title) {
    // Create popup elements if they don't exist
    let overlay = document.querySelector('.mobile-popup-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-popup-overlay';
        document.body.appendChild(overlay);
        
        // Close popup when clicking outside content
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeMobilePopup();
            }
        });
    }
    
    // Create or update popup content
    let popup = document.querySelector('.mobile-popup-content');
    if (!popup) {
        popup = document.createElement('div');
        popup.className = 'mobile-popup-content';
        overlay.appendChild(popup);
    }
    
    // Set popup content with title
    popup.innerHTML = `
        <div class="mobile-popup-header">
            <h3 class="mobile-popup-title">${title}</h3>
            <button class="mobile-popup-close">&times;</button>
        </div>
        <div class="mobile-popup-body">${content}</div>
    `;
    
    // Add close button event listener
    popup.querySelector('.mobile-popup-close').addEventListener('click', closeMobilePopup);
    
    // Show popup
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
}

// Function to close the mobile popup
function closeMobilePopup() {
    const overlay = document.querySelector('.mobile-popup-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scrolling
    }
}

function renderResourcesTabs() {
    const tabsContainer = document.getElementById('resources-tabs');
    const contentContainer = document.getElementById('resources-content');
    if (!tabsContainer || !contentContainer) return;

    fetch('json/resources.json?t=' + new Date().getTime())
        .then(res => res.json())
        .then(resources => {
            tabsContainer.innerHTML = '';
            contentContainer.innerHTML = '';
            
            if (!resources.children || !resources.children.length) {
                tabsContainer.innerHTML = '<div class="text-gray-500">No resources found.</div>';
                return;
            }
            
            // Create wrapper for the content
            const contentWrapper = document.createElement('div');
            contentWrapper.id = 'resource-content-wrapper';
            contentWrapper.className = 'border border-gray-200 p-6 bg-white';
            contentContainer.appendChild(contentWrapper);
            
            resources.children.forEach((child, idx) => {
                const tabBtn = document.createElement('button');
                tabBtn.className = 'px-4 py-2 mx-1 border border-gray-300 rounded-t-lg font-semibold text-charcoal bg-gray-50 hover:bg-gray-100 focus:outline-none transition-colors duration-200';
                tabBtn.textContent = child.label;
                tabBtn.setAttribute('data-resource-file', child.json);
                tabBtn.onclick = function() {
                    setActiveTab(idx);
                };
                tabsContainer.appendChild(tabBtn);
            });
            
            // Auto-select first tab
            setActiveTab(0);

            function setActiveTab(activeIdx) {
                // First, update the tab appearance
                Array.from(tabsContainer.children).forEach((btn, i) => {
                    if (i === activeIdx) {
                        btn.classList.remove('bg-gray-50');
                        btn.classList.add('bg-white', 'border-b-0', 'active');
                    } else {
                        btn.classList.remove('bg-white', 'border-b-0', 'active');
                        btn.classList.add('bg-gray-50');
                    }
                });
                
                // Then, load the content
                const activeChild = resources.children[activeIdx];
                if (activeChild && activeChild.json) {
                    const resourceFile = 'json/' + activeChild.json;
                    console.log('Attempting to fetch resource:', resourceFile);
                    
                    fetch(resourceFile + '?t=' + new Date().getTime())
                        .then(res => {
                            if (!res.ok) {
                                console.error('Failed to fetch resource:', resourceFile, 'Status:', res.status);
                                throw new Error('Failed to fetch resource: ' + resourceFile);
                            }
                            console.log('Successfully fetched resource:', resourceFile);
                            
                            if (resourceFile.endsWith('.md')) {
                                return res.text().then(text => ({ content: text, type: 'md' }));
                            }
                            return res.json().then(json => ({ content: json, type: 'json' }));
                        })
                        .then(data => {
                            if (data.type === 'md') {
                                console.log('Rendering markdown content');
                                const renderedContent = renderMarkdownResource(data.content);
                                
                                // For mobile devices, show in popup
                                if (window.innerWidth <= 768) {
                                    openMobilePopup(renderedContent, activeChild.label);
                                } else {
                                    // For desktop, show in the container
                                    document.getElementById('resource-content-wrapper').innerHTML = renderedContent;
                                }
                            } else {
                                console.log('Rendering JSON content');
                                const renderedContent = renderJsonResource(data.content);
                                
                                // For mobile devices, show in popup
                                if (window.innerWidth <= 768) {
                                    openMobilePopup(renderedContent, activeChild.label);
                                } else {
                                    // For desktop, show in the container
                                    document.getElementById('resource-content-wrapper').innerHTML = renderedContent;
                                }
                            }
                        })
                        .catch((error) => {
                            console.error('Error loading resource:', error);
                            contentContainer.innerHTML = `<div class="text-red-500 p-4">Unable to load resource content: ${resourceFile}. Error: ${error.message}</div>`;
                        });
                }
            }
        })
        .catch(() => {
            tabsContainer.innerHTML = '<div class="text-red-500">Unable to load resources.</div>';
        });
}

/**
 * Renders structured JSON data into HTML without collapsible sections.
 * @param {object} data - The JSON data for the resource.
 * @returns {string} - The generated HTML string.
 */
function renderJsonResource(data) {
    const resourceArray = Array.isArray(data.items) ? data.items : (Array.isArray(data.views) ? data.views : null);
    if (resourceArray) {
        let html = '<div class="prose prose-lg max-w-none md:prose-xl">';
        
        // Add title and description at the top
        if (data.title) html += `<h1 class='mb-4'>${data.title}</h1>`;
        if (data.summary || data.description) html += `<p class='mb-6 text-gray-700'>${data.summary || data.description}</p>`;
        
        // Render each item as a section with heading
        resourceArray.forEach((item, idx) => {
            // Add section heading
            html += `<h2 class='mt-8 mb-4 text-charcoal font-bold'>${item.title || item.name}</h2>`;
            
            // Add item description
            if (item.description) html += `<p class='mb-4 text-gray-700'>${item.description}</p>`;
            
            // Add details
            if (Array.isArray(item.details)) {
                item.details.forEach(detail => {
                    if (Array.isArray(detail.items) && detail.items.length > 0) {
                        // Check if details are table-like data (objects)
                        if (detail.items.every(row => typeof row === 'object' && !Array.isArray(row) && row !== null)) {
                            // Add section subheading if there's a label
                            if (detail.label) html += `<h3 class='mt-6 mb-3 font-semibold'>${detail.label}</h3>`;
                            
                            // Desktop & tablet view - table-based display
                            html += `<div class='hidden md:block overflow-x-auto mb-6'>`;
                            html += `<table class='min-w-full border mb-4'><thead><tr>`;
                            Object.keys(detail.items[0]).forEach(key => {
                                html += `<th class='px-4 py-2 border-b font-semibold text-charcoal bg-gray-50'>${key}</th>`;
                            });
                            html += `</tr></thead><tbody>`;
                            detail.items.forEach(row => {
                                html += `<tr>`;
                                Object.values(row).forEach(val => {
                                    html += `<td class='px-4 py-2 border-b text-gray-700'>${val}</td>`;
                                });
                                html += `</tr>`;
                            });
                            html += `</tbody></table></div>`;
                            
                            // Mobile view - card-based display for tables
                            html += `<div class='block md:hidden space-y-4 mb-6'>`;
                            detail.items.forEach(row => {
                                html += `<div class='bg-white rounded-lg shadow p-4 mb-2 break-words'>`;
                                Object.keys(row).forEach(key => {
                                    html += `<div class='mb-2'><span class='font-semibold text-charcoal block mb-1'>${key}</span><span class='text-gray-700 break-words'>${row[key]}</span></div>`;
                                });
                                html += `</div>`;
                            });
                            html += `</div>`;
                        } else {
                            // Regular list data
                            html += `<div class='mb-4'>`;
                            if (detail.label) html += `<h3 class='mt-6 mb-3 font-semibold'>${detail.label}</h3>`;
                            html += `<ul class='list-disc ml-6 text-gray-700 space-y-2 mb-4'>`;
                            detail.items.forEach(d => {
                                html += `<li>${d}</li>`;
                            });
                            html += `</ul></div>`;
                        }
                    }
                });
            }
            
            // Add purpose section
            if (item.purpose) html += `<div class='my-4 p-4 bg-blue-50 rounded-lg text-gray-800'><h3 class='font-semibold mb-2'>Purpose</h3><p>${item.purpose}</p></div>`;
            
            // Add key features
            if (Array.isArray(item.keyFeatures) && item.keyFeatures.length > 0) {
                html += '<h3 class="mt-6 mb-3 font-semibold">Key Features</h3>';
                html += '<ul class="list-disc ml-6 text-gray-700 space-y-2 mb-6">';
                item.keyFeatures.forEach(f => {
                    html += `<li>${f}</li>`;
                });
                html += '</ul>';
            }
            
            // Add a divider between sections (except the last one)
            if (idx < resourceArray.length - 1) {
                html += '<hr class="my-8 border-gray-200">';
            }
        });
        
        // Add conclusion if present
        if (data.conclusion) {
            html += `<div class='mt-8 p-4 bg-gray-50 rounded-lg text-gray-800'>${data.conclusion}</div>`;
        }
        
        html += '</div>';
        return html;
    }
    
    // Fallback if data format is unknown
    return `<div class="prose prose-lg max-w-none"><pre class='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>${JSON.stringify(data, null, 2)}</pre></div>`;
}

/**
 * Renders a Markdown string into styled HTML content.
 * @param {string} markdownText - The raw Markdown text.
 * @returns {string} - The generated HTML string.
 */
function renderMarkdownResource(markdownText) {
    if (typeof marked === 'undefined') {
        return '<div class="text-red-500">Markdown parser (marked.js) is not loaded.</div>';
    }
    
    // Set options for marked to ensure mobile-friendly output
    marked.setOptions({
        breaks: true,  // Convert line breaks to <br>
        gfm: true      // Enable GitHub flavored markdown
    });
    
    let html = marked.parse(markdownText);
    
    // Process the HTML to make it more mobile-friendly
    // 1. Make all images responsive
    html = html.replace(/<img /g, '<img class="max-w-full h-auto" ');
    
    // 2. Add horizontal scroll to tables
    html = html.replace(/<table>/g, '<div class="overflow-x-auto"><table class="min-w-full">');
    html = html.replace(/<\/table>/g, '</table></div>');
    
    // Add prose class for Tailwind typography styles
    return `<div class="prose prose-lg max-w-none md:prose-xl prose-headings:break-words prose-p:break-words">${html}</div>`;
}
