/* ============================================================
   PATHFINDER — quiz.js
   Interactive career quiz with results logic
   ============================================================ */

/* ── Questions ── */
const QUESTIONS = [
  {
    text: "What subject do you enjoy most?",
    options: [
      { emoji: "💻", label: "Technology & Computers",  tags: ["tech", "analytical"] },
      { emoji: "🎨", label: "Art, Design & Creativity", tags: ["creative", "people"] },
      { emoji: "🔬", label: "Science & Research",       tags: ["analytical", "research"] },
      { emoji: "📢", label: "Communication & Media",    tags: ["people", "creative"] },
      { emoji: "💰", label: "Business & Economics",     tags: ["business", "analytical"] },
    ],
  },
  {
    text: "How do you prefer to work?",
    options: [
      { emoji: "🧍", label: "Independently — I love deep focus",       tags: ["analytical", "research"] },
      { emoji: "👥", label: "In a team — collaboration energises me",   tags: ["people", "creative"] },
      { emoji: "🔀", label: "A mix of both",                            tags: ["tech", "business"] },
      { emoji: "👨‍💼", label: "Leading and organising others",            tags: ["business", "people"] },
    ],
  },
  {
    text: "Which of these sounds most exciting to you?",
    options: [
      { emoji: "🏗️", label: "Building something from scratch",          tags: ["tech", "creative"] },
      { emoji: "🧩", label: "Solving a tricky problem",                  tags: ["analytical", "research"] },
      { emoji: "🌍", label: "Making a difference in people's lives",     tags: ["people", "research"] },
      { emoji: "💡", label: "Coming up with a brand new idea",           tags: ["creative", "business"] },
      { emoji: "📊", label: "Analysing data to find hidden patterns",    tags: ["analytical", "tech"] },
    ],
  },
  {
    text: "What kind of environment suits you best?",
    options: [
      { emoji: "🏢", label: "A structured office or corporate setting", tags: ["business", "analytical"] },
      { emoji: "🏡", label: "Remote — freedom to work anywhere",        tags: ["tech", "creative"] },
      { emoji: "🏥", label: "Out in the field or on-site",              tags: ["people", "research"] },
      { emoji: "🎭", label: "A studio or creative space",               tags: ["creative", "people"] },
    ],
  },
  {
    text: "What matters most to you in a career?",
    options: [
      { emoji: "💸", label: "High earning potential",                   tags: ["business", "tech"] },
      { emoji: "❤️", label: "Helping and supporting others",            tags: ["people", "research"] },
      { emoji: "🚀", label: "Innovation and pushing boundaries",        tags: ["tech", "creative"] },
      { emoji: "🔒", label: "Stability and job security",               tags: ["analytical", "business"] },
      { emoji: "🌱", label: "Growth and constant learning",             tags: ["research", "analytical"] },
    ],
  },
];

/* ── Career results by dominant tag combo ── */
const CAREERS = {
  tech: {
    title: "Software Engineer",
    emoji: "💻",
    desc: "You love building things with technology and solving complex problems. Software engineering lets you create digital products used by millions — and the demand for skilled developers keeps growing.",
    uni: { name: "TU Wien", field: "Computer Science · Vienna" },
    job: { name: "Junior Developer", company: "Tech Startup / Corporate" },
    skills: ["Python", "Problem Solving", "Algorithms", "Teamwork"],
  },
  creative: {
    title: "UX / Product Designer",
    emoji: "🎨",
    desc: "You think visually, feel empathy for users, and love bringing ideas to life. UX Design sits right at the intersection of creativity and technology — shaping how people experience digital products.",
    uni: { name: "University of Applied Arts Vienna", field: "Design & Media · Vienna" },
    job: { name: "UX Designer", company: "Design Agency / Product Company" },
    skills: ["Figma", "User Research", "Visual Thinking", "Communication"],
  },
  people: {
    title: "HR & People Manager",
    emoji: "🤝",
    desc: "You are energised by people, conversations, and making teams work well together. A career in HR, management, or social work lets you have a real impact on the people around you every day.",
    uni: { name: "WU Vienna", field: "Business & Management · Vienna" },
    job: { name: "People Operations Analyst", company: "Medium to Large Company" },
    skills: ["Communication", "Empathy", "Conflict Resolution", "Organisation"],
  },
  analytical: {
    title: "Data Analyst",
    emoji: "📊",
    desc: "You enjoy digging into numbers, spotting patterns, and turning raw data into insights that help organisations make better decisions. Data Analysts are in huge demand across every industry.",
    uni: { name: "Vienna University of Economics", field: "Business Analytics · Vienna" },
    job: { name: "Junior Data Analyst", company: "Finance / Consulting / Tech" },
    skills: ["Excel / SQL", "Statistics", "Python", "Critical Thinking"],
  },
  research: {
    title: "Research Scientist",
    emoji: "🔬",
    desc: "You are curious, methodical, and love understanding how things work at a deep level. A research career lets you push the boundaries of knowledge in medicine, science, technology, or social fields.",
    uni: { name: "University of Vienna", field: "Natural Sciences · Vienna" },
    job: { name: "Research Associate", company: "University / Institute / Lab" },
    skills: ["Scientific Method", "Writing", "Statistics", "Attention to Detail"],
  },
  business: {
    title: "Entrepreneur / Business Analyst",
    emoji: "🚀",
    desc: "You think big, love strategy, and want to build something meaningful. Whether launching your own venture or shaping decisions inside a company, a business-focused path lets you lead and grow.",
    uni: { name: "WU Vienna", field: "Business Administration · Vienna" },
    job: { name: "Business Analyst", company: "Consulting / Startup / Corporate" },
    skills: ["Strategy", "Communication", "Excel", "Leadership"],
  },
};

/* ── State ── */
let currentStep = 0;
let answers     = [];     // array of picked option indices per question
let tagScores   = {};     // accumulates tag scores

/* ── Init ── */
document.addEventListener("DOMContentLoaded", renderQuestion);

/* ── Render current question ── */
function renderQuestion() {
  const card = document.getElementById("quizCard");
  const q    = QUESTIONS[currentStep];
  const pct  = Math.round((currentStep / QUESTIONS.length) * 100);

  card.innerHTML = `
    <div class="quiz-topbar">
      <span class="quiz-step-label">Question ${currentStep + 1} of ${QUESTIONS.length}</span>
      <button class="quiz-close-btn" onclick="window.location='index.html'" title="Exit quiz">✕</button>
    </div>

    <div class="quiz-progress-track">
      <div class="quiz-progress-fill" id="progressFill" style="width:${pct}%"></div>
    </div>

    <div class="quiz-question">${q.text}</div>

    <div class="quiz-options" id="optionsContainer">
      ${q.options.map((opt, i) => `
        <div
          class="quiz-option ${answers[currentStep] === i ? "picked" : ""}"
          onclick="pickOption(${i})"
        >
          <span class="opt-emoji">${opt.emoji}</span>
          ${opt.label}
        </div>
      `).join("")}
    </div>

    <div class="quiz-nav">
      <button class="btn-back" onclick="goBack()" ${currentStep === 0 ? "disabled style='opacity:0;pointer-events:none'" : ""}>
        ← Back
      </button>
      <button class="btn-next" id="nextBtn" onclick="goNext()" ${answers[currentStep] === undefined ? "disabled" : ""}>
        ${currentStep === QUESTIONS.length - 1 ? "See My Results ✦" : "Next →"}
      </button>
    </div>
  `;
}

/* ── Pick an option ── */
function pickOption(index) {
  answers[currentStep] = index;

  // Update visual
  document.querySelectorAll(".quiz-option").forEach((el, i) => {
    el.classList.toggle("picked", i === index);
  });

  // Enable Next button
  document.getElementById("nextBtn").disabled = false;
}

/* ── Navigate forward ── */
function goNext() {
  if (answers[currentStep] === undefined) return;

  if (currentStep === QUESTIONS.length - 1) {
    renderResult();
  } else {
    currentStep++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ── Navigate back ── */
function goBack() {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
  }
}

/* ── Calculate result ── */
function calcResult() {
  const scores = {};

  answers.forEach((answerIndex, qIndex) => {
    const tags = QUESTIONS[qIndex].options[answerIndex].tags;
    tags.forEach(tag => {
      scores[tag] = (scores[tag] || 0) + 1;
    });
  });

  // Find top tag
  const topTag = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0][0];

  return CAREERS[topTag] || CAREERS.tech;
}

/* ── Render result ── */
function renderResult() {
  const card   = document.getElementById("quizCard");
  const career = calcResult();

  card.innerHTML = `
    <div class="quiz-result">
      <div class="result-emoji">${career.emoji}</div>
      <div class="result-heading">Your best career match is…</div>
      <div class="result-career-badge">${career.title}</div>
      <p class="result-desc">${career.desc}</p>

      <div class="result-cards">
        <div class="result-mini-card">
          <div class="rmc-label">🏛️ Top University</div>
          <div class="rmc-name">${career.uni.name}</div>
          <div class="rmc-sub">${career.uni.field}</div>
        </div>
        <div class="result-mini-card">
          <div class="rmc-label">💼 Entry-Level Job</div>
          <div class="rmc-name">${career.job.name}</div>
          <div class="rmc-sub">${career.job.company}</div>
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Key skills to develop</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
          ${career.skills.map(s => `<span style="background:var(--off-white);border:1px solid var(--border);border-radius:50px;padding:5px 14px;font-size:0.8rem;font-weight:600;color:var(--text-soft);">${s}</span>`).join("")}
        </div>
      </div>

      <div class="result-actions">
        <button class="btn-back" onclick="restartQuiz()">← Retake Quiz</button>
        <a href="features.html" class="btn btn-navy">Explore Pathfinder</a>
        <a href="contact.html" class="btn btn-gold">Get Early Access ✦</a>
      </div>
    </div>
  `;
}

/* ── Restart ── */
function restartQuiz() {
  currentStep = 0;
  answers     = [];
  renderQuestion();
}
