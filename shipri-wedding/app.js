'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const CONFIG = Object.freeze({
  weddingDate: '2027-01-26T19:00:00+05:30',
  venue: 'Blue Mountain Country Club & Resort, Siliguri',
  whatsappNumber: '919711668419'
});
let toastTimeout;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3800); }
function remember(key, value) { try { localStorage.setItem(key, value); } catch {} }
function recalled(key) { try { return localStorage.getItem(key); } catch { return null; } }
function addPetal(petal) {
  $('#petals').append(petal);
  const cleanup = setTimeout(() => petal.remove(), 8500);
  petal.addEventListener('animationend', () => { clearTimeout(cleanup); petal.remove(); }, { once: true });
}
function showerPetals(count = 30) {
  if (reduceMotion.matches) return;
  const available = Math.max(0, 84 - $('#petals').childElementCount);
  for (let i = 0; i < Math.min(count, available); i++) {
    const petal = document.createElement('i'); petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty('--duration', `${3.5 + Math.random() * 3}s`);
    petal.style.setProperty('--drift', `${(Math.random() - .5) * 300}px`);
    petal.style.setProperty('--spin', `${Math.random() * 900 - 450}deg`);
    petal.style.animationDelay = `${Math.random() * 1.1}s`;
    addPetal(petal);
  }
}
function burstFromSeal(x, y) {
  if (reduceMotion.matches) return;
  const available = Math.max(0, 84 - $('#petals').childElementCount);
  for (let i = 0; i < Math.min(22, available); i++) {
    const petal = document.createElement('i'); petal.className = 'petal petal--burst';
    const angle = Math.PI + (i / 21) * Math.PI;
    const radius = Math.min(innerWidth * .4, 240) * (.65 + Math.random() * .35);
    petal.style.left = `${x}px`; petal.style.top = `${y}px`;
    petal.style.setProperty('--burst-x', `${Math.cos(angle) * radius}px`);
    petal.style.setProperty('--burst-y', `${Math.sin(angle) * radius - 35}px`);
    petal.style.setProperty('--burst-end-x', `${Math.cos(angle) * radius * 1.5}px`);
    petal.style.setProperty('--burst-end-y', `${innerHeight * .85}px`);
    petal.style.setProperty('--spin', `${(i % 2 ? -1 : 1) * (220 + Math.random() * 350)}deg`);
    petal.style.setProperty('--duration', `${2.3 + Math.random() * .7}s`);
    petal.style.animationDelay = `${.16 + Math.random() * .13}s`;
    addPetal(petal);
  }
}
/* An optional welcome screen, with keyboard focus kept on its seal. */
const entry = $('#entry');
const site = $('#site');
let entryTimer, revealTimer;
function finishEntry() {
  clearTimeout(entryTimer);
  entry.classList.add('closed'); entry.setAttribute('aria-hidden', 'true'); site.inert = false;
  document.body.classList.remove('entry-active'); document.body.classList.add('invite-open');
  $('#names').tabIndex = -1; $('#names').focus({ preventScroll: true }); updateFloatingRsvp();
  revealTimer = setTimeout(() => document.body.classList.remove('invitation-revealing'), 350);
}
function closeEntry({ instant = false } = {}) {
  if (entry.classList.contains('closed')) return;
  if (instant || reduceMotion.matches) { finishEntry(); return; }
  if (entry.classList.contains('opening')) return;
  const seal = $('#open-invite').getBoundingClientRect();
  const x = seal.left + seal.width / 2, y = seal.top + seal.height / 2;
  entry.style.setProperty('--seal-x', `${x}px`); entry.style.setProperty('--seal-y', `${y}px`);
  entry.classList.add('opening'); document.body.classList.add('invitation-revealing');
  burstFromSeal(x, y);
  entryTimer = setTimeout(finishEntry, 1800);
}
function openEntry() {
  clearTimeout(entryTimer); clearTimeout(revealTimer);
  document.body.classList.remove('invitation-revealing'); $('#petals').replaceChildren();
  entry.classList.remove('closed', 'opening'); entry.removeAttribute('aria-hidden');
  site.inert = true; document.body.classList.add('entry-active'); document.body.classList.remove('invite-open'); updateFloatingRsvp();
  $('#open-invite').focus({ preventScroll: true });
}
$('#open-invite').addEventListener('click', () => closeEntry());
entry.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    const buttons = [...entry.querySelectorAll('button:not([hidden]):not([disabled])')];
    const index = buttons.indexOf(document.activeElement);
    e.preventDefault(); buttons[(index + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
  }
  if (e.key === 'Escape') closeEntry({ instant: true });
});
$('#replay-invite').addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'instant' }); openEntry(); });
$('.skip-link').addEventListener('click', () => closeEntry({ instant: true }));
reduceMotion.addEventListener?.('change', () => { if (reduceMotion.matches && entry.classList.contains('opening')) closeEntry({ instant: true }); });
if (!location.hash) openEntry(); else { entry.classList.add('closed'); entry.setAttribute('aria-hidden', 'true'); document.body.classList.add('invite-open'); }
/* Scroll reveals, respecting the visitor’s motion preference. */
const revealObserver = new IntersectionObserver(entries => { for (const item of entries) if (item.isIntersecting) { item.target.classList.add('in-view'); revealObserver.unobserve(item.target); } }, { threshold: .07 });
$$('.reveal').forEach(el => revealObserver.observe(el));
const sections = ['home', 'celebrations', 'rsvp', 'venue'];
let scrollQueued = false;
function updateFloatingRsvp() {
  const floating = $('#floating-rsvp');
  const form = $('#rsvp-form');
  if (!floating || !form) return;
  const beforeForm = form.getBoundingClientRect().top > innerHeight * .88;
  floating.hidden = !document.body.classList.contains('invite-open') || !beforeForm || $('#rsvp-dialog').open;
  document.body.classList.toggle('has-floating-rsvp', !floating.hidden);
}
function updateNav() {
  scrollQueued = false; updateFloatingRsvp(); let active = 'home';
  for (const id of sections) if (document.getElementById(id).getBoundingClientRect().top <= innerHeight * .4) active = id;
  $$('.mobile-nav a').forEach(link => { const selected = link.hash === `#${active}`; link.classList.toggle('active', selected); if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateNav); } }, { passive: true });
updateNav();
addEventListener('resize', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateNav); } }, { passive: true });
$('#floating-rsvp').addEventListener('click', () => $('#reply-form-title').focus({ preventScroll: true }));
/* Fixed ISO offset ensures the countdown is identical in every time zone. */
function updateCountdown() {
  const delta = Math.max(0, new Date(CONFIG.weddingDate).getTime() - Date.now());
  const remaining = Math.floor(delta / 1000);
  const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((key, index) => { $(`#${key}`).textContent = String(values[index]).padStart(2, '0'); });
  if (!delta) $('#countdown-title').textContent = 'Our forever has begun.';
}
updateCountdown(); setInterval(updateCountdown, 1000);
/* One date reservation, tailored to the celebrations in the reviewed RSVP. */
function calendarPlan(selectedEvents) {
  if (!Array.isArray(selectedEvents)) return null;
  const celebrations = [
    { title: 'Haldi', start: '2027-01-25T10:00:00+05:30', description: 'Haldi: 25 January 2027 at 10:00 AM IST. Dress: sunshine yellow ethnic wear.' },
    { title: 'Sangeet', start: '2027-01-25T18:00:00+05:30', description: 'Sangeet: 25 January 2027 at 6:00 PM IST. Dress: Indo-Western attire.' },
    { title: 'Wedding', start: CONFIG.weddingDate, description: 'Wedding: 26 January 2027 at 7:00 PM IST. Dress in your finest Indian festive wear.' }
  ];
  const events = celebrations.filter(event => selectedEvents.includes(event.title));
  if (!events.length) return null;
  const dates = [...new Set(events.map(event => event.start.slice(0, 10)))].sort();
  const first = dates[0], last = dates[dates.length - 1];
  const end = new Date(`${last}T00:00:00Z`); end.setUTCDate(end.getUTCDate() + 1);
  const format = (date, options) => new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
  const label = (dates.length > 1 ? `${format(first, { day: 'numeric' })}–` : '') + format(last, { day: 'numeric', month: 'long', year: 'numeric' });
  return {
    events, days: dates.length, label,
    start: first.replace(/-/g, ''), end: end.toISOString().slice(0, 10).replace(/-/g, ''),
    filename: `Priyanka-and-Shiva-${label.replace(/[ –]/g, '-')}.ics`
  };
}
function calendarText(selectedEvents) {
  const plan = calendarPlan(selectedEvents); if (!plan) return null;
  const escape = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = plan.days > 1 ? 'Wedding celebrations' : plan.events.map(event => event.title).join(' & ');
  const description = `Your selected celebrations:\n\n${plan.events.map(event => event.description).join('\n\n')}\n\nAll ceremony times are India Standard Time (IST).`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Priyanka and Shiva//Wedding//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:shipri-rsvp-${plan.start}-${plan.end}@wedding.local`, `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${plan.start}`, `DTEND;VALUE=DATE:${plan.end}`, 'SEQUENCE:1',
    `SUMMARY:${escape(`Priyanka & Shiva — ${title}`)}`, `LOCATION:${escape(CONFIG.venue)}`,
    `DESCRIPTION:${escape(description)}`,
    'END:VEVENT', 'END:VCALENDAR', ''];
  // RFC 5545: fold content lines at 75 UTF-8 octets without splitting a character.
  return lines.map(line => {
    let result = '', bytes = 0;
    for (const character of line) {
      const size = new TextEncoder().encode(character).length;
      if (bytes + size > 75) { result += '\r\n '; bytes = 1; }
      result += character; bytes += size;
    }
    return result;
  }).join('\r\n');
}
function saveRsvpCalendar() {
  const plan = calendarPlan(preparedCalendarEvents); if (!plan) return;
  const text = calendarText(preparedCalendarEvents);
  const href = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a'); link.href = href; link.download = plan.filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 30000);
  $('#rsvp-calendar-status').textContent = `Calendar file ready — open it to save ${plan.days === 2 ? 'both days' : 'your day'}.`;
}
function updateRsvpCalendar() {
  const plan = calendarPlan(preparedCalendarEvents);
  $('#rsvp-calendar').hidden = !plan;
  $('#download-rsvp-calendar').disabled = !plan;
  $('#rsvp-calendar-status').textContent = '';
  if (!plan) return;
  $('#rsvp-calendar-title').textContent = plan.label;
  $('#rsvp-calendar-events').textContent = plan.events.map(event => event.title).join(' · ');
  $('#download-rsvp-calendar span').textContent = `Add ${plan.days === 2 ? 'both days' : 'this day'} to calendar`;
}
$('#download-rsvp-calendar').addEventListener('click', saveRsvpCalendar);
/* A personal blessing; the saved state belongs only to this browser. */
function lightDiya(celebrate = true) {
  $('#diya-button').setAttribute('aria-pressed', 'true'); $('#diya-button').setAttribute('aria-label', 'Diya is lit. Tap to shower petals.');
  $('.diya-prompt').textContent = 'A WISH, A LIGHT, A NEW BEGINNING';
  $('#blessing-message').textContent = 'May their forever be filled with light and love.';
  remember('shipri-diya-lit', 'yes'); if (celebrate) { showerPetals(32); chime(); }
}
$('#diya-button').addEventListener('click', () => lightDiya());
$('#petal-button').addEventListener('click', () => { showerPetals(45); toast('With love, for Priyanka & Shiva.'); });
if (recalled('shipri-diya-lit') === 'yes') lightDiya(false);
/* Gentle, original pentatonic chimes. Sound starts only after an explicit tap. */
let audioContext, soundTimer, soundOn = false;
const notes = [261.63, 293.66, 329.63, 392, 440, 523.25, 440, 392, 329.63, 293.66];
let noteIndex = 0;
function playNote(frequency, volume = .055) {
  if (!audioContext || audioContext.state !== 'running') return;
  const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
  oscillator.type = 'sine'; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, audioContext.currentTime); gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + .025); gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + 3.8);
  oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + 4);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function chime() { if (soundOn) { playNote(523.25); setTimeout(() => playNote(783.99, .025), 180); } }
async function setSound(enabled) {
  try {
    if (enabled) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return toast('Ambient sound is not available in this browser.');
      audioContext ||= new Audio(); await audioContext.resume(); soundOn = true;
      playNote(notes[noteIndex++ % notes.length]); clearInterval(soundTimer);
      soundTimer = setInterval(() => { if (!document.hidden) playNote(notes[noteIndex++ % notes.length]); }, 2000);
    } else { soundOn = false; clearInterval(soundTimer); if (audioContext) await audioContext.suspend(); }
    $('#sound-toggle').setAttribute('aria-pressed', String(soundOn)); $('#sound-toggle').setAttribute('aria-label', `Turn ambient sound ${soundOn ? 'off' : 'on'}`); $('.sound-label').textContent = `SOUND ${soundOn ? 'ON' : 'OFF'}`;
  } catch { toast('Tap again to enable sound in your browser.'); }
}
$('#sound-toggle').addEventListener('click', () => setSound(!soundOn));
document.addEventListener('visibilitychange', () => { if (document.hidden && soundOn) setSound(false); });
/* Share actions never claim a message has been sent. */
async function copyText(text, success) {
  try { await navigator.clipboard.writeText(text); toast(success); return true; }
  catch { toast('Copy is unavailable. Select and copy the text in the preview.'); return false; }
}
$('#copy-venue').addEventListener('click', async () => {
  const done = await copyText(CONFIG.venue, 'Venue details copied.');
  if (!done) { const range = document.createRange(); range.selectNodeContents($('#venue-name')); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
});
$('#share-invite').addEventListener('click', async () => {
  if (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname)) { toast('This is a local preview. Share your live link after publishing.'); return; }
  const data = { title: 'Priyanka & Shiva · Wedding Invitation', text: 'Join us for Priyanka & Shiva’s wedding on 26 January 2027 in Siliguri.', url: location.href.split('#')[0] };
  if (navigator.share) { try { await navigator.share(data); } catch (error) { if (error.name !== 'AbortError') await copyText(data.url, 'Invitation link copied.'); } }
  else await copyText(data.url, 'Invitation link copied.');
});
/* RSVP is prepared locally and addressed to the couple’s chosen WhatsApp number. */
function updateAttendance() {
  const attending = $('input[name=attendance]:checked').value === 'yes'; $('#attending-fields').hidden = !attending;
  $$('#attending-fields input, #attending-fields button').forEach(input => { input.disabled = !attending; });
}
$$('input[name=attendance]').forEach(input => input.addEventListener('change', updateAttendance));
let preparedReply = '', preparedCalendarEvents = [];
const dialog = $('#rsvp-dialog');
$('#rsvp-form').addEventListener('submit', e => {
  e.preventDefault(); const form = e.currentTarget;
  const name = $('#guest-name').value.trim(); if (!name) { $('#guest-name').setCustomValidity('Please enter your name.'); $('#guest-name').reportValidity(); return; }
  const attending = $('input[name=attendance]:checked').value === 'yes';
  const chosenEvents = $$('input[name=events]:checked').map(input => input.value);
  if (attending && !chosenEvents.length) { toast('Please choose at least one celebration.'); $('input[name=events]').focus(); return; }
  if (!form.reportValidity()) return;
  const note = $('#guest-note').value.trim();
  preparedReply = [`Dear Priyanka & Shiva,`, '', `I’m ${name}.`, attending ? `I’m joyfully attending your wedding celebrations!` : `I’m unable to attend, but will be celebrating you from afar.`,
    ...(attending ? [`Celebrations: ${chosenEvents.join(', ')}`] : []),
    ...(note ? ['', note] : []), '', 'With love and best wishes,', name].join('\n');
  $('#rsvp-preview').textContent = preparedReply; $('#whatsapp-rsvp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(preparedReply)}`;
  preparedCalendarEvents = attending ? [...chosenEvents] : []; updateRsvpCalendar();
  dialog.showModal(); document.body.style.overflow = 'hidden'; updateFloatingRsvp();
});
$('#guest-name').addEventListener('input', () => $('#guest-name').setCustomValidity(''));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { const rect = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; updateFloatingRsvp(); $('.submit-rsvp').focus({ preventScroll: true }); });
$('#copy-rsvp').addEventListener('click', async () => { if (!await copyText(preparedReply, 'RSVP copied — ready to send to the couple.')) { const range = document.createRange(); range.selectNodeContents($('#rsvp-preview')); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); } });
$('#share-rsvp').addEventListener('click', async () => {
  if (navigator.share) { try { await navigator.share({ title: 'RSVP · Priyanka & Shiva', text: preparedReply }); } catch (error) { if (error.name !== 'AbortError') await copyText(preparedReply, 'RSVP copied — ready to share.'); } }
  else await copyText(preparedReply, 'RSVP copied — choose Open WhatsApp to send.');
});

/* Living paintings: one low-rate loop, running only for visible artwork. */
(() => {
  const scenes = $$('[data-art-scene]').map(element => ({
    element, kind: element.dataset.artScene, image: element.querySelector('img'),
    canvas: element.querySelector('canvas'), context: null, unavailable: false,
    visible: false, width: 0, height: 0, paintWidth: 0, paintHeight: 0, x: 0, y: 0
  }));
  let frame = 0, previous = 0, elapsed = 0;
  const paused = () => reduceMotion.matches || document.hidden;
  const point = (scene, x, y) => [scene.x + scene.paintWidth * x, scene.y + scene.paintHeight * y];

  function fit(scene) {
    const width = scene.element.clientWidth, height = scene.element.clientHeight;
    scene.width = width; scene.height = height;
    if (!width || !height) return;
    const naturalWidth = scene.image.naturalWidth || Number(scene.image.getAttribute('width'));
    const naturalHeight = scene.image.naturalHeight || Number(scene.image.getAttribute('height'));
    const scale = Math.max(width / naturalWidth, height / naturalHeight);
    scene.paintWidth = naturalWidth * scale; scene.paintHeight = naturalHeight * scale;
    const position = getComputedStyle(scene.image).objectPosition.split(' ');
    const fraction = value => value?.endsWith('%') ? parseFloat(value) / 100 : .5;
    scene.x = (width - scene.paintWidth) * fraction(position[0]);
    scene.y = (height - scene.paintHeight) * fraction(position[1]);
    if (scene.context) {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      scene.canvas.width = Math.round(width * ratio); scene.canvas.height = Math.round(height * ratio);
      scene.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }
  function prepare(scene) {
    if (scene.context || scene.unavailable) return;
    try { scene.context = scene.canvas.getContext('2d', { alpha: true }); } catch {}
    scene.unavailable = !scene.context;
    fit(scene);
  }
  function glow(scene, x, y, radius, strength) {
    const ctx = scene.context, [px, py] = point(scene, x, y), r = radius * scene.paintWidth;
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, r);
    gradient.addColorStop(0, `rgba(255,216,124,${strength})`);
    gradient.addColorStop(.35, `rgba(252,179,71,${strength * .4})`);
    gradient.addColorStop(1, 'rgba(255,179,71,0)');
    ctx.fillStyle = gradient; ctx.fillRect(px - r, py - r, r * 2, r * 2);
  }
  function speck(scene, x, y, radius, opacity, colour = '255,222,147') {
    const ctx = scene.context, [px, py] = point(scene, x, y);
    ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${colour},${opacity})`; ctx.fill();
  }
  function paint(scene, time) {
    const ctx = scene.context;
    if (!ctx || !scene.width || !scene.height) return;
    ctx.clearRect(0, 0, scene.width, scene.height);
    const unit = Math.min(scene.width / 450, 1.4);
    if (scene.kind === 'haldi') {
      for (let i = 0; i < 12; i++) {
        const phase = (time * (.025 + i % 3 * .005) + i * .137) % 1;
        const x = (.1 + i * .173) % .9 + Math.sin(time * .5 + i) * .045;
        const [px, py] = point(scene, x, phase * 1.2 - .1);
        ctx.save(); ctx.translate(px, py); ctx.rotate(time * .35 + i);
        ctx.globalAlpha = .55 * Math.sin(phase * Math.PI);
        ctx.fillStyle = i % 3 ? '#efbd59' : '#d79789';
        ctx.beginPath(); ctx.ellipse(0, 0, 3 * unit, 6 * unit, .3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    } else if (scene.kind === 'sangeet') {
      [[.256,.229], [.412,.148], [.681,.06], [.889,.121], [.86,.403], [.32,.92]].forEach(([x,y], i) => {
        glow(scene, x, y, .065, .23 + .08 * Math.sin(time * 1.2 + i * 2));
      });
      for (let i = 0; i < 13; i++) {
        const x = .15 + (i * .137) % .75 + Math.sin(time * .22 + i) * .018;
        const y = .18 + (i * .173) % .7 + Math.cos(time * .25 + i) * .018;
        speck(scene, x, y, (1 + i % 2 * .5) * unit, .15 + .32 * (1 + Math.sin(time * .8 + i)) / 2);
      }
    } else if (scene.kind === 'wedding') {
      glow(scene, .5, .742, .13, .18 + .06 * Math.sin(time * 3.2));
      [[.044,.555], [.956,.555], [.068,.677], [.935,.677]].forEach(([x,y], i) => glow(scene, x, y, .045, .15 + .05 * Math.sin(time * 1.8 + i)));
      for (let i = 0; i < 12; i++) {
        const rise = (time * (.11 + i % 3 * .025) + i * .083) % 1;
        const x = .5 + Math.sin(time * .7 + i * 2) * .025 + (i % 5 - 2) * rise * .008;
        speck(scene, x, .755 - rise * .16, (1 + i % 3 * .35) * unit, Math.sin(rise * Math.PI) * .75, '255,195,85');
      }
    }
  }
  function tick(now) {
    frame = 0;
    if (paused() || !scenes.some(scene => scene.visible && scene.context)) { previous = 0; return; }
    if (!previous || now - previous >= 1000 / 30) {
      elapsed += previous ? Math.min(now - previous, 100) / 1000 : 0;
      previous = now;
      scenes.filter(scene => scene.visible).forEach(scene => paint(scene, elapsed));
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    document.body.classList.toggle('art-motion-paused', reduceMotion.matches);
    document.body.classList.toggle('art-page-hidden', document.hidden);
    if (paused()) {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      if (reduceMotion.matches) scenes.forEach(scene => scene.context?.clearRect(0,0,scene.width,scene.height));
      return;
    }
    scenes.filter(scene => scene.visible).forEach(prepare);
    if (!frame && scenes.some(scene => scene.visible && scene.context)) frame = requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(item => {
      const scene = scenes.find(scene => scene.element === item.target);
      scene.visible = item.isIntersecting;
      scene.element.classList.toggle('is-art-visible', scene.visible);
    });
    sync();
  }, { threshold: .01 });
  scenes.forEach(scene => {
    observer.observe(scene.element);
    scene.image.addEventListener('load', () => { fit(scene); updateFloatingRsvp(); });
  });
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(entries => entries.forEach(item => fit(scenes.find(scene => scene.element === item.target))));
    scenes.forEach(scene => resizeObserver.observe(scene.element));
  } else addEventListener('resize', () => scenes.forEach(fit), { passive: true });
  reduceMotion.addEventListener?.('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.fonts?.ready.then(updateFloatingRsvp);
  sync();
})();

/* Only stack cards when every card fits above the navigation in full. */
(() => {
  const stack = $('.event-stack'), cards = [...stack.querySelectorAll(':scope > .ceremony')];
  let layout = [], frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  function render() {
    frame = 0;
    if (reduceMotion.matches || !layout.length) return;
    const start = stack.getBoundingClientRect().top;
    layout.forEach((item, index) => {
      const next = layout[index + 1];
      const overlap = next ? clamp((item.top + item.height - (start + next.offset)) / Math.min(item.height * .8, innerHeight * .7)) : 0;
      item.overlap = overlap;
      item.card.style.setProperty('--stack-scale', (1 - overlap * .045).toFixed(4));
      item.card.style.setProperty('--stack-turn', `${(overlap * (index % 2 ? 1 : -1) * .9).toFixed(3)}deg`);
    });
  }
  function measure() {
    if (reduceMotion.matches) {
      stack.classList.remove('photo-stack'); layout = []; cancelAnimationFrame(frame); frame = 0; return;
    }
    const nav = $('.mobile-nav');
    const navigationHeight = getComputedStyle(nav).display === 'none' ? 0 : nav.offsetHeight;
    const availableBottom = innerHeight - navigationHeight - 24;
    const startTop = navigationHeight ? 12 : 28, step = navigationHeight ? 10 : 14;
    const heights = cards.map(card => card.offsetHeight);
    const fits = heights.every((height, index) => height > 0 && height + startTop + index * step <= availableBottom);
    stack.classList.toggle('photo-stack', fits);
    if (!fits) {
      layout = []; cancelAnimationFrame(frame); frame = 0;
      cards.forEach(card => { card.style.removeProperty('--stack-scale'); card.style.removeProperty('--stack-turn'); });
      return;
    }
    const gap = parseFloat(getComputedStyle(stack).rowGap) || 60;
    let offset = 0;
    layout = cards.map((card, index) => {
      const height = heights[index];
      const top = startTop + index * step;
      card.style.setProperty('--stack-top', `${top}px`);
      card.style.setProperty('--stack-layer', String(index + 1));
      card.style.setProperty('--stack-origin', '0%');
      const item = { card, height, top, offset, overlap: 0 };
      offset += height + gap;
      return item;
    });
    render();
  }
  addEventListener('scroll', () => {
    if (!reduceMotion.matches && !frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  addEventListener('resize', measure, { passive: true });
  reduceMotion.addEventListener?.('change', measure);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measure);
    cards.forEach(card => observer.observe(card));
  }
  stack.addEventListener('focusin', event => {
    const item = layout.find(item => item.card.contains(event.target));
    if (item?.overlap > .05) {
      window.scrollTo({ top: scrollY + stack.getBoundingClientRect().top + item.offset - 24, behavior: 'instant' });
    }
  });
  document.fonts?.ready.then(measure);
  measure();
})();
