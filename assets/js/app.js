import { supabase } from "/assets/js/supabase.js";

/* ═══════════════════════════════════════
   GUARDIA: se NON sei loggato → vai a login
════════════════════════════════════════ */
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) location.replace("/auth.html");
})();

/* LOGOUT */
window.hpLogout = async () => {
  await supabase.auth.signOut();
  location.replace("/auth.html");
};

/* ═══════════════════════════════════════
   STATO INTERNO APP
════════════════════════════════════════ */
let currentFmt = 'testo';
let hasReplied = false;
let drawingTool = 'pencil';
let brushSize = 4;
let isDrawing = false;
let lastX = 0, lastY = 0;
let ctx = null;

/* ═══════════════════════════════════════
   SCREEN NAVIGATION
════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  target.style.display = 'flex';
  setTimeout(() => target.classList.add('active'), 10);
}

window.showWelcome = () => showScreen('welcome');

window.showMain = () => {
  showScreen('main');
  if (hasReplied) {
    document.getElementById('locked-section').classList.add('hidden');
    document.getElementById('unlocked-section').classList.remove('hidden');
    document.getElementById('dq-label-text').textContent = 'Hai risposto oggi';
  }
};

window.showReply = () => showScreen('reply');

/* ═══════════════════════════════════════
   FORMAT SELECTOR (TESTO / FOTO / DISEGNO / MUSICA)
════════════════════════════════════════ */
window.selectFmt = (fmt, btn) => {
  currentFmt = fmt;
  document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');

  ['testo','foto','disegno','musica'].forEach(f => {
    const el = document.getElementById('fmt-'+f);
    el.classList.toggle('hidden', f !== fmt);
  });

  if (fmt === 'disegno') initCanvas();
};

/* ═══════════════════════════════════════
   TESTO — CONTEGGIO CARATTERI
════════════════════════════════════════ */
window.updateCharCount = () => {
  const v = document.getElementById('reply-text').value.length;
  document.getElementById('char-count').textContent = v;
};

/* ═══════════════════════════════════════
   REAZIONI (SMILE / SAD)
════════════════════════════════════════ */
window.toggleReact = (btn, type) => {
  const isSmile = type === 'smile';
  const onClass = isSmile ? 'smile-on' : 'sad-on';
  const otherClass = isSmile ? 'sad-on' : 'smile-on';

  const siblings = btn.parentElement.querySelectorAll('.rb');

  siblings.forEach(s => {
    if (s === btn) {
      const wasOn = s.classList.contains(onClass);
      s.classList.remove(onClass, otherClass);

      if (!wasOn) {
        s.classList.add(onClass);
        const num = parseInt(s.querySelector('span').textContent);
        s.querySelector('span').textContent = num + 1;
      } else {
        const num = parseInt(s.querySelector('span').textContent);
        s.querySelector('span').textContent = num - 1;
      }
    } else {
      if (s.classList.contains(otherClass)) {
        const num = parseInt(s.querySelector('span').textContent);
        s.querySelector('span').textContent = Math.max(0, num - 1);
      }
      s.classList.remove(onClass, otherClass);
    }
  });
};

/* ═══════════════════════════════════════
   PUBBLICAZIONE RISPOSTA
════════════════════════════════════════ */
window.publishReply = () => {
  hasReplied = true;
  showMain();
};

/* ═══════════════════════════════════════
   DISEGNO — CANVAS
════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('drawing-canvas');
  if (!canvas || ctx) return;

  const size = canvas.offsetWidth;
  canvas.width = size * window.devicePixelRatio;
  canvas.height = size * window.devicePixelRatio;

  ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.strokeStyle = '#DFFF00';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = brushSize;

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    startDraw({ offsetX: t.clientX - r.left, offsetY: t.clientY - r.top });
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    draw({ offsetX: t.clientX - r.left, offsetY: t.clientY - r.top });
  }, { passive: false });

  canvas.addEventListener('touchend', stopDraw);
}

function startDraw(e) {
  if (!['pencil','eraser'].includes(drawingTool)) return;

  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  ctx.beginPath();
  ctx.arc(lastX, lastY, ctx.lineWidth/2, 0, Math.PI*2);
  ctx.fillStyle = drawingTool === 'eraser' ? '#040404' : '#DFFF00';
  ctx.fill();
}

function draw(e) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);

  ctx.strokeStyle = drawingTool === 'eraser' ? '#040404' : '#DFFF00';
  ctx.lineWidth = drawingTool === 'eraser' ? brushSize * 4 : brushSize;
  ctx.stroke();

  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDraw() { isDrawing = false; }

window.setTool = (t) => {
  drawingTool = t;
  document.getElementById('tool-pencil').classList.toggle('on', t === 'pencil');
  document.getElementById('tool-text').classList.toggle('on', t === 'text');
  document.getElementById('tool-eraser').classList.toggle('on', t === 'eraser');
};

window.setBrush = (s) => {
  brushSize = s;
  if (ctx) ctx.lineWidth = s;

  document.querySelectorAll('.bs').forEach(b => b.classList.remove('on'));
  event.target.classList.add('on');
};

window.clearCanvas = () => {
  if (!ctx) return;
  const c = document.getElementById('drawing-canvas');
  ctx.clearRect(0, 0, c.width, c.height);
};

/* ═══════════════════════════════════════
   MUSICA
════════════════════════════════════════ */
window.checkYTLink = () => {
  const link = document.getElementById('yt-link')?.value || "";
  const preview = document.querySelector('.music-preview');
  preview.style.display =
    (link.includes('youtube.com') || link.includes('youtu.be'))
      ? 'flex'
      : 'none';
};

/* ═══════════════════════════════════════
   COOKIE BANNER
════════════════════════════════════════ */
function initCookieBanner() {
  if (!localStorage.getItem('hp-cookies')) {
    setTimeout(() => {
      document.getElementById('cookie-banner').classList.add('show');
    }, 3000);
  }
}

window.acceptCookies = () => {
  localStorage.setItem('hp-cookies', 'accepted');
  hideBanner();
};

window.rejectCookies = () => {
  localStorage.setItem('hp-cookies', 'rejected');
  hideBanner();
};

function hideBanner() {
  const b = document.getElementById('cookie-banner');
  b.style.transform = 'translateY(100%)';
  setTimeout(() => b.style.display = 'none', 400);
}

/* ═══════════════════════════════════════
   INIT APP
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  // Lo splash ora non esiste in app.html, quindi non serve più mostrarlo
});
