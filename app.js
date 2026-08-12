(() => {
  const STORAGE_KEY = 'embedded-tutor-canvas-generator:v1';
  const outputEl = document.querySelector('[data-output]');
  const previewEl = document.querySelector('[data-preview]');
  const editorEl = document.querySelector('#editor');
  const statusEl = document.querySelector('[data-status]');
  const resetBtn = document.querySelector('[data-action="reset"]');
  const copyBtns = [...document.querySelectorAll('[data-action^="copy-html"]')];
  const downloadBtn = document.querySelector('[data-action="download-html"]');

  const defaultState = () => ({
    pageTitle: 'Meet Your Embedded Tutor',
    eyebrow: 'Tutorial Center · Embedded Tutor',
    tutorName: 'Robert Voss',
    tutorRole: 'Embedded Tutor',
    introLead: 'Hi, I’m Robert. I’m the embedded tutor for this course and a STEM tutor at the Clovis Community College Tutorial Center.',
    introBody: 'I graduated from CCC in Spring 2025 with degrees in Computer Science, Mathematics, Physics, and Engineering-related coursework. I’m also a computer science student at Fresno State. I spend most of my time on CS, math, physics, engineering, and troubleshooting.',
    introExtra: 'Outside school, I work on underwater robotics, programming projects, photography, and anything that involves building something from scratch.',
    introGoal: 'If you get stuck, bring the problem, what you’ve tried, and I’ll help you work through it.',
    contactDiscord: 'vossrobert in your class Discord server',
    contactCanvas: 'Message me through Canvas Messages',
    contactEmail: 'rav1@my.scccd.edu',
    contactTip: 'Please include your course, what you tried, and a screenshot or photo if it’s a circuit issue.',
    zoomUrl: 'https://cccconfer.zoom.us/j/5593255248',
    zoomId: '559 325 5248',
    inPersonLocation: 'AC1-137, next to the computer lab',
    canvasUrl: 'https://scccd.instructure.com/courses/108747',
    canvasLabel: 'Tutorial Center Canvas',
    helpItems: [
      'Circuit checks: help with wiring, setup, and measurements',
      'Concept to application: connect the theory to what you’re seeing in the lab',
      'Debugging: fresh eyes on code or circuits when something is not working',
      'Homework support: I can help you choose an approach and catch mistakes, but I will not just hand you the answer',
      'Study sessions: occasional review sessions for exams or harder topics',
    ],
    courseNote: 'I work with ENGR 6 and CSCI 45, so I can pull from more than one class when something needs a different angle.',
    visitCards: [
      { title: 'STEM Drop-In', body: 'Walk in during open hours with your assignment, notes, and student ID.' },
      { title: 'Writing and Humanities', body: '30-minute scheduled appointments through the front desk.' },
      { title: 'COMM Lab', body: 'Presentations, structure, delivery, practice, and feedback.' },
      { title: 'PACE', body: 'Support for CHEM 3A and ENGL C1000.' },
    ],
    resourcesNote: 'Whiteboard tables are one of the best tools here. They make it easier to work through problems without feeling locked into the first thing you write.',
    resourcesTip: 'Services and hours can change, so confirm details on the Tutorial Center Canvas.',
    centerHours: [
      { section: 'In Person (AC1-137)', rows: [
        { day: 'Monday', detail: '9:00am – 6:00pm' },
        { day: 'Tuesday', detail: '9:00am – 9:00pm' },
        { day: 'Wednesday', detail: '9:00am – 9:00pm' },
        { day: 'Thursday', detail: '9:00am – 9:00pm' },
        { day: 'Friday', detail: '9:00am – 5:00pm' },
      ]},
      { section: 'Online', rows: [
        { day: 'Monday', detail: '10:00am – 6:00pm' },
        { day: 'Tuesday', detail: '10:00am – 9:00pm' },
        { day: 'Wednesday', detail: '10:00am – 9:00pm' },
        { day: 'Thursday', detail: '10:00am – 9:00pm' },
        { day: 'Friday', detail: '10:00am – 5:00pm' },
        { day: 'Sunday', detail: '2:00pm – 8:00pm' },
      ]},
    ],
    personalHours: [
      { day: 'Monday', detail: 'Off' },
      { day: 'Tuesday', detail: 'Embedded (CSCI 45)' },
      { day: 'Wednesday', detail: '6:00pm – 8:30pm' },
      { day: 'Thursday', detail: 'Embedded (CSCI 45)' },
      { day: 'Friday', detail: 'Embedded (ENGR 6)' },
      { day: 'Sunday', detail: 'Online Only · 2:00pm – 5:00pm' },
    ],
    closingNote: 'Please feel free to come in, even if it’s a simple question.',
  });

  const trimToLength = (arr, min, max) => {
    const next = Array.isArray(arr) ? [...arr] : [];
    while (next.length < min) next.push('');
    if (next.length > max) next.length = max;
    return next;
  };

  const normalizeTextRows = (arr, min, max) => trimToLength(arr, min, max).map((value) => String(value ?? ''));
  const normalizeHourRows = (arr, min, max) => trimToLength(arr, min, max).map((row) => ({
    day: String(row?.day ?? ''),
    detail: String(row?.detail ?? ''),
  }));

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const defaults = defaultState();
      return {
        ...defaults,
        ...parsed,
        helpItems: normalizeTextRows(parsed.helpItems ?? defaults.helpItems, 5, 8),
        visitCards: trimToLength(parsed.visitCards ?? defaults.visitCards, 4, 4).map((item, idx) => ({
          title: String(item?.title ?? defaults.visitCards[idx].title),
          body: String(item?.body ?? defaults.visitCards[idx].body),
        })),
        centerHours: defaults.centerHours.map((section, idx) => ({
          section: String(parsed.centerHours?.[idx]?.section ?? section.section),
          rows: normalizeHourRows(parsed.centerHours?.[idx]?.rows ?? section.rows, idx === 0 ? 5 : 6, idx === 0 ? 8 : 8),
        })),
        personalHours: normalizeHourRows(parsed.personalHours ?? defaults.personalHours, 4, 8),
      };
    } catch {
      return defaultState();
    }
  };

  let state = loadState();

  const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const deepSet = (path, value) => {
    const parts = path.split('.');
    let ref = state;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const key = parts[i];
      if (key.endsWith(']')) {
        const match = key.match(/^(.*)\[(\d+)\]$/);
        if (!match) return;
        const [, arrName, index] = match;
        ref = ref[arrName][Number(index)];
      } else {
        ref = ref[key];
      }
    }
    const last = parts[parts.length - 1];
    if (last.endsWith(']')) {
      const match = last.match(/^(.*)\[(\d+)\]$/);
      if (!match) return;
      const [, arrName, index] = match;
      ref[arrName][Number(index)] = value;
    } else {
      ref[last] = value;
    }
  };

  const cardInput = (label, name, value, type = 'text', extra = '') => `
    <label class="field ${extra}">
      <span class="labelText">${escapeHtml(label)}</span>
      ${type === 'textarea'
        ? `<textarea name="${escapeHtml(name)}">${escapeHtml(value)}</textarea>`
        : `<input type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`}
    </label>`;

  const renderEditor = () => {
    const helpItems = state.helpItems.map((item, index) => `
      <label class="field full">
        <span class="labelText">Help item ${index + 1}</span>
        <textarea name="helpItems[${index}]">${escapeHtml(item)}</textarea>
      </label>`).join('');

    const visitCards = state.visitCards.map((card, index) => `
      <div class="rowCard">
        <div class="rowGrid three">
          <label>
            <span class="miniLabel">Card title</span>
            <input name="visitCards[${index}].title" value="${escapeHtml(card.title)}" />
          </label>
          <label class="fullField">
            <span class="miniLabel">Card text</span>
            <input name="visitCards[${index}].body" value="${escapeHtml(card.body)}" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-remove-card="visitCards" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>`).join('');

    const centerHours = state.centerHours.map((section, sectionIndex) => `
      <div class="rowCard">
        <div class="rowGrid three">
          <label class="fullField">
            <span class="miniLabel">Section label</span>
            <input name="centerHours[${sectionIndex}].section" value="${escapeHtml(section.section)}" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-add-hour-section="${sectionIndex}">Add row</button>
          </div>
        </div>
        <div class="hoursRows">
          ${section.rows.map((row, rowIndex) => `
            <div class="rowGrid">
              <label>
                <span class="miniLabel">Day</span>
                <input name="centerHours[${sectionIndex}].rows[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label>
                <span class="miniLabel">Detail</span>
                <input name="centerHours[${sectionIndex}].rows[${rowIndex}].detail" value="${escapeHtml(row.detail)}" />
              </label>
              <div class="helperStrip">
                <button class="ghostBtn" type="button" data-add-row="centerHours-${sectionIndex}" data-index="${rowIndex}">Add below</button>
                <button class="ghostBtn" type="button" data-remove-row="centerHours-${sectionIndex}" data-index="${rowIndex}">Remove</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`).join('');

    const personalHours = `
      <div class="rowCard">
        <div class="rowGrid three">
          <label class="fullField">
            <span class="miniLabel">Section label</span>
            <input value="My Spring Hours" disabled />
          </label>
          <div class="helperStrip"><span class="notice">Editable rows below</span></div>
        </div>
        <div class="hoursRows">
          ${state.personalHours.map((row, rowIndex) => `
            <div class="rowGrid">
              <label>
                <span class="miniLabel">Day</span>
                <input name="personalHours[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label>
                <span class="miniLabel">Detail</span>
                <input name="personalHours[${rowIndex}].detail" value="${escapeHtml(row.detail)}" />
              </label>
              <div class="helperStrip">
                <button class="ghostBtn" type="button" data-add-row="personalHours" data-index="${rowIndex}">Add below</button>
                <button class="ghostBtn" type="button" data-remove-row="personalHours" data-index="${rowIndex}">Remove</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    editorEl.innerHTML = `
      <form id="generator-form" class="editorForm">
        <section class="fieldGroup card">
          <h3>Header and intro</h3>
          <p class="groupNote">This is the top block students see first.</p>
          <div class="fieldGrid">
            ${cardInput('Page title', 'pageTitle', state.pageTitle)}
            ${cardInput('Eyebrow', 'eyebrow', state.eyebrow)}
            ${cardInput('Tutor name', 'tutorName', state.tutorName)}
            ${cardInput('Tutor role', 'tutorRole', state.tutorRole)}
            ${cardInput('Intro lead', 'introLead', state.introLead, 'text', 'full')}
            ${cardInput('Intro body', 'introBody', state.introBody, 'textarea', 'full')}
            ${cardInput('Intro extra', 'introExtra', state.introExtra, 'textarea', 'full')}
            ${cardInput('Intro goal', 'introGoal', state.introGoal, 'text', 'full')}
          </div>
        </section>

        <section class="fieldGroup card">
          <h3>Contact and links</h3>
          <p class="groupNote">Keep the contact options direct and short.</p>
          <div class="fieldGrid">
            ${cardInput('Discord line', 'contactDiscord', state.contactDiscord)}
            ${cardInput('Canvas Inbox line', 'contactCanvas', state.contactCanvas)}
            ${cardInput('Email address', 'contactEmail', state.contactEmail, 'email')}
            ${cardInput('Contact tip', 'contactTip', state.contactTip, 'text', 'full')}
            ${cardInput('Zoom URL', 'zoomUrl', state.zoomUrl, 'url', 'full')}
            ${cardInput('Zoom ID', 'zoomId', state.zoomId)}
            ${cardInput('In-person location', 'inPersonLocation', state.inPersonLocation, 'text', 'full')}
            ${cardInput('Canvas page URL', 'canvasUrl', state.canvasUrl, 'url', 'full')}
            ${cardInput('Canvas link label', 'canvasLabel', state.canvasLabel)}
          </div>
        </section>

        <section class="fieldGroup card">
          <h3>How I can help</h3>
          <p class="groupNote">Short bullets read better than AI filler.</p>
          <div class="fieldGrid">
            ${helpItems}
          </div>
          <div class="helperStrip" style="margin-top: 12px;">
            <button class="ghostBtn" type="button" data-add-list-item="helpItems">Add help item</button>
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${cardInput('Course note', 'courseNote', state.courseNote, 'textarea', 'full')}
          </div>
        </section>

        <section class="fieldGroup card">
          <h3>What to expect at the Tutorial Center</h3>
          <p class="groupNote">These are the smaller service cards students skim quickly.</p>
          <div class="fieldGrid">
            ${visitCards}
          </div>
          <div class="helperStrip" style="margin-top: 12px;">
            <button class="ghostBtn" type="button" data-add-card="visitCards">Add card</button>
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${cardInput('Resources note', 'resourcesNote', state.resourcesNote, 'textarea', 'full')}
            ${cardInput('Resources tip', 'resourcesTip', state.resourcesTip, 'text', 'full')}
          </div>
        </section>

        <section class="fieldGroup card">
          <h3>Tutorial Center Hours</h3>
          <p class="groupNote">Prefilled, but easy to change if the center changes hours later.</p>
          <div class="fieldGrid">
            ${centerHours}
          </div>
        </section>

        <section class="fieldGroup card">
          <h3>My Spring Hours</h3>
          <p class="groupNote">Use this for your personal embedded schedule.</p>
          <div class="fieldGrid">
            ${personalHours}
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${cardInput('Closing note', 'closingNote', state.closingNote, 'text', 'full')}
          </div>
        </section>
      </form>
    `;
  };

  const buildHoursTable = (title, rows, dark = false) => {
    const tableStyle = dark
      ? 'width: 100%; border-collapse: collapse; font-size: 14px; color: #f8fafc;'
      : 'width: 100%; border-collapse: collapse; font-size: 14px; color: #0f172a;';
    const border = dark ? 'rgba(255,255,255,0.15)' : '#e2e8f0';
    return `
      <section style="flex: 1 1 0%; min-width: 300px; padding: 14px; border-radius: 12px; background: ${dark ? '#0f172a' : '#f8fafc'}; border: 1px solid ${dark ? '#0f172a' : '#cbd5e1'}; color: ${dark ? '#f8fafc' : '#0f172a'};">
        <strong>${escapeHtml(title)}</strong>
        <table style="${tableStyle}; margin-top: 8px;">
          <tbody>
            ${rows.map((row, index) => `
              <tr>
                <th scope="row" style="padding: 6px 0; text-align: left; font-weight: 700; border-top: ${index === 0 ? 'none' : `1px solid ${border}`};">${escapeHtml(row.day)}</th>
                <td style="padding: 6px 0; text-align: right; border-top: ${index === 0 ? 'none' : `1px solid ${border}`};">${escapeHtml(row.detail)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </section>`;
  };

  const buildVisitCard = (item, titleStyle) => `
    <div style="flex: 1 1 0%; min-width: 280px; padding: 14px; border-radius: 12px; background: ${titleStyle.bg}; border: 1px solid ${titleStyle.border}; color: #0f172a;">
      <strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.body)}
    </div>`;

  const buildHelpList = () => state.helpItems.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  const generatedHtml = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(state.pageTitle)}</title>
</head>
<body style="margin:0; background:#ffffff; color:#0f172a; font-family: Arial, Helvetica, sans-serif; line-height:1.6;">
  <div style="max-width: 960px; margin: 0 auto; padding: 24px;">
    <header style="margin-bottom: 18px;">
      <p style="margin:0 0 6px 0; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#0f766e; font-weight:700;">${escapeHtml(state.eyebrow)}</p>
      <h1 style="margin:0; font-size:30px; line-height:1.2; color:#111827;">${escapeHtml(state.pageTitle)}</h1>
      <div style="margin-top:6px; font-size:14px; color:#475569;">${escapeHtml(state.tutorName)} &middot; ${escapeHtml(state.tutorRole)}</div>
    </header>

    <section style="display:flex; flex-wrap:wrap; gap:18px; align-items:center; padding:18px; border-radius:14px; background:linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #0f766e 100%); border:1px solid #0f172a;">
      <div style="flex:1; min-width:260px; color:#f8fafc;">
        <div style="font-size:18px; font-weight:700; margin-bottom:8px;">${escapeHtml(state.introLead)}</div>
        <div style="font-size:14.5px; color:#e2e8f0;">
          <p style="margin:0 0 10px 0;">${escapeHtml(state.introBody)}</p>
          <p style="margin:0 0 10px 0;">${escapeHtml(state.introExtra)}</p>
          <p style="margin:0;">${escapeHtml(state.introGoal)}</p>
        </div>
        <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.22); font-size:14px; color:#f8fafc;">
          <div style="margin-bottom:6px; font-weight:700;">Contact</div>
          <div><strong>Discord (preferred):</strong> ${escapeHtml(state.contactDiscord)}</div>
          <div><strong>Canvas Inbox:</strong> ${escapeHtml(state.contactCanvas)}</div>
          <div><strong>Email:</strong> <a style="color:#bfdbfe; text-decoration:underline;" href="mailto:${escapeHtml(state.contactEmail)}">${escapeHtml(state.contactEmail)}</a></div>
          <div style="margin-top:6px; font-size:13.5px;"><em>${escapeHtml(state.contactTip)}</em></div>
        </div>
      </div>
    </section>

    <section style="margin-top:16px; display:flex; flex-wrap:wrap; gap:12px;">
      <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a;">
        <div style="margin-bottom:8px; font-weight:700; color:#111827;">Quick Access</div>
        <div style="font-size:14px;">
          <div style="margin-bottom:4px;"><strong>Online:</strong> <a style="color:#1d4ed8; text-decoration:underline;" href="${escapeHtml(state.zoomUrl)}">Tutorial Center Zoom</a></div>
          <div style="margin-bottom:4px;"><strong>Zoom ID:</strong> ${escapeHtml(state.zoomId)}</div>
          <div><strong>In Person:</strong> ${escapeHtml(state.inPersonLocation)}</div>
        </div>
      </div>
      <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a;">
        <div style="margin-bottom:8px; font-weight:700; color:#111827;">Tutorial Center Canvas</div>
        <div style="font-size:14px;">For the latest services, schedules, and resources, visit the <a style="color:#1d4ed8; text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</div>
      </div>
    </section>

    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:#111827;">How I can help in this course</h2>
      <div style="padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a;">
        <ul style="margin:0; padding-left:18px;">
          ${buildHelpList()}
        </ul>
        <div style="margin-top:10px; font-size:13.5px; color:#334155;">${escapeHtml(state.courseNote)}</div>
      </div>
    </section>

    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:#111827;">What to expect at the Tutorial Center</h2>
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
        ${state.visitCards.slice(0, 2).map((item, index) => buildVisitCard(item, index === 0 ? { bg: '#fff7ed', border: '#fb923c' } : { bg: '#f5f3ff', border: '#a78bfa' })).join('')}
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:12px;">
        ${state.visitCards.slice(2, 4).map((item, index) => buildVisitCard(item, index === 0 ? { bg: '#eff6ff', border: '#60a5fa' } : { bg: '#ecfdf5', border: '#34d399' })).join('')}
      </div>
      <div style="margin-top:12px; padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a;"><strong>Resources available:</strong> ${escapeHtml(state.resourcesNote)}</div>
      <div style="margin-top:10px; font-size:13.5px; color:#475569;"><em>${escapeHtml(state.resourcesTip)} <a style="color:#1d4ed8; text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</em></div>
    </section>

    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:#111827;">Tutorial Center Hours</h2>
      <div style="display:flex; flex-wrap:wrap; gap:14px;">
        ${state.centerHours.map((section, idx) => buildHoursTable(section.section, section.rows, idx === 1)).join('')}
      </div>
    </section>

    <section style="margin-top:22px;">
      <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:#111827;">My Spring Hours</h2>
      <div style="padding:14px; border-radius:12px; background:#0f172a; border:1px solid #0f172a; color:#f8fafc;">
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#f8fafc;">
          <tbody>
            ${state.personalHours.map((row, index) => `
              <tr>
                <th scope="row" style="padding:6px 0; text-align:left; font-weight:700; border-top:${index === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)'};">${escapeHtml(row.day)}</th>
                <td style="padding:6px 0; text-align:right; border-top:${index === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)'};">${escapeHtml(row.detail)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top:10px; font-size:13.5px; color:#475569;"><em>${escapeHtml(state.closingNote)}</em></div>
    </section>
  </div>
</body>
</html>`;

  const renderPreview = () => {
    const html = generatedHtml();
    outputEl.value = html;
    previewEl.srcdoc = html;
    saveState();
  };

  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  const copyHtml = async () => {
    const html = outputEl.value || generatedHtml();
    try {
      await navigator.clipboard.writeText(html);
      setStatus('HTML copied to clipboard.');
    } catch {
      outputEl.focus();
      outputEl.select();
      document.execCommand('copy');
      setStatus('HTML copied using the fallback selection method.');
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([outputEl.value || generatedHtml()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'embedded-tutor-page.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Downloaded HTML file.');
  };

  const updateFromInput = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const name = target.getAttribute('name');
    if (!name) return;
    const value = target.value;

    const listMatch = name.match(/^(helpItems)\[(\d+)\]$/);
    const cardMatch = name.match(/^(visitCards)\[(\d+)\]\.(title|body)$/);
    const centerMatch = name.match(/^centerHours\[(\d+)\]\.section$/);
    const centerRowMatch = name.match(/^centerHours\[(\d+)\]\.rows\[(\d+)\]\.(day|detail)$/);
    const personalMatch = name.match(/^personalHours\[(\d+)\]\.(day|detail)$/);

    if (listMatch) {
      state.helpItems[Number(listMatch[2])] = value;
    } else if (cardMatch) {
      const idx = Number(cardMatch[2]);
      const key = cardMatch[3];
      state.visitCards[idx][key] = value;
    } else if (centerMatch) {
      state.centerHours[Number(centerMatch[1])].section = value;
    } else if (centerRowMatch) {
      const sectionIndex = Number(centerRowMatch[1]);
      const rowIndex = Number(centerRowMatch[2]);
      const key = centerRowMatch[3];
      state.centerHours[sectionIndex].rows[rowIndex][key] = value;
    } else if (personalMatch) {
      const rowIndex = Number(personalMatch[1]);
      const key = personalMatch[2];
      state.personalHours[rowIndex][key] = value;
    } else if (Object.prototype.hasOwnProperty.call(state, name)) {
      state[name] = value;
    }
    renderPreview();
  };

  const addHelpItem = () => {
    state.helpItems = [...state.helpItems, 'New help item'];
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const addVisitCard = () => {
    state.visitCards = [...state.visitCards, { title: 'New card', body: 'Edit this text.' }].slice(0, 4);
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const addHourRow = (sectionIndex) => {
    const section = state.centerHours[sectionIndex];
    section.rows = [...section.rows, { day: 'New day', detail: 'New time' }];
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const insertHourRow = (collection, index) => {
    const target = state[collection];
    target.splice(index + 1, 0, { day: 'New day', detail: 'New time' });
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const removeHourRow = (collection, index) => {
    const target = state[collection];
    if (target.length <= 1) return;
    target.splice(index, 1);
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const addCenterHourRow = (sectionIndex) => {
    state.centerHours[sectionIndex].rows = [...state.centerHours[sectionIndex].rows, { day: 'New day', detail: 'New time' }];
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const removeCenterHourRow = (sectionIndex, index) => {
    const rows = state.centerHours[sectionIndex].rows;
    if (rows.length <= 1) return;
    rows.splice(index, 1);
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const removeVisitCard = (index) => {
    if (state.visitCards.length <= 1) return;
    state.visitCards.splice(index, 1);
    renderEditor();
    bindEditor();
    renderPreview();
  };

  const bindEditor = () => {
    const form = document.querySelector('#generator-form');
    if (!form) return;
    form.addEventListener('input', updateFromInput);
    form.addEventListener('change', updateFromInput);
    form.querySelectorAll('[data-add-list-item="helpItems"]').forEach((btn) => btn.addEventListener('click', addHelpItem));
    form.querySelectorAll('[data-add-card="visitCards"]').forEach((btn) => btn.addEventListener('click', addVisitCard));
    form.querySelectorAll('[data-remove-card="visitCards"]').forEach((btn) => btn.addEventListener('click', (e) => removeVisitCard(Number(e.currentTarget.dataset.index))));
    form.querySelectorAll('[data-add-hour-section]').forEach((btn) => btn.addEventListener('click', (e) => addCenterHourRow(Number(e.currentTarget.dataset.addHourSection))));
    form.querySelectorAll('[data-add-row]').forEach((btn) => btn.addEventListener('click', (e) => {
      const key = e.currentTarget.dataset.addRow;
      const index = Number(e.currentTarget.dataset.index);
      if (key === 'personalHours') insertHourRow('personalHours', index);
      if (key.startsWith('centerHours-')) {
        const sectionIndex = Number(key.split('-')[1]);
        const rows = state.centerHours[sectionIndex].rows;
        rows.splice(index + 1, 0, { day: 'New day', detail: 'New time' });
        renderEditor();
        bindEditor();
        renderPreview();
      }
    }));
    form.querySelectorAll('[data-remove-row]').forEach((btn) => btn.addEventListener('click', (e) => {
      const key = e.currentTarget.dataset.removeRow;
      const index = Number(e.currentTarget.dataset.index);
      if (key === 'personalHours') removeHourRow('personalHours', index);
      if (key.startsWith('centerHours-')) {
        const sectionIndex = Number(key.split('-')[1]);
        removeCenterHourRow(sectionIndex, index);
      }
    }));
  };

  const reset = () => {
    state = defaultState();
    localStorage.removeItem(STORAGE_KEY);
    renderEditor();
    bindEditor();
    renderPreview();
    setStatus('Reset to defaults.');
  };

  renderEditor();
  bindEditor();
  renderPreview();

  copyBtns.forEach((btn) => btn.addEventListener('click', copyHtml));
  downloadBtn?.addEventListener('click', downloadHtml);
  resetBtn?.addEventListener('click', reset);
})();
