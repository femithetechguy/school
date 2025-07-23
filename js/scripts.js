// ...removed call to setupExclusiveMediaPlayback (no longer exists)...
// ...exclusive playback logic removed...
// BI Playlist and BI Podcast buttons should scroll to the embedded iframes
// Also set Podcast and Videos menu links to external playlists
document.addEventListener('DOMContentLoaded', function() {
  fetch('json/links.json?t=' + new Date().getTime())
    .then(res => res.json())
    .then(links => {
      // BI Playlist button
      var biPlaylistBtn = document.getElementById('bi-playlist-btn');
      if (biPlaylistBtn) {
        biPlaylistBtn.setAttribute('href', '#featured-powerbi-playlist');
        biPlaylistBtn.removeAttribute('target');
        biPlaylistBtn.removeAttribute('rel');
      }
      // BI Podcast button
      var biPodcastBtn = document.getElementById('bi-podcast-btn');
      if (biPodcastBtn) {
        biPodcastBtn.setAttribute('href', '#p3adaptive-spotify-embed');
        biPodcastBtn.removeAttribute('target');
        biPodcastBtn.removeAttribute('rel');
      }

      // Podcast menu (desktop & mobile)
      var podcastMenu = document.getElementById('menu-podcast');
      var podcastMenuMobile = document.getElementById('menu-podcast-mobile');
      var spotifyPlaylist = links?.podcastPlaylists?.beginnerSeries;
      if (podcastMenu && spotifyPlaylist) {
        podcastMenu.setAttribute('href', spotifyPlaylist.replace('/embed/', '/'));
        podcastMenu.setAttribute('target', '_blank');
        podcastMenu.setAttribute('rel', 'noopener');
      }
      if (podcastMenuMobile && spotifyPlaylist) {
        podcastMenuMobile.setAttribute('href', spotifyPlaylist.replace('/embed/', '/'));
        podcastMenuMobile.setAttribute('target', '_blank');
        podcastMenuMobile.setAttribute('rel', 'noopener');
      }

      // Videos menu (desktop & mobile)
      var videosMenu = document.getElementById('menu-videos');
      var videosMenuMobile = document.getElementById('menu-videos-mobile');
      var ytPlaylist = links?.playlists?.powerBIMasterclass;
      if (videosMenu && ytPlaylist) {
        // Convert embed link to YouTube playlist page link
        var ytPageLink = ytPlaylist.replace('/embed/videoseries?', '/playlist?').replace('www.youtube.com', 'youtube.com').replace('embed/', '');
        videosMenu.setAttribute('href', ytPageLink);
        videosMenu.setAttribute('target', '_blank');
        videosMenu.setAttribute('rel', 'noopener');
      }
      if (videosMenuMobile && ytPlaylist) {
        var ytPageLink = ytPlaylist.replace('/embed/videoseries?', '/playlist?').replace('www.youtube.com', 'youtube.com').replace('embed/', '');
        videosMenuMobile.setAttribute('href', ytPageLink);
        videosMenuMobile.setAttribute('target', '_blank');
        videosMenuMobile.setAttribute('rel', 'noopener');
      }
    });
});

// --- Dynamic Resources Tab ---
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
                tabBtn.setAttribute('data-json', child.json);
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
                    fetch('json/' + activeChild.json + '?t=' + new Date().getTime())
                        .then(res => res.json())
                        .then(data => {
                            contentContainer.innerHTML = renderResourceJson(activeChild, data);
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

function renderResourceJson(child, data) {
    // Support both 'items' (new) and 'views' (legacy) for backward compatibility
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
            // For new 'items' structure
            if (item.description) html += `<p class='mb-3 text-gray-600 text-base md:text-lg'>${item.description}</p>`;
            if (Array.isArray(item.details)) {
                item.details.forEach(detail => {
                    if (Array.isArray(detail.items) && detail.items.length > 0) {
                        // Detect if detail.items is a table-like array of objects
                        if (detail.items.every(row => typeof row === 'object' && !Array.isArray(row) && row !== null)) {
                            // Responsive table/cards rendering
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
            // For legacy 'views' structure
            if (item.purpose) html += `<p class='mb-3 text-gray-600 text-base md:text-lg'>${item.purpose}</p>`;
            if (Array.isArray(item.keyFeatures)) {
                html += '<ul class="list-disc ml-6 text-gray-700 space-y-1">';
                item.keyFeatures.forEach(f => {
                    html += `<li>${f}</li>`;
                });
                html += '</ul>';
            }
            html += `</div>`;
            html += `</div>`;
        });
        html += '</div>';
        if (data.conclusion) html += `<div class='mt-8 p-4 bg-gray-50 rounded-lg text-gray-800 text-base md:text-lg'>${data.conclusion}</div>`;

        // Add collapsible logic
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
    // Default fallback for unknown resource types
    return `<pre class='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>${JSON.stringify(data, null, 2)}</pre>`;
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupIntersectionObserver();
    setupNewsletterForm();
    setupLazyLoading();
    setupSearchFunctionality();
    renderYouTubeChannels();
    renderFeaturedPowerBIPlaylist();
    // setupP3AdaptivePodcastNavigation(); // Removed: function not defined
}

// Render the featured Power BI playlist before the Spotify embed
function renderFeaturedPowerBIPlaylist() {
    const playlistDiv = document.getElementById('featured-powerbi-playlist');
    if (!playlistDiv) return;
    fetch('json/links.json?t=' + new Date().getTime())
        .then(res => res.json())
        .then(links => {
            const playlistUrl = links?.playlists?.powerBIMasterclass;
            if (playlistUrl) {
                playlistDiv.innerHTML = `
                    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div class="aspect-video w-full rounded-t-xl">
                            <iframe width="100%" height="100%" src="${playlistUrl}" frameborder="0" allowfullscreen class="rounded-t-xl"></iframe>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-heading font-bold text-charcoal mb-2">Power BI Masterclass Playlist</h3>
                            <a href="https://www.youtube.com/playlist?list=PLjNd3r1KLjQuVWrPuygE8QwEmCL6rrUrx" target="_blank" rel="noopener" class="text-blue-700 hover:underline">View on YouTube</a>
                        </div>
                    </div>
                `;
            } else {
                playlistDiv.innerHTML = '<div class="text-red-500">Power BI playlist not found.</div>';
            }
        })
        .catch(() => {
            playlistDiv.innerHTML = '<div class="text-red-500">Unable to load playlist. Please try again later.</div>';
        });
    console.log('Data Analysis Learning Hub initialized successfully!');
}
// Dynamically load and render YouTube channels from channels.json
function renderYouTubeChannels() {
    const container = document.getElementById('channels-list');
    if (!container) return;
    // Cache busting: add timestamp
    const url = 'json/channels.json?t=' + new Date().getTime();
    fetch(url)
        .then(res => res.json())
        .then(channels => {
            container.innerHTML = '';
            channels.forEach(channel => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col';
                card.innerHTML = `
                    <div class="flex items-center mb-3">
                        <i class="bi bi-youtube text-2xl text-red-500 mr-2"></i>
                        <a href="${channel.url}" target="_blank" rel="noopener" class="text-lg font-bold text-blue-700 hover:underline">${channel.name}</a>
                    </div>
                    <div class="text-sm text-gray-600 mb-2">${channel.bestFor || ''}</div>
                    <div class="mb-2">
                        <span class="font-semibold text-charcoal">Hosts:</span> ${Array.isArray(channel.hosts) ? channel.hosts.join(', ') : ''}
                    </div>
                    <div>
                        <span class="font-semibold text-charcoal">Topics:</span> ${Array.isArray(channel.topics) ? channel.topics.join(', ') : ''}
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(() => {
            container.innerHTML = '<div class="text-red-500">Unable to load channels. Please try again later.</div>';
        });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Update button icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for sticky nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card-hover, .feature-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Newsletter Form Handling
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // Simulate form submission
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Email Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set notification style based on type
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
    } else {
        notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Lazy Loading for Embeds
function setupLazyLoading() {
    const lazyEmbeds = document.querySelectorAll('[data-src]');
    
    if ('IntersectionObserver' in window) {
        const embedObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const embed = entry.target;
                    embed.src = embed.dataset.src;
                    embed.removeAttribute('data-src');
                    embedObserver.unobserve(embed);
                }
            });
        });
        
        lazyEmbeds.forEach(embed => {
            embedObserver.observe(embed);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyEmbeds.forEach(embed => {
            embed.src = embed.dataset.src;
        });
    }
}

// Search Functionality (for future SPA sections)
function setupSearchFunctionality() {
    // This will be expanded when we add the SPA sections
    console.log('Search functionality ready for SPA sections');
}

// Utility Functions

// Debounce function for search and other inputs
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Local Storage Helpers
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Local storage not available:', e);
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('Error reading from local storage:', e);
        return null;
    }
}

// Progress Tracking (for future curriculum features)
function trackProgress(moduleId, completed = false) {
    const progress = getLocalStorage('learningProgress') || {};
    progress[moduleId] = {
        completed: completed,
        timestamp: new Date().toISOString()
    };
    setLocalStorage('learningProgress', progress);
}

// Theme Toggle (for future dark mode support)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.classList.remove(currentTheme);
    body.classList.add(newTheme);
    
    setLocalStorage('theme', newTheme);
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = getLocalStorage('theme') || 'light';
    document.body.classList.add(savedTheme);
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
}

// Call performance logging after page load
window.addEventListener('load', logPerformance);

// Analytics tracking (placeholder for Google Analytics)
function trackEvent(category, action, label = '') {
    // Placeholder for analytics tracking
    console.log('Analytics Event:', { category, action, label });
    
    // When Google Analytics is added:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// Keyboard accessibility improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'fas fa-bars text-xl';
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered: ', registration))
        //     .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        debounce,
        setLocalStorage,
        getLocalStorage,
        trackProgress
    };
}