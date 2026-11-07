(function initProxy() {
  // This automatically grabs the URL of wherever your site is hosted!
  const WORKER_URL = window.location.origin;

  const engineSelect = document.getElementById('engine-select');
  const browserForm = document.getElementById('browser-form');
  const browserUrl = document.getElementById('browser-url');
  const proxyFrame = document.getElementById('proxy-frame');
  const urlInput = document.getElementById('url-input');
  const addressForm = document.getElementById('address-form');

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

    if (engine.startsWith('sj')) {
      proxyUrl = `${WORKER_URL}/scramjet/${encodeURIComponent(targetUrl)}`;
    } else {
      proxyUrl = `${WORKER_URL}/uv/service/${encodeURIComponent(targetUrl)}`;
    }

    browserUrl.value = targetUrl;
    urlInput.value = targetUrl;
    proxyFrame.src = proxyUrl;
  };

  browserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.openProxy(browserUrl.value);
  });

  addressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.openProxy(urlInput.value);
  });

  const homeSearchForm = document.getElementById('home-search-form');
  if (homeSearchForm) {
    homeSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('home-search').value;
      window.openProxy(val);
    });
  }
})();
