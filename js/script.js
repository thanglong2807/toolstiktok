// ===== CẤU HÌNH: đổi ngày cưới thật của bạn tại đây =====
const WEDDING_DATE = new Date('2026-08-01T11:00:00');

// ===== PHẦN TỬ DOM =====
const envelope = document.getElementById('envelope');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const blessingFeed = document.getElementById('blessingFeed');
const wishForm = document.getElementById('wishForm');
const wishInput = document.getElementById('wishInput');
const heartBtn = document.getElementById('heartBtn');

const DEFAULT_WISHES = [
  { name: 'Thanh', emoji: '🌸', message: 'Mong rằng tình yêu của hai bạn mãi đẹp như ngày hôm nay!' },
  { name: 'Linh', emoji: '💐', message: 'Chúc hai bạn trăm năm hạnh phúc!' },
  { name: 'Trung', emoji: '🥂', message: 'Tân hôn hạnh phúc, trăm năm bên nhau!' },
  { name: 'Duy', emoji: '💕', message: 'Chúc hai bạn trăm năm hạnh phúc!' },
  { name: 'Lan Anh', emoji: '🌹', message: 'Mong rằng tình yêu của hai bạn mãi đẹp như ngày hôm nay!' },
  { name: 'Ngọc', emoji: '💫', message: 'Chúc cho tình yêu của hai bạn mỗi ngày một lớn mạnh!' },
];

console.log('toolstiktok build:', document.body.dataset.build || 'unknown');

// ===== MỞ PHONG BÌ =====
envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.remove('close');
  envelope.classList.add('open');
  document.body.classList.remove('cover-locked');
  bgMusic.play().then(() => {
    musicToggle.classList.add('playing');
  }).catch(() => {});

  setTimeout(() => startBlessingLoop(), 1000);
  setTimeout(() => startAutoScroll(), 1000);
});

// ===== LỊCH CƯỚI =====
const WEDDING_DAY = WEDDING_DATE.getDate();
const calGrid = document.getElementById('calendarGrid');
if (calGrid) {
  const year = WEDDING_DATE.getFullYear();
  const month = WEDDING_DATE.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement('span');
    empty.className = 'cal-day empty';
    calGrid.appendChild(empty);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('span');
    cell.className = 'cal-day' + (d === WEDDING_DAY ? ' wedding-day' : '');
    cell.textContent = d === WEDDING_DAY ? '♥' : String(d);
    calGrid.appendChild(cell);
  }
}

// ===== NHẠC NỀN =====
musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => musicToggle.classList.add('playing')).catch(() => {});
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
  }
});

// ===== ĐẾM NGƯỢC =====
function updateCountdown() {
  const now = new Date();
  let diff = WEDDING_DATE - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== FADE-IN KHI CUỘN =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ===== LỜI CHÚC BAY LÊN =====
function loadWishes() {
  try {
    const saved = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    return [...DEFAULT_WISHES, ...saved];
  } catch {
    return DEFAULT_WISHES;
  }
}

function saveWish(wish) {
  const saved = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
  saved.push(wish);
  localStorage.setItem('weddingWishes', JSON.stringify(saved.slice(-50)));
}

const MAX_VISIBLE = 6;

function showBlessing(wish) {
  if (!blessingFeed) return;

  const visible = blessingFeed.querySelectorAll('.blessing-msg:not(.removing)');
  if (visible.length >= MAX_VISIBLE) {
    const oldest = visible[0];
    oldest.classList.add('removing');
    oldest.addEventListener('animationend', () => oldest.remove(), { once: true });
  }

  const msg = document.createElement('div');
  msg.className = 'blessing-msg';
  msg.innerHTML = `<strong>${wish.name}:</strong> ${wish.emoji || '💝'} ${wish.message}`;
  blessingFeed.appendChild(msg);
}

let blessingIndex = 0;

function startBlessingLoop() {
  const wishes = loadWishes();
  if (!wishes.length) return;

  function showNext() {
    showBlessing(wishes[blessingIndex % wishes.length]);
    blessingIndex++;
    const delay = 800 + Math.random() * 700;
    setTimeout(showNext, delay);
  }
  showNext();
}

// ===== GỬI LỜI CHÚC TỪ THANH DƯỚI =====
wishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = wishInput.value.trim();
  if (!text) return;

  const emojis = ['💝', '🌸', '💕', '🥂', '💐', '🌹', '💫', '✨', '🎉', '💒'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const wish = { name: 'Bạn', emoji, message: text };

  saveWish(wish);
  showBlessing(wish);
  wishInput.value = '';
  wishInput.blur();
});

// ===== BẮN TIM =====
heartBtn.addEventListener('click', () => {
  const rect = heartBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top;

  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('span');
    heart.className = 'fly-heart';
    heart.textContent = ['❤', '💕', '💗', '💖', '🩷', '🤍'][i % 6];
    heart.style.left = `${cx + (Math.random() - 0.5) * 60}px`;
    heart.style.top = `${cy - Math.random() * 20}px`;
    heart.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
    heart.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2200);
  }
});

// ===== RSVP FORM → GOOGLE SHEETS =====
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzL5NDjWEv56AK53WXuXHnLv0COzLLku91DcgZlNm9kTO_be9f5x1qOIgPqL90Nrxlq/exec';
const rsvpForm = document.getElementById('rsvpForm');
const rsvpThanks = document.getElementById('rsvpThanks');
const rsvpBtn = rsvpForm.querySelector('.btn-submit');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(rsvpForm);
  const data = {
    name: formData.get('name'),
    attending: formData.get('attending'),
    guests: formData.get('guests'),
    message: formData.get('message') || '',
  };

  rsvpBtn.disabled = true;
  rsvpBtn.textContent = 'Đang gửi...';

  if (GOOGLE_SHEET_URL) {
    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(() => {
        rsvpForm.classList.add('hidden');
        rsvpThanks.classList.remove('hidden');
      })
      .catch(() => {
        rsvpBtn.disabled = false;
        rsvpBtn.textContent = 'Gửi Xác Nhận';
        alert('Gửi thất bại, vui lòng thử lại!');
      });
  } else {
    rsvpForm.classList.add('hidden');
    rsvpThanks.classList.remove('hidden');
  }
});

// ===== AUTO-SCROLL SAU KHI MỞ THIỆP =====
function startAutoScroll() {
  let scrollId = null;
  let paused = false;
  let lastTime = 0;
  const pxPerSecond = 120;

  function step(timestamp) {
    if (paused) return;
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    const px = (pxPerSecond * delta) / 1000;
    window.scrollBy(0, px);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 2) return;
    scrollId = requestAnimationFrame(step);
  }

  scrollId = requestAnimationFrame(step);

  function stopScroll() {
    paused = true;
    if (scrollId) {
      cancelAnimationFrame(scrollId);
      scrollId = null;
    }
    window.removeEventListener('touchstart', stopScroll);
    window.removeEventListener('wheel', stopScroll);
    window.removeEventListener('mousedown', stopScroll);
    window.removeEventListener('keydown', stopScroll);
  }

  setTimeout(() => {
    const rsvpSection = document.getElementById('rsvp');
    if (rsvpSection) {
      rsvpSection.addEventListener('focusin', stopScroll, { once: true });
    }
    window.addEventListener('touchstart', stopScroll, { once: true, passive: true });
    window.addEventListener('wheel', stopScroll, { once: true, passive: true });
    window.addEventListener('mousedown', stopScroll, { once: true });
    window.addEventListener('keydown', stopScroll, { once: true });
  }, 500);
}
