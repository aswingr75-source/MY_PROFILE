/* ===== Aswin GR — Portfolio Script ===== */
document.addEventListener("DOMContentLoaded", () => {

  /* LOADER: typing effect */
  const typedEl = document.getElementById("typed");
  const enterBtn = document.getElementById("enter-btn");
  const loader = document.getElementById("loader");
  const name = "Aswin GR";
  let i = 0;
  const typeTimer = setInterval(() => {
    i++;
    typedEl.textContent = name.slice(0, i);
    if (i >= name.length) { clearInterval(typeTimer); enterBtn.disabled = false; }
  }, 110);
  enterBtn.addEventListener("click", () => {
    loader.classList.add("hide");
    setTimeout(() => (loader.style.display = "none"), 600);
  });

  /* HERO NAME: char-by-char reveal */
  const heroName = document.getElementById("hero-name");
  name.split("").forEach((c, idx) => {
    const span = document.createElement("span");
    span.className = "char neon-text";
    span.textContent = c === " " ? "\u00A0" : c;
    span.style.animationDelay = idx * 0.08 + "s";
    heroName.appendChild(span);
  });

  /* PARTICLES */
  const buildParticles = (container, count) => {
    for (let n = 0; n < count; n++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = 2 + Math.random() * 4;
      p.style.cssText = `
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        width:${size}px; height:${size}px; opacity:.6;
        animation: float-y ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 6}s infinite;`;
      container.appendChild(p);
    }
  };
  buildParticles(document.getElementById("particles"), 28);
  buildParticles(document.getElementById("loader-particles"), 40);

  /* MOBILE MENU */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.textContent = "☰";
    })
  );

  /* SCROLL: progress, active nav, back-to-top */
  const progress = document.getElementById("scroll-progress");
  const backTop = document.getElementById("back-top");
  const navAnchors = document.querySelectorAll(".nav-link");
  const sections = ["home","about","skills","projects","resume","contact"]
    .map(id => document.getElementById(id)).filter(Boolean);
  const onScroll = () => {
    const h = document.documentElement;
    const ratio = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = ratio + "%";
    backTop.classList.toggle("show", h.scrollTop > 400);
    let current = "home";
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 120) current = s.id; });
    navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* REVEAL ON SCROLL + skill bars + counters */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.opacity = "1";
      e.target.style.transform = "translateY(0)";
      const bar = e.target.querySelector("[data-bar]");
      if (bar) bar.style.width = bar.dataset.bar + "%";
      const counter = e.target.querySelector("[data-counter]");
      if (counter) animateCounter(counter);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity .8s ease, transform .8s ease";
    io.observe(el);
  });
  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    let cur = 0;
    const step = Math.max(1, Math.round(target / 40));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur + "%";
    }, 30);
  }

  /* MOUSE GLOW + CURSOR TRAIL */
  const glow = document.getElementById("mouse-glow");
  const trails = [];
  for (let n = 0; n < 8; n++) {
    const d = document.createElement("div");
    d.className = "trail-dot";
    d.style.opacity = 1 - n * 0.12;
    document.body.appendChild(d);
    trails.push(d);
  }
  let mx = -100, my = -100;
  const positions = Array.from({ length: 8 }, () => ({ x: -100, y: -100 }));
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + "px"; glow.style.top = my + "px";
  });
  (function tick() {
    positions.unshift({ x: mx, y: my });
    positions.length = trails.length;
    trails.forEach((t, idx) => {
      t.style.left = positions[idx].x + "px";
      t.style.top = positions[idx].y + "px";
    });
    requestAnimationFrame(tick);
  })();

  /* RIPPLE */
  document.querySelectorAll(".ripple").forEach(el => {
    el.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const span = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      span.className = "ripple-circle";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - rect.left - size / 2) + "px";
      span.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(span);
      setTimeout(() => span.remove(), 700);
    });
  });

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
      }
    });
  });

  /* CHATBOT */
  const chatToggle = document.getElementById("chat-toggle");
  const chatPanel = document.getElementById("chat-panel");
  const chatBody = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  const addBubble = (text, from) => {
    const div = document.createElement("div");
    div.className = "chat-bubble " + (from === "bot" ? "chat-bot" : "chat-user");
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  };
  addBubble("Hi 👋 I'm Aswin's Portfolio Assistant. Ask me about skills, education, projects, interests, resume or contact.", "bot");

  const answer = (q) => {
    const t = q.toLowerCase();
    if (/skill/.test(t)) return "Aswin's core skills: Python (90%), C (80%), HTML (90%), CSS (85%). He's also exploring AI, ML and Full Stack Development.";
    if (/education|college|study|school/.test(t)) return "Aswin is a 2nd Year B.Tech Computer Science Engineering student at Toch Institute of Science and Technology, Ernakulam.";
    if (/project/.test(t)) return "Featured projects: MoneyLens AI (currency recognition & money management) and AI Medical Assistant (symptom guidance, reminders, chatbot). More coming soon!";
    if (/interest|passion|like/.test(t)) return "Aswin is passionate about Artificial Intelligence, Machine Learning, Full Stack Development and Problem Solving.";
    if (/resume|cv/.test(t)) return "You can view or download Aswin's resume from the Resume section above.";
    if (/contact|email|reach|linkedin|github/.test(t)) return "Email: aswingr75@gmail.com · GitHub: github.com/aswingr75-source · LinkedIn: linkedin.com/in/aswin-g-r-52012037b";
    if (/location|where|live/.test(t)) return "Aswin is based in Ernakulam, Kochi, Kerala, India.";
    if (/hi|hello|hey/.test(t)) return "Hello! 👋 Ask me about Aswin's skills, projects, education or how to contact him.";
    return "I can help with: skills, education, projects, interests, resume and contact. Try one of those!";
  };

  const send = () => {
    const q = chatInput.value.trim();
    if (!q) return;
    addBubble(q, "user");
    chatInput.value = "";
    const typing = addBubble("typing…", "bot");
    typing.style.opacity = ".7";
    setTimeout(() => {
      typing.remove();
      const reply = answer(q);
      const bubble = addBubble("", "bot");
      let k = 0;
      const tt = setInterval(() => {
        k++;
        bubble.textContent = reply.slice(0, k);
        chatBody.scrollTop = chatBody.scrollHeight;
        if (k >= reply.length) clearInterval(tt);
      }, 15);
    }, 500);
  };

  chatToggle.addEventListener("click", () => {
    chatPanel.classList.toggle("open");
    chatToggle.textContent = chatPanel.classList.contains("open") ? "✕" : "💬";
  });
  chatSend.addEventListener("click", send);
  chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
});