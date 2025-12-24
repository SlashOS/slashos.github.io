const API_URL = 'https://api.github.com/repos/slashos/desktop/releases';

document.addEventListener('DOMContentLoaded', () => {
    loadReleases();
    setupMenuToggle();
    setCopyrightYear();
});

function loadReleases() {
    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            if (!Array.isArray(data) || data.length === 0) return handleReleaseError();

            const releases = [...data].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
            const latestOverall = releases[0];
            const latestStable = releases.find((r) => !r.prerelease) || latestOverall;

            populateHero(latestStable, latestOverall);
            populateDesktop(latestStable, latestOverall);
            populateArchive(releases);
        })
        .catch((error) => {
            console.error('Error fetching releases:', error);
            handleReleaseError();
        });
}

function populateHero(stable, latest) {
    if (!stable || !latest) return;

    setText('hero-stable-tag', formatTag(stable.tag_name));
    setText('hero-stable-date', formatDate(stable.published_at));
    setHtml('hero-stable-btn', buildCta(stable, true));

    setText('hero-edge-tag', formatTag(latest.tag_name));
    setText('hero-edge-date', formatDate(latest.published_at));
    setHtml('hero-edge-btn', buildCta(latest, false));
}

function populateDesktop(stable, latest) {
    if (stable) {
        setText('stable-tag', formatTag(stable.tag_name) || 'Stable');
        setText('stable-date', formatDate(stable.published_at));
        setText('stable-body', trimBody(stable.body) || 'Official stable release.');
        setHtml('stable-cta', buildCta(stable, true));
    }

    if (latest) {
        setText('edge-tag', formatTag(latest.tag_name) || 'Latest');
        setText('edge-date', formatDate(latest.published_at));
        setText('edge-body', trimBody(latest.body) || (latest.prerelease ? 'Newest prerelease build.' : 'Newest available build.'));
        setHtml('edge-cta', buildCta(latest, false));
    }
}

function populateArchive(releases) {
    const stable = releases.filter((r) => !r.prerelease);
    const pre = releases.filter((r) => r.prerelease);
    renderArchiveGroup('releases-stable', stable, 'No stable releases yet.');
    renderArchiveGroup('releases-pre', pre, 'No prereleases yet.');
}

function renderArchiveGroup(containerId, items, emptyText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="archive-empty glass">${emptyText}</div>`;
        return;
    }

    items.forEach((release) => {
        const card = document.createElement('article');
        card.className = 'archive-card glass';

        const assetsHtml = (release.assets || [])
            .map((asset) => `<a class="btn small primary" target="_blank" rel="noopener" href="${asset.browser_download_url}">${asset.name}</a>`)
            .join('');

        card.innerHTML = `
            <div class="archive-top">
                <div class="pill-row">
                    <span class="pill ${release.prerelease ? 'accent' : 'success'}">${release.prerelease ? 'Prerelease' : 'Stable'}</span>
                    <span class="pill outline">${release.tag_name}</span>
                </div>
                <span class="archive-date">${formatDate(release.published_at)}</span>
            </div>
            <p class="archive-body">${trimBody(release.body, 220) || 'No description provided.'}</p>
            <div class="archive-assets">${assetsHtml || '<span class="muted">No assets</span>'}</div>
        `;

        container.appendChild(card);
    });
}

function buildCta(release, primary = true) {
    const asset = pickAsset(release);
    const btnClass = primary ? 'btn primary' : 'btn secondary';
    const label = release && release.tag_name ? `Download ${formatTag(release.tag_name)}` : 'Download';
    if (asset) {
        return `<a href="${asset.browser_download_url}" class="${btnClass}" target="_blank" rel="noopener">${label}</a>`;
    }
    return `<a href="${release.html_url}" class="${btnClass}" target="_blank" rel="noopener">View on GitHub</a>`;
}

function pickAsset(release) {
    if (!release || !Array.isArray(release.assets)) return null;
    return release.assets.find((asset) => asset.browser_download_url) || null;
}

function trimBody(body, limit = 120) {
    if (!body) return '';
    const clean = body.replace(/\r?\n+/g, ' ').trim();
    return clean.length > limit ? `${clean.slice(0, limit)}...` : clean;
}

function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : '';
}

function formatTag(tag) {
    if (!tag || typeof tag !== 'string') return '';
    // Strip common arch/build suffixes to keep the card compact
    return tag.replace(/-x86(_)?64.*$/i, '');
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function handleReleaseError() {
    setText('hero-stable-tag', 'Unavailable');
    setText('hero-edge-tag', 'Unavailable');
    setText('stable-tag', 'Unavailable');
    setText('edge-tag', 'Unavailable');
}

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

function setCopyrightYear() {
    const el = document.getElementById('copyright-year');
    if (el) el.textContent = new Date().getFullYear();
}