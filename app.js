(() => {
  const STORAGE_KEY = 'embedded-tutor-canvas-generator:v4';
  const outputEl = document.querySelector('[data-output]');
  const previewEl = document.querySelector('[data-preview]');
  const editorEl = document.querySelector('#editor');
  const statusEl = document.querySelector('[data-status]');
  const resetBtn = document.querySelector('[data-action="reset"]');
  const copyBtns = [...document.querySelectorAll('[data-action^="copy-html"]')];
  const downloadBtn = document.querySelector('[data-action="download-html"]');

  const termLabels = { fall: 'Fall', spring: 'Spring', summer: 'Summer' };

  const presets = {
    spring: {
      pageBg: '#f3f6fb', surface: '#ffffff', surfaceAlt: '#f8fafc', text: '#0f172a', muted: '#475569', border: '#cbd5e1',
      accent: '#0f766e', accent2: '#1d4ed8', heroStart: '#0b1b3a', heroMid: '#123a6f', heroEnd: '#0f766e', heroText: '#f8fafc',
      soft1: '#eff6ff', soft2: '#f5f3ff', soft3: '#ecfdf5', soft4: '#fff7ed',
    },
    summer: {
      pageBg: '#fbfdff', surface: '#ffffff', surfaceAlt: '#f8fafc', text: '#0f172a', muted: '#475569', border: '#cbd5e1',
      accent: '#2563eb', accent2: '#0f766e', heroStart: '#082f49', heroMid: '#0f766e', heroEnd: '#f59e0b', heroText: '#f8fafc',
      soft1: '#eff6ff', soft2: '#ecfeff', soft3: '#fef9c3', soft4: '#f0fdf4',
    },
    fall: {
      pageBg: '#f8fafc', surface: '#ffffff', surfaceAlt: '#f8fafc', text: '#111827', muted: '#4b5563', border: '#d1d5db',
      accent: '#b45309', accent2: '#7c3aed', heroStart: '#1f2937', heroMid: '#7c3aed', heroEnd: '#b45309', heroText: '#f9fafb',
      soft1: '#fff7ed', soft2: '#f5f3ff', soft3: '#fffbeb', soft4: '#fef2f2',
    },
    custom: {
      pageBg: '#f3f6fb', surface: '#ffffff', surfaceAlt: '#f8fafc', text: '#0f172a', muted: '#475569', border: '#cbd5e1',
      accent: '#1d4ed8', accent2: '#0f766e', heroStart: '#0b1b3a', heroMid: '#123a6f', heroEnd: '#0f766e', heroText: '#f8fafc',
      soft1: '#eff6ff', soft2: '#f5f3ff', soft3: '#ecfdf5', soft4: '#fff7ed',
    },
  };

  const sectionDefs = [
    { key: 'hero', label: 'Header / intro', note: 'Title, intro, first impression' },
    { key: 'contact', label: 'Contact methods', note: 'Which methods appear' },
    { key: 'quickAccess', label: 'Quick access', note: 'Zoom, Canvas, location' },
    { key: 'images', label: 'Images', note: 'Portraits and gallery' },
    { key: 'help', label: 'How I can help', note: 'Bullets and course note' },
    { key: 'services', label: 'Services / resources', note: 'Tutorial Center cards' },
    { key: 'hours', label: 'Tutorial Center hours', note: 'Center schedule table' },
    { key: 'personalHours', label: 'Personal hours', note: 'Your embedded schedule' },
    { key: 'pet', label: 'Pet / mascot', note: 'Optional personality block' },
    { key: 'closingNote', label: 'Closing note', note: 'Final line at the bottom' },
  ];

  const contactMethodDefs = [
    { key: 'email', label: 'Email', icon: '✉️', href: 'mailto:', placeholder: 'rav1@my.scccd.edu' },
    { key: 'discord', label: 'Discord', icon: '💬', href: null, placeholder: 'vossrobert in your class Discord server' },
    { key: 'canvas', label: 'Canvas', icon: '🧭', href: null, placeholder: 'Message me through Canvas Messages' },
    { key: 'slack', label: 'Slack', icon: '#', href: null, placeholder: 'optional Slack handle or channel' },
    { key: 'telegram', label: 'Telegram', icon: '✈️', href: 'https://t.me/', placeholder: '@wheelchairboy7246' },
    { key: 'sms', label: 'SMS', icon: '📱', href: 'sms:', placeholder: 'optional number' },
  ];

  const defaultState = () => ({
    term: 'spring',
    palettePreset: 'spring',
    pageBg: presets.spring.pageBg,
    surface: presets.spring.surface,
    surfaceAlt: presets.spring.surfaceAlt,
    text: presets.spring.text,
    muted: presets.spring.muted,
    border: presets.spring.border,
    accent: presets.spring.accent,
    accent2: presets.spring.accent2,
    heroStart: presets.spring.heroStart,
    heroMid: presets.spring.heroMid,
    heroEnd: presets.spring.heroEnd,
    heroText: presets.spring.heroText,
    sections: {
      hero: true,
      contact: true,
      quickAccess: true,
      images: true,
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
    contactTip: 'Please include your course, what you tried, and a screenshot or photo if it’s a circuit issue.',
    contactMethods: {
      email: { enabled: true, value: 'rav1@my.scccd.edu' },
      discord: { enabled: true, value: 'vossrobert in your class Discord server' },
      canvas: { enabled: true, value: 'Message me through Canvas Messages' },
      slack: { enabled: false, value: '' },
      telegram: { enabled: false, value: '@wheelchairboy7246' },
      sms: { enabled: false, value: '' },
    },
    zoomUrl: 'https://cccconfer.zoom.us/j/5593255248',
    zoomId: '559 325 5248',
    inPersonLocation: 'AC1-137, next to the computer lab',
    canvasUrl: 'https://scccd.instructure.com/courses/108747',
    canvasLabel: 'Tutorial Center Canvas',
    images: [
      { src: 'https://scccd.instructure.com/courses/108747/files/26143261/preview', alt: 'Robert Voss', caption: 'Tutor portrait' },
    ],
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
    petName: 'Neptune',
    petDescription: 'A tiny morale-boosting section for an animal, mascot, or lab gremlin.',
    petImage: '',
    petAlt: '',
    petNote: 'Optional. Delete it if you do not want a mascot block.',
    closingNote: 'Please feel free to come in, even if it’s a simple question.',
  });

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const normalizeState = (raw) => {
    const defaults = defaultState();
    const parsed = raw && typeof raw === 'object' ? raw : {};
    const presetName = ['spring', 'summer', 'fall', 'custom'].includes(parsed.palettePreset) ? parsed.palettePreset : defaults.palettePreset;
    const preset = presetName === 'custom' ? {} : presets[presetName];
    const sections = { ...defaults.sections, ...(parsed.sections || {}) };
    const methods = {};
    for (const def of contactMethodDefs) {
      const src = parsed.contactMethods?.[def.key] || defaults.contactMethods[def.key];
      methods[def.key] = { enabled: Boolean(src?.enabled), value: String(src?.value ?? '') };
    }
    return {
      ...defaults,
      ...parsed,
      term: ['fall', 'spring', 'summer'].includes(parsed.term) ? parsed.term : defaults.term,
      palettePreset: presetName,
      sections,
      pageBg: String(parsed.pageBg ?? preset.pageBg ?? defaults.pageBg),
      surface: String(parsed.surface ?? preset.surface ?? defaults.surface),
      surfaceAlt: String(parsed.surfaceAlt ?? preset.surfaceAlt ?? defaults.surfaceAlt),
      text: String(parsed.text ?? preset.text ?? defaults.text),
      muted: String(parsed.muted ?? preset.muted ?? defaults.muted),
      border: String(parsed.border ?? preset.border ?? defaults.border),
      accent: String(parsed.accent ?? preset.accent ?? defaults.accent),
      accent2: String(parsed.accent2 ?? preset.accent2 ?? defaults.accent2),
      heroStart: String(parsed.heroStart ?? preset.heroStart ?? defaults.heroStart),
      heroMid: String(parsed.heroMid ?? preset.heroMid ?? defaults.heroMid),
      heroEnd: String(parsed.heroEnd ?? preset.heroEnd ?? defaults.heroEnd),
      heroText: String(parsed.heroText ?? preset.heroText ?? defaults.heroText),
      images: Array.isArray(parsed.images) ? parsed.images.slice(0, 4).map((img) => ({
        src: String(img?.src ?? ''),
        alt: String(img?.alt ?? ''),
        caption: String(img?.caption ?? ''),
      })) : clone(defaults.images),
      helpItems: Array.isArray(parsed.helpItems) ? parsed.helpItems.slice(0, 8).map((item) => String(item ?? '')) : clone(defaults.helpItems),
      visitCards: Array.isArray(parsed.visitCards) ? parsed.visitCards.slice(0, 4).map((item, idx) => ({
        title: String(item?.title ?? defaults.visitCards[idx].title),
        body: String(item?.body ?? defaults.visitCards[idx].body),
      })) : clone(defaults.visitCards),
      centerHours: Array.isArray(parsed.centerHours) ? parsed.centerHours.slice(0, 2).map((section, idx) => ({
        section: String(section?.section ?? defaults.centerHours[idx].section),
        rows: Array.isArray(section?.rows) ? section.rows.slice(0, 8).map((row) => ({ day: String(row?.day ?? ''), detail: String(row?.detail ?? '') })) : clone(defaults.centerHours[idx].rows),
      })) : clone(defaults.centerHours),
      personalHours: Array.isArray(parsed.personalHours) ? parsed.personalHours.slice(0, 8).map((row) => ({ day: String(row?.day ?? ''), detail: String(row?.detail ?? '') })) : clone(defaults.personalHours),
      contactMethods: methods,
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
  const setStatus = (message) => { statusEl.textContent = message; };
  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const termLabel = () => termLabels[state.term] || 'Spring';
  const activeTheme = () => {
    const base = state.palettePreset === 'custom' ? presets.spring : presets[state.palettePreset] || presets.spring;
    return {
      pageBg: state.pageBg, surface: state.surface, surfaceAlt: state.surfaceAlt, text: state.text, muted: state.muted, border: state.border,
      accent: state.accent, accent2: state.accent2, heroStart: state.heroStart, heroMid: state.heroMid, heroEnd: state.heroEnd, heroText: state.heroText,
      soft1: base.soft1, soft2: base.soft2, soft3: base.soft3, soft4: base.soft4,
    };
  };

  const textField = (label, name, value, type = 'text', full = false) => `
    <label class="field ${full ? 'full' : ''}">
      <span class="labelText">${escapeHtml(label)}</span>
      ${type === 'textarea'
        ? `<textarea name="${escapeHtml(name)}">${escapeHtml(value)}</textarea>`
        : `<input type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`}
    </label>`;

  const colorField = (label, name, value) => `
    <label class="field colorField">
      <span class="labelText">${escapeHtml(label)}</span>
      <span class="colorPair">
        <input type="color" name="${escapeHtml(name)}__color" value="${escapeHtml(value)}" aria-label="${escapeHtml(label)} color picker" />
        <input type="text" name="${escapeHtml(name)}" value="${escapeHtml(value)}" aria-label="${escapeHtml(label)} hex value" />
      </span>
    </label>`;

  const switchField = (label, name, checked, note = '') => `
    <label class="switchItem">
      <span class="switchLabel">
        <input type="checkbox" name="${escapeHtml(name)}" ${checked ? 'checked' : ''} />
        <span>${escapeHtml(label)}</span>
      </span>
      ${note ? `<small>${escapeHtml(note)}</small>` : ''}
    </label>`;

  const contactBadge = (def, item) => {
    const value = String(item?.value ?? '');
    const icon = `<span class="iconBadge" aria-hidden="true">${escapeHtml(def.icon)}</span>`;
    const label = `<span class="contactLabel"><strong>${escapeHtml(def.label)}</strong><span>${escapeHtml(value)}</span></span>`;
    if (!item?.enabled || !value) return `<div class="contactBadge">${icon}${label}</div>`;
    const href = def.key === 'email' ? `mailto:${value}`
      : def.key === 'telegram' ? `https://t.me/${value.replace(/^@/, '')}`
      : def.key === 'sms' ? `sms:${value}`
      : def.href ? `${def.href}${value}`
      : null;
    return href
      ? `<a class="contactBadge" href="${escapeHtml(href)}">${icon}${label}</a>`
      : `<div class="contactBadge">${icon}${label}</div>`;
  };

  const sectionCard = (key, title, note, contentHtml) => `
    <section class="fieldGroup card ${state.sections[key] ? '' : 'disabled'}">
      <div class="sectionHead sectionLocalHead">
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p class="groupNote">${escapeHtml(note)}</p>
        </div>
        ${switchField('Show section', `sections.${key}`, Boolean(state.sections[key]))}
      </div>
      ${state.sections[key] ? contentHtml : '<div class="sectionOffNote">Turn this section on to edit it.</div>'}
    </section>`;

  const buildEditor = () => {
    const setup = `
      <section class="fieldGroup card">
        <div class="sectionHead sectionLocalHead">
          <div>
            <h3>Site setup</h3>
            <p class="groupNote">Term, colors, and the section map.</p>
          </div>
        </div>
        <div class="fieldGrid topGrid">
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
          <div class="setupNote">Everything below can be hidden locally, section by section.</div>
        </div>
        <div class="sectionToggleGrid">
          ${sectionDefs.map((s) => switchField(s.label, `sections.${s.key}`, Boolean(state.sections[s.key]), s.note)).join('')}
        </div>
        <div class="fieldGrid swatchGrid" style="margin-top: 12px;">
          ${colorField('Hero start', 'heroStart', state.heroStart)}
          ${colorField('Hero middle', 'heroMid', state.heroMid)}
          ${colorField('Hero end', 'heroEnd', state.heroEnd)}
          ${colorField('Hero text', 'heroText', state.heroText)}
          ${colorField('Accent', 'accent', state.accent)}
          ${colorField('Accent 2', 'accent2', state.accent2)}
          ${colorField('Page background', 'pageBg', state.pageBg)}
          ${colorField('Surface', 'surface', state.surface)}
          ${colorField('Surface alt', 'surfaceAlt', state.surfaceAlt)}
          ${colorField('Text', 'text', state.text)}
          ${colorField('Muted text', 'muted', state.muted)}
          ${colorField('Border', 'border', state.border)}
        </div>
      </section>`;

    const contactMethodsHtml = contactMethodDefs.map((def) => {
      const item = state.contactMethods[def.key] || { enabled: false, value: '' };
      return `
        <div class="rowCard contactMethodCard">
          <div class="sectionHead methodHead">
            <div class="methodTitle">
              <span class="iconBadge" aria-hidden="true">${escapeHtml(def.icon)}</span>
              <div>
                <strong>${escapeHtml(def.label)}</strong>
                <div class="muted small">${escapeHtml(def.placeholder)}</div>
              </div>
            </div>
            ${switchField('Include', `contactMethods.${def.key}.enabled`, Boolean(item.enabled))}
          </div>
          <label class="field full">
            <span class="labelText">${escapeHtml(def.label)} value</span>
            <input type="text" name="contactMethods.${def.key}.value" value="${escapeHtml(item.value)}" placeholder="${escapeHtml(def.placeholder)}" />
          </label>
        </div>`;
    }).join('');

    const imageHtml = state.images.map((img, idx) => `
      <div class="rowCard imageRow">
        <div class="rowGrid imageGrid">
          <label class="field">
            <span class="miniLabel">Image URL or data</span>
            <input name="images[${idx}].src" value="${escapeHtml(img.src)}" placeholder="https://..." />
          </label>
          <label class="field">
            <span class="miniLabel">Alt text</span>
            <input name="images[${idx}].alt" value="${escapeHtml(img.alt)}" placeholder="Describe the image" />
          </label>
          <label class="field fullField">
            <span class="miniLabel">Caption</span>
            <input name="images[${idx}].caption" value="${escapeHtml(img.caption)}" placeholder="Optional caption" />
          </label>
          <label class="field fullField filePicker">
            <span class="miniLabel">Upload image</span>
            <input type="file" accept="image/*" data-image-file="${idx}" />
          </label>
          <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-image="${idx}">Remove</button></div>
        </div>
      </div>`).join('');

    const helpHtml = state.helpItems.map((item, idx) => `
      <label class="field full">
        <span class="labelText">Help item ${idx + 1}</span>
        <textarea name="helpItems[${idx}]">${escapeHtml(item)}</textarea>
      </label>`).join('');

    const servicesHtml = state.visitCards.map((card, idx) => `
      <div class="rowCard">
        <div class="rowGrid serviceGrid">
          <label class="field">
            <span class="miniLabel">Card title</span>
            <input name="visitCards[${idx}].title" value="${escapeHtml(card.title)}" />
          </label>
          <label class="field fullField">
            <span class="miniLabel">Card text</span>
            <input name="visitCards[${idx}].body" value="${escapeHtml(card.body)}" />
          </label>
          <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-visit-card="${idx}">Remove</button></div>
        </div>
      </div>`).join('');

    const centerHoursHtml = state.centerHours.map((section, sectionIndex) => `
      <div class="rowCard">
        <div class="rowGrid sectionHeaderGrid">
          <label class="field fullField">
            <span class="miniLabel">Section label</span>
            <input name="centerHours[${sectionIndex}].section" value="${escapeHtml(section.section)}" />
          </label>
          <div class="helperStrip"><button class="ghostBtn" type="button" data-add-center-row="${sectionIndex}">Add row</button></div>
        </div>
        <div class="hoursRows">
          ${section.rows.map((row, rowIndex) => `
            <div class="rowGrid hourRow">
              <label class="field">
                <span class="miniLabel">Day</span>
                <input name="centerHours[${sectionIndex}].rows[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label class="field">
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

    const personalHoursHtml = `
      <div class="rowCard">
        <div class="rowGrid sectionHeaderGrid">
          <label class="field fullField">
            <span class="miniLabel">Section label</span>
            <input value="My ${escapeHtml(termLabel())} Hours" disabled />
          </label>
          <div class="helperStrip"><span class="notice">Editable rows below</span></div>
        </div>
        <div class="hoursRows">
          ${state.personalHours.map((row, rowIndex) => `
            <div class="rowGrid hourRow">
              <label class="field">
                <span class="miniLabel">Day</span>
                <input name="personalHours[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label class="field">
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

    const petHtml = `
      <div class="fieldGrid">
        ${textField('Pet name', 'petName', state.petName)}
        ${textField('Pet image URL or data', 'petImage', state.petImage, 'text', true)}
        ${textField('Pet alt text', 'petAlt', state.petAlt)}
        ${textField('Pet description', 'petDescription', state.petDescription, 'textarea', true)}
        ${textField('Pet note', 'petNote', state.petNote, 'text', true)}
      </div>`;

    const contactSection = sectionCard('contact', 'Contact methods', 'Pick the methods students should actually see.', `
      <div class="fieldGrid contactGrid">${contactMethodsHtml}</div>
      <div class="fieldGrid" style="margin-top: 12px;">${textField('Contact tip', 'contactTip', state.contactTip, 'text', true)}</div>`);

    const quickSection = sectionCard('quickAccess', 'Quick access', 'Zoom, location, and the main Canvas page.', `
      <div class="fieldGrid">
        ${textField('Zoom URL', 'zoomUrl', state.zoomUrl, 'url', true)}
        ${textField('Zoom ID', 'zoomId', state.zoomId)}
        ${textField('In-person location', 'inPersonLocation', state.inPersonLocation, 'text', true)}
        ${textField('Canvas page URL', 'canvasUrl', state.canvasUrl, 'url', true)}
        ${textField('Canvas link label', 'canvasLabel', state.canvasLabel)}
      </div>`);

    editorEl.innerHTML = `
      <form id="generator-form" class="editorForm">
        ${setup}

        ${sectionCard('hero', 'Header and intro', 'This is the top block students see first.', `
          <div class="fieldGrid">
            ${textField('Page title', 'pageTitle', state.pageTitle)}
            ${textField('Eyebrow', 'eyebrow', state.eyebrow)}
            ${textField('Tutor name', 'tutorName', state.tutorName)}
            ${textField('Tutor role', 'tutorRole', state.tutorRole)}
            ${textField('Intro lead', 'introLead', state.introLead, 'text', true)}
            ${textField('Intro body', 'introBody', state.introBody, 'textarea', true)}
            ${textField('Intro extra', 'introExtra', state.introExtra, 'textarea', true)}
            ${textField('Intro goal', 'introGoal', state.introGoal, 'text', true)}
          </div>`)}

        ${contactSection}
        ${quickSection}

        ${sectionCard('images', 'Images', 'Use one image or a small gallery. URLs or uploads both work.', `
          <div class="fieldGrid">${imageHtml || '<p class="muted">No image slots yet.</p>'}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-image>Add image</button></div>`)}

        ${sectionCard('help', 'How I can help', 'Short bullets read better than AI filler.', `
          <div class="fieldGrid">${helpHtml}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-help-item>Add help item</button></div>
          <div class="fieldGrid" style="margin-top: 12px;">${textField('Course note', 'courseNote', state.courseNote, 'textarea', true)}</div>`)}

        ${sectionCard('services', 'What to expect at the Tutorial Center', 'Small service cards that skim well.', `
          <div class="fieldGrid">${servicesHtml}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-visit-card>Add card</button></div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${textField('Resources note', 'resourcesNote', state.resourcesNote, 'textarea', true)}
            ${textField('Resources tip', 'resourcesTip', state.resourcesTip, 'text', true)}
          </div>`)}

        ${sectionCard('hours', 'Tutorial Center hours', 'Prefilled, but easy to change later.', `<div class="fieldGrid">${centerHoursHtml}</div>`)}

        ${sectionCard('personalHours', `${escapeHtml(termLabel())} personal hours`, 'Use this for your embedded schedule.', `
          <div class="fieldGrid">${personalHoursHtml}</div>
          <div class="fieldGrid" style="margin-top: 12px;">${textField('Closing note', 'closingNote', state.closingNote, 'text', true)}</div>`)}

        ${sectionCard('pet', 'Pet / mascot', 'Optional personality block.', `<div class="fieldGrid">${petHtml}</div>`)}

        ${sectionCard('closingNote', 'Closing note', 'Keep the final line short.', `<div class="fieldGrid">${textField('Closing note', 'closingNote', state.closingNote, 'text', true)}</div>`)}
      </form>`;
  };

  const buildImageFigure = (img, idx) => {
    if (!img.src.trim()) return '';
    const alt = escapeHtml(img.alt || img.caption || `Image ${idx + 1}`);
    return `
      <figure style="margin:0; flex:1 1 280px; min-width:240px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
        <img src="${escapeHtml(img.src)}" alt="${alt}" style="width:100%; height:auto; display:block; border-radius:12px; border:1px solid var(--border);" />
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

  const buildPetBlock = () => {
    if (!state.sections.pet) return '';
    const hasImage = state.petImage.trim();
    return `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.petName || 'Mascot corner')}</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:stretch;">
          ${hasImage ? `
            <div style="flex:0 0 auto; min-width:220px; max-width:320px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border);">
              <img src="${escapeHtml(state.petImage)}" alt="${escapeHtml(state.petAlt || state.petName || 'Mascot')}" style="width:100%; height:auto; display:block; border-radius:12px; border:1px solid var(--border);" />
            </div>` : ''}
          <div style="flex:1 1 280px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
            <div style="font-size:18px; font-weight:700; margin-bottom:6px;">${escapeHtml(state.petTitle || 'Optional mascot corner')}</div>
            <div style="font-size:14.5px; color:var(--muted);">${escapeHtml(state.petDescription)}</div>
            <div style="margin-top:10px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.petNote)}</em></div>
          </div>
        </div>
      </section>`;
  };

  const buildFragment = () => {
    const theme = activeTheme();
    const methods = contactMethodDefs.filter((def) => state.contactMethods[def.key]?.enabled);
    const images = state.images.filter((img) => img.src.trim());

    const contactHtml = state.sections.contact ? `
      <section style="margin-top:16px; padding:14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.16); color:var(--hero-text);">
        <div style="font-size:14px; font-weight:700; margin-bottom:10px;">Contact</div>
        <div style="display:grid; gap:10px; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));">
          ${methods.map((def) => contactBadge(def, state.contactMethods[def.key])).join('')}
        </div>
        <div style="margin-top:10px; font-size:13.5px;"><em>${escapeHtml(state.contactTip)}</em></div>
      </section>` : '';

    const heroHtml = state.sections.hero ? `
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

    const quickHtml = state.sections.quickAccess ? `
      <section style="margin-top:16px; display:flex; flex-wrap:wrap; gap:12px;">
        <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:8px; font-weight:700; color:var(--text);">🎥 Quick Access</div>
          <div style="font-size:14px;">
            <div style="margin-bottom:4px;"><strong>Online:</strong> <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.zoomUrl)}">Tutorial Center Zoom</a></div>
            <div style="margin-bottom:4px;"><strong>Zoom ID:</strong> ${escapeHtml(state.zoomId)}</div>
            <div><strong>In Person:</strong> ${escapeHtml(state.inPersonLocation)}</div>
          </div>
        </div>
        <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:8px; font-weight:700; color:var(--text);">🧭 Tutorial Center Canvas</div>
          <div style="font-size:14px;">For the latest services, schedules, and resources, visit the <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</div>
        </div>
      </section>` : '';

    const imageHtml = state.sections.images && images.length ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">Images</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">${images.map((img, idx) => buildImageFigure(img, idx)).join('')}</div>
      </section>` : '';

    const helpHtml = state.sections.help ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">How I can help in this course</h2>
        <div style="padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <ul style="margin:0; padding-left:18px;">${state.helpItems.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
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

    return `
      <div style="--page-bg:${theme.pageBg}; --surface:${theme.surface}; --surface-alt:${theme.surfaceAlt}; --text:${theme.text}; --muted:${theme.muted}; --border:${theme.border}; --accent:${theme.accent}; --accent-2:${theme.accent2}; --hero-start:${theme.heroStart}; --hero-mid:${theme.heroMid}; --hero-end:${theme.heroEnd}; --hero-text:${theme.heroText}; max-width:960px; margin:0 auto; padding:24px; font-family:Arial, Helvetica, sans-serif; line-height:1.55; color:var(--text); background:var(--page-bg);">
        <header style="margin-bottom:18px;">
          <p style="margin:0 0 6px 0; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent-2); font-weight:700;">${escapeHtml(state.eyebrow)}</p>
          <h1 style="margin:0; font-size:30px; line-height:1.2; color:var(--text);">${escapeHtml(state.pageTitle)}</h1>
          <div style="margin-top:6px; font-size:14px; color:var(--muted);">${escapeHtml(state.tutorName)} &middot; ${escapeHtml(state.tutorRole)}</div>
        </header>
        ${heroHtml}
        ${quickHtml}
        ${imageHtml}
        ${helpHtml}
        ${servicesHtml}
        ${hoursHtml}
        ${personalHoursHtml}
        ${petHtml}
      </div>`;
  };

  const buildStandaloneHtml = () => {
    const theme = activeTheme();
    return `<!doctype html>
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
  };

  const renderPreview = () => {
    outputEl.value = buildFragment();
    previewEl.srcdoc = buildStandaloneHtml();
    saveState();
  };

  const parseColorName = (name) => name.endsWith('__color') ? name.replace(/__color$/, '') : name;

  const applyInput = (name, value, checked = false) => {
    if (name.startsWith('sections.')) {
      const key = name.split('.')[1];
      state.sections[key] = checked;
      return;
    }

    if (name === 'term' || name === 'palettePreset') {
      state[name] = value;
      if (name === 'palettePreset' && value !== 'custom') {
        const preset = presets[value] || presets.spring;
        Object.assign(state, {
          pageBg: preset.pageBg, surface: preset.surface, surfaceAlt: preset.surfaceAlt, text: preset.text, muted: preset.muted, border: preset.border,
          accent: preset.accent, accent2: preset.accent2, heroStart: preset.heroStart, heroMid: preset.heroMid, heroEnd: preset.heroEnd, heroText: preset.heroText,
        });
      }
      return;
    }

    const colorName = parseColorName(name);
    if (['pageBg', 'surface', 'surfaceAlt', 'text', 'muted', 'border', 'accent', 'accent2', 'heroStart', 'heroMid', 'heroEnd', 'heroText'].includes(colorName)) {
      state[colorName] = value;
      state.palettePreset = 'custom';
      return;
    }

    const contactMethod = name.match(/^contactMethods\.(.+?)\.(enabled|value)$/);
    if (contactMethod) {
      const key = contactMethod[1];
      const prop = contactMethod[2];
      if (!state.contactMethods[key]) state.contactMethods[key] = { enabled: false, value: '' };
      state.contactMethods[key][prop] = prop === 'enabled' ? checked : value;
      return;
    }

    const imageMatch = name.match(/^images\[(\d+)\]\.(src|alt|caption)$/);
    if (imageMatch) {
      const index = Number(imageMatch[1]);
      const prop = imageMatch[2];
      if (!state.images[index]) state.images[index] = { src: '', alt: '', caption: '' };
      state.images[index][prop] = value;
      return;
    }

    const helpMatch = name.match(/^helpItems\[(\d+)\]$/);
    if (helpMatch) {
      state.helpItems[Number(helpMatch[1])] = value;
      return;
    }

    const visitMatch = name.match(/^visitCards\[(\d+)\]\.(title|body)$/);
    if (visitMatch) {
      const idx = Number(visitMatch[1]);
      state.visitCards[idx][visitMatch[2]] = value;
      return;
    }

    const centerSectionMatch = name.match(/^centerHours\[(\d+)\]\.section$/);
    if (centerSectionMatch) {
      state.centerHours[Number(centerSectionMatch[1])].section = value;
      return;
    }

    const centerRowMatch = name.match(/^centerHours\[(\d+)\]\.rows\[(\d+)\]\.(day|detail)$/);
    if (centerRowMatch) {
      const s = Number(centerRowMatch[1]);
      const r = Number(centerRowMatch[2]);
      state.centerHours[s].rows[r][centerRowMatch[3]] = value;
      return;
    }

    const personalMatch = name.match(/^personalHours\[(\d+)\]\.(day|detail)$/);
    if (personalMatch) {
      const r = Number(personalMatch[1]);
      state.personalHours[r][personalMatch[2]] = value;
      return;
    }

    if (Object.prototype.hasOwnProperty.call(state, name)) {
      state[name] = value;
    }
  };

  const renderEditor = () => {
    const setupBlock = `
      <section class="fieldGroup card">
        <div class="sectionHead sectionLocalHead">
          <div>
            <h3>Site setup</h3>
            <p class="groupNote">Term, colors, and the section map.</p>
          </div>
        </div>
        <div class="fieldGrid topGrid">
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
          <div class="setupNote">Use the local toggles below to trim or expand each section.</div>
        </div>
        <div class="sectionToggleGrid">
          ${sectionDefs.map((s) => switchField(s.label, `sections.${s.key}`, Boolean(state.sections[s.key]), s.note)).join('')}
        </div>
        <div class="fieldGrid swatchGrid" style="margin-top: 12px;">
          ${colorField('Hero start', 'heroStart', state.heroStart)}
          ${colorField('Hero middle', 'heroMid', state.heroMid)}
          ${colorField('Hero end', 'heroEnd', state.heroEnd)}
          ${colorField('Hero text', 'heroText', state.heroText)}
          ${colorField('Accent', 'accent', state.accent)}
          ${colorField('Accent 2', 'accent2', state.accent2)}
          ${colorField('Page background', 'pageBg', state.pageBg)}
          ${colorField('Surface', 'surface', state.surface)}
          ${colorField('Surface alt', 'surfaceAlt', state.surfaceAlt)}
          ${colorField('Text', 'text', state.text)}
          ${colorField('Muted text', 'muted', state.muted)}
          ${colorField('Border', 'border', state.border)}
        </div>
      </section>`;

    const sectionBlocks = [
      sectionCard('hero', 'Header and intro', 'This is the top block students see first.', `
        <div class="fieldGrid">
          ${textField('Page title', 'pageTitle', state.pageTitle)}
          ${textField('Eyebrow', 'eyebrow', state.eyebrow)}
          ${textField('Tutor name', 'tutorName', state.tutorName)}
          ${textField('Tutor role', 'tutorRole', state.tutorRole)}
          ${textField('Intro lead', 'introLead', state.introLead, 'text', true)}
          ${textField('Intro body', 'introBody', state.introBody, 'textarea', true)}
          ${textField('Intro extra', 'introExtra', state.introExtra, 'textarea', true)}
          ${textField('Intro goal', 'introGoal', state.introGoal, 'text', true)}
        </div>`),
      sectionCard('contact', 'Contact methods', 'Pick the methods students should actually see.', `
        <div class="fieldGrid contactGrid">
          ${contactMethodDefs.map((def) => {
            const item = state.contactMethods[def.key] || { enabled: false, value: '' };
            return `
              <div class="rowCard contactMethodCard">
                <div class="sectionHead methodHead">
                  <div class="methodTitle">
                    <span class="iconBadge" aria-hidden="true">${escapeHtml(def.icon)}</span>
                    <div>
                      <strong>${escapeHtml(def.label)}</strong>
                      <div class="muted small">${escapeHtml(def.placeholder)}</div>
                    </div>
                  </div>
                  ${switchField('Include', `contactMethods.${def.key}.enabled`, Boolean(item.enabled))}
                </div>
                <label class="field full">
                  <span class="labelText">${escapeHtml(def.label)} value</span>
                  <input type="text" name="contactMethods.${def.key}.value" value="${escapeHtml(item.value)}" placeholder="${escapeHtml(def.placeholder)}" />
                </label>
              </div>`;
          }).join('')}
        </div>
        <div class="fieldGrid" style="margin-top: 12px;">${textField('Contact tip', 'contactTip', state.contactTip, 'text', true)}</div>`),
      sectionCard('quickAccess', 'Quick access', 'Zoom, location, and the main Canvas page.', `
        <div class="fieldGrid">
          ${textField('Zoom URL', 'zoomUrl', state.zoomUrl, 'url', true)}
          ${textField('Zoom ID', 'zoomId', state.zoomId)}
          ${textField('In-person location', 'inPersonLocation', state.inPersonLocation, 'text', true)}
          ${textField('Canvas page URL', 'canvasUrl', state.canvasUrl, 'url', true)}
          ${textField('Canvas link label', 'canvasLabel', state.canvasLabel)}
        </div>`),
      sectionCard('images', 'Images', 'Use one image or a small gallery. URLs or uploads both work.', `
        <div class="fieldGrid">${state.images.map((img, idx) => `
          <div class="rowCard imageRow">
            <div class="rowGrid imageGrid">
              <label class="field">
                <span class="miniLabel">Image URL or data</span>
                <input name="images[${idx}].src" value="${escapeHtml(img.src)}" placeholder="https://..." />
              </label>
              <label class="field">
                <span class="miniLabel">Alt text</span>
                <input name="images[${idx}].alt" value="${escapeHtml(img.alt)}" placeholder="Describe the image" />
              </label>
              <label class="field fullField">
                <span class="miniLabel">Caption</span>
                <input name="images[${idx}].caption" value="${escapeHtml(img.caption)}" placeholder="Optional caption" />
              </label>
              <label class="field fullField filePicker">
                <span class="miniLabel">Upload image</span>
                <input type="file" accept="image/*" data-image-file="${idx}" />
              </label>
              <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-image="${idx}">Remove</button></div>
            </div>
          </div>`).join('') || '<p class="muted">No image slots yet.</p>'}</div>
        <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-image>Add image</button></div>`),
      sectionCard('help', 'How I can help', 'Short bullets read better than AI filler.', `
        <div class="fieldGrid">${state.helpItems.map((item, idx) => textField(`Help item ${idx + 1}`, `helpItems[${idx}]`, item, 'textarea', true)).join('')}</div>
        <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-help-item>Add help item</button></div>
        <div class="fieldGrid" style="margin-top: 12px;">${textField('Course note', 'courseNote', state.courseNote, 'textarea', true)}</div>`),
      sectionCard('services', 'What to expect at the Tutorial Center', 'Small service cards that skim well.', `
        <div class="fieldGrid">${state.visitCards.map((card, idx) => `
          <div class="rowCard">
            <div class="rowGrid serviceGrid">
              <label class="field">
                <span class="miniLabel">Card title</span>
                <input name="visitCards[${idx}].title" value="${escapeHtml(card.title)}" />
              </label>
              <label class="field fullField">
                <span class="miniLabel">Card text</span>
                <input name="visitCards[${idx}].body" value="${escapeHtml(card.body)}" />
              </label>
              <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-visit-card="${idx}">Remove</button></div>
            </div>
          </div>`).join('')}</div>
        <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-visit-card>Add card</button></div>
        <div class="fieldGrid" style="margin-top: 12px;">
          ${textField('Resources note', 'resourcesNote', state.resourcesNote, 'textarea', true)}
          ${textField('Resources tip', 'resourcesTip', state.resourcesTip, 'text', true)}
        </div>`),
      sectionCard('hours', 'Tutorial Center hours', 'Prefilled, but easy to change later.', `
        <div class="fieldGrid">${state.centerHours.map((section, sectionIndex) => `
          <div class="rowCard">
            <div class="rowGrid sectionHeaderGrid">
              <label class="field fullField">
                <span class="miniLabel">Section label</span>
                <input name="centerHours[${sectionIndex}].section" value="${escapeHtml(section.section)}" />
              </label>
              <div class="helperStrip"><button class="ghostBtn" type="button" data-add-center-row="${sectionIndex}">Add row</button></div>
            </div>
            <div class="hoursRows">${section.rows.map((row, rowIndex) => `
              <div class="rowGrid hourRow">
                <label class="field">
                  <span class="miniLabel">Day</span>
                  <input name="centerHours[${sectionIndex}].rows[${rowIndex}].day" value="${escapeHtml(row.day)}" />
                </label>
                <label class="field">
                  <span class="miniLabel">Detail</span>
                  <input name="centerHours[${sectionIndex}].rows[${rowIndex}].detail" value="${escapeHtml(row.detail)}" />
                </label>
                <div class="helperStrip">
                  <button class="ghostBtn" type="button" data-add-center-below="${sectionIndex}" data-index="${rowIndex}">Add below</button>
                  <button class="ghostBtn" type="button" data-remove-center-row="${sectionIndex}" data-index="${rowIndex}">Remove</button>
                </div>
              </div>`).join('')}</div>
          </div>`).join('')}</div>`),
      sectionCard('personalHours', `${escapeHtml(termLabel())} personal hours`, 'Use this for your embedded schedule.', `
        <div class="fieldGrid">${state.personalHours.map((row, rowIndex) => `
          <div class="rowCard">
            <div class="rowGrid hourRow">
              <label class="field">
                <span class="miniLabel">Day</span>
                <input name="personalHours[${rowIndex}].day" value="${escapeHtml(row.day)}" />
              </label>
              <label class="field">
                <span class="miniLabel">Detail</span>
                <input name="personalHours[${rowIndex}].detail" value="${escapeHtml(row.detail)}" />
              </label>
              <div class="helperStrip">
                <button class="ghostBtn" type="button" data-add-personal-below="${rowIndex}">Add below</button>
                <button class="ghostBtn" type="button" data-remove-personal-row="${rowIndex}">Remove</button>
              </div>
            </div>
          </div>`).join('')}</div>
        <div class="fieldGrid" style="margin-top: 12px;">${textField('Closing note', 'closingNote', state.closingNote, 'text', true)}</div>`),
      sectionCard('pet', 'Pet / mascot', 'Optional personality block.', `
        <div class="fieldGrid">
          ${textField('Pet name', 'petName', state.petName)}
          ${textField('Pet image URL or data', 'petImage', state.petImage, 'text', true)}
          ${textField('Pet alt text', 'petAlt', state.petAlt)}
          ${textField('Pet description', 'petDescription', state.petDescription, 'textarea', true)}
          ${textField('Pet note', 'petNote', state.petNote, 'text', true)}
        </div>`),
      sectionCard('closingNote', 'Closing note', 'Keep the final line short.', `<div class="fieldGrid">${textField('Closing note', 'closingNote', state.closingNote, 'text', true)}</div>`),
    ];

    editorEl.innerHTML = `<form id="generator-form" class="editorForm">${setupBlock}${sectionBlocks.join('')}</form>`;
  };

  const render = () => {
    outputEl.value = buildFragment();
    previewEl.srcdoc = buildStandaloneHtml();
    saveState();
  };

  const syncAndRender = () => {
    renderEditor();
    render();
    bindForm();
  };

  const bindForm = () => {
    const form = document.querySelector('#generator-form');
    if (!form) return;

    form.addEventListener('input', async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const name = target.getAttribute('name');
      if (!name) return;

      const type = target.getAttribute('type');
      if (type === 'checkbox') {
        applyInput(name, '', target.checked);
      } else {
        applyInput(name, target.value, false);
      }

      if (name.endsWith('__color')) {
        const baseName = name.replace(/__color$/, '');
        const textInput = form.querySelector(`input[name="${CSS.escape(baseName)}"]`);
        if (textInput) textInput.value = target.value;
      }

      if (name === 'term') {
        renderEditor();
        bindForm();
      }

      render();
    });

    form.addEventListener('change', async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const name = target.getAttribute('name');
      if (!name) return;

      if (name === 'palettePreset') {
        applyInput(name, target.value, false);
        if (target.value !== 'custom') {
          renderEditor();
          bindForm();
        }
        render();
        return;
      }

      if (name === 'term') {
        applyInput(name, target.value, false);
        renderEditor();
        bindForm();
        render();
        return;
      }

      if (name.endsWith('__color')) {
        const baseName = name.replace(/__color$/, '');
        const textInput = form.querySelector(`input[name="${CSS.escape(baseName)}"]`);
        if (textInput) textInput.value = target.value;
        applyInput(baseName, target.value, false);
        render();
        return;
      }

      if (target.getAttribute('type') === 'file') {
        const fileInput = target;
        const index = Number(fileInput.dataset.imageFile);
        const file = fileInput.files && fileInput.files[0];
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
        bindForm();
        render();
      }
    });

    const onClick = (selector, handler) => {
      form.querySelectorAll(selector).forEach((btn) => btn.addEventListener('click', handler));
    };

    onClick('[data-add-image]', () => {
      if (state.images.length >= 4) return;
      state.images = [...state.images, { src: '', alt: '', caption: '' }];
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-remove-image]', (event) => {
      const idx = Number(event.currentTarget.dataset.removeImage);
      state.images.splice(idx, 1);
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-add-help-item]', () => {
      state.helpItems = [...state.helpItems, 'New help item'];
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-add-visit-card]', () => {
      state.visitCards = [...state.visitCards, { title: 'New card', body: 'Edit this text.' }].slice(0, 4);
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-remove-visit-card]', (event) => {
      const idx = Number(event.currentTarget.dataset.removeVisitCard);
      if (state.visitCards.length <= 1) return;
      state.visitCards.splice(idx, 1);
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-add-center-row]', (event) => {
      const idx = Number(event.currentTarget.dataset.addCenterRow);
      state.centerHours[idx].rows.push({ day: 'New day', detail: 'New time' });
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-add-center-below]', (event) => {
      const s = Number(event.currentTarget.dataset.addCenterBelow);
      const r = Number(event.currentTarget.dataset.index);
      state.centerHours[s].rows.splice(r + 1, 0, { day: 'New day', detail: 'New time' });
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-remove-center-row]', (event) => {
      const s = Number(event.currentTarget.dataset.removeCenterRow);
      const r = Number(event.currentTarget.dataset.index);
      if (state.centerHours[s].rows.length <= 1) return;
      state.centerHours[s].rows.splice(r, 1);
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-add-personal-below]', (event) => {
      const r = Number(event.currentTarget.dataset.addPersonalBelow);
      state.personalHours.splice(r + 1, 0, { day: 'New day', detail: 'New time' });
      renderEditor();
      bindForm();
      render();
    });
    onClick('[data-remove-personal-row]', (event) => {
      const r = Number(event.currentTarget.dataset.removePersonalRow);
      if (state.personalHours.length <= 1) return;
      state.personalHours.splice(r, 1);
      renderEditor();
      bindForm();
      render();
    });
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
    const a = document.createElement('a');
    a.href = url;
    a.download = 'embedded-tutor-page.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('Downloaded full local HTML page.');
  };

  const reset = () => {
    state = defaultState();
    localStorage.removeItem(STORAGE_KEY);
    renderEditor();
    bindForm();
    render();
    setStatus('Reset to defaults.');
  };

  renderEditor();
  bindForm();
  render();

  copyBtns.forEach((btn) => btn.addEventListener('click', copyHtml));
  downloadBtn?.addEventListener('click', downloadHtml);
  resetBtn?.addEventListener('click', reset);
})();
