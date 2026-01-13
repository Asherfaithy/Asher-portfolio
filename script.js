// ===== PRELOADER WITH TYPEWRITER =====
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const typewriterText = document.getElementById('typewriterText');
    const phrases = ['Crafting stories...', 'Fueled by Research...', 'Welcome.'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewrite() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentPhrase.length) {
            if (phraseIndex === phrases.length - 1) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 800);
                return;
            }
            typingSpeed = 1000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex++;
        }

        setTimeout(typewrite, typingSpeed);
    }

    document.body.style.overflow = 'hidden';
    setTimeout(typewrite, 500);

    // ===== ALTERNATING TITLE ANIMATION =====
    const alternatingTitle = document.getElementById('alternatingTitle');
    if (alternatingTitle) {
        const titles = ['Writer', 'Brand Storyteller'];
        let titleIndex = 0;

        setInterval(() => {
            alternatingTitle.style.opacity = '0';
            setTimeout(() => {
                titleIndex = (titleIndex + 1) % titles.length;
                alternatingTitle.textContent = titles[titleIndex];
                alternatingTitle.style.opacity = '1';
            }, 500);
        }, 3000);
    }
});

// ===== CURSOR GLOW FOLLOWER =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate counters
            if (entry.target.classList.contains('hero-stats')) {
                entry.target.querySelectorAll('.stat-number').forEach(counter => {
                    animateCounter(counter);
                });
            }

            // Animate process steps
            if (entry.target.classList.contains('process-timeline')) {
                const steps = entry.target.querySelectorAll('.process-step');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('active');
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.hero-stats, .work-card, .about-grid, .skills-content, .experience-content').forEach(el => {
    observer.observe(el);
});

// Testimonials section removed - Professional Experience section is static

// ===== WORK CARDS HOVER EFFECT =====
document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', function (e) {
        this.style.setProperty('--mouse-x', e.offsetX + 'px');
        this.style.setProperty('--mouse-y', e.offsetY + 'px');
    });
});

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const sendMessageBtn = document.getElementById('sendMessageBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const originalText = sendMessageBtn.innerHTML;

        // Visual feedback - Loading
        sendMessageBtn.innerHTML = '<span>Sending Message...</span>';
        sendMessageBtn.disabled = true;

        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success feedback
                sendMessageBtn.innerHTML = '<span>Message Sent! ✓</span>';
                sendMessageBtn.style.background = '#22c55e';
                this.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error feedback
            sendMessageBtn.innerHTML = '<span>Error! Please try again.</span>';
            sendMessageBtn.style.background = '#ef4444';
        } finally {
            setTimeout(() => {
                sendMessageBtn.innerHTML = originalText;
                sendMessageBtn.style.background = '';
                sendMessageBtn.disabled = false;
            }, 3000);
        }
    });
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    const shapes = document.querySelectorAll('.shape');

    if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);

        shapes.forEach((shape, i) => {
            const speed = 0.1 + (i * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// ===== NAV LINK ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.btn-primary:not(#sendMessageBtn)').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});
