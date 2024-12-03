const API_BASE = "http://localhost:5000/api";

const playerNamesContainer = document.getElementById("playerNames");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextButton = document.getElementById("nextButton");

let currentGameId = localStorage.getItem("gameId"); 
let currentPlayerOne = localStorage.getItem("playerOneName"); 
let currentPlayerTwo = localStorage.getItem("playerTwoName"); 
let currentQuestionIndex = 0;
let questions = [];

async function fetchQuestions() {
  try {
    const response = await fetch(`${API_BASE}/questions/${currentGameId}/questions`);
    const data = await response.json();

    if (data && data.questions) {
      questions = data.questions;
      displayPlayerNames();
      displayQuestion();
    } else {
      console.error("No questions found.");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function displayPlayerNames() {
  playerNamesContainer.innerHTML = `
    <p>Player 1: ${currentPlayerOne}</p>
    <p>Player 2: ${currentPlayerTwo}</p>
  `;
}

function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    window.location.href = "result.html"; 
    return;
  }

  const question = questions[currentQuestionIndex];
  questionText.textContent = question.text;

  optionsContainer.innerHTML = question.options
    .map(
      (option, index) =>
        `<button class="option-button" onclick="submitAnswer(${index})">${option}</button>`
    )
    .join("");
}

async function submitAnswer(selectedOption) {
  const question = questions[currentQuestionIndex];
  const correctOption = question.correctOption;
  const isCorrect = selectedOption === correctOption;

  // Determine the difficulty level based on the current question
  let currentDifficulty = 'easy'; // You can adjust difficulty logic based on the number of questions answered
  if (currentQuestionIndex > 5) currentDifficulty = 'medium';
  if (currentQuestionIndex > 10) currentDifficulty = 'hard';

  try {
    const response = await fetch(`${API_BASE}/questions/${currentGameId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question._id,
        playerId: currentPlayerOne, // or currentPlayerTwo depending on whose turn it is
        submittedAnswer: selectedOption,
        difficulty: currentDifficulty, // Include the difficulty level
      }),
    });

    const data = await response.json();
    console.log("Answer submitted:", data);

    if (data && data.player && data.player.score) {
      updateScoreDisplay(data.player.score); // Update the displayed score
    }

    const feedbackElement = document.createElement("p");
    feedbackElement.classList.add("feedback");
    feedbackElement.textContent = isCorrect ? "Correct!" : `Wrong! Correct Answer: ${question.options[correctOption]}`;
    optionsContainer.appendChild(feedbackElement);

  } catch (error) {
    console.error("Error submitting answer:", error);
  }
}

function updateScoreDisplay(newScore) {
  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) {
    scoreDisplay.textContent = `Score: ${newScore}`; // Update the score
  }
}

function loadNextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

nextButton.addEventListener("click", loadNextQuestion);

fetchQuestions();