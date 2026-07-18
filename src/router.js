import { renderPart, renderEmpty, renderNotFound } from './renderer.js';

let ctx = null;
let currentView = null;

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  if (!raw) return { view: 'home' };
  const [system, partId] = raw.split('/').filter(Boolean);
  if (!system) return { view: 'home' };
  if (!partId) return { view: 'system', system };
  return { view: 'part', system, partId };
}

async function loadPart(partId) {
  const res = await fetch(`./data/parts/${partId}.json`);
  if (!res.ok) throw new Error(`part not found: ${partId}`);
  return await res.json();
}

async function route() {
  const { view, system, partId } = parseHash();

  if (view === 'home') {
    if (currentView !== 'home') {
      await ctx.renderSideView();
      currentView = 'home';
    }
    renderEmpty(ctx.panel);
    ctx.panel.setAttribute('data-open', 'false');
    return;
  }

  if (view === 'system') {
    if (currentView !== `system:${system}`) {
      await ctx.renderSystemView(system);
      currentView = `system:${system}`;
    }
    renderEmpty(ctx.panel);
    ctx.panel.setAttribute('data-open', 'false');
    return;
  }

  if (view === 'part') {
    if (currentView !== `system:${system}`) {
      await ctx.renderSystemView(system);
      currentView = `system:${system}`;
    }
    try {
      const data = await loadPart(partId);
      renderPart(ctx.panel, data);
      ctx.panel.setAttribute('data-open', 'true');
    } catch (err) {
      renderNotFound(ctx.panel, partId);
      ctx.panel.setAttribute('data-open', 'true');
    }
  }
}

export function initRouter(context) {
  ctx = context;
  window.addEventListener('hashchange', route);
  route();
}
