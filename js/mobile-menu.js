// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded');
    setupMobileMenu();
});

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Mobile menu setup:', mobileMenuBtn, mobileMenu);
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            console.log('Mobile menu button clicked');
            e.preventDefault();
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
        
        // Close mobile menu when clicking outside
        document.body.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            }
        });
    } else {
        console.error('Mobile menu elements not found');
    }
}
