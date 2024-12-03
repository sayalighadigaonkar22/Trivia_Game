// document.getElementById('start-form').addEventListener('submit', async function (event) {
//   event.preventDefault();

//   const playerOneName = document.getElementById('playerOneName').value.trim();
//   const playerTwoName = document.getElementById('playerTwoName').value.trim();
//   const category = document.getElementById('category').value;

//   if (!playerOneName || !playerTwoName) {
//       alert("Please enter names for both players.");
//       return;
//   }

//   try {
//       const response = await fetch('http://localhost:5000/api/games/startNew', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//               playerOneName,
//               playerTwoName,
//               category,
//           }),
//       });

//       if (!response.ok) {
//           throw new Error('Failed to start the game. Status: ' + response.status);
//       }

//       const data = await response.json(); 
//       const { _id: gameId, questions } = data;

//       localStorage.setItem('gameData', JSON.stringify({ gameId, playerOneName, playerTwoName, questions }));

//       window.location.href = 'play.html'; 
//   } catch (error) {
//       console.error('Error starting the game:', error);
//       alert('Failed to start the game. Please try again.');
//   }
// });

const API_BASE = "http://localhost:5000/api";

const startForm = document.getElementById("start-form");
const playerOneNameInput = document.getElementById("playerOneName");
const playerTwoNameInput = document.getElementById("playerTwoName");
const categorySelect = document.getElementById("category");

startForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    const playerOneName = playerOneNameInput.value.trim();
    const playerTwoName = playerTwoNameInput.value.trim();
    const selectedCategory = categorySelect.value;

    try {

        const response = await fetch(`${API_BASE}/games/startNew`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playerOneName,
                playerTwoName,
                category: selectedCategory,
            }),
        });

        const gameData = await response.json();

        document.getElementById("game-status").innerText = "Status: Ongoing";

        localStorage.setItem("gameId", gameData._id);
        localStorage.setItem("playerOneName", playerOneName);
        localStorage.setItem("playerTwoName", playerTwoName);
        localStorage.setItem("category", selectedCategory);

        window.location.href = "play.html";
    } 
    catch (error) {
        console.error("Failed to start the game:", error);
        alert("Something went wrong! Please try again.");
    }
});