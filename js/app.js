(function initApp() {
  // --- Tab Switching (Sidebar) ---
  const sidebarBtns = document.querySelectorAll('.sidebar button');
  const tabs = document.querySelectorAll('.tab');
  const dock = document.getElementById('dynamic-dock');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabs.forEach(t => t.classList.add('hidden'));
      
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.remove('hidden');

      // Hide dock if not on home
      if (dock) dock.style.display = btn.dataset.tab === 'home' ? 'flex' : 'none';
    });
  });

  // --- Tab Bar Functionality ---
  const tabBar = document.getElementById('tab-bar');
  const newTabBtn = document.getElementById('new-tab-btn');
  let tabCount = 1;

  newTabBtn.addEventListener('click', () => {
    // Switch to home tab as a "new tab" simulation
    document.querySelector('[data-tab="home"]').click();
    
    // Add visual tab (purely aesthetic for now)
    const newTabEl = document.createElement('div');
    newTabEl.className = 'browser-tab';
    newTabEl.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> New Tab ${tabCount++}`;
    
    // Remove active from others
    document.querySelectorAll('.browser-tab').forEach(t => t.classList.remove('active'));
    newTabEl.classList.add('active');
    
    // Insert before the + button
    tabBar.insertBefore(newTabEl, newTabBtn);
  });

  // --- Settings Management ---
  function loadSettings() {
    // Theme Color
    const savedColor = localStorage.getItem('vesper-theme');
    if (savedColor) {
      document.documentElement.style.setProperty('--accent', savedColor);
      document.getElementById('theme-color').value = savedColor;
    }

    // Proxy toggles
    ['close-prevention', 'block-prevention', 'source-random', 'url-encoding', 'tor', 'about-blank', 'click-off'].forEach(id => {
      const el = document.getElementById(`setting-${id}`) || document.getElementById(`cloak-${id}`);
      if (el) {
        const saved = localStorage.getItem(`vesper-${id}`);
        if (saved !== null) el.checked = saved === 'true';
        el.addEventListener('change', () => localStorage.setItem(`vesper-${id}`, el.checked));
      }
    });

    // Tab cloaking
    const cloakSelect = document.getElementById('cloak-select');
    const savedCloak = localStorage.getItem('vesper-cloak');
    if (savedCloak && cloakSelect) cloakSelect.value = savedCloak;

    if (cloakSelect) {
      cloakSelect.addEventListener('change', () => {
        localStorage.setItem('vesper-cloak', cloakSelect.value);
        applyCloak(cloakSelect.value);
      });
      applyCloak(cloakSelect.value);
    }
  }

  function applyCloak(val) {
    const cloaks = {
      'google-classroom': { title: 'Classroom', favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
      'google-drive': { title: 'My Drive - Google Drive', favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' },
      'ixl': { title: 'IXL | Math, Language Arts, Science, Social Studies, and Spanish', favicon: 'https://www.ixl.com/favicon.ico' },
      'canvas': { title: 'Dashboard', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' }
    };
    if (cloaks[val]) {
      document.title = cloaks[val].title;
      let link = document.querySelector('link[rel="icon"]');
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = cloaks[val].favicon;
    } else {
      document.title = 'Vesper v3';
      let link = document.querySelector('link[rel="icon"]');
      if (link) link.href = 'assets/images/Vesper Logo(w only clear).svg';
    }
  }

  // Theme color listener
  const themeColor = document.getElementById('theme-color');
  themeColor.addEventListener('input', () => {
    document.documentElement.style.setProperty('--accent', themeColor.value);
    localStorage.setItem('vesper-theme', themeColor.value);
  });

  // Load games
  const gamesList = document.getElementById('games-list');
  const gameFrame = document.getElementById('game-frame');
  const games = [
    { name: 'Geometry Dash', url: 'https://gmtmath.github.io/geometry-dash/' },
    { name: 'The Impossible Quiz', url: 'https://gmtmath.github.io/impossible-quiz/' },
    { name: 'World\'s Hardest Game', url: 'https://gmtmath.github.io/worlds-hardest-game/' },
    { name: 'Drive Mad', url: 'https://gmtmath.github.io/drive-mad/' }
  ];

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.textContent = game.name;
    card.addEventListener('click', () => {
      gameFrame.src = game.url;
      gameFrame.classList.remove('hidden');
    });
    gamesList.appendChild(card);
  });

  // Sync settings engine dropdown
  const settingEngine = document.getElementById('setting-engine');
  const browserEngine = document.getElementById('engine-select');
  if (settingEngine && browserEngine) {
    settingEngine.innerHTML = browserEngine.innerHTML;
    settingEngine.addEventListener('change', () => { browserEngine.value = settingEngine.value; });
  }

  // Initialize
  loadSettings();
})();
