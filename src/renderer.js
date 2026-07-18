const template = document.querySelector('#part-card');

export function renderEmpty(panel) {
  const inner = panel.querySelector('.panel-inner');
  inner.innerHTML = '<p class="panel-empty">系統またはパーツをクリックすると詳細が表示されます。</p>';
}

export function renderNotFound(panel, partId) {
  const inner = panel.querySelector('.panel-inner');
  inner.innerHTML = `<div class="not-found">パーツ「${escapeHtml(partId)}」は見つかりませんでした。<br>URLを確認するか、エンジン全体に戻ってください。</div>`;
}

export function renderPart(panel, data) {
  const inner = panel.querySelector('.panel-inner');
  const card = template.content.cloneNode(true);

  card.querySelector('.part-name-ja').textContent = data.names.ja;
  card.querySelector('.part-name-en').textContent = data.names.en;
  card.querySelector('.part-system').textContent = `system: ${data.system}`;

  // Variants
  const vbody = card.querySelector('.variants-body');
  data.variants.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.years[0]}–${v.years[1]}</td>
      <td>${v.oem_numbers.map(o => `<span class="oem">${escapeHtml(o)}</span>`).join('<br>')}</td>
      <td>${escapeHtml(v.notes_ja || '')}</td>
    `;
    vbody.appendChild(tr);
  });

  // History
  card.querySelector('.history').textContent = data.history_ja || '(未記載)';

  // Failure modes
  const fList = card.querySelector('.failure-modes');
  if (data.failure_modes.length === 0) {
    fList.innerHTML = '<li class="failure-mode"><p class="failure-mode-summary">(未記載)</p></li>';
  } else {
    data.failure_modes.forEach(fm => {
      const li = document.createElement('li');
      li.className = `failure-mode severity-${fm.severity}`;
      li.innerHTML = `
        <h4 class="failure-mode-title">${escapeHtml(fm.title_ja)}<span class="severity-badge ${fm.severity}">${fm.severity}</span></h4>
        <p class="failure-mode-meta">対象年式: ${fm.years_affected[0]}–${fm.years_affected[1]}${fm.confidence ? ` · 信頼度: ${fm.confidence}` : ''}</p>
        <p class="failure-mode-summary">${escapeHtml(fm.summary_ja)}</p>
        <ul class="failure-mode-sources">
          ${fm.sources.map(s => `<li>[${escapeHtml(s.lang)}] <a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)}</a> <span style="color:#888">(${escapeHtml(s.accessed)})</span></li>`).join('')}
        </ul>
      `;
      fList.appendChild(li);
    });
  }

  // Availability
  card.querySelector('.availability').textContent = data.parts_availability_ja || '(未記載)';

  // Links
  const lList = card.querySelector('.links');
  if (data.links.length === 0) {
    lList.innerHTML = '<li class="link-item">(未記載)</li>';
  } else {
    data.links.forEach(l => {
      const li = document.createElement('li');
      li.className = 'link-item';
      li.innerHTML = `<span class="link-type">${escapeHtml(l.type)}</span>[${escapeHtml(l.lang)}] <a href="${safeUrl(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.title)}</a>`;
      lList.appendChild(li);
    });
  }

  // Confidence
  const cNote = card.querySelector('.confidence-note');
  if (data.confidence === 'low') {
    cNote.textContent = '⚠ このパーツの情報は Phase 0 プレースホルダです。Phase 1 で /research-part により実データに置換されます。';
  } else if (data.confidence) {
    cNote.textContent = `情報の全体信頼度: ${data.confidence}`;
  } else {
    cNote.remove();
  }

  inner.innerHTML = '';
  inner.appendChild(card);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(u) {
  try {
    const parsed = new URL(u, location.href);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return escapeHtml(parsed.href);
  } catch { /* fallthrough */ }
  return '#';
}
