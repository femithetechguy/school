// BI Playlist and BI Podcast buttons should scroll to the embedded iframes
document.addEventListener('DOMContentLoaded', function() {
  fetch('json/links.json?t=' + new Date().getTime())
    .then(res => res.json())
    .then(links => {
      var biPlaylistBtn = document.getElementById('bi-playlist-btn');
      if (biPlaylistBtn) {
        biPlaylistBtn.setAttribute('href', '#featured-powerbi-playlist');
        biPlaylistBtn.removeAttribute('target');
        biPlaylistBtn.removeAttribute('rel');
      }
      var biPodcastBtn = document.getElementById('bi-podcast-btn');
      if (biPodcastBtn) {
        biPodcastBtn.setAttribute('href', '#p3adaptive-spotify-embed');
        biPodcastBtn.removeAttribute('target');
        biPodcastBtn.removeAttribute('rel');
      }
    });
});
// Data Analysis Learning Hub - JavaScript

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
}
    setupP3AdaptivePodcastNavigation();
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
    const nextBtn = document.getElementById('next-episode');
    if (!embed || !prevBtn || !nextBtn) return;
    prevBtn.onclick = function() {
        if (currentEpisode > 0) {
            currentEpisode--;
            embed.src = `https://open.spotify.com/embed/episode/${p3adaptiveEpisodes[currentEpisode]}`;
        }
    };
    nextBtn.onclick = function() {
        if (currentEpisode < p3adaptiveEpisodes.length - 1) {
            currentEpisode++;
            embed.src = `https://open.spotify.com/embed/episode/${p3adaptiveEpisodes[currentEpisode]}`;
        }
    };
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