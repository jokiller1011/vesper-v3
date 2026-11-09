(function initApp() {
  // --- Tab Switching ---
  const sidebarBtns = document.querySelectorAll('.sidebar-nav button');
  const tabs = document.querySelectorAll('.tab');
  const dock = document.getElementById('dynamic-dock');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabs.forEach(t => t.classList.add('hidden'));
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.remove('hidden');
      if (dock) dock.style.display = btn.dataset.tab === 'home' ? 'flex' : 'none';
    });
  });

  // --- Tab Bar (Simplified) ---
  const tabBar = document.getElementById('tab-bar');
  const newTabBtn = document.getElementById('new-tab-btn');
  let tabCount = 1;
  newTabBtn.addEventListener('click', () => {
    document.querySelector('[data-tab="home"]').click();
    const newTabEl = document.createElement('div');
    newTabEl.className = 'browser-tab';
    newTabEl.innerHTML = `<span>New Tab ${tabCount++}</span><button class="close-tab">×</button>`;
    document.querySelectorAll('.browser-tab').forEach(t => t.classList.remove('active'));
    newTabEl.classList.add('active');
    tabBar.appendChild(newTabEl);
    newTabEl.querySelector('.close-tab').addEventListener('click', (e) => {
      e.stopPropagation();
      newTabEl.remove();
      const remaining = document.querySelectorAll('.browser-tab');
      if (remaining.length) remaining[remaining.length - 1].classList.add('active');
    });
  });

  // --- Settings (Sliders, Background, Account) ---
  function loadSettings() {
    // Theme Color
    const savedColor = localStorage.getItem('vesper-theme');
    if (savedColor) {
      document.documentElement.style.setProperty('--accent', savedColor);
      document.getElementById('theme-color').value = savedColor;
    }

    // Sliders (Close Prevention, Block Prevention, etc.)
    const sliderIds = ['close-prevention', 'block-prevention', 'source-random', 'url-encoding', 'tor', 'about-blank', 'click-off'];
    sliderIds.forEach(id => {
      const el = document.getElementById(`setting-${id}`) || document.getElementById(`cloak-${id}`);
      if (el) {
        const saved = localStorage.getItem(`vesper-${id}`);
        if (saved !== null) el.value = saved;
        el.addEventListener('input', () => {
          localStorage.setItem(`vesper-${id}`, el.value);
          if (id === 'click-off') applyClickOffCloak(el.value === '1');
        });
      }
    });

    // Tab Cloaking
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

    // Background Switcher
    const bgSelect = document.getElementById('background-select');
    if (bgSelect) {
      const savedBg = localStorage.getItem('vesper-bg') || 'default';
      bgSelect.value = savedBg;
      applyBackground(savedBg);
      bgSelect.addEventListener('change', () => {
        localStorage.setItem('vesper-bg', bgSelect.value);
        applyBackground(bgSelect.value);
      });
    }

    // Username (Account Settings)
    const usernameInput = document.getElementById('setting-username');
    const savedUsername = localStorage.getItem('vesper-username');
    if (savedUsername && usernameInput) usernameInput.value = savedUsername;
    document.getElementById('save-username')?.addEventListener('click', () => {
      if (usernameInput) localStorage.setItem('vesper-username', usernameInput.value);
    });
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
      if (link) link.href = 'assets/images/vesper-v.png';
    }
  }

  function applyClickOffCloak(enabled) {
    if (enabled) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) window.location.href = 'https://google.com';
      });
    }
  }

  function applyBackground(val) {
    document.body.classList.remove('bg-default', 'bg-bg1', 'bg-bg2');
    if (val === 'bg1') document.body.classList.add('bg-bg1');
    else if (val === 'bg2') document.body.classList.add('bg-bg2');
    else document.body.classList.add('bg-default');
  }

  // Theme color listener
  const themeColor = document.getElementById('theme-color');
  if (themeColor) {
    themeColor.addEventListener('input', () => {
      document.documentElement.style.setProperty('--accent', themeColor.value);
      localStorage.setItem('vesper-theme', themeColor.value);
    });
  }

  // --- Games (Fetch Real List from GN-Math) ---
  const gamesList = document.getElementById('games-list');
  const gameFrame = document.getElementById('game-frame');
  async function loadGames() {
    try {
      // Fetch the raw game list from the GN-Math repository
      const res = await fetch('https://raw.githubusercontent.com/genizy/web-port/main/games.json'); // Adjust URL if needed
      const games = await res.json(); // Assuming a JSON format
      
      gamesList.innerHTML = '';
      games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.textContent = game.name;
        card.addEventListener('click', () => {
          // Proxy the game URL
          gameFrame.src = `${window.location.origin}/bare/uv/${encodeURIComponent(game.url)}`;
          gameFrame.classList.remove('hidden');
        });
        gamesList.appendChild(card);
      });
    } catch (e) {
      // Fallback to default games
      const fallbackGames = [
        { name: 'Geometry Dash', url: 'https://gmtmath.github.io/geometry-dash/' },
        { name: 'The Impossible Quiz', url: 'https://gmtmath.github.io/impossible-quiz/' },
        { name: 'World\'s Hardest Game', url: 'https://gmtmath.github.io/worlds-hardest-game/' },
        { name: 'Drive Mad', url: 'https://gmtmath.github.io/drive-mad/' }
      ];
      gamesList.innerHTML = '';
      fallbackGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.textContent = game.name;
        card.addEventListener('click', () => {
          gameFrame.src = `${window.location.origin}/bare/uv/${encodeURIComponent(game.url)}`;
          gameFrame.classList.remove('hidden');
        });
        gamesList.appendChild(card);
      });
    }
  }

  // --- Media (Working APIs) ---
  async function loadMedia() {
    const mediaResults = document.getElementById('media-results');
    if (!mediaResults) return;
    mediaResults.innerHTML = '<p class="muted-text">Loading...</p>';
    try {
      const movieRes = await fetch('https://itunes.apple.com/search?term=star+wars&media=movie&limit=10');
      const movieData = await movieRes.json();
      const tvRes = await fetch('https://api.tvmaze.com/search/shows?q=star');
      const tvData = await tvRes.json();
      
      mediaResults.innerHTML = '';
      movieData.results.forEach(m => {
        const div = document.createElement('div');
        div.className = 'media-card';
        div.innerHTML = `<h3>${m.trackName}</h3><p>${m.primaryGenreName} (${new Date(m.releaseDate).getFullYear()})</p>`;
        mediaResults.appendChild(div);
      });
      tvData.forEach(t => {
        const div = document.createElement('div');
        div.className = 'media-card';
        div.innerHTML = `<h3>${t.show.name}</h3><p>${t.show.genres.join(', ')} (${t.show.premiered ? t.show.premiered.substring(0, 4) : 'N/A'})</p>`;
        mediaResults.appendChild(div);
      });
    } catch (e) {
      mediaResults.innerHTML = '<p class="muted-text">Failed to load media.</p>';
    }
  }

  // Event Listeners for Tabs
  document.querySelector('[data-tab="games"]').addEventListener('click', loadGames);
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
