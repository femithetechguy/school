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
                tabBtn.className = 'px-4 py-2 rounded-lg font-semibold text-charcoal bg-gray-100 hover:bg-starfruit focus:bg-starfruit transition-colors duration-200';
                tabBtn.textContent = child.label;
                tabBtn.setAttribute('data-resource-file', child.json); // Use a more descriptive attribute
                tabBtn.onclick = function() {
                    setActiveTab(idx);
                };
                tabsContainer.appendChild(tabBtn);
            });
            
            // Auto-select first tab
            setActiveTab(0);

            function setActiveTab(activeIdx) {
                Array.from(tabsContainer.children).forEach((btn, i) => {
                    btn.classList.toggle('bg-starfruit', i === activeIdx);
                });
                const activeChild = resources.children[activeIdx];
                if (activeChild && activeChild.json) {
                    const resourceFile = 'json/' + activeChild.json;
                    fetch(resourceFile + '?t=' + new Date().getTime())
                        .then(res => {
                            if (resourceFile.endsWith('.md')) {
                                return res.text().then(text => ({ content: text, type: 'md' }));
                            }
                            return res.json().then(json => ({ content: json, type: 'json' }));
                        })
                        .then(data => {
                            if (data.type === 'md') {
                                contentContainer.innerHTML = renderMarkdownResource(data.content);
                            } else {
                                contentContainer.innerHTML = renderJsonResource(data.content);
                            }
                        })
                        .catch(() => {
                            contentContainer.innerHTML = '<div class="text-red-500">Unable to load resource content.</div>';
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
            html += `<span class='text-xl md:text-2xl font-bold text-charcoal group-hover:text-starfruit transition-colors'>${item.title || item.name}</span>`;
            html += `<i class='fas ${chevron} ml-2 text-gray-500 group-hover:text-starfruit transition-colors'></i>`;
            html += `</button>`;
            html += `<div class='collapsible-content mt-2 ${collapsed}' data-content='${idx}'>`;
            if (item.description) html += `<p class='mb-3 text-gray-600 text-base md:text-lg'>${item.description}</p>`;
            if (Array.isArray(item.details)) {
                item.details.forEach(detail => {
                    if (Array.isArray(detail.items) && detail.items.length > 0) {
                        if (detail.items.every(row => typeof row === 'object' && !Array.isArray(row) && row !== null)) {
                            html += `<div class='block md:hidden'>`;
                            detail.items.forEach(row => {
                                html += `<div class='bg-white rounded-lg shadow p-4 mb-4'>`;
                                Object.keys(row).forEach(key => {
                                    html += `<div class='flex justify-between mb-1'><span class='font-semibold text-charcoal'>${key}</span><span class='text-gray-700'>${row[key]}</span></div>`;
                                });
                                html += `</div>`;
                            });
                            html += `</div>`;
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
    const html = marked.parse(markdownText);
    // Add prose class for Tailwind typography styles
    return `<div class="prose prose-lg max-w-none">${html}</div>`;
}
