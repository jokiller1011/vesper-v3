(function initApp() {
  // Tab switching
  const sidebarBtns = document.querySelectorAll('.pill-sidebar button');
  const tabs = document.querySelectorAll('.tab');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabs.forEach(t => t.classList.add('hidden'));
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.remove('hidden');

      // Hide dock when not on home
      const dock = document.getElementById('dynamic-dock');
      dock.style.display = btn.dataset.tab === 'home' ? 'flex' : 'none';
    });
  });

  // Games: load GN-Math games
  const gamesList = document.getElementById('games-list');
  const gameFrame = document.getElementById('game-frame');
  const GN_MATH_BASE = 'https://gmtmath.github.io/';

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

  // Settings: sync engine selector
  const settingEngine = document.getElementById('setting-engine');
  const browserEngine = document.getElementById('engine-select');
  if (settingEngine && browserEngine) {
    // Copy options
    settingEngine.innerHTML = browserEngine.innerHTML;
    settingEngine.addEventListener('change', () => {
      browserEngine.value = settingEngine.value;
    });
  }

  // Theme color
  const themeColor = document.getElementById('theme-color');
  themeColor.addEventListener('input', () => {
    document.documentElement.style.setProperty('--accent', themeColor.value);
  });

  // Tab cloaking
  const cloakSelect = document.getElementById('cloak-select');
  const cloaks = {
    'google-classroom': { title: 'Classroom', favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
    'google-drive': { title: 'My Drive - Google Drive', favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' },
    'ixl': { title: 'IXL | Math, Language Arts, Science, Social Studies, and Spanish', favicon: 'https://www.ixl.com/favicon.ico' },
    'canvas': { title: 'Dashboard', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' }
  };
  cloakSelect.addEventListener('change', () => {
    const c = cloaks[cloakSelect.value];
    if (c) {
      document.title = c.title;
      const link = document.querySelector('link[rel="icon"]');
      if (link) link.href = c.favicon;
    }
  });

  // About:Blank cloaking (simplified)
  const aboutBlankCheck = document.getElementById('cloak-about-blank');
  aboutBlankCheck.addEventListener('change', () => {
    if (aboutBlankCheck.checked) {
      // In production, you would open a new window and write the proxy into it.
      console.log('About:Blank cloaking enabled');
    }
  });

  // Click-off cloaking
  const clickOffCheck = document.getElementById('cloak-click-off');
  clickOffCheck.addEventListener('change', () => {
    if (clickOffCheck.checked) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.location.href = 'https://google.com';
        }
      });
    }
  });

  // Initialize: hide dock initially if not on home (but home is default)
  document.getElementById('dynamic-dock').style.display = 'flex';
})();
