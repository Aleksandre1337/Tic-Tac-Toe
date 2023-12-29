// Function to reset the game status
function resetGameStatus() {
  // Reset game status variables
  activePlayer = 0;
  currentRound = 1;
  gameIsOver = false;

  // Reset game over message
  gameOverElement.firstElementChild.innerHTML =
    'You won, <span id="winner-name">PLAYER NAME</span>!';
  gameOverElement.style.display = 'none';

  // Reset game board
  let gameBoardIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameData[i][j] = 0;
      const gameBoardItemElement = gameBoardElement.children[gameBoardIndex];
      gameBoardItemElement.textContent = '';
      gameBoardItemElement.classList.remove('disabled');
      gameBoardIndex++;
    }
  }
}

// Function to start a new game
function startNewGame() {
  // Check if player names are set
  if (players[0].name === '' || players[1].name === '') {
    alert('Please set custom player names for both players!');
    return;
  } else if (players[0].name === players[1].name) {
    alert("Both players cannot have the same name.");

    // Reload the page after 3 seconds
    setTimeout(function () {
      location.reload();
    }, 1000);

    throw new Error("Both players cannot have the same name.");
  } else if (players[0].name.length > 20 || players[1].name.length > 20) {
    alert("Player name must be 20 characters or less.");

    // Reload the page after 3 seconds
    setTimeout(function () {
      location.reload();
    }, 1000);

    throw new Error("Player name must be 20 characters or less.");
  }

  resetGameStatus();

  // Set active player name and display game area
  activePlayerNameElement.textContent = players[activePlayer].name;
  gameAreaElement.style.display = 'block';

  // Make the "turn" element visible again
    const turnElement = document.getElementById('turn');
    if (turnElement) {
      turnElement.style.display = 'block';
    }
}

// Function to switch the active player
function switchPlayer() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  activePlayerNameElement.textContent = players[activePlayer].name;
}

// Function to handle the selection of a game field
function selectGameField(event) {
  if (event.target.tagName !== 'LI' || gameIsOver) {
    return;
  }

  const selectedField = event.target;
  const selectedColumn = selectedField.dataset.col - 1;
  const selectedRow = selectedField.dataset.row - 1;

  if (gameData[selectedRow][selectedColumn] > 0) {
    alert('Please select an empty field!');
    return;
  }

  selectedField.textContent = players[activePlayer].symbol;
  selectedField.classList.add('disabled');

  gameData[selectedRow][selectedColumn] = activePlayer + 1;

  const winnerId = checkForGameOver();

  if (winnerId !== 0) {
    endGame(winnerId);
  }

  currentRound++;
  switchPlayer();
}

// Function to check if the game is over
function checkForGameOver() {
  // Checking the rows for equality
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }

  // Checking the columns for equality
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[0][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  // Diagonal: Top left to bottom right
  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }

  // Diagonal: Bottom left to top right
  if (
    gameData[2][0] > 0 &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }

  if (currentRound === 9) {
    return -1; // Return -1 for a draw
  }

  return 0;
}

// Function to end the game
function endGame(winnerId) {
  gameIsOver = true;
  gameOverElement.style.display = 'block';

    // Hide the "turn" element
    const turnElement = document.getElementById('turn');
    if (turnElement) {
      turnElement.style.display = 'none';
    }

  if (winnerId > 0) {
    const winnerName = players[winnerId - 1].name;
    gameOverElement.firstElementChild.firstElementChild.textContent =
      winnerName;
  } else {
    gameOverElement.firstElementChild.textContent = "It's a draw!";
  }
}

