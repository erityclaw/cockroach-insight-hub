const speciesData = [
  { name: 'German Cockroach', habitat: 'Indoor', risk: 'High', facts: 'Fast breeder, common in kitchens and bathrooms.' },
  { name: 'American Cockroach', habitat: 'Sewer/Outdoor', risk: 'Medium', facts: 'Large species, often enters through drains and utility lines.' },
  { name: 'Oriental Cockroach', habitat: 'Damp Areas', risk: 'Medium', facts: 'Prefers cool, moist spaces like basements and crawlspaces.' },
  { name: 'Brown-banded Cockroach', habitat: 'Indoor', risk: 'Low', facts: 'Can infest dry upper areas, including furniture and electronics.' },
  { name: 'Smokybrown Cockroach', habitat: 'Outdoor', risk: 'Low', facts: 'Found around mulch and roof voids in warm climates.' },
  { name: 'Turkestan Cockroach', habitat: 'Outdoor', risk: 'Low', facts: 'Increasingly common in arid urban landscapes.' }
];

const lifecycleInfo = {
  egg: 'Egg cases (oothecae) protect developing embryos. Depending on species, each case can contain 10 to 50 eggs.',
  nymph: 'Nymphs resemble small adults but lack wings. They molt multiple times as they grow.',
  adult: 'Adults are fully reproductive. Lifespan and mobility vary by species and environment.'
};

const controls = {
  sanitation: { score: 35, text: 'Reduce food and water sources: clean grease, seal containers, fix leaks.' },
  exclusion: { score: 25, text: 'Seal cracks, install door sweeps, and screen vents to block entry points.' },
  monitoring: { score: 20, text: 'Use sticky traps in high-risk areas to detect activity trends early.' },
  treatment: { score: 20, text: 'Use baits and targeted products as part of an IPM strategy.' }
};

function initSpeciesFilter() {
  const container = document.querySelector('[data-species-list]');
  if (!container) return;

  const queryInput = document.querySelector('#species-query');
  const habitatSelect = document.querySelector('#species-habitat');

  function render() {
    const q = (queryInput?.value || '').toLowerCase().trim();
    const h = habitatSelect?.value || 'All';

    const filtered = speciesData.filter(s => {
      const matchesQ = !q || `${s.name} ${s.facts}`.toLowerCase().includes(q);
      const matchesH = h === 'All' || s.habitat === h;
      return matchesQ && matchesH;
    });

    container.innerHTML = filtered.map(s => `
      <article class="card">
        <h3>${s.name}</h3>
        <p><span class="tag">${s.habitat}</span><span class="tag">Risk: ${s.risk}</span></p>
        <p>${s.facts}</p>
      </article>
    `).join('') || '<p class="small">No species matched your filter.</p>';
  }

  queryInput?.addEventListener('input', render);
  habitatSelect?.addEventListener('change', render);
  render();
}

function initTabs() {
  const tabGroups = document.querySelectorAll('[data-tabs]');
  tabGroups.forEach(group => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        group.querySelector(`#${target}`)?.classList.add('active');
      });
    });
  });
}

function initLifecycleSelector() {
  const stage = document.querySelector('#lifecycle-stage');
  const out = document.querySelector('#lifecycle-output');
  if (!stage || !out) return;

  function update() {
    out.textContent = lifecycleInfo[stage.value] || '';
  }
  stage.addEventListener('change', update);
  update();
}

function initRiskCalculator() {
  const form = document.querySelector('#risk-form');
  const scoreEl = document.querySelector('#risk-score');
  const bar = document.querySelector('#risk-bar > div');
  const summary = document.querySelector('#risk-summary');
  if (!form || !scoreEl || !bar || !summary) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const food = Number(data.get('food'));
    const moisture = Number(data.get('moisture'));
    const clutter = Number(data.get('clutter'));
    const sightings = Number(data.get('sightings'));

    const score = Math.min(100, Math.round(food * 0.25 + moisture * 0.3 + clutter * 0.15 + sightings * 0.3));
    scoreEl.textContent = score;
    bar.style.width = `${score}%`;

    if (score >= 70) {
      summary.textContent = 'High risk. Start immediate sanitation and targeted treatment this week.';
    } else if (score >= 40) {
      summary.textContent = 'Moderate risk. Improve exclusion and monitoring to avoid escalation.';
    } else {
      summary.textContent = 'Lower risk. Maintain preventive controls and continue monitoring.';
    }
  });
}

function initIPMPlanner() {
  const list = document.querySelector('[data-ipm-list]');
  const total = document.querySelector('#ipm-total');
  const detail = document.querySelector('#ipm-detail');
  if (!list || !total || !detail) return;

  list.innerHTML = Object.entries(controls).map(([key, c]) => `
    <label class="card" style="display:block; margin-bottom:0.7rem;">
      <input type="checkbox" value="${key}"> <strong>${key[0].toUpperCase() + key.slice(1)}</strong>
      <p class="small">${c.text}</p>
    </label>
  `).join('');

  function recalc() {
    const checked = [...list.querySelectorAll('input:checked')].map(i => i.value);
    const score = checked.reduce((sum, k) => sum + controls[k].score, 0);
    total.textContent = score;

    if (!checked.length) {
      detail.textContent = 'Select controls to estimate expected prevention strength.';
    } else {
      detail.textContent = `Selected: ${checked.join(', ')}.`;
    }
  }

  list.addEventListener('change', recalc);
  recalc();
}

function initQuickQuiz() {
  const form = document.querySelector('#quiz-form');
  const result = document.querySelector('#quiz-result');
  if (!form || !result) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    let score = 0;
    if (data.get('q1') === 'b') score++;
    if (data.get('q2') === 'a') score++;
    if (data.get('q3') === 'c') score++;

    result.textContent = `You scored ${score}/3. ${score === 3 ? 'Great work, your IPM knowledge is strong.' : 'Review the control page to tighten your approach.'}`;
  });
}

initSpeciesFilter();
initTabs();
initLifecycleSelector();
initRiskCalculator();
initIPMPlanner();
initQuickQuiz();
