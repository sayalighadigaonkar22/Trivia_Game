// document.addEventListener('DOMContentLoaded', async function () {
//     const gameData = JSON.parse(localStorage.getItem('gameData'));
//     if (!gameData) {
//         alert('No game data found. Start a new game!');
//         window.location.href = 'index.html';
//         return;
//     }

//     const { gameId } = gameData;
//     const winnerText = document.getElementById('winnerText');
//     const playAgainButton = document.getElementById('playAgainButton');

//     async function fetchResults() {
//         try {
//             const response = await fetch(`http://localhost:5000/api/games/${gameId}/end`, {
//                 method: 'POST',
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch results.');
//             }
//             const data = await response.json();
//             winnerText.textContent = data.results.result;
//         } catch (error) {
//             console.error('Error fetching results:', error);
//             winnerText.textContent = 'Error fetching results. Please try again.';
//         }
//     }

//     playAgainButton.addEventListener('click', () => {
//         localStorage.clear();
//         window.location.href = 'index.html';
//     });

//     await fetchResults();
// });

// const API_BASE = "http://localhost:5000/api";
// const resultsContainer = document.getElementById("results-container");
// const restartGameButton = document.getElementById("restart-game");

// let currentGameId = localStorage.getItem("gameId");

// // Fetch Results
// async function fetchResults() {
//   try {
//     const response = await fetch(`${API_BASE}/games/${currentGameId}/end`, { method: "POST" });
//     const data = await response.json();

//     console.log("Results from backend:", data);

//     if (data.results) {
//       resultsContainer.innerHTML = `
//         <h2>Game Over: ${data.results.result}</h2>
//         <ul>
//           ${data.results.players
//             .map((player) => `<li>${player.name}: ${player.score} points</li>`)
//             .join("")}
//         </ul>
//       `;
//     } else {
//       resultsContainer.innerHTML = `<p>Unable to fetch results. Try again later.</p>`;
//     }
//   } catch (error) {
//     console.error("Error fetching results:", error);
//     resultsContainer.innerHTML = `<p>Error fetching results. Please try again later.</p>`;
//   }
// }

// // Restart Game
// restartGameButton.addEventListener("click", () => {
//   localStorage.clear();
//   window.location.href = "index.html"; // Redirect to the home page to restart the game
// });

// // Initialize Results
// fetchResults();


const API_BASE = "http://localhost:5000/api";

const resultsContainer = document.getElementById("results-container");
const restartGameButton = document.getElementById("restart-game");

let currentGameId = localStorage.getItem("gameId");

async function fetchResults() {
  try {
    // Fetch results from the backend
    const response = await fetch(`${API_BASE}/games/${currentGameId}/end`, { method: "POST" });

    if (!response.ok) {
      throw new Error(`Failed to fetch results: ${response.statusText}`);
    }

    const data = await response.json();

    // Log backend response for debugging
    console.log("Backend Response:", data);

    // Handle the case where players exist and scores are updated
    if (data.results && data.results.players) {
      resultsContainer.innerHTML = `
        <h2>Game Over: ${data.results.result}</h2>
        <ul>
          ${data.results.players
            .map(player => `<li>${player.name}: ${player.score} points</li>`)
            .join("")}
        </ul>
      `;
    } else {
      resultsContainer.innerHTML = `<p>No players or scores found for this game.</p>`;
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    resultsContainer.innerHTML = `<p>Error loading results. Please try again later.</p>`;
  }
}

// Restart Game
restartGameButton.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// Initialize Results
fetchResults();