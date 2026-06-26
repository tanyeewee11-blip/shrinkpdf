/* ── SHARED COMPONENTS — ShrinkPDF ── */

(function() {
  // Map page filename → which nav button is active
  const NAV_ACTIVE = {
    'index.html':         '🗜️ Compress',
    '':                   '🗜️ Compress',
    'merge.html':         '🔗 Merge',
    'split.html':         '✂️ Split',
    'rotate.html':        '🔄 Rotate',
    'pdf-to-images.html': '🖼️ PDF→IMG',
    'images-to-pdf.html': '📷 IMG→PDF',
    'reorder.html':       '📋 Reorder',
  };

  const TOOLS = [
    { href: 'index.html',         icon: '🗜️', label: '🗜️ Compress' },
    { href: 'merge.html',         icon: '🔗', label: '🔗 Merge' },
    { href: 'split.html',         icon: '✂️', label: '✂️ Split' },
    { href: 'rotate.html',        icon: '🔄', label: '🔄 Rotate' },
    { href: 'pdf-to-images.html', icon: '🖼️', label: '🖼️ PDF→IMG' },
    { href: 'images-to-pdf.html', icon: '📷', label: '📷 IMG→PDF' },
    { href: 'reorder.html',       icon: '📋', label: '📋 Reorder' },
  ];

  // Detect root prefix for guides subdir
  const isInGuides = window.location.pathname.includes('/guides/');
  const root = isInGuides ? '../' : '';

  const rawPage = window.location.pathname.split('/').pop() || '';
  // Normalise: add .html if missing so /merge and merge.html both match
  const page = rawPage === '' ? '' : rawPage.includes('.') ? rawPage : rawPage + '.html';
  const activePage = NAV_ACTIVE[page] || '';

  function navBtn(tool) {
    const active = tool.label === activePage ? ' active' : '';
    return `<a href="${root}${tool.href}" class="nav-tool-btn${active}">${tool.label}</a>`;
  }

  // Inject NAV
  const navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.insertAdjacentHTML('beforebegin', '<a href="#main-content" class="skip-link">Skip to main content</a>');
    navEl.innerHTML = `
      <div class="nav-top">
        <a href="${root}index.html" class="logo"><span>Shrink</span>PDF</a>
        <a href="${root}guides.html" class="nav-guides-link">📚 Guides</a>
        <button class="hamburger" id="hamburgerBtn" onclick="toggleDrawer()" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav-bottom">
        ${TOOLS.map(navBtn).join('\n        ')}
      </div>
      <div class="mobile-drawer" id="mobileDrawer">
        ${TOOLS.map(navBtn).join('')}
      </div>
    `;
  }

  // Inject FOOTER
  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo"><span>Shrink</span>PDF</div>
          <p class="footer-tagline">Free PDF tools. No login. No limits. No watermarks.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <div class="footer-col-title">Tools</div>
            <a href="${root}index.html">Compress PDF</a>
            <a href="${root}merge.html">Merge PDF</a>
            <a href="${root}split.html">Split PDF</a>
            <a href="${root}rotate.html">Rotate PDF</a>
            <a href="${root}pdf-to-images.html">PDF to Images</a>
            <a href="${root}images-to-pdf.html">Images to PDF</a>
            <a href="${root}reorder.html">Reorder Pages</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Guides</div>
            <a href="${root}guides.html">All Guides</a>
            <a href="${root}guides/en-01-below1mb.html">Compress Below 1MB</a>
            <a href="${root}guides/en-34-send-large-pdf-email.html">Send Large PDF by Email</a>
            <a href="${root}guides/en-06-malaysia.html">LHDN e-Filing PDF</a>
            <a href="${root}guides/en-09-mobile.html">Compress on Mobile</a>
            <a href="${root}guides/en-12-university.html">University Submission</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Company</div>
            <a href="${root}about.html">About</a>
            <a href="${root}contact.html">Contact</a>
            <a href="${root}privacy.html">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ShrinkPDF · No login · No storage · Always free</span>
      </div>
    `;
  }

  // Global toggleDrawer used by hamburger onclick
  window.toggleDrawer = function() {
    var btn = document.getElementById('hamburgerBtn');
    var drawer = document.getElementById('mobileDrawer');
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
  };

  // ── showToast(message, type, duration) ──
  // type: 'error' | 'warning' | 'success' | 'info'  (default: 'error')
  // duration: ms (default: 4000)
  window.showToast = function(message, type, duration) {
    type = type || 'error';
    duration = duration || 4000;

    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    var icons = { error: '❌', warning: '⚠️', success: '✅', info: 'ℹ️' };
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || '❌') + '</span><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('removing');
      toast.addEventListener('animationend', function() { toast.remove(); }, { once: true });
    }, duration);
  };
})();
