// DOM Elements
const quizContainer = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result");
const scoreEl = document.getElementById("score");
const correctionsEl = document.getElementById("corrections");
const restartBtn = document.getElementById("restart-btn");

// App State
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

/**
 * Fetches questions from the API and initializes the quiz
 */
async function fetchQuestions() {
  const res = await fetch("https://the-trivia-api.com/v2/questions?limit=10");
  const data = await res.json();

  // Format and shuffle options for each question
  questions = data.map((q) => ({
    question: q.question.text,
    correctAnswer: q.correctAnswer,
    options: shuffle([...q.incorrectAnswers, q.correctAnswer]),
  }));

  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];

  // Show the first question
  showQuestion();

  // Show quiz and hide result container
  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
}

/**
 * Displays the current question and its options
 */
function showQuestion() {
  resetState();

  const current = questions[currentQuestionIndex];
  questionEl.textContent = `${currentQuestionIndex + 1}. ${current.question}`;

  // Create buttons for each option
  current.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option");
    btn.onclick = () => selectOption(btn, option);
    optionsEl.appendChild(btn);
  });
}

/**
 * Clears the option area and hides the next button
 */
function resetState() {
  nextBtn.classList.add("hidden");
  optionsEl.innerHTML = "";
}

/**
 * Handles user selecting an option
 */
function selectOption(button, selectedAnswer) {
  const correct = questions[currentQuestionIndex].correctAnswer;
  const optionButtons = document.querySelectorAll(".option");

  // Disable all options and highlight correct/incorrect answers
  optionButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.style.backgroundColor = "#86efac"; // Green for correct
    } else if (btn.textContent === selectedAnswer) {
      btn.style.backgroundColor = "#fca5a5"; // Red for incorrect
    }
  });

  // Update score if answer is correct
  if (selectedAnswer === correct) score++;

  // Save the user's answer for later correction display
  userAnswers.push({
    question: questions[currentQuestionIndex].question,
    selectedAnswer,
    correctAnswer: correct,
  });

  nextBtn.classList.remove("hidden");
}

// Handle "Next" button click
nextBtn.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

/**
 * Displays final score and corrections
 */
function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  // Display the final score in English
  scoreEl.textContent = `You answered ${score} correctly and ${
    questions.length - score
  } incorrectly.`;

  // Show a list of questions answered incorrectly
  correctionsEl.innerHTML = "";
  userAnswers.forEach((ans) => {
    if (ans.selectedAnswer !== ans.correctAnswer) {
      const li = document.createElement("li");
      li.textContent = `Question: ${ans.question} | Your Answer: ${ans.selectedAnswer} | Correct Answer: ${ans.correctAnswer}`;
      correctionsEl.appendChild(li);
    }
  });
}

// Restart button to fetch new questions
restartBtn.onclick = fetchQuestions;

/**
 * Shuffles array elements randomly
 */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Start quiz on initial load
fetchQuestions();
