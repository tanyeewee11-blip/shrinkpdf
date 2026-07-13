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
    'watermark.html':     '💧 Watermark',
    'page-numbers.html':  '🔢 Page #',
  };

  const TOOLS = [
    { href: 'index.html',         icon: '🗜️', label: '🗜️ Compress' },
    { href: 'merge.html',         icon: '🔗', label: '🔗 Merge' },
    { href: 'split.html',         icon: '✂️', label: '✂️ Split' },
    { href: 'rotate.html',        icon: '🔄', label: '🔄 Rotate' },
    { href: 'pdf-to-images.html', icon: '🖼️', label: '🖼️ PDF→IMG' },
    { href: 'images-to-pdf.html', icon: '📷', label: '📷 IMG→PDF' },
    { href: 'reorder.html',       icon: '📋', label: '📋 Reorder' },
    { href: 'watermark.html',     icon: '💧', label: '💧 Watermark' },
    { href: 'page-numbers.html',  icon: '🔢', label: '🔢 Page #' },
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
        <a href="/" class="logo"><span>Shrink</span>PDF</a>
        <a href="${root}guides" class="nav-guides-link">📚 Guides</a>
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
            <a href="/">Compress PDF</a>
            <a href="${root}merge">Merge PDF</a>
            <a href="${root}split">Split PDF</a>
            <a href="${root}rotate">Rotate PDF</a>
            <a href="${root}pdf-to-images">PDF to Images</a>
            <a href="${root}images-to-pdf">Images to PDF</a>
            <a href="${root}reorder">Reorder Pages</a>
            <a href="${root}watermark">Add Watermark</a>
            <a href="${root}page-numbers">Add Page Numbers</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Guides</div>
            <a href="${root}guides">All Guides</a>
            <a href="${root}guides/en-01-below1mb">Compress Below 1MB</a>
            <a href="${root}guides/en-34-send-large-pdf-email">Send Large PDF by Email</a>
            <a href="${root}guides/en-06-malaysia">LHDN e-Filing PDF</a>
            <a href="${root}guides/en-09-mobile">Compress on Mobile</a>
            <a href="${root}guides/en-12-university">University Submission</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Company</div>
            <a href="${root}about">About</a>
            <a href="${root}contact">Contact</a>
            <a href="${root}privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ShrinkPDF · No login · No storage · Always free</span>
      </div>
    `;
  }

  // ── shareWhatsApp() / copyLink() ──
  // Global so every page (not just index.html) can use the "What's next?" share buttons.
  // Appends UTM params so shared/copied links are attributable in GA4 instead of
  // landing as unattributed Direct traffic.
  // Builds the URL from the real site-absolute path (window.location.pathname),
  // NOT from the 'root' relative-link prefix above — root is only correct for
  // links pointing out of the current page, not for reconstructing this page's
  // own canonical URL (which matters once /guides/ pages start using this too).
  function canonicalPath() {
    let path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (path === '') path = '/';
    return path;
  }

  window.shareWhatsApp = function() {
    const url = 'https://shrinkpdf.fyi' + canonicalPath() +
      '?utm_source=whatsapp&utm_medium=share&utm_campaign=tool_share';
    const text = encodeURIComponent('Free PDF tools — no upload, no login, no file size limit. Files stay on your device: ' + url);
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  window.copyLink = function() {
    const url = 'https://shrinkpdf.fyi' + canonicalPath() +
      '?utm_source=copy_link&utm_medium=share&utm_campaign=tool_share';
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('copyLinkBtn');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  };

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

  // ── Keyboard accessibility for custom "pick one" cards ──
  // .pos-card / .format-card / .angle-card / .color-swatch are plain <div>s with
  // onclick handlers (rotate, watermark, page-numbers option pickers). Mouse users
  // are fine; keyboard and screen-reader users previously couldn't reach them at
  // all. This makes every matching element on every page focusable, activatable
  // with Enter/Space, and announces selection state via aria-pressed — without
  // needing to hand-edit each tool page's markup or JS.
  (function() {
    const SELECTOR = '.pos-card, .format-card, .angle-card, .color-swatch';

    function enhance(el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      el.setAttribute('aria-pressed', el.classList.contains('active') ? 'true' : 'false');
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          el.click();
        }
      });
    }

    const cards = document.querySelectorAll(SELECTOR);
    if (!cards.length) return;
    cards.forEach(enhance);

    // The pages' own selectPosition()/selectFormat()/selectAngle()/selectColor()
    // functions toggle the .active class directly — observe that instead of
    // requiring every page's JS to also manage aria-pressed.
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          m.target.setAttribute('aria-pressed', m.target.classList.contains('active') ? 'true' : 'false');
        }
      });
    });
    cards.forEach(function(el) {
      observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
  })();
})();
