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

  const drops = [];
  const NUM_DROPS = 150;

  for (let i = 0; i < NUM_DROPS; i++) {
    drops.push({
      x: Math.random() * w,
      y: Math.random() * h,
      len: Math.random() * 20 + 10,
      speed: Math.random() * 4 + 4,
      opacity: Math.random() * 0.3 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(150, 180, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    for (const d of drops) {
      ctx.globalAlpha = d.opacity;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.len);
      ctx.stroke();

      d.y += d.speed;
      if (d.y > h) {
        d.y = -d.len;
        d.x = Math.random() * w;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
