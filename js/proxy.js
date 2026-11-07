(function initProxy() {
  // Base URL of the worker handling the proxy
  const WORKER_URL = 'https://pinpoint.keymoreshealth.workers.dev';

  const engineSelect = document.getElementById('engine-select');
  const browserForm = document.getElementById('browser-form');
  const browserUrl = document.getElementById('browser-url');
  const proxyFrame = document.getElementById('proxy-frame');
  const urlInput = document.getElementById('url-input');
  const addressForm = document.getElementById('address-form');

  // Global function so the dock can call it
  window.openProxy = function(targetUrl) {
    if (!targetUrl) return;
    
    // Ensure it has https://
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
      } else {
        targetUrl = 'https://www.google.com/search?q=' + encodeURIComponent(targetUrl);
      }
    }

    // Switch to browser tab
    document.querySelector('[data-tab="browser"]').click();

    // Determine the proxy route based on the engine selected
    const engine = engineSelect.value;
    let proxyUrl = '';

    // Assuming your worker handles /uv/ and /scramjet/ paths by forwarding to the CDN
    // We use the standard Wisp/Bare proxy patterns.
    // If the worker is set up correctly with Scramjet, this should work:
    if (engine.startsWith('sj')) {
      // Scramjet proxy URL format
      proxyUrl = `${WORKER_URL}/scramjet/${encodeURIComponent(targetUrl)}`;
    } else {
      // Ultraviolet proxy URL format
      proxyUrl = `${WORKER_URL}/uv/service/${encodeURIComponent(targetUrl)}`;
    }

    // Update UI
    browserUrl.value = targetUrl;
    urlInput.value = targetUrl;
    proxyFrame.src = proxyUrl;
  };

  // Handle Browser Tab form submit
  browserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.openProxy(browserUrl.value);
  });

  // Handle Top Bar form submit
  addressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.openProxy(urlInput.value);
  });

  // Handle Home Search form submit
  const homeSearchForm = document.getElementById('home-search-form');
  if (homeSearchForm) {
    homeSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('home-search').value;
      window.openProxy(val);
    });
  }
})();
