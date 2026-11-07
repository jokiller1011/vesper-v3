// Prøxy engine handler
(function initProxy() {
  const WORKER_BASE = 'https://pinpoint.keymoreshealth.workers.dev';

  const engineSelect = document.getElementById('engine-select');
  const urlInput = document.getElementById('browser-url');
  const goBtn = document.getElementById('browser-go');
  const frame = document.getElementById('proxy-frame');

  function getPrefix(engine) {
    const map = {
      uv3: '/uv/service/',
      sj1: '/scramjet/1/',
      sj2: '/scramjet/2/',
      sj3: '/scramjet/3/',
      sj2a: '/scramjet/alpha/',
      rh: '/rammerhead/'
    };
    return map[engine] || '/uv/service/';
  }

  function navigate() {
    const url = urlInput.value.trim();
    if (!url) return;
    const engine = engineSelect.value;
    const prefix = getPrefix(engine);
    const target = WORKER_BASE + prefix + encodeURIComponent(url);
    frame.src = target;
  }

  goBtn.addEventListener('click', navigate);
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') navigate();
  });

  // Home search bar
  const homeSearch = document.getElementById('home-search');
  homeSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      urlInput.value = homeSearch.value;
      document.querySelector('[data-tab="browser"]').click();
      navigate();
    }
  });
})();
