'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Navegación: fondo sólido al hacer scroll, menú móvil, enlace activo */
const nav = $('.nav'), menu = $('#menu'), burger = $('.burger');
const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
const links = $$('a', menu);
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* Aparición de módulos al entrar en pantalla */
const reveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
}), { threshold: .15 });
$$('.reveal').forEach(el => reveal.observe(el));

/* Hojas de otoño (decorativas) */
const leaves = $('.leaves');
for (let i = 0; i < 16; i++) {
  const l = document.createElement('span');
  l.className = 'leaf';
  l.style.cssText = `left:${Math.random() * 100}%;--dx:${Math.random() * 160 - 80}px;` +
    `animation-duration:${9 + Math.random() * 9}s;animation-delay:-${Math.random() * 14}s;` +
    `transform:scale(${.6 + Math.random() * .9})`;
  leaves.appendChild(l);
}

/* Personajes: lee los data-* de cada botón */
const tabs = $$('.char-tab'), img = $('#char-img');
tabs.forEach((t, i) => {
  t.addEventListener('click', () => {
    tabs.forEach(o => o.setAttribute('aria-selected', o === t));
    $('#char-name').textContent = t.dataset.name;
    $('#char-role').textContent = t.dataset.role;
    $('#char-text').textContent = t.dataset.text;
    img.src = t.dataset.img; img.alt = t.dataset.name;
    img.classList.remove('swap'); void img.offsetWidth; img.classList.add('swap');
  });
  t.addEventListener('keydown', e => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (d) { e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click(); }
  });
});

/* Galería con lightbox (<dialog> nativo: Esc cierra) */
const lb = $('#lightbox'), lbImg = $('img', lb), shots = $$('.gallery img');
let cur = 0;
const show = i => { cur = (i + shots.length) % shots.length; lbImg.src = shots[cur].src; lbImg.alt = shots[cur].alt; };
shots.forEach((s, i) => s.parentElement.addEventListener('click', () => { show(i); lb.showModal(); }));
$('.prev', lb).addEventListener('click', () => show(cur - 1));
$('.next', lb).addEventListener('click', () => show(cur + 1));
$('.lb-close', lb).addEventListener('click', () => lb.close());
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
lb.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(cur - 1);
  if (e.key === 'ArrowRight') show(cur + 1);
});

/* Enlaces provisionales: avisan en lugar de navegar */
const toast = $('.toast');
let timer;
$$('[data-placeholder]').forEach(a => a.addEventListener('click', e => {
  if (a.getAttribute('href') !== '#' && a.getAttribute('href') !== '#descargar') return;
  e.preventDefault();
  toast.textContent = 'Enlace provisional · aún no disponible';
  toast.classList.add('show'); clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('show'), 2400);
}));
