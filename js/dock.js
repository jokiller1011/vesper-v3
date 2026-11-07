(function initDock() {
  const dockItems = document.querySelectorAll('.dock-item');
  dockItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      dockItems.forEach(other => {
        if (other !== item) {
          other.style.transform = 'scale(0.9) translateY(4px)';
        }
      });
    });
    item.addEventListener('mouseleave', () => {
      dockItems.forEach(other => {
        other.style.transform = '';
      });
    });
  });
})();
