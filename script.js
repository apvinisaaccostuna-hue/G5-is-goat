const coinSymbols = ['$', '¢', '🪙'];
let activeRain = null;

function dropCash() {
  // Ignore repeat clicks until the current effect has been cleaned up.
  if (activeRain) return;

  const layer = document.createElement('div');
  layer.className = 'cash-rain';
  layer.setAttribute('aria-hidden', 'true');
  const pieces = document.createDocumentFragment();

  for (let i = 0; i < 180; i += 1) {
    const isBill = i % 3 === 0;
    const piece = document.createElement('span');
    piece.className = `money-drop ${isBill ? 'money-bill' : 'money-coin'}`;
    piece.textContent = isBill ? '$' : coinSymbols[i % coinSymbols.length];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.animationDuration = `${2.5 + Math.random() * 0.6}s`;
    piece.style.setProperty('--spin', `${Math.random() > 0.5 ? 1 : -1}turn`);
    piece.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
    pieces.appendChild(piece);
  }

  layer.appendChild(pieces);
  document.body.appendChild(layer);
  activeRain = window.setTimeout(() => {
    layer.remove();
    activeRain = null;
  }, 4000);
}

document.querySelectorAll('.cash-button').forEach((button) => {
  button.addEventListener('click', dropCash);
});

document.querySelectorAll('.coin').forEach((coin) => {
  coin.addEventListener('click', () => {
    coin.classList.remove('is-shining');
    void coin.offsetWidth;
    coin.classList.add('is-shining');
    window.setTimeout(() => coin.classList.remove('is-shining'), 850);
  });
});

// Play a quick money-rip effect before navigating to another local page.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.target && link.target !== '_self' || link.hasAttribute('download')) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;

  event.preventDefault();
  if (document.querySelector('.page-transition')) return;

  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="ripped-bill"><span class="bill-half bill-left">$</span><span class="bill-half bill-right">$</span></div>';
  document.body.appendChild(overlay);
  window.setTimeout(() => window.location.assign(destination.href), 620);
});
