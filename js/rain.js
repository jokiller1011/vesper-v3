(function initRain() {
  const canvas = document.getElementById('rain-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Two layers for depth: far (slow, faint) and near (fast, bright)
  const layers = [
    { count: 90, speedMin: 8, speedMax: 14, lenMin: 12, lenMax: 22, alpha: 0.12, width: 0.8 },
    { count: 60, speedMin: 16, speedMax: 26, lenMin: 20, lenMax: 40, alpha: 0.25, width: 1.2 }
  ];

  const drops = [];
  layers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        len: layer.lenMin + Math.random() * (layer.lenMax - layer.lenMin),
        speed: layer.speedMin + Math.random() * (layer.speedMax - layer.speedMin),
        alpha: layer.alpha + Math.random() * 0.05,
        width: layer.width,
        wind: (Math.random() - 0.5) * 0.6
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const d of drops) {
      const gradient = ctx.createLinearGradient(d.x, d.y, d.x + d.wind * d.len * 0.02, d.y + d.len);
      gradient.addColorStop(0, `rgba(160, 190, 255, 0)`);
      gradient.addColorStop(0.35, `rgba(160, 190, 255, ${d.alpha})`);
      gradient.addColorStop(1, `rgba(200, 220, 255, ${d.alpha * 1.4})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = d.width;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.wind * d.len * 0.02, d.y + d.len);
      ctx.stroke();

      d.y += d.speed;
      d.x += d.wind;

      if (d.y > h + d.len) {
        d.y = -d.len - Math.random() * 40;
        d.x = Math.random() * w;
      }
      if (d.x < -20) d.x = w + 20;
      if (d.x > w + 20) d.x = -20;
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
