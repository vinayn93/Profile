const body = document.body;
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section, footer');
const sectionLinks = document.querySelectorAll('.nav-links a');
const tiltItems = document.querySelectorAll('.skill-card, .project-card, .edu-card, .portrait-panel, .highlight-card');
const interactiveButtons = document.querySelectorAll('.btn, .project-btn');
const scenePanels = document.querySelectorAll('section, footer');
const certificateButtons = document.querySelectorAll('.certificate-preview');
const certificateModal = document.getElementById('certificateModal');
const certificateFrame = document.getElementById('certificateFrame');
const certificateModalTitle = document.getElementById('certificateModalTitle');
const closeCertificate = document.querySelector('.certificate-close');
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

const buildFloatingOrbs = () => {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual || motionReduced) return;

    const orbCount = 5;
    for (let i = 0; i < orbCount; i += 1) {
        const orb = document.createElement('span');
        orb.className = 'floating-orb';
        orb.style.left = `${12 + (i * 18)}%`;
        orb.style.top = `${18 + (i * 12)}%`;
        orb.style.animationDelay = `${i * 0.6}s`;
        orb.style.setProperty('--orb-size', `${18 + (i * 8)}px`);
        orb.style.setProperty('--orb-opacity', `${0.16 + (i * 0.08)}`);
        heroVisual.appendChild(orb);
    }
};

const buildBackgroundParticles = () => {
    const particlesWrapper = document.createElement('div');
    particlesWrapper.className = 'background-particles';
    document.body.appendChild(particlesWrapper);

    for (let i = 0; i < 18; i += 1) {
        const dot = document.createElement('span');
        dot.className = 'particle';
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.setProperty('--size', `${Math.random() * 8 + 4}px`);
        dot.style.animationDelay = `${Math.random() * 6}s`;
        particlesWrapper.appendChild(dot);
    }
};

const cycleTagline = () => {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;

    const strings = tagline.dataset.strings ? tagline.dataset.strings.split(',') : [tagline.textContent.trim()];
    let index = 0;

    const tick = () => {
        tagline.textContent = strings[index];
        index = (index + 1) % strings.length;
    };

    tick();
    setInterval(tick, 2400);
};

const setTheme = (isDark) => {
    body.classList.toggle('dark-mode', isDark);
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
};

if (!motionReduced) {
    tiltItems.forEach((item) => {
        item.addEventListener('pointermove', (event) => {
            const bounds = item.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            const isPortrait = item.classList.contains('portrait-panel');
            const base = isPortrait ? 'rotateZ(2deg) translateY(-6px)' : 'translateY(-6px)';
            item.style.transform = isPortrait
                ? `perspective(1400px) rotateX(${y * -12}deg) rotateY(${x * 14}deg) rotateZ(2deg) translate3d(${x * 8}px, ${y * -8}px, 22px)`
                : `perspective(1200px) rotateX(${y * -12}deg) rotateY(${x * 16}deg) ${base}`;
        });

        item.addEventListener('pointerleave', () => {
            item.style.transform = item.classList.contains('portrait-panel')
                ? 'perspective(1400px) rotateX(9deg) rotateY(-16deg) rotateZ(2deg) translateY(0)'
                : 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    const portraitPanel = document.querySelector('.portrait-panel');
    if (portraitPanel) {
        portraitPanel.addEventListener('pointermove', (event) => {
            const rect = portraitPanel.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            const frame = portraitPanel.querySelector('.portrait-frame');
            if (frame) {
                frame.style.transform = `translateZ(24px) rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
            }
        });

        portraitPanel.addEventListener('pointerleave', () => {
            const frame = portraitPanel.querySelector('.portrait-frame');
            if (frame) {
                frame.style.transform = 'translateZ(18px) rotateX(0deg) rotateY(0deg)';
            }
        });
    }

    scenePanels.forEach((panel, index) => {
        panel.addEventListener('pointermove', (event) => {
            if (window.innerWidth <= 768) return;
            const bounds = panel.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            panel.style.transform = `translate3d(${x * 10}px, ${y * -8}px, 24px) rotateX(${y * -0.9}deg) rotateY(${x * 1.6}deg)`;
        });

        panel.addEventListener('pointerleave', () => {
            if (window.innerWidth <= 768) return;
            panel.style.transform = '';
        });
    });
}

document.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
});

interactiveButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const ripple = document.createElement('span');
        const bounds = button.getBoundingClientRect();
        ripple.className = 'ripple';
        ripple.style.left = `${event.clientX - bounds.left}px`;
        ripple.style.top = `${event.clientY - bounds.top}px`;
        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

const savedTheme = localStorage.getItem('portfolio-theme');
setTheme(savedTheme ? savedTheme === 'dark' : true);
themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('dark-mode')));

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = `<i class="fas fa-${isOpen ? 'times' : 'bars'}" aria-hidden="true"></i>`;
});

sectionLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    });
});

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

const openCertificateModal = (pdfUrl, title) => {
    if (!certificateModal || !certificateFrame) return;
    certificateFrame.src = pdfUrl;
    certificateModalTitle.textContent = title;
    certificateModal.classList.add('open');
    certificateModal.setAttribute('aria-hidden', 'false');
};

const closeCertificateModal = () => {
    if (!certificateModal || !certificateFrame) return;
    certificateModal.classList.remove('open');
    certificateModal.setAttribute('aria-hidden', 'true');
    certificateFrame.src = '';
};

certificateButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const pdfUrl = button.dataset.pdf;
        const title = button.dataset.title || 'Certificate';
        openCertificateModal(pdfUrl, title);
    });
});

if (closeCertificate) {
    closeCertificate.addEventListener('click', closeCertificateModal);
}

if (certificateModal) {
    certificateModal.addEventListener('click', (event) => {
        if (event.target.hasAttribute('data-close')) {
            closeCertificateModal();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && certificateModal && certificateModal.classList.contains('open')) {
        closeCertificateModal();
    }
});

buildFloatingOrbs();
buildBackgroundParticles();
cycleTagline();
