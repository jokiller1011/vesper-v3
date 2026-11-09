(function initProxy() {
  const WORKER_URL = window.location.origin;
  const WISP_URL = 'wss://wisp.mercurywork.shop'; // Public Wisp server for Scramjet[reference:6]

  const engineSelect = document.getElementById('engine-select');
  const browserForm = document.getElementById('browser-form');
  const browserUrl = document.getElementById('browser-url');
  const proxyFrame = document.getElementById('proxy-frame');
  const urlInput = document.getElementById('url-input');
  const addressForm = document.getElementById('address-form');
  const aboutBlankCloak = document.getElementById('cloak-about-blank');

  window.openProxy = function(targetUrl) {
    if (!targetUrl) return;
    
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
      } else {
        targetUrl = 'https://www.google.com/search?q=' + encodeURIComponent(targetUrl);
      }
    }

    document.querySelector('[data-tab="browser"]').click();

    const engine = engineSelect.value;
    let proxyUrl = '';

    // --- Engine Routing ---
    if (engine.startsWith('sj')) {
      // Scramjet uses the Wisp server
      // The actual routing is handled by Scramjet's service worker
      proxyUrl = `${WORKER_URL}/scramjet/${encodeURIComponent(targetUrl)}`;
    } else if (engine === 'rh') {
      // Rammerhead uses Bare
      proxyUrl = `${WORKER_URL}/bare/rammerhead/${encodeURIComponent(targetUrl)}`;
    } else {
      // Ultraviolet uses Bare
      proxyUrl = `${WORKER_URL}/bare/uv/${encodeURIComponent(targetUrl)}`;
    }

    // --- About:Blank Cloaking ---
    if (aboutBlankCloak && aboutBlankCloak.checked) {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.write(`<iframe src="${window.location.href}" style="width:100%;height:100%;border:none;margin:0;padding:0;"></iframe>`);
        win.document.body.style.margin = '0';
        win.document.body.style.overflow = 'hidden';
      } else {
        alert('Please allow pop-ups for About:Blank cloaking.');
      }
      return;
    }

    browserUrl.value = targetUrl;
    urlInput.value = targetUrl;
    proxyFrame.src = proxyUrl;
  };

  browserForm.addEventListener('submit', (e) => { e.preventDefault(); window.openProxy(browserUrl.value); });
  addressForm.addEventListener('submit', (e) => { e.preventDefault(); window.openProxy(urlInput.value); });

  const homeSearchForm = document.getElementById('home-search-form');
  if (homeSearchForm) {
    homeSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.openProxy(document.getElementById('home-search').value);
    });
  }
})();
