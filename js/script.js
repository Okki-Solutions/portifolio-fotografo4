/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initReveal();
  initCarousel();
  initForm();
  initYear();
});

/* =====================================================
   HEADER — sombra ao rolar
   ===================================================== */
function initHeader() {
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =====================================================
   MENU HAMBÚRGUER (mobile)
   ===================================================== */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  const toggle = () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  btn.addEventListener('click', toggle);

  // Fecha ao clicar em um link
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) toggle();
    });
  });

  // Fecha com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) toggle();
  });
}

/* =====================================================
   REVEAL — revelar seções on-scroll
   ===================================================== */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
}

/* =====================================================
   CARROSSEL DE DEPOIMENTOS
   ===================================================== */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const dotsBox = document.getElementById('carouselDots');
  if (!track) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  let index = 0;
  let autoTimer;

  // Cria dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir para o depoimento ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(b);
  });
  const dots = Array.from(dotsBox.children);

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  function goTo(i) {
    index = (i + total) % total;
    update();
    restartAuto();
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  // Auto-play
  function startAuto() { autoTimer = setInterval(() => goTo(index + 1), 6000); }
  function stopAuto() { clearInterval(autoTimer); }
  function restartAuto() { stopAuto(); startAuto(); }

  // Pausa ao interagir / hover
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Swipe no celular
  let startX = 0, dx = 0;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; dx = 0;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchmove', e => { dx = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener('touchend', () => {
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
    else startAuto();
  });

  // Teclado (setas) quando o carrossel está em foco
  document.addEventListener('keydown', e => {
    const rect = carousel.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  update();
  startAuto();
}

/* =====================================================
   FORMULÁRIO DE CONTATO
   ===================================================== */
function initForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // Validação nativa do navegador
    if (!form.checkValidity()) {
      feedback.textContent = 'Por favor, preencha todos os campos corretamente.';
      feedback.classList.add('error');
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const nome = (data.get('nome') || '').toString().trim();

    // Aqui você integraria com seu backend / serviço de envio.
    // Simulação:
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      feedback.textContent = `Mensagem enviada com sucesso${nome ? ', ' + nome.split(' ')[0] : ''}! Retornarei em até 24h úteis.`;
      feedback.classList.add('success');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensagem';
    }, 1200);
  });
}

/* =====================================================
   ANO AUTOMÁTICO NO FOOTER
   ===================================================== */
function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}