(function initApp() {
  // --- Tab Switching (Sidebar) ---
  const sidebarBtns = document.querySelectorAll('.sidebar-nav-top button, .sidebar-nav-bottom button');
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

  // --- Tab Bar Functionality (Right Sidebar) ---
  const tabBar = document.getElementById('tab-bar');
  const newTabBtn = document.getElementById('new-tab-btn');
  let tabCount = 1;

  newTabBtn.addEventListener('click', () => {
    // Switch to home tab as a "new tab" simulation
    document.querySelector('[data-tab="home"]').click();

    const newTabEl = document.createElement('div');
    newTabEl.className = 'browser-tab';
    newTabEl.dataset.tabId = tabCount;
    newTabEl.innerHTML = `
      <span>New Tab ${tabCount}</span>
      <button class="close-tab" aria-label="Close tab">×</button>
    `;
    tabCount++;

    document.querySelectorAll('.browser-tab').forEach(t => t.classList.remove('active'));
    newTabEl.classList.add('active');
    tabBar.appendChild(newTabEl); // Append to the vertical tab bar

    // Add close listener to new tab
    newTabEl.querySelector('.close-tab').addEventListener('click', (e) => {
      e.stopPropagation();
      newTabEl.remove();
      // Optional: Switch to the last remaining tab
      const remainingTabs = document.querySelectorAll('.browser-tab');
      if (remainingTabs.length > 0) {
        remainingTabs[remainingTabs.length - 1].classList.add('active');
      }
    });
  });

  // --- Settings Management (Fully Functional) ---
  function loadSettings() {
    // Theme Color
    const savedColor = localStorage.getItem('vesper-theme');
    if (savedColor) {
      document.documentElement.style.setProperty('--accent', savedColor);
      document.getElementById('theme-color').value = savedColor;
    }

    // Proxy toggles
    const toggleIds = ['close-prevention', 'block-prevention', 'source-random', 'url-encoding', 'tor', 'about-blank', 'click-off'];
    toggleIds.forEach(id => {
      const el = document.getElementById(`setting-${id}`) || document.getElementById(`cloak-${id}`);
      if (el) {
        const saved = localStorage.getItem(`vesper-${id}`);
        if (saved !== null) el.checked = saved === 'true';
        el.addEventListener('change', () => {
          localStorage.setItem(`vesper-${id}`, el.checked);
          if (id === 'click-off') applyClickOffCloak(el.checked);
        });
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

  // Click-Off Cloaking Logic
  function applyClickOffCloak(enabled) {
    if (enabled) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.location.href = 'https://google.com';
        }
      });
    }
  }

  // Theme color listener
  const themeColor = document.getElementById('theme-color');
  if (themeColor) {
    themeColor.addEventListener('input', () => {
      document.documentElement.style.setProperty('--accent', themeColor.value);
      localStorage.setItem('vesper-theme', themeColor.value);
    });
  }

  // --- Load Games (GN-Math) ---
  const gamesList = document.getElementById('games-list');
  const gameFrame = document.getElementById('game-frame');
  const games = [
    { name: 'Geometry Dash', url: 'https://gmtmath.github.io/geometry-dash/' },
    { name: 'The Impossible Quiz', url: 'https://gmtmath.github.io/impossible-quiz/' },
    { name: 'World\'s Hardest Game', url: 'https://gmtmath.github.io/worlds-hardest-game/' },
    { name: 'Drive Mad', url: 'https://gmtmath.github.io/drive-mad/' }
  ];

  if (gamesList) {
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
  }

  // --- Load Media (Free APIs, No Keys) ---
  async function loadMedia() {
    const mediaResults = document.getElementById('media-results');
    if (!mediaResults) return;
    mediaResults.innerHTML = '<p class="muted-text">Loading...</p>';

    try {
      // iTunes Search API for movies (free, no auth)
      const movieRes = await fetch('https://itunes.apple.com/search?term=star+wars&media=movie&limit=10');
      const movieData = await movieRes.json();

      // TVmaze API for TV shows (free, no auth)
      const tvRes = await fetch('https://api.tvmaze.com/search/shows?q=star');
      const tvData = await tvRes.json();

      mediaResults.innerHTML = '';

      // Render Movies
      movieData.results.forEach(m => {
        const div = document.createElement('div');
        div.className = 'media-card';
        div.innerHTML = `
          <h3>${m.trackName}</h3>
          <p>${m.primaryGenreName} (${new Date(m.releaseDate).getFullYear()})</p>
        `;
        mediaResults.appendChild(div);
      });

      // Render TV Shows
      tvData.forEach(t => {
        const div = document.createElement('div');
        div.className = 'media-card';
        div.innerHTML = `
          <h3>${t.show.name}</h3>
          <p>${t.show.genres.join(', ')} (${t.show.premiered ? t.show.premiered.substring(0, 4) : 'N/A'})</p>
        `;
        mediaResults.appendChild(div);
      });

    } catch (e) {
      mediaResults.innerHTML = '<p class="muted-text">Failed to load media.</p>';
    }
  }

  // Load media when tab is clicked
  document.querySelector('[data-tab="media"]').addEventListener('click', loadMedia);

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
