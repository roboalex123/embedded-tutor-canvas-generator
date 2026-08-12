(() => {
  const STORAGE_KEY = 'embedded-tutor-canvas-generator:v6';
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
    { key: 'contact', label: 'Contact methods', note: 'Email, Discord, Canvas, plus custom methods' },
    { key: 'quickAccess', label: 'Quick access', note: 'Zoom, location, Canvas' },
    { key: 'images', label: 'Images', note: 'Portraits and gallery' },
    { key: 'help', label: 'How I can help', note: 'Bullets and course note' },
    { key: 'services', label: 'Services / resources', note: 'Tutorial Center cards' },
    { key: 'hours', label: 'Hours', note: 'One section with per-row online / in-person toggles' },
    { key: 'myHours', label: 'My hours', note: 'A separate personal schedule section if you want it' },
    { key: 'hobby', label: 'Hobby section', note: 'Optional personal interests' },
    { key: 'custom', label: 'Custom section', note: 'One extra freeform block' },
    { key: 'pet', label: 'Pet / mascot', note: 'Optional personality block' },
    { key: 'closingNote', label: 'Closing note', note: 'Final line at the bottom' },
  ];

  const defaultContactMethods = [
    { key: 'email', label: 'Email', badge: 'EM', hrefPrefix: 'mailto:' },
    { key: 'discord', label: 'Discord', badge: 'DC', hrefPrefix: null },
    { key: 'canvas', label: 'Canvas', badge: 'CV', hrefPrefix: null },
  ];

  const defaultState = () => ({
    term: 'spring',
    palettePreset: 'spring',
    editorTheme: 'dark',
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
      myHours: true,
      hobby: false,
      custom: false,
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
    },
    customContactMethods: [],
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
    hoursTitle: 'Hours',
    hoursNote: 'Weekdays can share the same hours across online and in person. Sunday can stay online only.',
    hoursRows: [
      { day: 'Monday', time: '9:00am – 6:00pm', online: true, inPerson: true, note: '' },
      { day: 'Tuesday', time: '9:00am – 9:00pm', online: true, inPerson: true, note: '' },
      { day: 'Wednesday', time: '9:00am – 9:00pm', online: true, inPerson: true, note: '' },
      { day: 'Thursday', time: '9:00am – 9:00pm', online: true, inPerson: true, note: '' },
      { day: 'Friday', time: '9:00am – 5:00pm', online: true, inPerson: true, note: '' },
      { day: 'Sunday', time: '2:00pm – 8:00pm', online: true, inPerson: false, note: 'Online only' },
    ],
    myHoursTitle: 'My hours',
    myHoursNote: 'Optional personal schedule or tutor-specific availability.',
    myHoursRows: [
      { day: 'Monday', time: 'Before 9:00am', online: false, inPerson: false, note: 'Planning / prep' },
      { day: 'Tuesday', time: 'After 5:00pm', online: false, inPerson: false, note: 'If available' },
    ],
    hobbyTitle: 'A little about me',
    hobbyBlurb: 'Optional. Keep it human, not performative.',
    hobbyItems: ['Underwater robotics', 'Photography', 'Programming side projects'],
    customTitle: 'Custom section',
    customBody: 'Use this for one extra block that does not fit anywhere else.',
    customItems: ['Optional bullet one', 'Optional bullet two'],
    petTitle: 'Optional mascot corner',
    petName: 'Neptune',
    petDescription: 'A tiny morale-boosting section for an animal, mascot, or lab gremlin.',
    petImage: '',
    petAlt: '',
    petNote: 'Optional. Delete it if you do not want a mascot block.',
    closingNote: 'Please feel free to come in, even if it’s a simple question.',
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const currentTermLabel = () => termLabels[state.term] || 'Spring';

  const currentTheme = () => {
    const preset = state.palettePreset === 'custom' ? presets.spring : (presets[state.palettePreset] || presets.spring);
    return {
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
      soft1: preset.soft1,
      soft2: preset.soft2,
      soft3: preset.soft3,
      soft4: preset.soft4,
    };
  };

  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const defaults = defaultState();
      const presetName = ['spring', 'summer', 'fall', 'custom'].includes(parsed.palettePreset) ? parsed.palettePreset : defaults.palettePreset;
      const preset = presetName === 'custom' ? {} : presets[presetName];
      return {
        ...defaults,
        ...parsed,
        term: ['fall', 'spring', 'summer'].includes(parsed.term) ? parsed.term : defaults.term,
        palettePreset: presetName,
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
        sections: { ...defaults.sections, ...(parsed.sections || {}) },
        contactMethods: {
          email: { enabled: Boolean(parsed.contactMethods?.email?.enabled ?? defaults.contactMethods.email.enabled), value: String(parsed.contactMethods?.email?.value ?? defaults.contactMethods.email.value) },
          discord: { enabled: Boolean(parsed.contactMethods?.discord?.enabled ?? defaults.contactMethods.discord.enabled), value: String(parsed.contactMethods?.discord?.value ?? defaults.contactMethods.discord.value) },
          canvas: { enabled: Boolean(parsed.contactMethods?.canvas?.enabled ?? defaults.contactMethods.canvas.enabled), value: String(parsed.contactMethods?.canvas?.value ?? defaults.contactMethods.canvas.value) },
        },
        customContactMethods: Array.isArray(parsed.customContactMethods)
          ? parsed.customContactMethods.slice(0, 8).map((item) => ({
              enabled: Boolean(item?.enabled),
              label: String(item?.label ?? ''),
              badge: String(item?.badge ?? ''),
              value: String(item?.value ?? ''),
              link: String(item?.link ?? ''),
            }))
          : clone(defaults.customContactMethods),
        images: Array.isArray(parsed.images)
          ? parsed.images.slice(0, 4).map((img) => ({ src: String(img?.src ?? ''), alt: String(img?.alt ?? ''), caption: String(img?.caption ?? '') }))
          : clone(defaults.images),
        myHoursTitle: String(parsed.myHoursTitle ?? defaults.myHoursTitle),
        myHoursNote: String(parsed.myHoursNote ?? defaults.myHoursNote),
        myHoursRows: Array.isArray(parsed.myHoursRows)
          ? parsed.myHoursRows.slice(0, 8).map((row) => ({
              day: String(row?.day ?? ''),
              time: String(row?.time ?? ''),
              online: Boolean(row?.online),
              inPerson: Boolean(row?.inPerson),
              note: String(row?.note ?? ''),
            }))
          : clone(defaults.myHoursRows),
        customItems: Array.isArray(parsed.customItems) ? parsed.customItems.slice(0, 8).map((item) => String(item ?? '')) : clone(defaults.customItems),
      };
    } catch {
      return defaultState();
    }
  };

  let state = loadState();

  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  const tipMarkup = (tip) => tip ? `<span class="tipWrap"><button type="button" class="infoTip" title="${escapeHtml(tip)}" aria-label="${escapeHtml(tip)}">i</button><span class="tipBubble">${escapeHtml(tip)}</span></span>` : '';

  const textField = (label, name, value, type = 'text', full = false, tip = '') => `
    <label class="field ${full ? 'full' : ''}">
      <span class="labelText">${escapeHtml(label)}${tipMarkup(tip)}</span>
      ${tip ? `<span class="fieldTip">${escapeHtml(tip)}</span>` : ''}
      ${type === 'textarea'
        ? `<textarea name="${escapeHtml(name)}">${escapeHtml(value)}</textarea>`
        : `<input type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`}
    </label>`;

  const colorField = (label, name, value, tip = '') => `
    <label class="field colorField">
      <span class="labelText">${escapeHtml(label)}${tipMarkup(tip)}</span>
      ${tip ? `<span class="fieldTip">${escapeHtml(tip)}</span>` : ''}
      <span class="colorPair">
        <span class="colorPreview" style="background:${escapeHtml(value)}"></span>
        <input type="color" name="${escapeHtml(name)}__color" value="${escapeHtml(value)}" aria-label="${escapeHtml(label)} color picker" />
        <input type="text" name="${escapeHtml(name)}" value="${escapeHtml(value)}" aria-label="${escapeHtml(label)} hex value" />
      </span>
    </label>`;

  const checkboxField = (label, name, checked, note = '') => `
    <label class="switchItem">
      <span class="switchLabel">
        <input type="checkbox" name="${escapeHtml(name)}" ${checked ? 'checked' : ''} />
        <span>${escapeHtml(label)}</span>
      </span>
      ${note ? `<small>${escapeHtml(note)}</small>` : ''}
    </label>`;

  const sectionShell = (key, title, note, contentHtml) => `
    <section class="fieldGroup card ${state.sections[key] ? '' : 'disabled'}">
      <div class="sectionHead sectionLocalHead">
        <div>
          <h3>${escapeHtml(title)}</h3>
          ${note ? `<p class="groupNote">${escapeHtml(note)}</p>` : ''}
        </div>
        ${checkboxField('Show section', `sections.${key}`, Boolean(state.sections[key]))}
      </div>
      ${state.sections[key] ? contentHtml : '<div class="sectionOffNote">Turn this section on to edit it.</div>'}
    </section>`;

  const renderEditor = () => {
    const defaultContactCards = defaultContactMethods.map((def) => {
      const item = state.contactMethods[def.key];
      return `
        <div class="rowCard contactMethodCard">
          <div class="contactMethodTop">
            <div class="methodTitle">
              <span class="iconBadge" aria-hidden="true">${escapeHtml(def.badge)}</span>
              <div>
                <strong>${escapeHtml(def.label)}</strong>
                <div class="muted small">Default method</div>
              </div>
            </div>
            ${checkboxField('Include', `contactMethods.${def.key}.enabled`, Boolean(item.enabled))}
          </div>
          <div class="fieldStack">
            <label class="field full">
              <span class="labelText">${escapeHtml(def.label)} value</span>
              <input type="text" name="contactMethods.${def.key}.value" value="${escapeHtml(item.value)}" />
            </label>
          </div>
        </div>`;

    }).join('');

    const customContactCards = state.customContactMethods.map((item, index) => `
      <div class="rowCard contactMethodCard">
        <div class="contactMethodTop">
          <div class="methodTitle">
            <span class="iconBadge" aria-hidden="true">${escapeHtml(item.badge || 'CU')}</span>
            <div>
              <strong>${escapeHtml(item.label || 'Custom method')}</strong>
              <div class="muted small">Additional contact method</div>
            </div>
          </div>
          ${checkboxField('Include', `customContactMethods[${index}].enabled`, Boolean(item.enabled))}
        </div>
        <div class="fieldGrid contactCustomGrid">
          ${textField('Label', `customContactMethods[${index}].label`, item.label)}
          ${textField('Badge', `customContactMethods[${index}].badge`, item.badge)}
          ${textField('Value', `customContactMethods[${index}].value`, item.value, 'text', true)}
          ${textField('Link (optional)', `customContactMethods[${index}].link`, item.link, 'url', true)}
        </div>
        <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-custom-contact="${index}">Remove method</button></div>
      </div>`).join('');

    const imageCards = state.images.map((img, index) => `
      <div class="rowCard imageRow">
        <div class="rowGrid imageGrid">
          <label class="field">
            <span class="miniLabel">Image URL or data</span>
            <input name="images[${index}].src" value="${escapeHtml(img.src)}" placeholder="https://..." />
          </label>
          <label class="field">
            <span class="miniLabel">Alt text</span>
            <input name="images[${index}].alt" value="${escapeHtml(img.alt)}" placeholder="Describe the image" />
          </label>
          <label class="field fullField">
            <span class="miniLabel">Caption</span>
            <input name="images[${index}].caption" value="${escapeHtml(img.caption)}" placeholder="Optional caption" />
          </label>
          <label class="field fullField filePicker">
            <span class="miniLabel">Upload image</span>
            <input type="file" accept="image/*" data-image-file="${index}" />
          </label>
          <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-image="${index}">Remove</button></div>
        </div>
      </div>`).join('');

    const helpItems = state.helpItems.map((item, index) => `
      <label class="field full">
        <span class="labelText">Help item ${index + 1}</span>
        <textarea name="helpItems[${index}]">${escapeHtml(item)}</textarea>
      </label>`).join('');

    const serviceCards = state.visitCards.map((card, index) => `
      <div class="rowCard">
        <div class="rowGrid serviceGrid">
          <label class="field">
            <span class="miniLabel">Card title</span>
            <input name="visitCards[${index}].title" value="${escapeHtml(card.title)}" />
          </label>
          <label class="field fullField">
            <span class="miniLabel">Card text</span>
            <input name="visitCards[${index}].body" value="${escapeHtml(card.body)}" />
          </label>
          <div class="helperStrip"><button class="ghostBtn" type="button" data-remove-visit-card="${index}">Remove</button></div>
        </div>
      </div>`).join('');

    const hoursCards = state.hoursRows.map((row, index) => `
      <div class="rowCard">
        <div class="rowGrid hoursGrid">
          <label class="field">
            <span class="miniLabel">Day</span>
            <input name="hoursRows[${index}].day" value="${escapeHtml(row.day)}" />
          </label>
          <label class="field">
            <span class="miniLabel">Time</span>
            <input name="hoursRows[${index}].time" value="${escapeHtml(row.time)}" />
          </label>
          <label class="switchItem inlineSwitch">
            <span class="switchLabel"><input type="checkbox" name="hoursRows[${index}].online" ${row.online ? 'checked' : ''} /> <span>Online</span></span>
          </label>
          <label class="switchItem inlineSwitch">
            <span class="switchLabel"><input type="checkbox" name="hoursRows[${index}].inPerson" ${row.inPerson ? 'checked' : ''} /> <span>In person</span></span>
          </label>
          <label class="field fullField">
            <span class="miniLabel">Note</span>
            <input name="hoursRows[${index}].note" value="${escapeHtml(row.note)}" placeholder="Optional note" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-add-hour-below="${index}">Add below</button>
            <button class="ghostBtn" type="button" data-remove-hour-row="${index}">Remove</button>
          </div>
        </div>
      </div>`).join('');

    const myHoursCards = state.myHoursRows.map((row, index) => `
      <div class="rowCard">
        <div class="rowGrid hoursGrid">
          <label class="field">
            <span class="miniLabel">Day</span>
            <input name="myHoursRows[${index}].day" value="${escapeHtml(row.day)}" />
          </label>
          <label class="field">
            <span class="miniLabel">Time</span>
            <input name="myHoursRows[${index}].time" value="${escapeHtml(row.time)}" />
          </label>
          <label class="switchItem inlineSwitch">
            <span class="switchLabel"><input type="checkbox" name="myHoursRows[${index}].online" ${row.online ? 'checked' : ''} /> <span>Online</span></span>
          </label>
          <label class="switchItem inlineSwitch">
            <span class="switchLabel"><input type="checkbox" name="myHoursRows[${index}].inPerson" ${row.inPerson ? 'checked' : ''} /> <span>In person</span></span>
          </label>
          <label class="field fullField">
            <span class="miniLabel">Note</span>
            <input name="myHoursRows[${index}].note" value="${escapeHtml(row.note)}" placeholder="Optional note" />
          </label>
          <div class="helperStrip">
            <button class="ghostBtn" type="button" data-add-my-hour-below="${index}">Add below</button>
            <button class="ghostBtn" type="button" data-remove-my-hour-row="${index}">Remove</button>
          </div>
        </div>
      </div>`).join('');

    const hobbyItems = state.hobbyItems.map((item, index) => `
      <label class="field full">
        <span class="labelText">Hobby item ${index + 1}</span>
        <input name="hobbyItems[${index}]" value="${escapeHtml(item)}" />
      </label>`).join('');

    const customItems = state.customItems.map((item, index) => `
      <label class="field full">
        <span class="labelText">Custom bullet ${index + 1}</span>
        <input name="customItems[${index}]" value="${escapeHtml(item)}" />
      </label>`).join('');

    const hobbySection = `
      <div class="fieldGrid">
        ${textField('Section title', 'hobbyTitle', state.hobbyTitle)}
        ${textField('Blurb', 'hobbyBlurb', state.hobbyBlurb, 'text', true)}
        ${hobbyItems}
      </div>
      <div class="helperStrip">
        <button class="ghostBtn" type="button" data-add-hobby-item>Add hobby item</button>
        <button class="ghostBtn" type="button" data-remove-hobby-item>Remove last</button>
      </div>`;

    const customSection = `
      <div class="fieldGrid">
        ${textField('Section title', 'customTitle', state.customTitle)}
        ${textField('Body', 'customBody', state.customBody, 'textarea', true)}
        ${customItems}
      </div>
      <div class="helperStrip">
        <button class="ghostBtn" type="button" data-add-custom-item>Add custom bullet</button>
        <button class="ghostBtn" type="button" data-remove-custom-item>Remove last</button>
      </div>`;

    const petSection = `
      <div class="fieldGrid">
        ${textField('Pet title', 'petTitle', state.petTitle)}
        ${textField('Pet name', 'petName', state.petName)}
        ${textField('Pet image URL or data', 'petImage', state.petImage, 'text', true)}
        ${textField('Pet alt text', 'petAlt', state.petAlt)}
        ${textField('Pet description', 'petDescription', state.petDescription, 'textarea', true)}
        ${textField('Pet note', 'petNote', state.petNote, 'text', true)}
      </div>`;

    editorEl.innerHTML = `
      <form id="generator-form" class="editorForm">
        <section class="fieldGroup card">
          <div class="sectionHead sectionLocalHead">
            <div>
              <h3>Site setup</h3>
              <p class="groupNote">Choose the term, set the editor theme, and build the palette.</p>
            </div>
            <label class="themeChip">
              <span>Editor</span>
              <select name="editorTheme" aria-label="Editor theme">
                <option value="dark" ${state.editorTheme === 'dark' ? 'selected' : ''}>Dark</option>
                <option value="light" ${state.editorTheme === 'light' ? 'selected' : ''}>Light</option>
              </select>
            </label>
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
            <div class="setupNote">Everything below is editable. Nothing here is sacred.</div>
          </div>
          <div class="fieldGrid swatchGrid" style="margin-top: 12px;">
            ${colorField('Hero start', 'heroStart', state.heroStart, 'Left side of the hero gradient.')}
            ${colorField('Hero middle', 'heroMid', state.heroMid, 'Middle gradient stop.')}
            ${colorField('Hero end', 'heroEnd', state.heroEnd, 'Right side of the hero gradient.')}
            ${colorField('Hero text', 'heroText', state.heroText, 'Text used inside the hero banner.')}
            ${colorField('Accent', 'accent', state.accent, 'Primary link and highlight color.')}
            ${colorField('Accent 2', 'accent2', state.accent2, 'Secondary accent used in small labels.')}
            ${colorField('Page background', 'pageBg', state.pageBg, 'Outer page background around the card.')}
            ${colorField('Surface', 'surface', state.surface, 'Main card background.')}
            ${colorField('Surface alt', 'surfaceAlt', state.surfaceAlt, 'Alternate block background.')}
            ${colorField('Text', 'text', state.text, 'Main body text color.')}
            ${colorField('Muted text', 'muted', state.muted, 'Subtle helper text color.')}
            ${colorField('Border', 'border', state.border, 'Border lines and outlines.')}
          </div>
        </section>

        ${sectionShell('hero', 'Header and intro', 'This is the top block students see first.', `
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

        ${sectionShell('contact', 'Contact methods', 'Default methods are email, Discord, and Canvas. Custom methods are optional.', `
          <div class="fieldGrid contactGrid">${defaultContactCards}</div>
          <div class="helperStrip" style="margin-top: 12px;">
            <button class="ghostBtn" type="button" data-add-custom-contact>Add custom method</button>
          </div>
          <div class="fieldGrid" style="margin-top: 12px;">${customContactCards}</div>
          <div class="fieldGrid" style="margin-top: 12px;">${textField('Contact tip', 'contactTip', state.contactTip, 'text', true)}</div>`)}

        ${sectionShell('quickAccess', 'Quick access', 'Zoom, location, and the main Canvas page.', `
          <div class="fieldGrid">
            ${textField('Zoom URL', 'zoomUrl', state.zoomUrl, 'url', true)}
            ${textField('Zoom ID', 'zoomId', state.zoomId)}
            ${textField('In-person location', 'inPersonLocation', state.inPersonLocation, 'text', true)}
            ${textField('Canvas page URL', 'canvasUrl', state.canvasUrl, 'url', true)}
            ${textField('Canvas link label', 'canvasLabel', state.canvasLabel)}
          </div>`)}

        ${sectionShell('images', 'Images', 'Use one image or a small gallery. URLs or uploads both work.', `
          <div class="fieldGrid">${imageCards || '<p class="muted">No image slots yet.</p>'}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-image>Add image</button></div>`)}

        ${sectionShell('help', 'How I can help', 'Short bullets read better than AI filler.', `
          <div class="fieldGrid">${helpItems}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-help-item>Add help item</button></div>
          <div class="fieldGrid" style="margin-top: 12px;">${textField('Course note', 'courseNote', state.courseNote, 'textarea', true)}</div>`)}

        ${sectionShell('services', 'What to expect at the Tutorial Center', 'Small service cards that skim well.', `
          <div class="fieldGrid">${serviceCards}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-visit-card>Add card</button></div>
          <div class="fieldGrid" style="margin-top: 12px;">
            ${textField('Resources note', 'resourcesNote', state.resourcesNote, 'textarea', true)}
            ${textField('Resources tip', 'resourcesTip', state.resourcesTip, 'text', true)}
          </div>`)}

        ${sectionShell('hours', 'Hours', 'A single hours section with per-row online and in-person toggles.', `
          <div class="fieldGrid">
            ${textField('Section title', 'hoursTitle', state.hoursTitle)}
            ${textField('Note', 'hoursNote', state.hoursNote, 'text', true)}
          </div>
          <div class="fieldGrid">${hoursCards}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-hour-row>Add hour row</button></div>`)}

        ${sectionShell('myHours', 'My hours', 'Your personal availability or tutor-specific schedule.', `
          <div class="fieldGrid">
            ${textField('Section title', 'myHoursTitle', state.myHoursTitle)}
            ${textField('Note', 'myHoursNote', state.myHoursNote, 'text', true)}
          </div>
          <div class="fieldGrid">${myHoursCards}</div>
          <div class="helperStrip" style="margin-top: 12px;"><button class="ghostBtn" type="button" data-add-my-hour-row>Add my-hours row</button></div>`)}

        ${sectionShell('hobby', 'Hobby section', 'Optional. Keep it small and human.', hobbySection)}

        ${sectionShell('custom', 'Custom section', 'One extra block for whatever does not fit elsewhere.', customSection)}

        ${sectionShell('pet', 'Pet / mascot', 'Optional personality block.', petSection)}

        ${sectionShell('closingNote', 'Closing note', 'Keep the final line short.', `<div class="fieldGrid">${textField('Closing note', 'closingNote', state.closingNote, 'text', true)}</div>`)}
      </form>`;
  };

  const buildContactOutput = () => {
    const iconStyle = 'width:34px;height:34px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;background:rgba(255,255,255,0.18);color:var(--hero-text);flex:0 0 auto;';
    const badgeStyle = 'display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.10);color:var(--hero-text);text-decoration:none;min-height:60px;';
    const labelStyle = 'display:flex;flex-direction:column;gap:2px;min-width:0;';
    const valueStyle = 'opacity:0.92;font-size:13px;word-break:break-word;';
    const titleStyle = 'font-size:14px;';
    const makeBadge = (badge, label, value, href = '') => {
      const icon = `<span aria-hidden="true" style="${iconStyle}">${escapeHtml(badge)}</span>`;
      const text = `<span style="${labelStyle}"><strong style="${titleStyle}">${escapeHtml(label)}</strong><span style="${valueStyle}">${escapeHtml(value)}</span></span>`;
      const body = `${icon}${text}`;
      return href ? `<a href="${escapeHtml(href)}" style="${badgeStyle}">${body}</a>` : `<div style="${badgeStyle}">${body}</div>`;
    };

    const defaultHtml = defaultContactMethods.map((def) => {
      const item = state.contactMethods[def.key];
      const enabled = Boolean(item?.enabled);
      const value = String(item?.value || '');
      if (!enabled || !value) return makeBadge(def.badge, def.label, value, '');
      const href = def.key === 'email' ? `mailto:${value}` : value ? `${def.hrefPrefix || ''}${value}` : '';
      return makeBadge(def.badge, def.label, value, href);
    }).join('');

    const customHtml = state.customContactMethods.filter((item) => item.enabled && (item.label || item.value)).map((item) => {
      const badge = String(item.badge || 'CU');
      const label = String(item.label || 'Custom method');
      const value = String(item.value || '');
      const link = String(item.link || '').trim();
      return makeBadge(badge, label, value, link);
    }).join('');

    return `${defaultHtml}${customHtml}`;
  };

  const buildFragment = () => {
    const theme = currentTheme();
    const images = state.images.filter((img) => img.src.trim());
    const hoursRows = state.hoursRows.filter((row) => row.day || row.time);
    const myHoursRows = state.myHoursRows.filter((row) => row.day || row.time);

    const contactHtml = state.sections.contact ? `
      <section style="margin-top:16px; padding:14px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.16); color:var(--hero-text);">
        <div style="font-size:14px; font-weight:700; margin-bottom:10px;">Contact</div>
        <div style="display:grid; gap:10px; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));">
          ${buildContactOutput()}
        </div>
        <div style="margin-top:10px; font-size:13.5px;"><em>${escapeHtml(state.contactTip)}</em></div>
      </section>` : '';

    const heroHtml = state.sections.hero ? `
      <section style="display:flex; flex-wrap:wrap; gap:18px; align-items:stretch; padding:18px; border-radius:14px; background:linear-gradient(135deg, var(--hero-start) 0%, var(--hero-mid) 52%, var(--hero-end) 100%); border:1px solid var(--hero-start); color:var(--hero-text);">
        <div style="flex:1; min-width:260px; color:var(--hero-text);">
          <div style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700; opacity:0.95;">${escapeHtml(state.eyebrow)} · ${escapeHtml(currentTermLabel())}</div>
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
          <div style="margin-bottom:8px; font-weight:700; color:var(--text);">Quick access</div>
          <div style="font-size:14px;">
            <div style="margin-bottom:4px;"><strong>Online:</strong> <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.zoomUrl)}">Tutorial Center Zoom</a></div>
            <div style="margin-bottom:4px;"><strong>Zoom ID:</strong> ${escapeHtml(state.zoomId)}</div>
            <div><strong>In Person:</strong> ${escapeHtml(state.inPersonLocation)}</div>
          </div>
        </div>
        <div style="flex:1 1 0%; min-width:290px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:8px; font-weight:700; color:var(--text);">Canvas</div>
          <div style="font-size:14px;">For the latest services, schedules, and resources, visit the <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</div>
        </div>
      </section>` : '';

    const imageHtml = state.sections.images && images.length ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">Images</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          ${images.map((img, index) => `
            <figure style="margin:0; flex:1 1 280px; min-width:240px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
              <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.caption || `Image ${index + 1}`)}" style="width:100%; height:auto; display:block; border-radius:12px; border:1px solid var(--border);" />
              ${(img.caption || img.alt) ? `<figcaption style="margin-top:8px; font-size:13.5px; color:var(--muted);">${escapeHtml(img.caption || img.alt)}</figcaption>` : ''}
            </figure>`).join('')}
        </div>
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
          ${state.visitCards.slice(0, 2).map((item, index) => `
            <div style="flex:1 1 0%; min-width:280px; padding:14px; border-radius:12px; background:${index === 0 ? 'var(--soft1)' : 'var(--soft2)'}; border:1px solid ${index === 0 ? '#fb923c' : '#a78bfa'}; color:var(--text);">
              <strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.body)}
            </div>`).join('')}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          ${state.visitCards.slice(2, 4).map((item, index) => `
            <div style="flex:1 1 0%; min-width:280px; padding:14px; border-radius:12px; background:${index === 0 ? 'var(--soft3)' : 'var(--soft4)'}; border:1px solid ${index === 0 ? '#60a5fa' : '#34d399'}; color:var(--text);">
              <strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.body)}</div>`).join('')}
        </div>
        <div style="margin-top:12px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);"><strong>Resources available:</strong> ${escapeHtml(state.resourcesNote)}</div>
        <div style="margin-top:10px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.resourcesTip)} <a style="color:var(--accent); text-decoration:underline;" href="${escapeHtml(state.canvasUrl)}">${escapeHtml(state.canvasLabel)}</a>.</em></div>
      </section>` : '';

    const hoursHtml = state.sections.hours ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.hoursTitle || 'Hours')}</h2>
        <div style="padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          ${hoursRows.map((row, index) => {
            const tags = [];
            if (row.online) tags.push('Online');
            if (row.inPerson) tags.push('In person');
            const noteHtml = row.note ? `<div style="margin-top:6px; font-size:13px; color:var(--muted);">${escapeHtml(row.note)}</div>` : '';
            const tagsHtml = tags.length ? `<div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">${tags.map((tag) => `<span style="display:inline-flex; align-items:center; padding:3px 8px; border-radius:999px; border:1px solid var(--border); font-size:12px; font-weight:700; color:var(--text); background:var(--surface);">${escapeHtml(tag)}</span>`).join('')}</div>` : '';
            return `
              <div style="padding:12px 0; border-top:${index === 0 ? 'none' : '1px solid var(--border)'};">
                <div style="display:flex; justify-content:space-between; gap:12px; align-items:baseline;">
                  <strong>${escapeHtml(row.day)}</strong>
                  <span>${escapeHtml(row.time)}</span>
                </div>
                ${tagsHtml}
                ${noteHtml}
              </div>`;
          }).join('')}
          ${state.hoursNote ? `<div style="margin-top:12px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.hoursNote)}</em></div>` : ''}
        </div>
      </section>` : '';

    const myHoursHtml = state.sections.myHours ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.myHoursTitle || 'My hours')}</h2>
        <div style="padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          ${myHoursRows.map((row, index) => {
            const tags = [];
            if (row.online) tags.push('Online');
            if (row.inPerson) tags.push('In person');
            const noteHtml = row.note ? `<div style="margin-top:6px; font-size:13px; color:var(--muted);">${escapeHtml(row.note)}</div>` : '';
            const tagsHtml = tags.length ? `<div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">${tags.map((tag) => `<span style="display:inline-flex; align-items:center; padding:3px 8px; border-radius:999px; border:1px solid var(--border); font-size:12px; font-weight:700; color:var(--text); background:var(--surface);">${escapeHtml(tag)}</span>`).join('')}</div>` : '';
            return `
              <div style="padding:12px 0; border-top:${index === 0 ? 'none' : '1px solid var(--border)'};">
                <div style="display:flex; justify-content:space-between; gap:12px; align-items:baseline;">
                  <strong>${escapeHtml(row.day)}</strong>
                  <span>${escapeHtml(row.time)}</span>
                </div>
                ${tagsHtml}
                ${noteHtml}
              </div>`;
          }).join('')}
          ${state.myHoursNote ? `<div style="margin-top:12px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.myHoursNote)}</em></div>` : ''}
        </div>
      </section>` : '';

    const hobbyHtml = state.sections.hobby ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.hobbyTitle)}</h2>
        <div style="padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:10px; color:var(--muted);">${escapeHtml(state.hobbyBlurb)}</div>
          <ul style="margin:0; padding-left:18px;">${state.hobbyItems.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
      </section>` : '';

    const customHtml = state.sections.custom ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.customTitle)}</h2>
        <div style="padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
          <div style="margin-bottom:10px; white-space:pre-wrap;">${escapeHtml(state.customBody)}</div>
          <ul style="margin:0; padding-left:18px;">${state.customItems.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
      </section>` : '';

    const petHtml = state.sections.pet ? `
      <section style="margin-top:22px;">
        <h2 style="margin:0 0 10px 0; font-size:22px; line-height:1.25; color:var(--text);">${escapeHtml(state.petTitle || 'Optional mascot corner')}</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:stretch;">
          ${state.petImage.trim() ? `
            <div style="flex:0 0 auto; min-width:220px; max-width:320px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border);">
              <img src="${escapeHtml(state.petImage)}" alt="${escapeHtml(state.petAlt || state.petName || 'Mascot')}" style="width:100%; height:auto; display:block; border-radius:12px; border:1px solid var(--border);" />
            </div>` : ''}
          <div style="flex:1 1 280px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
            <div style="font-size:18px; font-weight:700; margin-bottom:6px;">${escapeHtml(state.petName || 'Mascot')}</div>
            <div style="font-size:14.5px; color:var(--muted);">${escapeHtml(state.petDescription)}</div>
            <div style="margin-top:10px; font-size:13.5px; color:var(--muted);"><em>${escapeHtml(state.petNote)}</em></div>
          </div>
        </div>
      </section>` : '';

    const closingHtml = state.sections.closingNote ? `
      <section style="margin-top:22px; padding:14px; border-radius:12px; background:var(--surface-alt); border:1px solid var(--border); color:var(--text);">
        <strong>Closing note:</strong> ${escapeHtml(state.closingNote)}
      </section>` : '';

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
        ${myHoursHtml}
        ${hobbyHtml}
        ${customHtml}
        ${petHtml}
        ${closingHtml}
      </div>`;
  };

  const buildStandaloneHtml = () => {
    const theme = currentTheme();
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

  const setColorPair = (form, baseName, value) => {
    const textInput = form.querySelector(`input[name="${CSS.escape(baseName)}"]`);
    const colorInput = form.querySelector(`input[name="${CSS.escape(baseName)}__color"]`);
    if (textInput) textInput.value = value;
    if (colorInput) colorInput.value = value;
  };

  const applyInput = (name, value, checked = false) => {
    if (name === 'editorTheme') {
      state.editorTheme = value;
      document.documentElement.setAttribute('data-theme', value === 'dark' ? 'dark' : 'light');
      return;
    }
    if (name === 'term' || name === 'palettePreset') {
      state[name] = value;
      if (name === 'palettePreset' && value !== 'custom') {
        const preset = presets[value] || presets.spring;
        state.pageBg = preset.pageBg;
        state.surface = preset.surface;
        state.surfaceAlt = preset.surfaceAlt;
        state.text = preset.text;
        state.muted = preset.muted;
        state.border = preset.border;
        state.accent = preset.accent;
        state.accent2 = preset.accent2;
        state.heroStart = preset.heroStart;
        state.heroMid = preset.heroMid;
        state.heroEnd = preset.heroEnd;
        state.heroText = preset.heroText;
      }
      return;
    }

    if (name.startsWith('sections.')) {
      state.sections[name.split('.')[1]] = checked;
      return;
    }

    const colorName = name.endsWith('__color') ? name.slice(0, -7) : name;
    if (['pageBg', 'surface', 'surfaceAlt', 'text', 'muted', 'border', 'accent', 'accent2', 'heroStart', 'heroMid', 'heroEnd', 'heroText'].includes(colorName)) {
      state[colorName] = value;
      state.palettePreset = 'custom';
      return;
    }

    const contactMatch = name.match(/^contactMethods\.(email|discord|canvas)\.(enabled|value)$/);
    if (contactMatch) {
      const key = contactMatch[1];
      const prop = contactMatch[2];
      state.contactMethods[key][prop] = prop === 'enabled' ? checked : value;
      return;
    }

    const customContactMatch = name.match(/^customContactMethods\[(\d+)\]\.(enabled|label|badge|value|link)$/);
    if (customContactMatch) {
      const index = Number(customContactMatch[1]);
      const prop = customContactMatch[2];
      if (!state.customContactMethods[index]) state.customContactMethods[index] = { enabled: false, label: '', badge: 'CU', value: '', link: '' };
      state.customContactMethods[index][prop] = prop === 'enabled' ? checked : value;
      return;
    }

    const imageMatch = name.match(/^images\[(\d+)\]\.(src|alt|caption)$/);
    if (imageMatch) {
      const index = Number(imageMatch[1]);
      state.images[index][imageMatch[2]] = value;
      return;
    }

    const helpMatch = name.match(/^helpItems\[(\d+)\]$/);
    if (helpMatch) {
      state.helpItems[Number(helpMatch[1])] = value;
      return;
    }

    const visitMatch = name.match(/^visitCards\[(\d+)\]\.(title|body)$/);
    if (visitMatch) {
      const index = Number(visitMatch[1]);
      state.visitCards[index][visitMatch[2]] = value;
      return;
    }

    const hoursMatch = name.match(/^hoursRows\[(\d+)\]\.(day|time|note)$/);
    if (hoursMatch) {
      const index = Number(hoursMatch[1]);
      state.hoursRows[index][hoursMatch[2]] = value;
      return;
    }
    const hoursToggleMatch = name.match(/^hoursRows\[(\d+)\]\.(online|inPerson)$/);
    if (hoursToggleMatch) {
      const index = Number(hoursToggleMatch[1]);
      state.hoursRows[index][hoursToggleMatch[2]] = checked;
      return;
    }

    const myHoursMatch = name.match(/^myHoursRows\[(\d+)\]\.(day|time|note)$/);
    if (myHoursMatch) {
      const index = Number(myHoursMatch[1]);
      state.myHoursRows[index][myHoursMatch[2]] = value;
      return;
    }
    const myHoursToggleMatch = name.match(/^myHoursRows\[(\d+)\]\.(online|inPerson)$/);
    if (myHoursToggleMatch) {
      const index = Number(myHoursToggleMatch[1]);
      state.myHoursRows[index][myHoursToggleMatch[2]] = checked;
      return;
    }

    const hobbyMatch = name.match(/^hobbyItems\[(\d+)\]$/);
    if (hobbyMatch) {
      state.hobbyItems[Number(hobbyMatch[1])] = value;
      return;
    }

    const customBulletMatch = name.match(/^customItems\[(\d+)\]$/);
    if (customBulletMatch) {
      state.customItems[Number(customBulletMatch[1])] = value;
      return;
    }

    if (Object.prototype.hasOwnProperty.call(state, name)) {
      state[name] = value;
    }
  };

  const bindForm = () => {
    const form = document.querySelector('#generator-form');
    if (!form) return;

    const rerender = () => {
      renderEditor();
      renderPreview();
    };

    form.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const name = target.getAttribute('name');
      if (!name) return;
      const type = target.getAttribute('type');
      const isCheckbox = type === 'checkbox';
      if (isCheckbox) applyInput(name, '', target.checked);
      else applyInput(name, target.value, false);

      if (name.endsWith('__color')) {
        const baseName = name.slice(0, -7);
        applyInput(baseName, target.value, false);
        setColorPair(form, baseName, target.value);
      }

      if (isCheckbox || name === 'term' || name === 'palettePreset' || name.startsWith('sections.')) {
        rerender();
      } else {
        renderPreview();
      }
    });

    form.addEventListener('change', async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const name = target.getAttribute('name');
      if (!name) return;

      if (target.getAttribute('type') === 'file') {
        const input = target;
        const idx = Number(input.dataset.imageFile);
        const file = input.files && input.files[0];
        if (!file) return;
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
        state.images[idx].src = dataUrl;
        if (!state.images[idx].alt) state.images[idx].alt = file.name.replace(/\.[^.]+$/, '');
        renderEditor();
        renderPreview();
        return;
      }

      if (target.tagName === 'SELECT') {
        applyInput(name, target.value, false);
        if (name === 'palettePreset' || name === 'term') {
          renderEditor();
          renderPreview();
        }
        return;
      }

      if (name.endsWith('__color')) {
        const baseName = name.slice(0, -7);
        applyInput(baseName, target.value, false);
        renderPreview();
        return;
      }

      if (target.getAttribute('type') === 'checkbox') {
        applyInput(name, '', target.checked);
        renderPreview();
      }
    });

    const clickMap = [
      ['[data-add-image]', () => {
        if (state.images.length >= 4) return;
        state.images = [...state.images, { src: '', alt: '', caption: '' }];
        rerender();
      }],
      ['[data-remove-image]', (event) => {
        const index = Number(event.currentTarget.dataset.removeImage);
        state.images.splice(index, 1);
        rerender();
      }],
      ['[data-add-help-item]', () => {
        state.helpItems = [...state.helpItems, 'New help item'];
        rerender();
      }],
      ['[data-add-visit-card]', () => {
        state.visitCards = [...state.visitCards, { title: 'New card', body: 'Edit this text.' }].slice(0, 4);
        rerender();
      }],
      ['[data-remove-visit-card]', (event) => {
        const index = Number(event.currentTarget.dataset.removeVisitCard);
        if (state.visitCards.length <= 1) return;
        state.visitCards.splice(index, 1);
        rerender();
      }],
      ['[data-add-custom-contact]', () => {
        state.customContactMethods = [...state.customContactMethods, { enabled: false, label: 'Custom method', badge: 'CU', value: '', link: '' }];
        rerender();
      }],
      ['[data-remove-custom-contact]', (event) => {
        const index = Number(event.currentTarget.dataset.removeCustomContact);
        if (state.customContactMethods.length <= 1) {
          state.customContactMethods[0] = { enabled: false, label: '', badge: 'CU', value: '', link: '' };
        } else {
          state.customContactMethods.splice(index, 1);
        }
        rerender();
      }],
      ['[data-add-hour-row]', () => {
        state.hoursRows = [...state.hoursRows, { day: 'New day', time: 'New time', online: true, inPerson: false, note: '' }];
        rerender();
      }],
      ['[data-add-my-hour-row]', () => {
        state.myHoursRows = [...state.myHoursRows, { day: 'New day', time: 'New time', online: false, inPerson: false, note: '' }];
        rerender();
      }],
      ['[data-add-my-hour-below]', (event) => {
        const index = Number(event.currentTarget.dataset.addMyHourBelow);
        state.myHoursRows.splice(index + 1, 0, { day: 'New day', time: 'New time', online: false, inPerson: false, note: '' });
        rerender();
      }],
      ['[data-remove-my-hour-row]', (event) => {
        const index = Number(event.currentTarget.dataset.removeMyHourRow);
        if (state.myHoursRows.length <= 1) return;
        state.myHoursRows.splice(index, 1);
        rerender();
      }],
      ['[data-add-hour-below]', (event) => {
        const index = Number(event.currentTarget.dataset.addHourBelow);
        state.hoursRows.splice(index + 1, 0, { day: 'New day', time: 'New time', online: true, inPerson: false, note: '' });
        rerender();
      }],
      ['[data-remove-hour-row]', (event) => {
        const index = Number(event.currentTarget.dataset.removeHourRow);
        if (state.hoursRows.length <= 1) return;
        state.hoursRows.splice(index, 1);
        rerender();
      }],
      ['[data-add-hobby-item]', () => {
        state.hobbyItems = [...state.hobbyItems, 'New hobby item'];
        rerender();
      }],
      ['[data-remove-hobby-item]', () => {
        if (state.hobbyItems.length <= 1) return;
        state.hobbyItems.pop();
        rerender();
      }],
      ['[data-add-custom-item]', () => {
        state.customItems = [...state.customItems, 'New custom bullet'];
        rerender();
      }],
      ['[data-remove-custom-item]', () => {
        if (state.customItems.length <= 1) return;
        state.customItems.pop();
        rerender();
      }],
    ];

    for (const [selector, handler] of clickMap) {
      form.querySelectorAll(selector).forEach((node) => node.addEventListener('click', handler));
    }
  };

  const renderApp = () => {
    document.documentElement.setAttribute('data-theme', state.editorTheme === 'dark' ? 'dark' : 'light');
    renderEditor();
    bindForm();
    renderPreview();
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

  const reset = () => {
    state = defaultState();
    localStorage.removeItem(STORAGE_KEY);
    renderApp();
    setStatus('Reset to defaults.');
  };

  renderApp();
  copyBtns.forEach((btn) => btn.addEventListener('click', copyHtml));
  downloadBtn?.addEventListener('click', downloadHtml);
  resetBtn?.addEventListener('click', reset);
})();
