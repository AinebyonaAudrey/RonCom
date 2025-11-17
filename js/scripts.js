document.addEventListener('DOMContentLoaded', function () {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Enhanced Navbar Toggle Functionality
    const navbarMenu = document.querySelector('.navbar-collapse');
    const body = document.body;
    const MOBILE_BREAKPOINT = 992; // Bootstrap's lg breakpoint
    const navbarContainer = document.querySelector('.navbar .container');
    
    let navbarToggle = document.querySelector('.navbar-toggler');
    
    // Function to check if device is mobile
    function isMobileView() {
        return window.innerWidth < MOBILE_BREAKPOINT;
    }

    // Function to create hamburger button
    function createHamburgerButton() {
        const button = document.createElement('button');
        button.className = 'navbar-toggler';
        button.type = 'button';
        button.setAttribute('aria-controls', 'navbarSupportedContent');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Toggle navigation');
        
        const icon = document.createElement('span');
        icon.className = 'navbar-toggler-icon';
        
        button.appendChild(icon);
        return button;
    }

    // Function to add hamburger button
    function addHamburgerButton() {
        if (!navbarToggle && isMobileView()) {
            navbarToggle = createHamburgerButton();
            const socialIcons = document.getElementById('nav-social-icons');
            if (socialIcons && navbarContainer) {
                navbarContainer.insertBefore(navbarToggle, socialIcons.nextSibling);
            }
            attachHamburgerEvents();
        }
    }

    // Function to remove hamburger button
    function removeHamburgerButton() {
        if (navbarToggle && !isMobileView()) {
            navbarToggle.remove();
            navbarToggle = null;
            // Clean up any open menu state
            if (navbarMenu) {
                navbarMenu.classList.remove('show');
                body.style.overflow = '';
            }
        }
    }

    // Function to attach events to hamburger button
    function attachHamburgerEvents() {
        if (!navbarToggle || !navbarMenu) return;

        navbarMenu.style.transition = 'all 0.3s ease-in-out';
        
        navbarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = navbarMenu.classList.contains('show');
            
            if (!isExpanded) {
                // Opening menu
                navbarMenu.classList.add('show');
                navbarToggle.classList.add('active');
                navbarToggle.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
                
                // Animate menu items
                const navItems = navbarMenu.querySelectorAll('.nav-item');
                navItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 50 * index);
                });
            } else {
                closeMenu();
            }
        });
    }

    function closeMenu() {
        if (!navbarMenu) return;
        
        navbarMenu.classList.remove('show');
        if (navbarToggle) {
            navbarToggle.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
        }
        body.style.overflow = '';
        
        // Reset nav items animation
        const navItems = navbarMenu.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
        if (!isMobileView() || !navbarToggle) return;
        
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Close navbar when clicking on a nav link
    if (navbarMenu) {
        const navLinks = navbarMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!isMobileView()) return;

                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        closeMenu();
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 300);
                    }
                } else {
                    closeMenu();
                }
            });
        });
    }

    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (!isMobileView()) return;
        
        if (e.key === 'Escape' && navbarMenu && navbarMenu.classList.contains('show')) {
            closeMenu();
        }
    });

    // Handle window resize - add/remove hamburger button
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isMobileView()) {
                addHamburgerButton();
            } else {
                removeHamburgerButton();
            }
        }, 250);
    });

    // Initial check - add or remove button on page load
    if (isMobileView()) {
        addHamburgerButton();
    } else {
        removeHamburgerButton();
    }

    // Form Validation for Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Create message container if it doesn't exist
        let messageContainer = document.querySelector('.form-message');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'form-message';
            contactForm.insertBefore(messageContainer, contactForm.firstChild);
        }

        // Validation functions
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validateField(field, validator) {
            const isValid = validator(field.value.trim());
            field.classList.toggle('is-valid', isValid);
            field.classList.toggle('is-invalid', !isValid);
            return isValid;
        }

        function clearValidation(field) {
            field.classList.remove('is-valid', 'is-invalid');
        }

        // Real-time validation
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, (val) => val.length >= 2);
        });

        emailInput.addEventListener('blur', () => {
            validateField(emailInput, validateEmail);
        });

        subjectInput.addEventListener('blur', () => {
            validateField(subjectInput, (val) => val.length >= 3);
        });

        messageInput.addEventListener('blur', () => {
            validateField(messageInput, (val) => val.length >= 10);
        });

        // Clear validation on focus
        [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
            field.addEventListener('focus', () => clearValidation(field));
        });

        // Form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all fields
            const nameValid = validateField(nameInput, (val) => val.length >= 2);
            const emailValid = validateField(emailInput, validateEmail);
            const subjectValid = validateField(subjectInput, (val) => val.length >= 3);
            const messageValid = validateField(messageInput, (val) => val.length >= 10);

            if (!nameValid || !emailValid || !subjectValid || !messageValid) {
                showMessage('Please fill in all fields correctly.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';

            // Simulate form submission (in real scenario, you'd send to backend)
            setTimeout(() => {
                // Success message
                showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');

                // Reset form
                contactForm.reset();
                [nameInput, emailInput, subjectInput, messageInput].forEach(field => clearValidation(field));

                // Reset button
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
            }, 2000);
        });

        function showMessage(text, type) {
            messageContainer.textContent = text;
            messageContainer.className = `form-message show ${type}`;

            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageContainer.classList.remove('show');
            }, 5000);
        }
    }

    const slider = document.querySelector('.hero-slider');
    if(!slider) return;

    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.dots');
    const prevBtn = slider.querySelector('.nav--prev');
    const nextBtn = slider.querySelector('.nav--next');

    let index = 0;
    let timer = null;
    const AUTOPLAY_MS = 6500;

    // Build dots
    slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role','tab');
        b.setAttribute('aria-label', 'Go to slide ' + (i+1));
        b.addEventListener('click', () => go(i, true));
        dotsWrap.appendChild(b);
    });

    function updateUI(){
        slides.forEach((s,i)=>s.classList.toggle('is-active', i===index));
        dotsWrap.querySelectorAll('button').forEach((b,i)=>{
        b.setAttribute('aria-selected', i===index ? 'true' : 'false');
        });
    }

    function go(i, pause){
        index = (i + slides.length) % slides.length;
        updateUI();
        if(pause) restartAutoplay();
    }

    function next(){ go(index+1, true); }
    function prev(){ go(index-1, true); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Keyboard
    slider.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowRight') next();
        if(e.key === 'ArrowLeft') prev();
    });
    slider.tabIndex = 0;

    // Touch swipe
    let sx = 0;
    slider.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
    slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx;
        if(Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    });

    function restartAutoplay(){
        if(timer) clearInterval(timer);
        timer = setInterval(()=> go(index+1, false), AUTOPLAY_MS);
    }

    // init
    updateUI();
    restartAutoplay();
});