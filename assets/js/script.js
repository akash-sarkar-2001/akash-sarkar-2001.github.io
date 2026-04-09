// 1. PRELOADER & 14. TOAST NOTIFICATION
document.addEventListener("DOMContentLoaded", () => {
  const bootLines = document.querySelectorAll('.boot-line');
  const preloader = document.getElementById('preloader');
  const toast = document.getElementById('toast');
  let delay = 0;

  bootLines.forEach((line, index) => {
    setTimeout(() => {
      line.style.display = 'block';
    }, delay);
    delay += 300; // Type interval
  });

  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }, 500);
  }, delay + 500);
});

// 2. MATRIX RAIN CANVAS
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const chars = '0123456789ABCDEF!@#$%^&*()_+'.split('');
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  ctx.fillStyle = isLight ? 'rgba(240, 244, 248, 0.05)' : 'rgba(7, 11, 16, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = isLight ? 'rgba(0, 102, 179, 0.3)' : 'rgba(0, 200, 255, 0.3)';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

// 3. MAGNETIC CURSOR
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorOutline.style.left = e.clientX + 'px';
    cursorOutline.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('.hover-target, a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// 4. TYPING EFFECT
const typeString = "VAPT · DIGITAL FORENSICS · ZERO TRUST";
const typeElem = document.getElementById('typewriter');
let typeIdx = 0;
setTimeout(() => {
  const typeInterval = setInterval(() => {
    if (typeIdx < typeString.length) {
      typeElem.textContent += typeString.charAt(typeIdx);
      typeIdx++;
    } else {
      clearInterval(typeInterval);
    }
  }, 70);
}, 2200); // Wait for preloader

// 5 & 7 & 9. SCROLL REVEAL, ANIMATED COUNTERS, SKILL BARS
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');

      // Trigger skill bars
      if (entry.target.classList.contains('skill-bar-wrapper')) {
        const fill = entry.target.querySelector('.skill-fill');
        fill.style.width = fill.getAttribute('data-width');
      }

      // Trigger counters
      if (entry.target.classList.contains('stats-bar')) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const target = +num.getAttribute('data-target');
          const suffix = num.getAttribute('data-suffix') || '';
          const isDecimal = num.hasAttribute('data-decimal');
          let count = 0;
          const speed = 100;
          const inc = target / speed;
          const updateCount = () => {
            count += inc;
            if (count < target) {
              num.innerText = (isDecimal ? count.toFixed(2) : Math.ceil(count)) + suffix;
              requestAnimationFrame(updateCount);
            } else {
              num.innerText = target + suffix;
            }
          };
          updateCount();
        });
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// 8. INTERACTIVE TERMINAL
const termToggle = document.getElementById('termToggle');
const termClose = document.getElementById('termClose');
const terminalWidget = document.getElementById('terminalWidget');
const termInput = document.getElementById('termInput');
const termOutput = document.getElementById('termOutput');
const termBody = document.getElementById('termBody');

function toggleTerm() {
  terminalWidget.classList.toggle('open');
  if (terminalWidget.classList.contains('open')) termInput.focus();
}
termToggle.addEventListener('click', toggleTerm);
termClose.addEventListener('click', toggleTerm);

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = termInput.value.trim().toLowerCase();
    let res = '';
    termOutput.innerHTML += `<div style="margin-top:5px"><span style="color:var(--text-bright)">$ ${val}</span></div>`;

    switch (val) {
      case 'help': res = "Available commands: whoami, skills, clear, contact"; break;
      case 'whoami': res = "Akash Sarkar: Offense meets Defense. VAPT & Zero Trust."; break;
      case 'skills': res = "Kali, Python, Burp Suite, AD, Digital Forensics."; break;
      case 'contact': res = "Ping me: i.am.akash.sarkar.2001@gmail.com"; break;
      case 'clear': termOutput.innerHTML = ''; res = ''; break;
      case '': break;
      default: res = `bash: ${val}: command not found`;
    }

    if (res) termOutput.innerHTML += `<div>${res}</div>`;
    termInput.value = '';
    termBody.scrollTop = termBody.scrollHeight;
  }
});

// 12. MOBILE HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// SCROLL PROGRESS & BACK TO TOP & THEME TOGGLE
const progressBar = document.getElementById('scrollProgress');
const backToTopBtn = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (progressBar) progressBar.style.width = `${(window.scrollY / scrollTotal) * 100}%`;
  if (window.scrollY > 400) backToTopBtn.classList.add('show');
  else backToTopBtn.classList.remove('show');
});

backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'light') { themeIcon.textContent = '☾'; themeText.textContent = 'DARK'; }
}

themeToggle.addEventListener('click', () => {
  if (document.documentElement.getAttribute('data-theme') === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    themeIcon.textContent = '☀'; themeText.textContent = 'LIGHT';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeIcon.textContent = '☾'; themeText.textContent = 'DARK';
  }
});
