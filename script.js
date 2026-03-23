window.addEventListener('load', () => {
    // ===== Language Toggle =====
    const langToggleBtn = document.getElementById('lang-toggle');

    // ===== Code Block Copy Buttons =====
    const injectCodeCopyButtons = () => {
        document.querySelectorAll('.code-block .code-header').forEach(header => {
            if (header.querySelector('.code-copy-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.textContent = 'COPY';
            btn.addEventListener('click', () => {
                const pre = header.parentElement.querySelector('pre');
                if (!pre) return;
                navigator.clipboard.writeText(pre.textContent).then(() => {
                    btn.textContent = 'COPIED!';
                    btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 2000);
                }).catch(err => console.error(err));
            });
            header.appendChild(btn);
        });
    };

    const setLanguage = (lang) => {
        // Re-query each time to capture dynamically revealed elements
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.dataset.i18nKey;
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
        localStorage.setItem('preferredLanguage', lang);
        // Inject copy buttons into code blocks after content is set
        injectCodeCopyButtons();
        // Batch MathJax typeset after all content is set
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise().catch(err => console.error('MathJax error:', err));
        }
    };

    langToggleBtn.addEventListener('click', () => {
        const newLang = document.documentElement.lang === 'en' ? 'zh' : 'en';
        setLanguage(newLang);
    });

    const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(preferredLang);

    // ===== Side Navigation =====
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    let isClickScrolling = false;
    let clickScrollTimeout;

    const tldrDot = document.querySelector('.nav-dot[data-section="tldr"]');
    if (tldrDot) tldrDot.classList.add('active');

    const navObserver = new IntersectionObserver((entries) => {
        if (isClickScrolling) return;
        let currentSectionId = '';
        entries.forEach(entry => {
            if (entry.isIntersecting) currentSectionId = entry.target.id;
        });
        if (currentSectionId) {
            navDots.forEach(dot => {
                dot.classList.toggle('active', dot.getAttribute('data-section') === currentSectionId);
            });
        }
    }, { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));

    navDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            isClickScrolling = true;
            navDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            clearTimeout(clickScrollTimeout);
            clickScrollTimeout = setTimeout(() => { isClickScrolling = false; }, 800);
        });
    });

    window.addEventListener('wheel', () => {
        clearTimeout(clickScrollTimeout);
        isClickScrolling = false;
    }, { passive: true });

    // ===== Related Links Toggle =====
    const relatedToggle = document.getElementById('related-links-toggle');
    const relatedDropdown = document.getElementById('related-links-dropdown');
    if (relatedToggle && relatedDropdown) {
        relatedToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            relatedDropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!relatedToggle.contains(e.target) && !relatedDropdown.contains(e.target)) {
                relatedDropdown.classList.remove('open');
            }
        });
    }

    // ===== BibTeX Modal =====
    const modal = document.getElementById('bibtex-modal');
    const triggerBtn = document.getElementById('bibtex-modal-trigger');
    const closeBtn = document.getElementById('modal-close-btn');
    const copyBtn = document.getElementById('copy-bibtex-btn');
    const bibtexCode = document.getElementById('bibtex-code');

    if (modal && triggerBtn && closeBtn && copyBtn) {
        triggerBtn.addEventListener('click', () => modal.classList.add('visible'));
        closeBtn.addEventListener('click', () => modal.classList.remove('visible'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('visible');
        });
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(bibtexCode.value.trim()).then(() => {
                const currentLang = document.documentElement.lang;
                const originalText = translations[currentLang].bib_copy;
                copyBtn.textContent = translations[currentLang].bib_copied;
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            }).catch(err => console.error(err));
        });
    }

    // ===== Scroll Fade-in Animation =====
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => animationObserver.observe(el));

    // ===== Collapsible Sections =====
    document.querySelectorAll('.collapsible-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const collapsible = btn.parentElement;
            collapsible.classList.toggle('open');
            // Re-typeset MathJax inside newly opened content
            if (collapsible.classList.contains('open') && window.MathJax && MathJax.typesetPromise) {
                const content = collapsible.querySelector('.collapsible-content');
                MathJax.typesetPromise([content]).catch(err => console.error(err));
            }
        });
    });

    // ===== Initialize Visualizations =====
    if (typeof initVisualizations === 'function') {
        initVisualizations();
    }
});
