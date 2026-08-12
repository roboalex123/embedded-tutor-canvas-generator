(() => {
  const STORAGE_KEY = 'embedded-tutor-canvas-generator:v2';
  const outputEl = document.querySelector('[data-output]');
  const previewEl = document.querySelector('[data-preview]');
  const editorEl = document.querySelector('#editor');
  const statusEl = document.querySelector('[data-status]');
  const resetBtn = document.querySelector('[data-action="reset"]');
  const copyBtns = [...document.querySelectorAll('[data-action^="copy-html"]')];
  const downloadBtn = document.querySelector('[data-action="download-html"]');

  const termLabels = {
    fall: 'Fall',
    spring: 'Spring',
    summer: 'Summer',
  };

  const presets = {
    spring: {
      pageBg: '#f3f6fb',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#0f172a',
      muted: '#475569',
      border: '#cbd5e1',
      accent: '#0f766e',
      accent2: '#1d4ed8',
      heroStart: '#0b1b3a',
      heroMid: '#123a6f',
      heroEnd: '#0f766e',
      heroText: '#f8fafc',
      soft1: '#eff6ff',
      soft2: '#f5f3ff',
      soft3: '#ecfdf5',
      soft4: '#fff7ed',
    },
    summer: {
      pageBg: '#fbfdff',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#0f172a',
      muted: '#475569',
      border: '#cbd5e1',
      accent: '#2563eb',
      accent2: '#0f766e',
      heroStart: '#082f49',
      heroMid: '#0f766e',
      heroEnd: '#f59e0b',
      heroText: '#f8fafc',
      soft1: '#eff6ff',
      soft2: '#ecfeff',
      soft3: '#fef9c3',
      soft4: '#f0fdf4',
    },
    fall: {
      pageBg: '#f8fafc',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#111827',
      muted: '#4b5563',
      border: '#d1d5db',
      accent: '#b45309',
      accent2: '#7c3aed',
      heroStart: '#1f2937',
      heroMid: '#7c3aed',
      heroEnd: '#b45309',
      heroText: '#f9fafb',
      soft1: '#fff7ed',
      soft2: '#f5f3ff',
      soft3: '#fffbeb',
      soft4: '#fef2f2',
    },
    custom: {
      pageBg: '#f3f6fb',
      surface: '#ffffff',
      surfaceAlt: '#f8fafc',
      text: '#0f172a',
      muted: '#475569',
      border: '#cbd5e1',
      accent: '#1d4ed8',
      accent2: '#0f766e',
      heroStart: '#0b1b3a',
      heroMid: '#123a6f',
      heroEnd: '#0f766e',
      heroText: '#f8fafc',
      soft1: '#eff6ff',
      soft2: '#f5f3ff',
      soft3: '#ecfdf5',
      soft4: '#fff7ed',
    },
  };

  const sectionDefs = [
    { key: 'hero', label: 'Header / intro', note: 'Title, intro, contact block' },
    { key: 'images', label: 'Images', note: 'Portraits and gallery images' },
    { key: 'contact', label: 'Contact panel', note: 'Discord, Canvas, email' },
    { key: 'quickAccess', label: 'Quick access', note: 'Zoom, location, Canvas link' },
    { key: 'help', label: 'Help section', note: 'What you help with' },
    { key: 'services', label: 'Services / resources', note: 'Tutorial Center cards' },
    { key: 'hours', label: 'Tutorial Center hours', note: 'Center schedule table' },
    { key: 'personalHours', label: 'Your hours', note: 'Embedded schedule' },
    { key: 'pet', label: 'Optional pet section', note: 'Mascot / personality block' },
    { key: 'closingNote', label: 'Closing note', note: 'Final line at the bottom' },
  ];

  const defaultState = () => ({
    term: 'spring',
    palettePreset: 'spring',
    heroStart: presets.spring.heroStart,
    heroMid: presets.spring.heroMid,
    heroEnd: presets.spring.heroEnd,
    accent: presets.spring.accent,
    accent2: presets.spring.accent2,
    pageBg: presets.spring.pageBg,
    surface: presets.spring.surface,
    surfaceAlt: presets.spring.surfaceAlt,
    text: presets.spring.text,
    muted: presets.spring.muted,
    border: presets.spring.border,
    heroText: presets.spring.heroText,
    sections: {
      hero: true,
      images: true,
      contact: true,
      quickAccess: true,
      help: true,
      services: true,
      hours: true,
      personalHours: true,
      pet: false,
      closingNote: true,
    },
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
      {
        section: 'In Person (AC1-137)',
        rows: [
          { day: 'Monday', detail: '9:00am – 6:00pm' },
          { day: 'Tuesday', detail: '9:00am – 9:00pm' },
          { day: 'Wednesday', detail: '9:00am – 9:00pm' },
          { day: 'Thursday', detail: '9:00am – 9:00pm' },
          { day: 'Friday', detail: '9:00am – 5:00pm' },
        ],
      },
      {
        section: 'Online',
        rows: [
          { day: 'Monday', detail: '10:00am – 6:00pm' },
          { day: 'Tuesday', detail: '10:00am – 9:00pm' },
          { day: 'Wednesday', detail: '10:00am – 9:00pm' },
          { day: 'Thursday', detail: '10:00am – 9:00pm' },
          { day: 'Friday', detail: '10:00am – 5:00pm' },
          { day: 'Sunday', detail: '2:00pm – 8:00pm' },
        ],
      },
    ],
    personalHours: [
      { day: 'Monday', detail: 'Off' },
      { day: 'Tuesday', detail: 'Embedded (CSCI 45)' },
      { day: 'Wednesday', detail: '6:00pm – 8:30pm' },
      { day: 'Thursday', detail: 'Embedded (CSCI 45)' },
      { day: 'Friday', detail: 'Embedded (ENGR 6)' },
      { day: 'Sunday', detail: 'Online Only · 2:00pm – 5:00pm' },
    ],
    images: [
      {
        src: 'https://scccd.instructure.com/courses/108747/files/26143261/preview',
        alt: 'Robert Voss',
        caption: 'Tutor portrait',
      },
    ],
    petEnabled: false,
    petTitle: 'Optional mascot corner',
    petName: 'Neptune',
    petDescription: 'A tiny morale-boosting section for an animal, mascot, or lab gremlin.',
    petImage: '',
    petAlt: '',
    petNote: 'Optional. Delete it if you do not want a mascot block.',
    closingNote: 'Please feel free to come in, even if it’s a simple question.',
  });

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const clampItems = (arr, min, max, factory) => {
    const next = Array.isArray(arr) ? [...arr] : [];
    while (next.length < min) next.push(factory());
    if (next.length > max) next.length = max;
    return next;
  };

  const normalizeState = (raw) => {
    const defaults = defaultState();
    const parsed = raw && typeof raw === 'object' ? raw : {};
    const sections = { ...defaults.sections, ...(parsed.sections || {}) };
    const palettePreset = ['spring', 'summer', 'fall', 'custom'].includes(parsed.palettePreset) ? parsed.palettePreset : defaults.palettePreset;
    const chosen = palettePreset === 'custom' ? {} : presets[palettePreset];
    return {
      ...defaults,
      ...parsed,
      palettePreset,
      term: ['fall', 'spring', 'summer'].includes(parsed.term) ? parsed.term : defaults.term,
      heroStart: String(parsed.heroStart ?? chosen.heroStart ?? defaults.heroStart),
      heroMid: String(parsed.heroMid ?? chosen.heroMid ?? defaults.heroMid),
      heroEnd: String(parsed.heroEnd ?? chosen.heroEnd ?? defaults.heroEnd),
      accent: String(parsed.accent ?? chosen.accent ?? defaults.accent),
      accent2: String(parsed.accent2 ?? chosen.accent2 ?? defaults.accent2),
      pageBg: String(parsed.pageBg ?? chosen.pageBg ?? defaults.pageBg),
      surface: String(parsed.surface ?? chosen.surface ?? defaults.surface),
      surfaceAlt: String(parsed.surfaceAlt ?? chosen.surfaceAlt ?? defaults.surfaceAlt),
      text: String(parsed.text ?? chosen.text ?? defaults.text),
      muted: String(parsed.muted ?? chosen.muted ?? defaults.muted),
      border: String(parsed.border ?? chosen.border ?? defaults.border),
      heroText: String(parsed.heroText ?? chosen.heroText ?? defaults.heroText),
      sections,
      helpItems: clampItems(parsed.helpItems, 5, 8, () => ''),
      visitCards: clampItems(parsed.visitCards, 4, 4, () => ({ title: '', body: '' })).map((item, idx) => ({
        title: String(item?.title ?? defaults.visitCards[idx].title),
        body: String(item?.body ?? defaults.visitCards[idx].body),
      })),
      centerHours: clampItems(parsed.centerHours, 2, 2, () => ({ section: '', rows: [] })).map((section, idx) => ({
        section: String(section?.section ?? defaults.centerHours[idx].section),
        rows: clampItems(section?.rows, idx === 0 ? 5 : 6, 8, () => ({ day: '', detail: '' })).map((row) => ({
          day: String(row?.day ?? ''),
          detail: String(row?.detail ?? ''),
        })),
      })),
      personalHours: clampItems(parsed.personalHours, 4, 8, () => ({ day: '', detail: '' })).map((row) => ({
        day: String(row?.day ?? ''),
        detail: String(row?.detail ?? ''),
      })),
      images: clampItems(parsed.images, 0, 4, () => ({ src: '', alt: '', caption: '' })).map((img) => ({
        src: String(img?.src ?? ''),
        alt: String(img?.alt ?? ''),
        caption: String(img?.caption ?? ''),
      })),
      petEnabled: Boolean(parsed.petEnabled ?? defaults.petEnabled),
      petTitle: String(parsed.petTitle ?? defaults.petTitle),
      petName: String(parsed.petName ?? defaults.petName),
      petDescription: String(parsed.petDescription ?? defaults.petDescription),
      petImage: String(parsed.petImage ?? defaults.petImage),
      petAlt: String(parsed.petAlt ?? defaults.petAlt),
      petNote: String(parsed.petNote ?? defaults.petNote),
    };
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeState(JSON.parse(raw)) : defaultState();
    } catch {
      return defaultState();
    }
  };

  let state = loadState();

  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const termLabel = () => termLabels[state.term] || 'Spring';

  const palette = () => ({
    pageBg: state.pageBg,
    surface: state.surface,
    surfaceAlt: state.surfaceAlt,
    text: state.text,
    muted: state.muted,
    border: state.border,
    accent: state.accent,
    accent2: state.accent2,
    heroStart: state.heroStart,
    heroMid: state.heroMid,
    heroEnd: state.heroEnd,
    heroText: state.heroText,
    soft1: presets[state.palettePreset === 'custom' ? 'spring' : state.palettePreset].soft1,
    soft2: presets[state.palettePreset === 'custom' ? 'spring' : state.palettePreset].soft2,
    soft3: presets[state.palettePreset === 'custom' ? 'spring' : state.palettePreset].soft3,
    soft4: presets[state.palettePreset === 'custom' ? 'spring' : state.palettePreset].soft4,
  });

  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  const field = (label, name, value, type = 'text', opts = {}) => {
    const cls = opts.full ? 'field full' : 'field';
    return `
      <label class="${cls}">
        <span class="labelText">${escapeHtml(label)}</span>
        ${type === 'textarea'
          ? `<textarea name="${escapeHtml(name)}">${escapeHtml(value)}</textarea>`
          : `<input type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`}
      </label>`;
  };

  const checkbox = (label, name, checked, note = '') => `
    <label class="switchItem">
      <span class="switchLabel">
        <input type="checkbox" name="${escapeHtml(name)}" ${checked ? 'checked' : ''} />
        <span>${escapeHtml(label)}</span>
      </span>
      ${note ? `<small>${escapeHtml(note)}</small>` : ''}
    </label>`;

  const renderEditor = () => {
    const sectionToggles = sectionDefs.map((section) =>
      checkbox(section.label, `sections.${section.key}`, Boolean(state.sections[section.key]), section.note)
    ).join('');

    const images = state.images.map((img, index) => `
      <div class="rowCard imageRow">
        <div class="rowGrid imageGrid">
          <label>
            <span class="miniLabel">Image URL or data</span>
            <input name="images[${index}].src" value="${escapeHtml(img.src)}" placeholder="https://..." />
          </label>
          <label>
            <span class="miniLabel">Alt text</span>
            <input name="images[${index}].alt" value="${escapeHtml(img.alt)}" placeholder="Describe the image" />
          </label>
          <label class="fullField">
            <span class="miniLabel">Caption</span>
            <input name="images[${index}].caption" value="${escapeHtml(img.caption)}" placeholder="Optional caption" />
          </label>
          <label class="fullField filePicker">
            <span class="miniLabel">Upload image</span>
            <input type="file" accept="image/*" data-image-file="${index}" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-remove-image="${index}">Remove</button>
          </div>
        </div>
      </div>`).join('');

    const helpItems = state.helpItems.map((item, index) => `
      <label class="field full">
        <span class="labelText">Help item ${index + 1}</span>
        <textarea name="helpItems[${index}]">${escapeHtml(item)}</textarea>
      </label>`).join('');

    const visitCards = state.visitCards.map((card, index) => `
      <div class="rowCard">
        <div class="rowGrid serviceGrid">
          <label>
            <span class="miniLabel">Card title</span>
            <input name="visitCards[${index}].title" value="${escapeHtml(card.title)}" />
          </label>
          <label class="fullField">
            <span class="miniLabel">Card text</span>
            <input name="visitCards[${index}].body" value="${escapeHtml(card.body)}" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-remove-visit-card="${index}">Remove</button>
          </div>
        </div>
      </div>`).join('');

    const centerHours = state.centerHours.map((section, sectionIndex) => `
      <div class="rowCard">
        <div class="rowGrid sectionHeaderGrid">
          <label class="fullField">
            <span class="miniLabel">Section label</span>
            <input name="centerHours[${sectionIndex}].section" value="${escapeHtml(section.section)}" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-add-center-row="${sectionIndex}">Add row</button>
          </div>
        </div>
        <div class="hoursRows">
          ${section.rows.map((row, rowIndex) => `
            <div class="rowGrid hourRow">
              <label>
                <span class="miniLabel">Day</span>
                <input name="centerHours[${sectionIndex}].rows[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label>
                <span class="miniLabel">Detail</span>
                <input name="centerHours[${sectionIndex}].rows[${rowIndex}].detail" value="${escapeHtml(row.detail)}" />
              </label>
              <div class="helperStrip">
                <button class="ghostBtn" type="button" data-add-center-below="${sectionIndex}" data-index="${rowIndex}">Add below</button>
                <button class="ghostBtn" type="button" data-remove-center-row="${sectionIndex}" data-index="${rowIndex}">Remove</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`).join('');

    const personalHours = `
      <div class="rowCard">
        <div class="rowGrid sectionHeaderGrid">
          <label class="fullField">
            <span class="miniLabel">Section label</span>
            <input value="My ${termLabel()} Hours" disabled />
          </label>
          <div class="helperStrip"><span class="notice">Editable rows below</span></div>
        </div>
        <div class="hoursRows">
          ${state.personalHours.map((row, rowIndex) => `
            <div class="rowGrid hourRow">
              <label>
                <span class="miniLabel">Day</span>
                <input name="personalHours[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label>
                <span class="miniLabel">Detail</span>
                <input name="personalHours[${rowIndex}].detail" value="${escapeHtml(row.detail)}" />
              </label>
              <div class="helperStrip">
                <button class="ghostBtn" type="button" data-add-personal-below="${rowIndex}">Add below</button>
                <button class="ghostBtn" type="button" data-remove-personal-row="${rowIndex}">Remove</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    const pet = `
      <div class="fieldGrid">
        ${field('Pet title', 'petTitle', state.petTitle)}
        ${field('Pet name', 'petName', state.petName)}
        ${field('Pet image URL or data', 'petImage', state.petImage, 'text', { full: true })}
        ${field('Pet alt text', 'petAlt', state.petAlt)}
        ${field('Pet description', 'petDescription', state.petDescription, 'textarea', { full: true })}
        ${field('Pet note', 'petNote', state.petNote, 'text', { full: true })}
      </div>`;

    const paletteFields = `
      <div class="fieldGrid swatchGrid">
        ${field('Hero start', 'heroStart', state.heroStart, 'text')}
        ${field('Hero middle', 'heroMid', state.heroMid, 'text')}
        ${field('Hero end', 'heroEnd', state.heroEnd, 'text')}
        ${field('Accent', 'accent', state.accent, 'text')}
        ${field('Accent 2', 'accent2', state.accent2, 'text')}
        ${field('Page background', 'pageBg', state.pageBg, 'text')}
        ${field('Surface', 'surface', state.surface, 'text')}
        ${field('Surface alt', 'surfaceAlt', state.surfaceAlt, 'text')}
      </div>`;

    editorEl.innerHTML = `
      <form id="generator-form" class="editorForm">
        <section class="fieldGroup card">
          <div class="sectionHead">
            <div>
              <h3>Site setup</h3>
              <p class="groupNote">Term, colors, and what sections appear in the final page.</p>
            </div>
          </div>
          <div class="fieldGrid topGrid">
            ${field('Term', 'term', state.term, 'text')}
            <label class="field">
              <span class="labelText">Term</span>
              <select name="term">
                <option value="fall" ${state.term === 'fall' ? 'selected' : ''}>Fall</option>
                <option value="spring" ${state.term === 'spring' ? 'selected' : ''}>Spring</option>
                <option value="summer" ${state.term === 'summer' ? 'selected' : ''}>Summer</option>
              </select>
            </label>
            <label class="field">
              <span class="labelText">Color preset</span>
              <select name="palettePreset">
                <option value="spring" ${state.palettePreset === 'spring' ? 'selected' : ''}>Spring</option>
                <option value="summer" ${state.palettePreset === 'summer' ? 'selected' : ''}>Summer</option>
                <option value="fall" ${state.palettePreset === 'fall' ? 'selected' : ''}>Fall</option>
                <option value="custom" ${state.palettePreset === 'custom' ? 'selected' : ''}>Custom</option>
              </select>
            </label>
          </div>
          <div class="sectionToggleGrid">
            ${sectionToggles}
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${paletteFields}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.hero ? '' : 'disabled'}">
          <h3>Header and intro</h3>
          <p class="groupNote">This is the top block students see first.</p>
          <div class="fieldGrid">
            ${field('Page title', 'pageTitle', state.pageTitle)}
            ${field('Eyebrow', 'eyebrow', state.eyebrow)}
            ${field('Tutor name', 'tutorName', state.tutorName)}
            ${field('Tutor role', 'tutorRole', state.tutorRole)}
            ${field('Intro lead', 'introLead', state.introLead, 'text', { full: true })}
            ${field('Intro body', 'introBody', state.introBody, 'textarea', { full: true })}
            ${field('Intro extra', 'introExtra', state.introExtra, 'textarea', { full: true })}
            ${field('Intro goal', 'introGoal', state.introGoal, 'text', { full: true })}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.contact ? '' : 'disabled'}">
          <h3>Contact and links</h3>
          <p class="groupNote">Keep the contact options direct and short.</p>
          <div class="fieldGrid">
            ${field('Discord line', 'contactDiscord', state.contactDiscord)}
            ${field('Canvas Inbox line', 'contactCanvas', state.contactCanvas)}
            ${field('Email address', 'contactEmail', state.contactEmail, 'email')}
            ${field('Contact tip', 'contactTip', state.contactTip, 'text', { full: true })}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.quickAccess ? '' : 'disabled'}">
          <h3>Quick access</h3>
          <p class="groupNote">Zoom, location, and the main Canvas page.</p>
          <div class="fieldGrid">
            ${field('Zoom URL', 'zoomUrl', state.zoomUrl, 'url', { full: true })}
            ${field('Zoom ID', 'zoomId', state.zoomId)}
            ${field('In-person location', 'inPersonLocation', state.inPersonLocation, 'text', { full: true })}
            ${field('Canvas page URL', 'canvasUrl', state.canvasUrl, 'url', { full: true })}
            ${field('Canvas link label', 'canvasLabel', state.canvasLabel)}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.images ? '' : 'disabled'}">
          <h3>Images</h3>
          <p class="groupNote">Use one image or a small gallery. URLs or uploaded files both work.</p>
          <div class="fieldGrid">${images || '<p class="muted">No image slots yet.</p>'}</div>
          <div class="helperStrip" style="margin-top: 12px;">
            <button class="ghostBtn" type="button" data-add-image>Add image</button>
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.help ? '' : 'disabled'}">
          <h3>How I can help</h3>
          <p class="groupNote">Short bullets read better than AI filler.</p>
          <div class="fieldGrid">${helpItems}</div>
          <div class="helperStrip" style="margin-top: 12px;">
            <button class="ghostBtn" type="button" data-add-help-item>Add help item</button>
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${field('Course note', 'courseNote', state.courseNote, 'textarea', { full: true })}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.services ? '' : 'disabled'}">
          <h3>What to expect at the Tutorial Center</h3>
          <p class="groupNote">These are the smaller service cards students skim quickly.</p>
          <div class="fieldGrid">${visitCards}</div>
          <div class="helperStrip" style="margin-top: 12px;">
            <button class="ghostBtn" type="button" data-add-visit-card>Add card</button>
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${field('Resources note', 'resourcesNote', state.resourcesNote, 'textarea', { full: true })}
            ${field('Resources tip', 'resourcesTip', state.resourcesTip, 'text', { full: true })}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.hours ? '' : 'disabled'}">
          <h3>Tutorial Center hours</h3>
          <p class="groupNote">Prefilled, but easy to change later.</p>
          <div class="fieldGrid">${centerHours}</div>
        </section>

        <section class="fieldGroup card ${state.sections.personalHours ? '' : 'disabled'}">
          <h3>${escapeHtml(termLabel())} personal hours</h3>
          <p class="groupNote">Use this for your personal embedded schedule.</p>
          <div class="fieldGrid">${personalHours}</div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${field('Closing note', 'closingNote', state.closingNote, 'text', { full: true })}
          </div>
        </section>

        <section class="fieldGroup card ${state.sections.pet ? '' : 'disabled'}">
          <div class="sectionHead">
            <div>
              <h3>Optional pet section</h3>
              <p class="groupNote">A mascot corner if you want the page to feel less clinical.</p>
            </div>
            <label class="switchItem inlineSwitch">
              <span class="switchLabel"><input type="checkbox" name="petEnabled" ${state.petEnabled ? 'checked' : ''} /> <span>Show pet block</span></span>
            </label>
          </div>
          ${pet}
        </section>
      </form>
    `;
  };

  const theme = palette();

  const buildImageCard = (img, index, compact = false) => {
    if (!img.src) return '';
    const width = compact ? 'min(100%, 320px)' : '100%';
    return `
      <figure style="margin:0; flex: 1 1 ${compact ? '240px' : '280px'}; max-width:${width}; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.caption || `Image ${index + 1}`)}" style="width:100%; height:auto; display:block; border-radius:12px; border:1px solid var(--border);" />
        ${(img.caption || img.alt) ? `<figcaption style="margin-top:8px; font-size:13.5px; color:var(--muted);">${escapeHtml(img.caption || img.alt)}</figcaption>` : ''}
      </figure>`;
  };

  const buildHoursTable = (title, rows, dark = false) => {
    const bg = dark ? 'var(--heroStart)' : 'var(--surface-alt)';
    const fg = dark ? 'var(--heroText)' : 'var(--text)';
    const border = dark ? 'rgba(255,255,255,0.15)' : 'var(--border)';
    return `
      <section style="flex:1 1 0%; min-width:300px; padding:14px; border-radius:12px; background:${bg}; border:1px solid ${dark ? 'var(--heroStart)' : 'var(--border)'}; color:${fg};">
        <strong>${escapeHtml(title)}</strong>
        <table style="width:100%; border-collapse:collapse; font-size:14px; margin-top:8px; color:${fg};">
          <tbody>
            ${rows.map((row, idx) => `
              <tr>
                <th scope="row" style="padding:6px 0; text-align:left; font-weight:700; border-top:${idx === 0 ? 'none' : `1px solid ${border}`};">${escapeHtml(row.day)}</th>
                <td style="padding:6px 0; text-align:right; border-top:${idx === 0 ? 'none' : `1px solid ${border}`};">${escapeHtml(row.detail)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </section>`;
  };

  const buildVisitCard = (item, bg, border) => `
    <div style="flex:1 1 0%; min-width:280px; padding:14px; border-radius:12px; background:${bg}; border:1px solid ${border}; color:var(--text);">
      <strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.body)}
    </div>`;

  const buildHelpList = () => state.helpItems.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  const buildPetBlock = () => {
    if (!state.petEnabled) return '';
    const hasImage = state.petImage.trim();
    return `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.petTitle || 'Optional mascot corner')}</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:stretch;">
          ${hasImage ? `
            <div style="flex:0 0 auto; min-width:220px; max-width:320px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border);">
              <img src="${escapeHtml(state.petImage)}" alt="${escapeHtml(state.petAlt || state.petName || 'Mascot') }" style="width:100%; height:auto; display:block; border-radius:12px; border:1px solid var(--border);" />
            </div>` : ''}
          <div style="flex:1 1 280px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
            <div style="font-size:18px; font-weight:700; margin-bottom:6px;">${escapeHtml(state.petName || 'Mascot')}</div>
            <div style="font-size:14.5px; color:var(--muted);">${escapeHtml(state.petDescription)}</div>
            <div style="margin-top:10px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.petNote)}</em></div>
          </div>
        </div>
      </section>`;
  };

  const buildFragment = () => {
    const vars = [
      `--page-bg:${theme.pageBg}`,
      `--surface:${theme.surface}`,
      `--surface-alt:${theme.surfaceAlt}`,
      `--text:${theme.text}`,
      `--muted:${theme.muted}`,
      `--border:${theme.border}`,
      `--accent:${theme.accent}`,
      `--accent-2:${theme.accent2}`,
      `--hero-start:${theme.heroStart}`,
      `--hero-mid:${theme.heroMid}`,
      `--hero-end:${theme.heroEnd}`,
      `--hero-text:${theme.heroText}`,
    ].join('; ');

    const heroImages = state.images.filter((img) => img.src.trim());
    const imageHtml = heroImages.length
      ? `
        <section style="margin-top:22px;">
          <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">Images</h2>
          <div style="display:flex; flex-wrap:wrap; gap:12px;">
            ${heroImages.map((img, idx) => buildImageCard(img, idx, true)).join('')}
          </div>
        </section>`
      : '';

    const contactHtml = state.sections.contact ? `
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.22); font-size:14px; color:var(--hero-text);">
        <div style="margin-bottom:6px; font-weight:700;">Contact</div>
        <div><strong>Discord (preferred):</strong> ${escapeHtml(state.contactDiscord)}</div>
        <div><strong>Canvas Inbox:</strong> ${escapeHtml(state.contactCanvas)}</div>
        <div><strong>Email:</strong> <a style="color:#bfdbfe; text-decoration:underline;" href="mailto:${escapeHtml(state.contactEmail)}">${escapeHtml(state.contactEmail)}</a></div>
        <div style="margin-top:6px; font-size:13.5px;"><em>${escapeHtml(state.contactTip)}</em></div>
      </div>` : '';

    const quickAccessHtml = state.sections.quickAccess ? `
      <section style="margin-top:16px; display:flex; flex-wrap:wrap; gap:12px;">
        <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:8px; font-weight:700; color:var(--text);">Quick Access</div>
          <div style="font-size:14px;">
            <div style="margin-bottom:4px;"><strong>Online:</strong> <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.zoomUrl)}">Tutorial Center Zoom</a></div>
            <div style="margin-bottom:4px;"><strong>Zoom ID:</strong> ${escapeHtml(state.zoomId)}</div>
            <div><strong>In Person:</strong> ${escapeHtml(state.inPersonLocation)}</div>
          </div>
        </div>
        <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:8px; font-weight:700; color:var(--text);">Tutorial Center Canvas</div>
          <div style="font-size:14px;">For the latest services, schedules, and resources, visit the <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</div>
        </div>
      </section>` : '';

    const helpHtml = state.sections.help ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">How I can help in this course</h2>
        <div style="padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <ul style="margin:0; padding-left:18px;">${buildHelpList()}</ul>
          <div style="margin-top:10px; font-size:13.5px; color:var(--muted);">${escapeHtml(state.courseNote)}</div>
        </div>
      </section>` : '';

    const servicesHtml = state.sections.services ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">What to expect at the Tutorial Center</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          ${state.visitCards.slice(0, 2).map((item, idx) => buildVisitCard(item, idx === 0 ? 'var(--soft1)' : 'var(--soft2)', idx === 0 ? '#fb923c' : '#a78bfa')).join('')}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          ${state.visitCards.slice(2, 4).map((item, idx) => buildVisitCard(item, idx === 0 ? 'var(--soft3)' : 'var(--soft4)', idx === 0 ? '#60a5fa' : '#34d399')).join('')}
        </div>
        <div style="margin-top:12px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);"><strong>Resources available:</strong> ${escapeHtml(state.resourcesNote)}</div>
        <div style="margin-top:10px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.resourcesTip)} <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</em></div>
      </section>` : '';

    const hoursHtml = state.sections.hours ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">Tutorial Center Hours</h2>
        <div style="display:flex; flex-wrap:wrap; gap:14px;">
          ${state.centerHours.map((section, idx) => buildHoursTable(section.section, section.rows, idx === 1)).join('')}
        </div>
      </section>` : '';

    const personalHoursHtml = state.sections.personalHours ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(termLabel())} personal hours</h2>
        <div style="padding:14px; border-radius:12px; background:var(--hero-start); border:1px solid var(--hero-start); color:var(--hero-text);">
          <table style="width:100%; border-collapse:collapse; font-size:14px; color:var(--hero-text);">
            <tbody>
              ${state.personalHours.map((row, idx) => `
                <tr>
                  <th scope="row" style="padding:6px 0; text-align:left; font-weight:700; border-top:${idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)'};">${escapeHtml(row.day)}</th>
                  <td style="padding:6px 0; text-align:right; border-top:${idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)'};">${escapeHtml(row.detail)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:10px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.closingNote)}</em></div>
      </section>` : '';

    const petHtml = state.sections.pet ? buildPetBlock() : '';
    const heroSection = state.sections.hero ? `
      <section style="display:flex; flex-wrap:wrap; gap:18px; align-items:stretch; padding:18px; border-radius:14px; background:linear-gradient(135deg, var(--hero-start) 0%, var(--hero-mid) 52%, var(--hero-end) 100%); border:1px solid var(--hero-start); color:var(--hero-text);">
        <div style="flex:1; min-width:260px; color:var(--hero-text);">
          <div style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700; opacity:0.95;">${escapeHtml(state.eyebrow)} · ${escapeHtml(termLabel())}</div>
          <div style="font-size:18px; font-weight:700; margin:8px 0 6px;">${escapeHtml(state.introLead)}</div>
          <div style="font-size:14.5px; color:rgba(255,255,255,0.92);">
            <p style="margin:0 0 10px 0;">${escapeHtml(state.introBody)}</p>
            <p style="margin:0 0 10px 0;">${escapeHtml(state.introExtra)}</p>
            <p style="margin:0;">${escapeHtml(state.introGoal)}</p>
          </div>
          ${contactHtml}
        </div>
      </section>` : '';

    return `
      <div style="max-width:960px; margin:0 auto; padding:24px; font-family:Arial, Helvetica, sans-serif; line-height:1.55; color:var(--text); background:var(--page-bg); ${vars}">
        <header style="margin-bottom:18px;">
          <p style="margin:0 0 6px 0; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent2); font-weight:700;">${escapeHtml(state.eyebrow)}</p>
          <h1 style="margin:0; font-size:30px; line-height:1.2; color:var(--text);">${escapeHtml(state.pageTitle)}</h1>
          <div style="margin-top:6px; font-size:14px; color:var(--muted);">${escapeHtml(state.tutorName)} &middot; ${escapeHtml(state.tutorRole)}</div>
        </header>
        ${heroSection}
        ${quickAccessHtml}
        ${imageHtml}
        ${helpHtml}
        ${servicesHtml}
        ${hoursHtml}
        ${personalHoursHtml}
        ${petHtml}
      </div>`;
  };

  const buildStandaloneHtml = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(state.pageTitle)}</title>
  <style>
    :root { color-scheme: light; }
    html, body { margin: 0; padding: 0; background: ${escapeHtml(theme.pageBg)}; }
    body { font-family: Arial, Helvetica, sans-serif; line-height: 1.55; color: ${escapeHtml(theme.text)}; }
    a { color: ${escapeHtml(theme.accent)}; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${buildFragment()}
</body>
</html>`;

  const renderPreview = () => {
    outputEl.value = buildFragment();
    previewEl.srcdoc = buildStandaloneHtml();
    saveState();
  };

  const copyHtml = async () => {
    const html = outputEl.value || buildFragment();
    try {
      await navigator.clipboard.writeText(html);
      setStatus('Canvas HTML copied.');
    } catch {
      outputEl.focus();
      outputEl.select();
      document.execCommand('copy');
      setStatus('Canvas HTML copied using the fallback selection method.');
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([buildStandaloneHtml()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'embedded-tutor-page.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Downloaded full local HTML page.');
  };

  const applyInput = (name, value) => {
    const listMatch = name.match(/^helpItems\[(\d+)\]$/);
    const visitMatch = name.match(/^visitCards\[(\d+)\]\.(title|body)$/);
    const centerSectionMatch = name.match(/^centerHours\[(\d+)\]\.section$/);
    const centerRowMatch = name.match(/^centerHours\[(\d+)\]\.rows\[(\d+)\]\.(day|detail)$/);
    const personalMatch = name.match(/^personalHours\[(\d+)\]\.(day|detail)$/);
    const imageMatch = name.match(/^images\[(\d+)\]\.(src|alt|caption)$/);

    if (name.startsWith('sections.')) {
      const key = name.split('.')[1];
      state.sections[key] = Boolean(value);
      return;
    }
    if (name === 'petEnabled') {
      state.petEnabled = Boolean(value);
      return;
    }
    if (listMatch) {
      state.helpItems[Number(listMatch[1])] = value;
      return;
    }
    if (visitMatch) {
      const index = Number(visitMatch[1]);
      state.visitCards[index][visitMatch[2]] = value;
      return;
    }
    if (centerSectionMatch) {
      state.centerHours[Number(centerSectionMatch[1])].section = value;
      return;
    }
    if (centerRowMatch) {
      const s = Number(centerRowMatch[1]);
      const r = Number(centerRowMatch[2]);
      state.centerHours[s].rows[r][centerRowMatch[3]] = value;
      return;
    }
    if (personalMatch) {
      const r = Number(personalMatch[1]);
      state.personalHours[r][personalMatch[2]] = value;
      return;
    }
    if (imageMatch) {
      const i = Number(imageMatch[1]);
      state.images[i][imageMatch[2]] = value;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(state, name)) {
      state[name] = value;
    }
  };

  const bindEditor = () => {
    const form = document.querySelector('#generator-form');
    if (!form) return;

    form.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const name = target.getAttribute('name');
      if (!name) return;
      applyInput(name, target.type === 'checkbox' ? target.checked : target.value);
      renderPreview();
    });

    form.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const name = target.getAttribute('name');
      if (!name) return;
      if (name === 'palettePreset') {
        const preset = presets[target.value] || presets.spring;
        state.palettePreset = target.value;
        if (target.value !== 'custom') {
          state.heroStart = preset.heroStart;
          state.heroMid = preset.heroMid;
          state.heroEnd = preset.heroEnd;
          state.accent = preset.accent;
          state.accent2 = preset.accent2;
          state.pageBg = preset.pageBg;
          state.surface = preset.surface;
          state.surfaceAlt = preset.surfaceAlt;
          state.text = preset.text;
          state.muted = preset.muted;
          state.border = preset.border;
          state.heroText = preset.heroText;
        }
        renderEditor();
        bindEditor();
        renderPreview();
        return;
      }
      if (name === 'term') {
        state.term = target.value;
        renderEditor();
        bindEditor();
        renderPreview();
        return;
      }
      if (name === 'petEnabled') {
        state.petEnabled = target.checked;
        renderPreview();
      }
    });

    form.querySelectorAll('[data-add-help-item]').forEach((btn) => btn.addEventListener('click', () => {
      state.helpItems = [...state.helpItems, 'New help item'];
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-add-visit-card]').forEach((btn) => btn.addEventListener('click', () => {
      state.visitCards = [...state.visitCards, { title: 'New card', body: 'Edit this text.' }].slice(0, 4);
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-remove-visit-card]').forEach((btn) => btn.addEventListener('click', (event) => {
      const index = Number(event.currentTarget.dataset.removeVisitCard);
      if (state.visitCards.length <= 1) return;
      state.visitCards.splice(index, 1);
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-add-image]').forEach((btn) => btn.addEventListener('click', () => {
      if (state.images.length >= 4) return;
      state.images = [...state.images, { src: '', alt: '', caption: '' }];
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-remove-image]').forEach((btn) => btn.addEventListener('click', (event) => {
      const index = Number(event.currentTarget.dataset.removeImage);
      state.images.splice(index, 1);
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-image-file]').forEach((input) => input.addEventListener('change', async (event) => {
      const target = event.currentTarget;
      const index = Number(target.dataset.imageFile);
      const file = target.files && target.files[0];
      if (!file) return;
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      state.images[index].src = dataUrl;
      if (!state.images[index].alt) state.images[index].alt = file.name.replace(/\.[^.]+$/, '');
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-add-center-row]').forEach((btn) => btn.addEventListener('click', (event) => {
      const sectionIndex = Number(event.currentTarget.dataset.addCenterRow);
      state.centerHours[sectionIndex].rows.push({ day: 'New day', detail: 'New time' });
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-add-center-below]').forEach((btn) => btn.addEventListener('click', (event) => {
      const sectionIndex = Number(event.currentTarget.dataset.addCenterBelow);
      const rowIndex = Number(event.currentTarget.dataset.index);
      state.centerHours[sectionIndex].rows.splice(rowIndex + 1, 0, { day: 'New day', detail: 'New time' });
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-remove-center-row]').forEach((btn) => btn.addEventListener('click', (event) => {
      const sectionIndex = Number(event.currentTarget.dataset.removeCenterRow);
      const rowIndex = Number(event.currentTarget.dataset.index);
      const rows = state.centerHours[sectionIndex].rows;
      if (rows.length <= 1) return;
      rows.splice(rowIndex, 1);
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-add-personal-below]').forEach((btn) => btn.addEventListener('click', (event) => {
      const rowIndex = Number(event.currentTarget.dataset.addPersonalBelow);
      state.personalHours.splice(rowIndex + 1, 0, { day: 'New day', detail: 'New time' });
      renderEditor();
      bindEditor();
      renderPreview();
    }));

    form.querySelectorAll('[data-remove-personal-row]').forEach((btn) => btn.addEventListener('click', (event) => {
      const rowIndex = Number(event.currentTarget.dataset.removePersonalRow);
      if (state.personalHours.length <= 1) return;
      state.personalHours.splice(rowIndex, 1);
      renderEditor();
      bindEditor();
      renderPreview();
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
