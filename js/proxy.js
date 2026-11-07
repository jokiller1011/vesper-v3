(function initProxy() {
  const WORKER_URL = window.location.origin;
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

    // Route to the correct engine path through our Worker's Bare server
    if (engine === 'rh') {
        proxyUrl = `${WORKER_URL}/bare/rammerhead/${encodeURIComponent(targetUrl)}`;
    } else if (engine.startsWith('sj')) {
      proxyUrl = `${WORKER_URL}/bare/scramjet/${encodeURIComponent(targetUrl)}`;
    } else {
      proxyUrl = `${WORKER_URL}/bare/uv/${encodeURIComponent(targetUrl)}`;
    }

    // About:Blank Cloaking Logic
    if (aboutBlankCloak && aboutBlankCloak.checked) {
        const win = window.open('about:blank', '_blank');
        if (win) {
            win.document.write(`<iframe src="${proxyUrl}" style="width:100%;height:100%;border:none;margin:0;padding:0;"></iframe>`);
            win.document.body.style.margin = '0';
            win.document.body.style.overflow = 'hidden';
        } else {
            alert('Please allow pop-ups for About:Blank cloaking to work.');
            browserUrl.value = targetUrl;
            urlInput.value = targetUrl;
            proxyFrame.src = proxyUrl;
        }
    } else {
        browserUrl.value = targetUrl;
        urlInput.value = targetUrl;
        proxyFrame.src = proxyUrl;
    }
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
