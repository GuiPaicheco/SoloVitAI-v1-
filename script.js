/* ================================================
   SOLOVITAI — script.js
   Partículas, Cursor, Scroll, Chat, Animações
   ================================================ */

/* ===== CURSOR PERSONALIZADO ===== */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .func-card, .sobre-card, .did-step, .team-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.borderColor = 'rgba(0,255,136,0.8)'; });
    el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(0,255,136,0.5)'; });
  });
})();

/* ===== CANVAS PARTÍCULAS ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 90;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.5 + 0.1;
      // Cor aleatória: verde ou azul
      this.color = Math.random() > 0.5 ? '0,255,136' : '0,207,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ===== NAVBAR SCROLL ===== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

/* ===== HAMBURGER MENU ===== */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

/* ===== REVEAL ON SCROLL ===== */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ===== CONTADORES ANIMADOS (HERO METRICS) ===== */
(function initCounters() {
  const els = document.querySelectorAll('.metric-val[data-target]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.target;
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          e.target.textContent = Math.floor(current);
        }, 28);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

/* ===== CHATBOT INTERATIVO ===== */
(function initChat() {
  const msgs    = document.getElementById('chat-messages');
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  // Banco de respostas simuladas
  const responses = {
    default: [
      'Processando dados dos sensores... Análise concluída! 🌿',
      'Consultando histórico do solo. Um momento!',
      'Integração com sensores confirmada. Aqui está o resultado:'
    ],
    umidade: [
      'Umidade atual do solo: **72%** — Nível ideal para cultivo. ✅',
      'Hectare 3: Umidade = 72%. Condição ótima para soja e milho.',
      'Sensor BLE-03 informa: umidade 72%. Tudo certo! 🌱'
    ],
    temperatura: [
      'Temperatura registrada: **24°C** — Excelente para crescimento. 🌡️',
      'Média da última hora: 24°C. Amplitude térmica dentro do normal.',
      'Temperatura do solo: 24°C. Perfeito para germinação de sementes.'
    ],
    plantar: [
      'Solo pronto para plantio! pH 6.5, umidade 72%, temperatura 24°C. ✅',
      'Análise completa: condições ideais detectadas. Recomendo plantio nas próximas 48h.',
      'IA confirma: solo saudável. Índice de aptidão: 94/100. 🏆'
    ],
    nutriente: [
      'Potássio (K) está em nível baixo: 38%. Recomendo aplicação nos próximos 3 dias. ⚠️',
      'N: 82% ✅ | P: 60% ✅ | K: 38% ⚠️ | Ca: 70% ✅ — Potássio precisa de atenção!',
      'Análise de nutrientes: deficiência de K detectada. Dose recomendada: 80 kg/ha.'
    ],
    ph: [
      'pH atual do solo: **6.5** — Faixa ideal para maioria das culturas. ✅',
      'pH 6.5 detectado. Sem necessidade de calagem no momento.',
      'Acidez do solo adequada: pH 6.5. Cultura de soja altamente recomendada.'
    ]
  };

  function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  }

  function appendMsg(text, type) {
    const div = document.createElement('div');
    div.className = 'msg ' + type;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;
    const time = document.createElement('span');
    time.className = 'msg-time';
    time.textContent = getTime();
    div.appendChild(bubble);
    div.appendChild(time);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot typing';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function classifyMessage(text) {
    const t = text.toLowerCase();
    if (t.includes('umid')) return 'umidade';
    if (t.includes('temp')) return 'temperatura';
    if (t.includes('plant') || t.includes('pronto') || t.includes('pode')) return 'plantar';
    if (t.includes('nutri') || t.includes('baixo') || t.includes('nitrog') || t.includes('potás') || t.includes('fosf')) return 'nutriente';
    if (t.includes('ph') || t.includes('acid')) return 'ph';
    return 'default';
  }

  function pickResponse(category) {
    const arr = responses[category];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    appendMsg(text, 'user');
    input.value = '';

    const typing = showTyping();
    const delay  = 900 + Math.random() * 600;

    setTimeout(() => {
      msgs.removeChild(typing);
      const cat  = classifyMessage(text);
      const resp = pickResponse(cat);
      appendMsg(resp, 'bot');
    }, delay);
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });
})();

// Função global para sugestões de chat
function sendSugg(btn) {
  const input = document.getElementById('chat-input');
  input.value = btn.textContent;
  document.getElementById('chat-send').click();
}

/* ===== PARALLAX HERO ===== */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.04 + i * 0.02;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  });
})();

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) cur = sec.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--green)' : '';
    });
  });
})();

/* ===== GLOW FOLLOW MOUSE (CARDS) ===== */
(function initCardGlow() {
  document.querySelectorAll('.func-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.fc-glow');
      if (glow) {
        glow.style.left = (x - 100) + 'px';
        glow.style.top  = (y - 100) + 'px';
      }
    });
  });
})();

/* ===== TYPING EFFECT HERO SLOGAN ===== */
(function initTyping() {
  const el = document.querySelector('.hero-slogan');
  if (!el) return;
  const original = el.textContent;
  // Pequena animação de aparecimento já feita via CSS, nada adicional necessário
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== NUTRIENT BARS ANIMATE ON SCROLL ===== */
(function initNutrientBars() {
  const bars = document.querySelectorAll('.bc-fill, .sensor-fill, .nut-bar div');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => {
    b.style.animationPlayState = 'paused';
    io.observe(b);
  });
})();

/* ===== GAUGE ANIMATE ON SCROLL ===== */
(function initGauge() {
  const gauge = document.querySelector('.gauge-fill');
  if (!gauge) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        gauge.style.animationPlayState = 'running';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  gauge.style.animationPlayState = 'paused';
  io.observe(gauge);
})();

/* ===== CHART ANIMATE ON SCROLL ===== */
(function initChart() {
  const line = document.querySelector('.chart-line');
  const area = document.querySelector('.chart-area');
  if (!line) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        line.style.animationPlayState = 'running';
        if (area) area.style.animationPlayState = 'running';
        document.querySelectorAll('.chart-dot').forEach(d => d.style.animationPlayState = 'running');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  line.style.animationPlayState = 'paused';
  if (area) area.style.animationPlayState = 'paused';
  document.querySelectorAll('.chart-dot').forEach(d => d.style.animationPlayState = 'paused');
  io.observe(line);
})();

/* ===== TOAST NOTIFICATION DEMO ===== */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:2rem; right:2rem; z-index:9000;
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.3);
    backdrop-filter: blur(20px);
    color: #00ff88;
    padding: 0.9rem 1.5rem;
    border-radius: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,255,136,0.2);
    animation: slideInToast 0.4s ease-out;
    display: flex; align-items: center; gap: 0.6rem;
  `;
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 3000);
}

// Toast de boas-vindas após 2 segundos
setTimeout(() => {
  showToast('SoloBot online — sensores sincronizados');
}, 2000);

/* ===== KEYFRAME INJECTION ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInToast {
    from { transform: translateX(120%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }
`;
document.head.appendChild(style);

/* ===== LOG ===== */
console.log('%cSoloVitAI 🌱', 'font-size:2rem; color:#00ff88; font-family:monospace; font-weight:bold;');
console.log('%cInteligência Artificial transformando o manejo agrícola.', 'color:#64748b; font-family:monospace;');
