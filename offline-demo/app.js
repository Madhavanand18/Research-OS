/**
 * ResearchOS Offline Demo — app.js
 * All rendering, navigation, simulation, and interactivity.
 * Runs entirely from file:// without network requests.
 */

// ============================================================ STATE
let currentProjectId = DEMO_PROJECTS[0].id;
let currentView = 'new';
let sourceFilterType = 'all';
let kgTransform = { x: 0, y: 0, scale: 1 };
let kgDragging = false;
let kgDragStart = null;
let kgSimRunning = false;
let selectedDepth = 'comprehensive';

// ============================================================ UTILITY

function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

function showToast(msg, duration = 2200) {
  const t = qs('#toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, duration);
}

function updateCharCount() {
  const v = (qs('#query-input').value || '').length;
  qs('#char-count').textContent = v + ' chars';
}

function setQuery(q) {
  qs('#query-input').value = q;
  updateCharCount();
}

function setAsk(q) {
  qs('#ask-input').value = q;
  submitAsk();
}

// ============================================================ NAVIGATION

const NAV_IDS = ['new', 'projects', 'workspace', 'dashboard', 'sources', 'knowledge', 'report'];
const PROJECT_NAV = ['workspace', 'dashboard', 'sources', 'knowledge', 'report'];

function showView(id) {
  currentView = id;
  NAV_IDS.forEach(v => {
    const panel = qs('#view-' + v);
    const btn = qs('#nav-' + v);
    if (panel) panel.classList.toggle('active', v === id);
    if (btn) btn.classList.toggle('active', v === id);
  });
  if (id === 'projects') renderProjects();
  if (id === 'sources') renderSources();
  if (id === 'knowledge') renderKnowledgeGraph();
  if (id === 'report') renderReport();
  if (id === 'dashboard') renderDashboard();
}

function setProjectNavVisible(visible) {
  PROJECT_NAV.forEach(id => {
    const btn = qs('#nav-' + id);
    if (btn) btn.classList.toggle('hidden', !visible);
  });
}

function selectDepth(d) {
  selectedDepth = d;
  ['quick', 'deep', 'comprehensive'].forEach(x => {
    qs('#depth-' + x).classList.toggle('selected', x === d);
  });
}

// ============================================================ PROJECTS VIEW

function renderProjects() {
  const container = qs('#projects-list');
  container.innerHTML = '';
  DEMO_PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div>
        <div class="project-badge-row">
          <span style="font-size:10px;font-weight:700;background:#ecfdf5;color:#047857;border:1px solid #d1fae5;padding:2px 8px;border-radius:4px;text-transform:uppercase;">Completed</span>
          <span style="font-size:10.5px;color:#64748b;">${new Date(p.created_at).toLocaleDateString()}</span>
        </div>
        <div class="project-title">${p.title}</div>
        <div class="project-summary">${p.summary}</div>
      </div>
      <div class="project-stats-row">
        <span>📄 ${p.sources.length} Sources</span>
        <span>🎓 ${p.academic_papers.length} Papers</span>
        <span>📊 ${p.statistics.length} Stats</span>
        <span>⭐ ${p.quality_score}/10</span>
      </div>
    `;
    card.addEventListener('click', () => openProject(p.id));
    container.appendChild(card);
  });
}

function openProject(id) {
  currentProjectId = id;
  setProjectNavVisible(true);
  showView('dashboard');
}

// ============================================================ RESEARCH SIMULATION

const PIPELINE_STAGES = ['Planning', 'Web Discovery', 'Academic Discovery', 'Reading', 'Evidence Extraction', 'Statistics Extraction', 'Knowledge Graph', 'Contradictions', 'Synthesis', 'Report'];

function startResearch() {
  const q = (qs('#query-input').value || '').trim();
  if (!q) { showToast('Please enter a research question.'); return; }

  // Find matching demo project or fall back
  let project = DEMO_PROJECTS.find(p =>
    p.research_question.toLowerCase().includes(q.toLowerCase().substring(0, 30)) ||
    q.toLowerCase().includes(p.research_question.toLowerCase().substring(0, 30))
  ) || DEMO_PROJECTS[0];

  currentProjectId = project.id;
  setProjectNavVisible(true);
  showView('workspace');
  runWorkspaceSimulation(project);
}

function runWorkspaceSimulation(project) {
  // Workspace banner
  qs('#ws-question-title').textContent = project.research_question;
  qs('#ws-depth-badge').textContent = (selectedDepth.charAt(0).toUpperCase() + selectedDepth.slice(1)) + ' Investigation';

  // Status badge: running
  const statusBadge = qs('#ws-status-badge');
  statusBadge.innerHTML = '<span class="spinner"></span> Running Pipeline';
  statusBadge.style.cssText = 'font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;display:flex;align-items:center;gap:6px;';

  // Hide "Open Dashboard" button
  qs('#ws-open-dashboard').classList.add('hidden');

  // Init pipeline stages
  const pipelineEl = qs('#pipeline-stages');
  pipelineEl.innerHTML = '';
  PIPELINE_STAGES.forEach(stage => {
    const el = document.createElement('div');
    el.className = 'pipeline-stage';
    el.id = 'stage-' + stage.replace(/\s+/g, '-');
    el.innerHTML = `<span class="stage-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="2 2"/></svg></span><span>${stage}</span>`;
    pipelineEl.appendChild(el);
  });

  // Init metrics
  const metricsEl = qs('#live-metrics');
  metricsEl.innerHTML = '';
  const metricDefs = [
    { label: 'Sources Discovered', key: 'sources', icon: '🔗' },
    { label: 'Academic Papers', key: 'academic', icon: '📚' },
    { label: 'Extracted Claims', key: 'claims', icon: '📋' },
    { label: 'Evidence Units', key: 'evidence', icon: '🔬' },
    { label: 'Statistics Gathered', key: 'stats', icon: '📊' },
    { label: 'Identified Entities', key: 'entities', icon: '🏷️' },
    { label: 'Contradictions', key: 'contradictions', icon: '⚡' },
    { label: 'Research Gaps', key: 'gaps', icon: '🔭' },
  ];
  const metricTargets = {
    sources: project.sources.length,
    academic: project.academic_papers.length,
    claims: project.claims.length,
    evidence: project.evidence.length,
    stats: project.statistics.length,
    entities: project.entities.length,
    contradictions: project.contradictions.length,
    gaps: project.research_gaps.length
  };

  metricDefs.forEach(m => {
    const tile = document.createElement('div');
    tile.className = 'metric-tile';
    tile.innerHTML = `
      <div class="metric-tile-label">${m.icon} ${m.label}</div>
      <span class="metric-tile-val" id="metric-${m.key}">0</span>
    `;
    metricsEl.appendChild(tile);
  });

  // Clear terminal
  const terminal = qs('#terminal-log');
  terminal.innerHTML = '';
  let eventCount = 0;

  function logEvent(stage, message, timestamp) {
    eventCount++;
    qs('#event-count-badge').textContent = eventCount + ' events logged';
    const ev = document.createElement('div');
    ev.className = 'terminal-event';
    ev.innerHTML = `
      <div class="terminal-event-meta">
        <span class="terminal-stage-tag">[${stage}]</span>
        <span>${timestamp || new Date().toLocaleTimeString()}</span>
      </div>
      <div class="terminal-message">${message}</div>
    `;
    terminal.appendChild(ev);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function markStagePassed(stageName) {
    const el = qs('#stage-' + stageName.replace(/\s+/g, '-'));
    if (!el) return;
    el.className = 'pipeline-stage passed';
    el.innerHTML = `<span class="stage-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span><span>${stageName}</span>`;
  }

  function markStageActive(stageName) {
    const el = qs('#stage-' + stageName.replace(/\s+/g, '-'));
    if (!el) return;
    el.className = 'pipeline-stage active';
    el.innerHTML = `<span class="stage-icon"><span class="spinner"></span></span><span>${stageName}</span>`;
  }

  // Run simulated events
  const events = project.simulation_events;
  let passedStages = new Set();

  let cumDelay = 0;
  events.forEach((ev, idx) => {
    cumDelay += ev.delayMs;
    setTimeout(() => {
      markStageActive(ev.stage);
      logEvent(ev.stage, ev.message);

      // Animate metric counters progressively
      if (ev.stage !== 'Planning' && ev.stage !== 'Complete') {
        Object.keys(metricTargets).forEach(key => {
          const target = metricTargets[key];
          const el = qs('#metric-' + key);
          if (el) {
            const current = parseInt(el.textContent) || 0;
            const fraction = Math.min(current + Math.ceil(target / events.length), target);
            el.textContent = fraction;
          }
        });
      }

      if (idx > 0) markStagePassed(events[idx - 1].stage);
      passedStages.add(ev.stage);

      // Last event
      if (idx === events.length - 1) {
        setTimeout(() => {
          // Mark all stages passed
          PIPELINE_STAGES.forEach(s => markStagePassed(s));
          // Set all metrics to final
          Object.keys(metricTargets).forEach(key => {
            const el = qs('#metric-' + key);
            if (el) el.textContent = metricTargets[key];
          });
          // Update status badge
          statusBadge.innerHTML = '✓ Completed';
          statusBadge.style.cssText = 'font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;background:#ecfdf5;color:#047857;border:1px solid #d1fae5;';
          // Show open dashboard button
          qs('#ws-open-dashboard').classList.remove('hidden');
          // Stop live pulse animation
          const pd = qs('#live-pulse');
          if (pd) pd.style.animationPlayState = 'paused';
        }, 300);
      }
    }, cumDelay);
  });
}

// ============================================================ DASHBOARD

function renderDashboard() {
  const project = getDemoProject(currentProjectId);

  qs('#dash-title').textContent = project.research_question;
  qs('#dash-summary').textContent = project.summary;
  qs('#quality-badge').textContent = `Quality Score: ${project.quality_score}/10`;

  // 8-metrics strip
  const strip = qs('#metrics-strip');
  const metrics = [
    { label: 'Sources', val: project.sources.length },
    { label: 'Academic', val: project.academic_papers.length },
    { label: 'Claims', val: project.claims.length },
    { label: 'Evidence', val: project.evidence.length },
    { label: 'Statistics', val: project.statistics.length },
    { label: 'Entities', val: project.entities.length },
    { label: 'Contradictions', val: project.contradictions.length },
    { label: 'Gaps', val: project.research_gaps.length }
  ];
  strip.innerHTML = metrics.map(m => `
    <div class="strip-item">
      <div class="strip-label">${m.label}</div>
      <div class="strip-val">${m.val}</div>
    </div>
  `).join('');

  // Draw chart (native SVG + canvas-free approach)
  drawStatsChart(project.statistics);

  // Stat mini cards
  const miniGrid = qs('#stat-mini-grid');
  miniGrid.innerHTML = project.statistics.slice(0, 4).map(s => `
    <div class="stat-mini-card">
      <div class="stat-mini-metric">${s.metric}</div>
      <div class="stat-mini-val">${s.value_display}</div>
      <div class="stat-mini-geo">${s.geography ? s.geography + ' · ' : ''}${s.year || ''}</div>
    </div>
  `).join('');

  // Contradictions
  qs('#con-count').textContent = project.contradictions.length;
  qs('#contradictions-list').innerHTML = project.contradictions.map(c => `
    <div class="contradiction-card">
      <div class="contradiction-title">⚡ ${c.topic}</div>
      <div class="contradiction-pos"><strong>Perspective A:</strong> ${c.position_a}</div>
      <div class="contradiction-pos"><strong>Perspective B:</strong> ${c.position_b}</div>
      ${c.likely_explanation ? `<div class="contradiction-exp">Explanation: ${c.likely_explanation}</div>` : ''}
    </div>
  `).join('');

  // Gaps
  qs('#gaps-count').textContent = project.research_gaps.length;
  qs('#gaps-list').innerHTML = project.research_gaps.map(g => `
    <div class="gap-card">
      <div class="gap-desc">${g.gap_description}</div>
      ${g.suggested_query ? `<div class="gap-query">Query: ${g.suggested_query}</div>` : ''}
    </div>
  `).join('');

  // Claims
  qs('#claims-count').textContent = project.claims.length;
  qs('#claims-list').innerHTML = project.claims.map((cl, i) => `
    <div class="claim-card">
      <div class="claim-header">
        <span class="claim-tag">Claim #${i + 1}</span>
        <span class="claim-conf">Confidence ${Math.round(cl.confidence * 100)}%</span>
      </div>
      <div class="claim-text">${cl.claim_text}</div>
      ${cl.topic ? `<div class="claim-topic">Topic: ${cl.topic}</div>` : ''}
    </div>
  `).join('');

  // Timeline
  qs('#timeline-count').textContent = project.timeline.length;
  qs('#timeline-list').innerHTML = project.timeline.map(t => `
    <div class="timeline-item">
      <div class="timeline-date">${t.date}</div>
      <div class="timeline-title">${t.title}</div>
      <div class="timeline-desc">${t.description}</div>
    </div>
  `).join('');

  // Academic papers on dashboard
  qs('#papers-count').textContent = project.academic_papers.length;
  qs('#papers-grid').innerHTML = renderPaperCards(project.academic_papers);
}

function renderPaperCards(papers) {
  return papers.map(p => `
    <div style="padding:12px;border-radius:8px;border:1px solid #f1f5f9;background:#f8fafc;font-size:12px;">
      <div style="font-weight:700;color:#0f172a;margin-bottom:4px;">${p.title}</div>
      <div style="color:#64748b;font-size:11px;margin-bottom:8px;line-height:1.5;">${(p.abstract || '').substring(0, 200)}${(p.abstract || '').length > 200 ? '...' : ''}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #e2e8f0;font-size:10.5px;color:#94a3b8;">
        <span>${p.venue || 'Academic Venue'} (${p.year || 'n/a'})</span>
        <span>Citations: ${p.citation_count}</span>
      </div>
    </div>
  `).join('');
}

// ============================================================ SVG BAR CHART

function drawStatsChart(statistics) {
  const canvas = qs('#stats-chart');
  if (!canvas) return;

  // Use SVG approach embedded into chart-container
  const container = qs('#chart-container');
  container.innerHTML = '<div class="chart-tooltip" id="chart-tooltip"></div>';

  const data = statistics.slice(0, 7);
  if (!data.length) {
    container.innerHTML += '<p style="text-align:center;color:#94a3b8;padding-top:60px;font-size:12px;">No statistics to display.</p>';
    return;
  }

  const W = container.clientWidth || 500;
  const H = 240;
  const padL = 44, padR = 16, padT = 16, padB = 60;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxVal = Math.max(...data.map(d => Math.abs(d.value)), 1);
  const barW = Math.floor((chartW / data.length) * 0.55);
  const gap = Math.floor((chartW / data.length) * 0.45);

  // Y-axis ticks
  const ticks = 5;
  let yTicks = '';
  let gridLines = '';
  for (let i = 0; i <= ticks; i++) {
    const val = (maxVal / ticks * i).toFixed(1);
    const y = padT + chartH - (chartH * i / ticks);
    yTicks += `<text x="${padL - 4}" y="${y + 4}" text-anchor="end" font-size="9" fill="#94a3b8">${val}</text>`;
    gridLines += `<line x1="${padL}" y1="${y}" x2="${padL + chartW}" y2="${y}" stroke="#f1f5f9" stroke-width="1"/>`;
  }

  // Bars and labels
  let bars = '';
  let xLabels = '';
  data.forEach((d, i) => {
    const barHeight = Math.max(4, (Math.abs(d.value) / maxVal) * chartH);
    const x = padL + (chartW / data.length) * i + gap / 2;
    const y = padT + chartH - barHeight;
    const label = (d.short_name || d.metric).substring(0, 22);
    const wrappedLabel = wrapLabel(label, 12);

    bars += `<rect class="chart-bar" x="${x}" y="${y}" width="${barW}" height="${barHeight}"
      rx="3" ry="3"
      data-label="${d.metric}" data-val="${d.value_display}" data-unit="${d.unit || ''}"
      onmouseenter="showChartTooltip(event,this)" onmouseleave="hideChartTooltip()" />`;

    // Multi-line x-axis label
    const lineY = padT + chartH + 12;
    wrappedLabel.forEach((line, li) => {
      xLabels += `<text x="${x + barW / 2}" y="${lineY + li * 11}" text-anchor="middle" font-size="9" fill="#64748b">${escapeHtml(line)}</text>`;
    });
  });

  const svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;overflow:visible;" xmlns="http://www.w3.org/2000/svg">
    <style>.chart-bar{fill:#2563eb;transition:fill .15s;cursor:pointer;}.chart-bar:hover{fill:#1d4ed8;}</style>
    ${gridLines}
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="#e2e8f0" stroke-width="1"/>
    <line x1="${padL}" y1="${padT + chartH}" x2="${padL + chartW}" y2="${padT + chartH}" stroke="#e2e8f0" stroke-width="1"/>
    ${yTicks}${bars}${xLabels}
  </svg>`;

  container.innerHTML = svg + '<div class="chart-tooltip" id="chart-tooltip"></div>';
}

function wrapLabel(text, maxLen) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach(w => {
    if ((current + ' ' + w).trim().length <= maxLen) {
      current = (current + ' ' + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function showChartTooltip(event, el) {
  const tip = qs('#chart-tooltip');
  if (!tip) return;
  tip.textContent = `${el.dataset.label}: ${el.dataset.val}${el.dataset.unit ? ' ' + el.dataset.unit : ''}`;
  tip.style.opacity = '1';
  tip.style.left = (event.offsetX + 10) + 'px';
  tip.style.top = (event.offsetY - 10) + 'px';
}

function hideChartTooltip() {
  const tip = qs('#chart-tooltip');
  if (tip) tip.style.opacity = '0';
}

// ============================================================ ASK THE RESEARCH

function submitAsk() {
  const q = (qs('#ask-input').value || '').trim().toLowerCase();
  if (!q) return;

  const project = getDemoProject(currentProjectId);
  let answer = '';

  // Simple keyword-matched answers from sample dataset
  if (q.includes('disagree') || q.includes('conflict') || q.includes('contradict') || q.includes('against')) {
    const c = project.contradictions[0];
    answer = `Based on the research dataset, there is a key empirical divergence:\n\n"${c.topic}"\n\n• Perspective A (Industry view — ${c.sources_a ? c.sources_a.join(', ') : 'NASSCOM'}): ${c.position_a}\n\n• Perspective B (Labour view — ${c.sources_b ? c.sources_b.join(', ') : 'ILO'}): ${c.position_b}\n\nMethodological explanation: ${c.likely_explanation}`;
  } else if (q.includes('agri') || q.includes('farm') || q.includes('rural') || q.includes('crop')) {
    const ev = project.evidence.find(e => e.text.toLowerCase().includes('agri') || e.text.toLowerCase().includes('crop') || e.text.toLowerCase().includes('farmer'));
    const stat = project.statistics.find(s => s.category && s.category.toLowerCase().includes('productivity'));
    answer = `Agricultural findings from the dataset:\n\n${stat ? `Key statistic: ${stat.metric} = ${stat.value_display} (${stat.geography || ''}, ${stat.year || ''})\nNote: ${stat.illustrative_note || ''}\n\n` : ''}${ev ? `Evidence: ${ev.text} (${ev.source_title}, ${ev.date})` : 'No direct agricultural evidence found in this dataset.'}`;
  } else if (q.includes('gap') || q.includes('missing') || q.includes('unknown')) {
    const gaps = project.research_gaps;
    answer = `The research identified ${gaps.length} key evidence gaps:\n\n${gaps.map((g, i) => `${i + 1}. ${g.gap_description}\n   Suggested follow-up: "${g.suggested_query}"`).join('\n\n')}`;
  } else if (q.includes('reskill') || q.includes('train') || q.includes('education') || q.includes('skill')) {
    const cl = project.claims.find(c => c.topic && c.topic.toLowerCase().includes('skill'));
    const stat = project.statistics.find(s => s.category && s.category.toLowerCase().includes('education'));
    answer = `Reskilling findings from the dataset:\n\n${cl ? `Key claim (confidence ${Math.round(cl.confidence * 100)}%): "${cl.claim_text}"\n\n` : ''}${stat ? `Statistic: ${stat.metric} = ${stat.value_display} — ${stat.illustrative_note || ''}` : ''}`;
  } else if (q.includes('net positive') || q.includes('overall') || q.includes('conclusion') || q.includes('impact') || q.includes('india')) {
    const rep = project.report;
    answer = `Summary conclusion from the research dataset:\n\n${rep.executive_summary}\n\nKey findings:\n${rep.key_findings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nConclusion: ${rep.conclusion}`;
  } else if (q.includes('source') || q.includes('reference') || q.includes('cite') || q.includes('who')) {
    const srcs = project.sources.slice(0, 5);
    answer = `Key sources in this research dataset:\n\n${srcs.map((s, i) => `${i + 1}. ${s.title}\n   Domain: ${s.domain} (${s.source_type}) — Quality: ${Math.round(s.quality_score * 100)}%\n   Published: ${s.published_date || 'n/a'}`).join('\n\n')}\n\nNote: These are illustrative example source metadata for demonstration purposes.`;
  } else if (q.includes('statistic') || q.includes('number') || q.includes('percent') || q.includes('million')) {
    const stats = project.statistics.slice(0, 5);
    answer = `Key statistics extracted from the research dataset:\n\n${stats.map(s => `• ${s.metric}: ${s.value_display} (${s.geography || ''}, ${s.year || ''})\n  Note: ${s.illustrative_note || 'Illustrative scenario projection.'}`).join('\n\n')}`;
  } else {
    // Default: synthesize from summary + top claims
    const topClaims = project.claims.slice(0, 3).map((c, i) => `${i + 1}. "${c.claim_text}" (Confidence: ${Math.round(c.confidence * 100)}%)`).join('\n');
    answer = `Based on the preloaded research dataset for "${project.research_question}":\n\n${project.summary}\n\nKey supported claims:\n${topClaims}\n\n[Dataset note: This answer is generated from preloaded offline demo data only. For a specific finding, try asking about agriculture, reskilling, contradictions, research gaps, or statistics.]`;
  }

  const resultBox = qs('#ask-result');
  qs('#ask-result-text').textContent = answer;
  resultBox.classList.remove('hidden');
}

// ============================================================ SOURCES VIEW

let _sourcesProject = null;
let _sourcesFilterType = 'all';

function renderSources() {
  _sourcesProject = getDemoProject(currentProjectId);
  qs('#sources-count-label').textContent = `Browse all ${_sourcesProject.sources.length} web sources and ${_sourcesProject.academic_papers.length} academic papers.`;
  qs('#src-papers-count').textContent = _sourcesProject.academic_papers.length;
  qs('#src-papers-grid').innerHTML = renderPaperCards(_sourcesProject.academic_papers);
  filterSources();
}

function setSourceFilter(btn) {
  qsa('.filter-pill', qs('#sources-filter-bar')).forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  _sourcesFilterType = btn.dataset.filter;
  filterSources();
}

function filterSources() {
  if (!_sourcesProject) return;
  const q = (qs('#sources-search').value || '').toLowerCase();
  const type = _sourcesFilterType || 'all';

  const filtered = _sourcesProject.sources.filter(s => {
    const matchType = type === 'all' || s.source_type === type;
    const matchSearch = !q ||
      s.title.toLowerCase().includes(q) ||
      (s.domain || '').toLowerCase().includes(q) ||
      (s.snippet || '').toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const grid = qs('#sources-grid');
  grid.innerHTML = filtered.map(s => `
    <div class="source-item-card">
      <div>
        <div class="source-meta-row">
          <span class="source-type-badge">${s.source_type || 'web'}</span>
          <span class="source-quality-badge">Quality: ${Math.round((s.quality_score || 0) * 100)}%</span>
        </div>
        <h3 class="source-title-h3">${escapeHtml(s.title)}</h3>
        <p class="source-snippet-p">${escapeHtml(s.snippet || 'No text snippet recorded.')}</p>
      </div>
      <div class="source-footer-row">
        <span class="source-domain-tag">${escapeHtml(s.domain || '')}</span>
        <span style="font-size:11px;color:#94a3b8;" title="Source URL noted — not clickable in offline demo">
          🔗 ${escapeHtml(s.domain || 'reference')}
        </span>
      </div>
    </div>
  `).join('');

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="font-size:13px;color:#94a3b8;text-align:center;padding:40px;">No sources match this filter.</div>';
  }
}

// ============================================================ KNOWLEDGE GRAPH (SVG)

const ENTITY_COLORS = {
  technology: '#2563eb',
  organization: '#7c3aed',
  government: '#059669',
  industry: '#d97706',
  policy: '#0891b2',
  education: '#be185d',
  demographic: '#64748b',
  default: '#64748b'
};

let kgNodes = [];
let kgEdges = [];
let kgScale = 1;
let kgOffsetX = 0;
let kgOffsetY = 0;
let kgIsDragging = false;
let kgDragOrigin = null;

function renderKnowledgeGraph() {
  const project = getDemoProject(currentProjectId);
  const svg = qs('#kg-svg');
  const container = qs('#kg-container');
  if (!svg || !container) return;

  const W = container.clientWidth || 800;
  const H = container.clientHeight || 580;

  // Build positions in circular layout
  const entities = project.entities;
  const relationships = project.relationships;
  const numEntities = entities.length;

  const nodePositions = {};
  entities.forEach((ent, i) => {
    const angle = (i / numEntities) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.min(W, H) * 0.36;
    const cx = W / 2 + radius * Math.cos(angle);
    const cy = H / 2 + radius * Math.sin(angle);
    nodePositions[ent.name] = { x: cx, y: cy, entity: ent };
  });

  // Render edges
  const edgesGroup = qs('#kg-edges-group');
  const nodesGroup = qs('#kg-nodes-group');
  edgesGroup.innerHTML = '';
  nodesGroup.innerHTML = '';

  // Update SVG viewBox
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  relationships.forEach((rel, i) => {
    const src = nodePositions[rel.source_entity];
    const tgt = nodePositions[rel.target_entity];
    if (!src || !tgt) return;

    // Draw curved line
    const mx = (src.x + tgt.x) / 2;
    const my = (src.y + tgt.y) / 2 - 24;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', `M${src.x},${src.y} Q${mx},${my} ${tgt.x},${tgt.y}`);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', '#cbd5e1');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    edgesGroup.appendChild(line);

    // Edge label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', mx);
    label.setAttribute('y', my - 4);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '9');
    label.setAttribute('fill', '#94a3b8');
    label.setAttribute('font-family', 'sans-serif');
    label.textContent = rel.relation_type;
    edgesGroup.appendChild(label);
  });

  // Render nodes
  entities.forEach((ent, i) => {
    const pos = nodePositions[ent.name];
    if (!pos) return;
    const color = ENTITY_COLORS[ent.entity_type] || ENTITY_COLORS.default;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${pos.x - 60},${pos.y - 22})`);
    g.style.cursor = 'pointer';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '120');
    rect.setAttribute('height', '44');
    rect.setAttribute('rx', '8');
    rect.setAttribute('fill', '#ffffff');
    rect.setAttribute('stroke', color);
    rect.setAttribute('stroke-width', '1.5');
    rect.setAttribute('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.07))');

    const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    typeText.setAttribute('x', '60');
    typeText.setAttribute('y', '14');
    typeText.setAttribute('text-anchor', 'middle');
    typeText.setAttribute('font-size', '8');
    typeText.setAttribute('font-weight', '700');
    typeText.setAttribute('text-transform', 'uppercase');
    typeText.setAttribute('fill', color);
    typeText.setAttribute('font-family', 'sans-serif');
    typeText.textContent = ent.entity_type.toUpperCase();

    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameText.setAttribute('x', '60');
    nameText.setAttribute('y', '30');
    nameText.setAttribute('text-anchor', 'middle');
    nameText.setAttribute('font-size', '10.5');
    nameText.setAttribute('font-weight', '700');
    nameText.setAttribute('fill', '#0f172a');
    nameText.setAttribute('font-family', 'sans-serif');
    // Truncate
    const nm = ent.name.length > 16 ? ent.name.substring(0, 14) + '…' : ent.name;
    nameText.textContent = nm;

    g.appendChild(rect);
    g.appendChild(typeText);
    g.appendChild(nameText);

    g.addEventListener('click', () => showKgInspector(ent));
    g.addEventListener('mouseenter', () => { rect.setAttribute('stroke-width', '2.5'); });
    g.addEventListener('mouseleave', () => { rect.setAttribute('stroke-width', '1.5'); });

    nodesGroup.appendChild(g);
  });
}

function showKgInspector(ent) {
  const inspector = qs('#kg-inspector');
  const content = qs('#kg-inspector-content');
  const color = ENTITY_COLORS[ent.entity_type] || ENTITY_COLORS.default;
  content.innerHTML = `
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:${color};margin-bottom:4px;">${ent.entity_type}</div>
    <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:8px;">${ent.name}</div>
    <div style="font-size:11.5px;color:#64748b;line-height:1.5;margin-bottom:8px;">${ent.description || ''}</div>
    <div style="display:flex;gap:10px;font-size:11px;color:#94a3b8;">
      <span>Mentions: <strong style="color:#0f172a;">${ent.mention_count}</strong></span>
      <span>Claims: <strong style="color:#0f172a;">${ent.related_claims_count}</strong></span>
    </div>
  `;
  inspector.style.display = 'block';
}

function kgZoom(factor) {
  kgScale = Math.max(0.4, Math.min(3, kgScale * factor));
  const group = qs('#kg-graph-group');
  if (group) group.setAttribute('transform', `scale(${kgScale})`);
}

function resetGraphView() {
  kgScale = 1;
  const group = qs('#kg-graph-group');
  if (group) group.setAttribute('transform', 'scale(1)');
  qs('#kg-inspector').style.display = 'none';
}

// ============================================================ REPORT VIEW

function renderReport() {
  const project = getDemoProject(currentProjectId);
  const rep = project.report;
  if (!rep) return;

  const article = qs('#report-article');
  article.innerHTML = `
    <header style="border-bottom:1px solid #f1f5f9;padding-bottom:24px;">
      <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">
        ResearchOS Intelligence Platform · Automated Multilateral Triangulation
        <span style="margin-left:8px;background:#fff3cd;color:#92400e;padding:2px 8px;border-radius:4px;border:1px solid #fde68a;font-weight:600;">⚠ Illustrative Data — Not Verified Research</span>
      </div>
      <h1 class="report-header-h1">${escapeHtml(rep.title)}</h1>
      <div style="font-size:12px;color:#94a3b8;margin-top:8px;">${rep.subtitle || ''} · ${rep.date_generated || ''}</div>
    </header>

    <section>
      <h2 class="report-sec-h2">Executive Summary</h2>
      <p class="report-body-p">${escapeHtml(rep.executive_summary)}</p>
    </section>

    <section>
      <h2 class="report-sec-h2">Methodology &amp; Scope</h2>
      <p class="report-body-p">${escapeHtml(rep.methodology)}</p>
      <p class="report-body-p" style="margin-top:8px;"><strong>Scope:</strong> ${escapeHtml(rep.scope)}</p>
    </section>

    ${rep.key_findings && rep.key_findings.length ? `
    <section>
      <h2 class="report-sec-h2">Key Findings</h2>
      <ul class="report-findings-ul">
        ${rep.key_findings.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
      </ul>
    </section>` : ''}

    <section>
      <h2 class="report-sec-h2">Detailed Analysis</h2>
      <div class="report-body-p" style="white-space:pre-line;">${escapeHtml(rep.detailed_analysis)}</div>
    </section>

    <section style="border-top:1px solid #f1f5f9;padding-top:24px;">
      <h2 class="report-sec-h2">Conclusion &amp; Outlook</h2>
      <p class="report-body-p">${escapeHtml(rep.conclusion)}</p>
    </section>
  `;
}

function copyReportMarkdown() {
  const project = getDemoProject(currentProjectId);
  const md = project.report.report_markdown;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(md).then(() => {
      const btn = qs('#copy-md-btn');
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Markdown'; }, 2000);
    });
  } else {
    showToast('Clipboard not available in this browser — use Download instead.');
  }
}

function downloadReport() {
  const project = getDemoProject(currentProjectId);
  const md = project.report.report_markdown;
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ResearchOS_Report.md';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  showToast('Report downloaded as ResearchOS_Report.md');
}

// ============================================================ HELPERS

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================ INIT

document.addEventListener('DOMContentLoaded', () => {
  // Pre-fill query input with first demo project
  const queryInput = qs('#query-input');
  if (queryInput) {
    queryInput.value = DEMO_PROJECTS[0].research_question;
    queryInput.addEventListener('input', updateCharCount);
    updateCharCount();
  }

  // Set project nav hidden initially
  setProjectNavVisible(false);

  // Ensure initial view
  showView('new');
});
