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
    question: "Which sports city is part of Derrick's fan identity?",
    answers: ["Boston", "Miami", "Seattle"],
    correct: "Boston"
  },
  {
    question: "Which company director profile was used as the site reference?",
    answers: ["Asia Allied Infrastructure", "Fenway Park", "MassDOT"],
    correct: "Asia Allied Infrastructure"
  },
  {
    question: "What public appointment title appears in Derrick's official profile?",
    answers: ["Justice of the Peace", "Mayor", "Senator"],
    correct: "Justice of the Peace"
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

const badges = ["B", "Sox", "C", "B", "Pats", "Sox", "Bruins", "C", "Pats", "Bruins", "MIT", "MIT"];
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
