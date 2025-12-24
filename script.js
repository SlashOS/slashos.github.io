document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.github.com/repos/slashos/desktop/releases')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) return;
            // Sort releases by published date, newest first
            data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

            // Find latest non-prerelease
            const latest = data.find(release => !release.prerelease) || data[0];
            if (latest) {
                const asset = (latest.assets && latest.assets[0]);
                const latestBtnHolder = document.getElementById('latest-btn');
                const heroBtnHolder = document.getElementById('hero-latest-btn');
                const heroLatest = document.getElementById('hero-latest');
                const latestDesc = document.getElementById('latest-desc');

                const downloadHtml = asset ? `<a href="${asset.browser_download_url}" class="btn primary" target="_blank">Download ${latest.tag_name}</a>` : `<span class="btn secondary">No assets</span>`;
                const scrollDownHtml = `<a href="#desktop" class="scroll-down-large">↓</a>`;

                if (latestBtnHolder) latestBtnHolder.innerHTML = downloadHtml;
                if (heroBtnHolder) heroBtnHolder.innerHTML = scrollDownHtml;
                if (heroLatest) heroLatest.textContent = `${latest.tag_name} • ${new Date(latest.published_at).toLocaleDateString()}`;
                if (latestDesc) latestDesc.textContent = latest.body ? latest.body.substring(0,160) + (latest.body.length>160?'…':'') : 'Official stable release.';
            }

            // Populate other versions
            const list = document.getElementById('releases-list');
            if (list && Array.isArray(data)) {
                data.forEach(release => {
                    const li = document.createElement('li');
                    li.className = 'release-item';

                    const info = document.createElement('div');
                    info.innerHTML = `<strong>${release.tag_name}</strong> ${release.prerelease ? '<span style="color:#ffb86b">(Prerelease)</span>' : ''} <span class="muted">- ${new Date(release.published_at).toLocaleDateString()}</span>`;

                    const assetsDiv = document.createElement('div');
                    assetsDiv.style.display = 'flex';
                    assetsDiv.style.gap = '0.5rem';
                    assetsDiv.style.flexWrap = 'wrap';

                    (release.assets || []).forEach(asset => {
                        const link = document.createElement('a');
                        link.href = asset.browser_download_url;
                        link.target = '_blank';
                        link.className = 'btn small';
                        link.textContent = asset.name;
                        assetsDiv.appendChild(link);
                    });

                    li.appendChild(info);
                    li.appendChild(assetsDiv);
                    list.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching releases:', error);
            const p = document.getElementById('hero-latest'); if (p) p.textContent = 'Error loading releases';
            const l = document.getElementById('latest-btn'); if (l) l.textContent = 'Error';
        });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('menu-toggle');
    const hdr = document.querySelector('header');
    if (!btn || !hdr) return;
    btn.addEventListener('click', () => {
        const isOpen = hdr.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // close menu on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hdr.classList.contains('open')) {
            hdr.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    // click outside to close
    document.addEventListener('click', (e) => {
        if (!hdr.classList.contains('open')) return;
        if (!hdr.contains(e.target) && !btn.contains(e.target)) {
            hdr.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
});

// Set copyright year dynamically
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});