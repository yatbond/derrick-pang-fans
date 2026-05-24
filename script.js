const canvas = document.querySelector("#motionCanvas");
const ctx = canvas.getContext("2d");
const cursorDot = document.querySelector("#cursorDot");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
let ribbons = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ribbons = Array.from({ length: width < 720 ? 18 : 34 }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    length: 70 + Math.random() * 180,
    speed: 0.35 + Math.random() * 1.1,
    angle: Math.random() * Math.PI * 2,
    size: 1 + Math.random() * 4,
    hue: index % 3
  }));
}

function drawMotion() {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "screen";

  ribbons.forEach((ribbon, index) => {
    ribbon.x += Math.cos(ribbon.angle) * ribbon.speed + (pointer.x - width / 2) * 0.0007;
    ribbon.y += Math.sin(ribbon.angle) * ribbon.speed + (pointer.y - height / 2) * 0.0007;
    ribbon.angle += Math.sin(Date.now() * 0.0007 + index) * 0.004;

    if (ribbon.x < -ribbon.length) ribbon.x = width + ribbon.length;
    if (ribbon.x > width + ribbon.length) ribbon.x = -ribbon.length;
    if (ribbon.y < -ribbon.length) ribbon.y = height + ribbon.length;
    if (ribbon.y > height + ribbon.length) ribbon.y = -ribbon.length;

    const colors = [
      "rgba(255, 240, 216, 0.72)",
      "rgba(31, 92, 255, 0.62)",
      "rgba(0, 194, 122, 0.58)"
    ];

    ctx.save();
    ctx.translate(ribbon.x, ribbon.y);
    ctx.rotate(ribbon.angle);
    ctx.strokeStyle = colors[ribbon.hue];
    ctx.lineWidth = ribbon.size;
    ctx.beginPath();
    ctx.moveTo(-ribbon.length / 2, 0);
    ctx.lineTo(ribbon.length / 2, 0);
    ctx.stroke();
    ctx.restore();
  });

  ctx.globalCompositeOperation = "source-over";
  if (!prefersReducedMotion) requestAnimationFrame(drawMotion);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
});

resizeCanvas();
if (!prefersReducedMotion) drawMotion();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.16 });

document.querySelectorAll(".section-panel, .motion-card, .research-grid article").forEach((element) => {
  observer.observe(element);
});

const batting = {
  timer: null,
  seconds: 20,
  hits: 0,
  active: false
};

const ball = document.querySelector("#ball");
const field = document.querySelector("#field");
const hits = document.querySelector("#hits");
const timeLeft = document.querySelector("#timeLeft");
const startBatting = document.querySelector("#startBatting");

function moveBall() {
  const maxX = field.clientWidth - ball.clientWidth - 8;
  const maxY = field.clientHeight - ball.clientHeight - 8;
  ball.style.left = `${Math.max(8, Math.random() * maxX)}px`;
  ball.style.top = `${Math.max(8, Math.random() * maxY)}px`;
}

function startBattingGame() {
  clearInterval(batting.timer);
  batting.seconds = 20;
  batting.hits = 0;
  batting.active = true;
  hits.textContent = batting.hits;
  timeLeft.textContent = batting.seconds;
  moveBall();
  batting.timer = setInterval(() => {
    batting.seconds -= 1;
    timeLeft.textContent = batting.seconds;
    if (batting.seconds <= 0) {
      batting.active = false;
      clearInterval(batting.timer);
    }
  }, 1000);
}

ball.addEventListener("click", () => {
  if (!batting.active) return;
  batting.hits += 1;
  hits.textContent = batting.hits;
  moveBall();
});

startBatting.addEventListener("click", startBattingGame);

const quiz = [
  {
    question: "Which university awarded Derrick his MEng?",
    answers: ["MIT", "Harvard", "Stanford"],
    correct: "MIT"
  },
  {
    question: "Which university awarded Derrick his PhD?",
    answers: ["HKUST", "Oxford", "UCLA"],
    correct: "HKUST"
  },
  {
    question: "When did Derrick become CEO of AAI?",
    answers: ["April 2017", "June 2012", "March 2024"],
    correct: "April 2017"
  },
  {
    question: "Which public appointment did he receive in June 2017?",
    answers: ["Justice of the Peace", "Financial Secretary", "Mayor of Boston"],
    correct: "Justice of the Peace"
  },
  {
    question: "Which company appointed him board chairman in 2024?",
    answers: ["Modern Living Investments", "Fenway Sports Group", "Massachusetts DOT"],
    correct: "Modern Living Investments"
  }
];

let quizIndex = 0;
let quizPoints = 0;
const question = document.querySelector("#question");
const answers = document.querySelector("#answers");
const quizScore = document.querySelector("#quizScore");
const nextQuestion = document.querySelector("#nextQuestion");

function renderQuiz() {
  const item = quiz[quizIndex];
  question.textContent = item.question;
  answers.innerHTML = "";
  item.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => {
      const correct = answer === item.correct;
      button.classList.add(correct ? "correct" : "wrong");
      if (correct) {
        quizPoints += 1;
        quizScore.textContent = quizPoints;
      }
      answers.querySelectorAll("button").forEach((node) => {
        node.disabled = true;
        if (node.textContent === item.correct) node.classList.add("correct");
      });
    });
    answers.append(button);
  });
}

nextQuestion.addEventListener("click", () => {
  quizIndex = (quizIndex + 1) % quiz.length;
  renderQuiz();
});

renderQuiz();

const badges = ["B", "Sox", "MIT", "B", "JP", "Sox", "HKUST", "MIT", "JP", "HKUST", "AAI", "AAI"];
const memoryGrid = document.querySelector("#memoryGrid");
const moves = document.querySelector("#moves");
const newMemory = document.querySelector("#newMemory");
let openCards = [];
let moveCount = 0;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderMemory() {
  memoryGrid.innerHTML = "";
  openCards = [];
  moveCount = 0;
  moves.textContent = moveCount;
  shuffle(badges).forEach((badge) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.badge = badge;
    card.textContent = "?";
    card.addEventListener("click", () => flipCard(card));
    memoryGrid.append(card);
  });
}

function flipCard(card) {
  if (card.classList.contains("open") || card.classList.contains("matched") || openCards.length === 2) return;
  card.classList.add("open");
  card.textContent = card.dataset.badge;
  openCards.push(card);
  if (openCards.length === 2) {
    moveCount += 1;
    moves.textContent = moveCount;
    const [a, b] = openCards;
    if (a.dataset.badge === b.dataset.badge) {
      a.classList.add("matched");
      b.classList.add("matched");
      openCards = [];
    } else {
      setTimeout(() => {
        a.classList.remove("open");
        b.classList.remove("open");
        a.textContent = "?";
        b.textContent = "?";
        openCards = [];
      }, 650);
    }
  }
}

newMemory.addEventListener("click", renderMemory);
renderMemory();

document.querySelector("#resetAll").addEventListener("click", () => {
  clearInterval(batting.timer);
  batting.active = false;
  batting.seconds = 20;
  batting.hits = 0;
  hits.textContent = "0";
  timeLeft.textContent = "20";
  quizPoints = 0;
  quizIndex = 0;
  quizScore.textContent = "0";
  renderQuiz();
  renderMemory();
});
