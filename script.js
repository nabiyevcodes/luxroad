// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log("LuxRoad Dispatch Service website loaded successfully.");

    // Initialize EmailJS with error handling
    try {
        emailjs.init("wUzfUVb53p51qxurC");
        console.log("EmailJS initialized successfully");
    } catch (error) {
        console.error("EmailJS initialization failed:", error);
        alert("Failed to initialize email service. Please refresh the page and try again.");
    }

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimized scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Batch DOM queries
    const elementsToObserve = [
        ...document.querySelectorAll('.service-section'),
        ...document.querySelectorAll('.benefit-card'),
        ...document.querySelectorAll('.stat-item:not(:last-child)')
    ];

    elementsToObserve.forEach(element => observer.observe(element));

    // Optimized form submission
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.querySelector('.success-message');
    const resetFormBtn = document.querySelector('.reset-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            
            try {
                const formData = {
                    from_name: document.getElementById('first-name').value,
                    from_email: document.getElementById('email').value,
                    phone_number: document.getElementById('phone').value,
                    service: document.getElementById('service').value,
                    message: document.getElementById('message').value,
                    to_name: "LuxRoad Team"
                };

                await emailjs.send("service_sjzo1wv", "template_6vgtede", formData);
                
                // Hide form and show success message
                contactForm.classList.add('hidden');
                successMessage.style.display = 'flex';
                setTimeout(() => {
                    successMessage.classList.add('visible');
                }, 100);
                
                // Reset form data
                contactForm.reset();
                
            } catch (error) {
                console.error('Email sending failed:', error);
                alert('Failed to send message. Please try again later.');
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }

    // Reset form functionality
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            // Hide success message and show form
            successMessage.classList.remove('visible');
            setTimeout(() => {
                successMessage.style.display = 'none';
                contactForm.classList.remove('hidden');
            }, 300);
            
            // Reset form fields
            contactForm.reset();
            
            // Reset any custom styling
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                const input = group.querySelector('input, select, textarea');
                const label = group.querySelector('label');
                if (input && label) {
                    label.classList.remove('active');
                }
            });
        });
    }

    // Optimized scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    const handleScroll = debounce(() => {
        scrollTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const menuToggle = document.querySelector('.menu-toggle');
                const mainNav = document.querySelector('.main-nav');
                if (menuToggle && mainNav) {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Optimized mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && mainNav) {
        const toggleMenu = () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', toggleMenu);
        navLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Optimized counter animations
    function animateCounter(element, target) {
        let count = 0;
        const speed = 200;
        const updateCount = () => {
            const increment = target / speed;
            if (count < target) {
                count = Math.ceil(count + increment);
                element.textContent = count + '+';
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + '+';
            }
        };
        updateCount();
    }

    // Optimized Intersection Observer for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.stat-item:not(:last-child)');
                statItems.forEach(item => {
                    const numberElement = item.querySelector('h4');
                    const target = parseInt(numberElement.textContent);
                    animateCounter(numberElement, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const aboutStatsSection = document.querySelector('.about-stats');
    if (aboutStatsSection) {
        statsObserver.observe(aboutStatsSection);
    }

    // Menu Toggle Functionality
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

// Optimized email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
