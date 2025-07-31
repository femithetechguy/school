// js/resource-loader.js

document.addEventListener('DOMContentLoaded', function() {
    renderResourcesTabs();
});

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
                                contentContainer.innerHTML = renderMarkdownResource(data.content);
                            } else {
                                console.log('Rendering JSON content');
                                contentContainer.innerHTML = renderJsonResource(data.content);
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
 * Renders structured JSON data into HTML with collapsible sections.
 * @param {object} data - The JSON data for the resource.
 * @returns {string} - The generated HTML string.
 */
function renderJsonResource(data) {
    const resourceArray = Array.isArray(data.items) ? data.items : (Array.isArray(data.views) ? data.views : null);
    if (resourceArray) {
        let html = '';
        if (data.title) html += `<h3 class='text-2xl md:text-3xl font-heading font-bold text-charcoal mb-2'>${data.title}</h3>`;
        if (data.summary || data.description) html += `<p class='mb-4 text-gray-700 text-base md:text-lg'>${data.summary || data.description}</p>`;
        html += '<div class="divide-y divide-gray-200">';
        resourceArray.forEach((item, idx) => {
            const collapsed = idx !== 0 ? 'hidden' : '';
            const chevron = idx !== 0 ? 'fa-chevron-down' : 'fa-chevron-up';
            html += `<div class='py-2 md:py-4'>`;
            html += `<button type='button' class='w-full flex items-center justify-between text-left focus:outline-none group' data-collapsible='${idx}'>`;
            html += `<span class='text-lg md:text-xl font-bold text-charcoal group-hover:text-starfruit transition-colors break-words'>${item.title || item.name}</span>`;
            html += `<i class='fas ${chevron} ml-2 text-gray-500 group-hover:text-starfruit transition-colors'></i>`;
            html += `</button>`;
            html += `<div class='collapsible-content mt-2 ${collapsed}' data-content='${idx}'>`;
            if (item.description) html += `<p class='mb-3 text-gray-600 text-base md:text-lg'>${item.description}</p>`;
            if (Array.isArray(item.details)) {
                item.details.forEach(detail => {
                    if (Array.isArray(detail.items) && detail.items.length > 0) {
                        if (detail.items.every(row => typeof row === 'object' && !Array.isArray(row) && row !== null)) {
                            // Mobile view - card-based display for tables
                            html += `<div class='block md:hidden space-y-4'>`;
                            detail.items.forEach(row => {
                                html += `<div class='bg-white rounded-lg shadow p-4 mb-2 break-words'>`;
                                Object.keys(row).forEach(key => {
                                    html += `<div class='mb-2'><span class='font-semibold text-charcoal block mb-1'>${key}</span><span class='text-gray-700 break-words'>${row[key]}</span></div>`;
                                });
                                html += `</div>`;
                            });
                            html += `</div>`;
                            
                            // Desktop view - table-based display
                            html += `<div class='hidden md:block overflow-x-auto'>`;
                            html += `<table class='min-w-full bg-white rounded-lg shadow mb-4'><thead><tr>`;
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
                        } else {
                            html += `<div class='mb-2'>`;
                            if (detail.label) html += `<div class='font-semibold text-charcoal mb-1'>${detail.label}</div>`;
                            html += `<ul class='list-disc ml-6 text-gray-700 space-y-1'>`;
                            detail.items.forEach(d => {
                                html += `<li>${d}</li>`;
                            });
                            html += `</ul></div>`;
                        }
                    }
                });
            }
            if (item.purpose) html += `<p class='mb-3 text-gray-600 text-base md:text-lg'>${item.purpose}</p>`;
            if (Array.isArray(item.keyFeatures)) {
                html += '<ul class="list-disc ml-6 text-gray-700 space-y-1">';
                item.keyFeatures.forEach(f => {
                    html += `<li>${f}</li>`;
                });
                html += '</ul>';
            }
            html += `</div></div>`;
        });
        html += '</div>';
        if (data.conclusion) html += `<div class='mt-8 p-4 bg-gray-50 rounded-lg text-gray-800 text-base md:text-lg'>${data.conclusion}</div>`;

        setTimeout(() => {
            const buttons = document.querySelectorAll('[data-collapsible]');
            buttons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = btn.getAttribute('data-collapsible');
                    const content = document.querySelector(`[data-content="${idx}"]`);
                    const icon = btn.querySelector('i');
                    if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        content.classList.add('hidden');
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                });
            });
        }, 0);

        return html;
    }
    return `<pre class='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>${JSON.stringify(data, null, 2)}</pre>`;
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
