function setupMenuToggle() {
    const btn = document.getElementById('menu-toggle');
    const hdr = document.querySelector('header');
    const navLinks = document.getElementById('nav-links');
    if (!btn || !hdr) return;

    const setMenuState = (open) => {
        hdr.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('menu-open', open);
    };

    btn.addEventListener('click', () => {
        const next = !hdr.classList.contains('open');
        setMenuState(next);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hdr.classList.contains('open')) {
            setMenuState(false);
        }
    });

    document.addEventListener('click', (e) => {
        if (!hdr.classList.contains('open')) return;
        if (!hdr.contains(e.target) && !btn.contains(e.target)) {
            setMenuState(false);
        }
    });

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960 && hdr.classList.contains('open')) {
            setMenuState(false);
        }
    });
}