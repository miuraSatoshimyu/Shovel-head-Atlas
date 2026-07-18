import { initRouter } from './router.js';

const viewer = document.querySelector('#viewer');
const panel = document.querySelector('#detail-panel');
const panelClose = panel.querySelector('.panel-close');

async function loadSvg(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`SVG load failed: ${path}`);
  return await res.text();
}

async function renderSideView() {
  try {
    const svg = await loadSvg('./assets/svg/engine-side.svg');
    viewer.innerHTML = svg;
    bindSystemClicks();
  } catch (err) {
    viewer.innerHTML = `<div class="not-found">エンジン図を読み込めませんでした: ${err.message}</div>`;
  }
}

async function renderSystemView(system) {
  try {
    const svg = await loadSvg(`./assets/svg/system-${system}.svg`);
    viewer.innerHTML = `<div class="viewer-back" role="button" tabindex="0">← エンジン全体に戻る</div>` + svg;
    bindBackButton();
    bindPartClicks();
  } catch (err) {
    viewer.innerHTML = `<div class="not-found">${system} の分解図はまだ用意されていません (Phase 1 以降で追加予定)。<br><span class="viewer-back" role="button" tabindex="0">← エンジン全体に戻る</span></div>`;
    bindBackButton();
  }
}

function bindSystemClicks() {
  const groups = viewer.querySelectorAll('[data-system]');
  groups.forEach(g => {
    const trigger = () => {
      const system = g.getAttribute('data-system');
      location.hash = `#/${system}`;
    };
    g.addEventListener('click', trigger);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });
}

function bindPartClicks() {
  const groups = viewer.querySelectorAll('[data-part-id]');
  groups.forEach(g => {
    const trigger = () => {
      const partId = g.getAttribute('data-part-id');
      const currentSystem = location.hash.split('/')[1] || 'lubrication';
      location.hash = `#/${currentSystem}/${partId}`;
    };
    g.addEventListener('click', trigger);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });
}

function bindBackButton() {
  const back = viewer.querySelector('.viewer-back');
  if (!back) return;
  const go = () => { location.hash = '#/'; };
  back.addEventListener('click', go);
  back.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
  });
}

panelClose.addEventListener('click', () => {
  panel.setAttribute('data-open', 'false');
});

initRouter({
  renderSideView,
  renderSystemView,
  panel,
});
