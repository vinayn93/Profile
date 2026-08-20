const body = document.body;
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section, footer');
const sectionLinks = document.querySelectorAll('.nav-links a');
const tiltItems = document.querySelectorAll('.skill-card, .project-card, .edu-card, .depth-card');
const interactiveButtons = document.querySelectorAll('.btn, .project-btn');
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!motionReduced) {
    tiltItems.forEach((item) => {
        item.addEventListener('pointermove', (event) => {
            const bounds = item.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            const depth = item.classList.contains('depth-card');
            const base = depth ? 'rotateZ(2deg)' : 'translateY(-4px)';
            item.style.transform = `perspective(900px) rotateX(${y * -10}deg) rotateY(${x * 12}deg) ${base}`;
        });
        item.addEventListener('pointerleave', () => {
                item.style.transform = item.classList.contains('depth-card')
                ? 'rotateX(8deg) rotateY(-14deg) rotateZ(2deg)'
                : 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}


document.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
});

interactiveButtons.forEach((button) => button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    const bounds = button.getBoundingClientRect();
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}));
const setTheme = (isDark) => {
    body.classList.toggle('dark-mode', isDark);
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
};

setTheme(localStorage.getItem('portfolio-theme') === 'dark');
themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('dark-mode')));

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = `<i class="fas fa-${isOpen ? 'times' : 'bars'}" aria-hidden="true"></i>`;
});

sectionLinks.forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
}));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const updateScrollState = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    const camera = Math.max(-160, window.scrollY * -0.08);
    document.documentElement.style.setProperty('--scene-camera', `${camera}px`);
    scrollProgress.style.width = `${progress}%`;
    backToTop.classList.toggle('visible', window.scrollY > 500);
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            sectionLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
    });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => activeObserver.observe(section));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('currentYear').textContent = new Date().getFullYear();
