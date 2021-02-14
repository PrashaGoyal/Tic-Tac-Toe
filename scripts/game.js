var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var aiPlayer = "X";
var huPlayer = "O";
var endGame = false;

//returns a list of the empty spots on the board
function emptySpots(board) {
  var empty = [];
  for (var i = 0; i < 9; i++) if (board[i] === i) empty.push(i);

  return empty;
}

//checks if the board is in a winning state
function isWinning(board, player) {
  //Horizontal wins
  if (board[0] === player && board[1] === player && board[2] === player)
    return true;
  else if (board[3] === player && board[4] === player && board[5] === player)
    return true;
  else if (board[6] === player && board[7] === player && board[8] === player)
    return true;
  //Vertical wins
  else if (board[0] === player && board[3] === player && board[6] === player)
    return true;
  else if (board[1] === player && board[4] === player && board[7] === player)
    return true;
  else if (board[2] === player && board[5] === player && board[8] === player)
    return true;
  //Diagonal wins
  else if (board[0] === player && board[4] === player && board[8] === player)
    return true;
  else if (board[2] === player && board[4] === player && board[6] === player)
    return true;
  //not in a winning state
  else return false;
}

//the main minimax function
function minimax(board, player) {
  var availSpots = emptySpots(board);

  //checking if the board is in a winning, losing or tie state and returning a value accordingly
  if (isWinning(board, aiPlayer)) return { score: 10 };
  else if (isWinning(board, huPlayer)) return { score: -10 };
  else if (availSpots.length === 0) return { score: 0 };

  //list to store the indices and scores of each available move
  var moves = [];

  //loop through the available spots
  for (var i = 0; i < availSpots.length; i++) {
    //object to store the index and score of each move
    var move = { index: availSpots[i] };

    //set the empty spot as the current player
    board[move.index] = player;

    //call minimax on the opponent and collect the score
    if (player === aiPlayer) move.score = minimax(board, huPlayer).score;
    else if (player === huPlayer) move.score = minimax(board, aiPlayer).score;

    //add the current object to the list
    moves.push(move);

    //revert the spot to empty
    board[move.index] = move.index;
  }

  var bestMove;
  //if player is aiPlayer then choose the move with the highest score
  if (player === aiPlayer) {
    var bestScore = -Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  //if player is huPlayer then choose the move with the lowest score
  else {
    var bestScore = Infinity;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  //return the move object of the best move
  return moves[bestMove];
}

//adding click event listeners to the board spots
for (var i = 0; i < 9; i++) {
  //closure function to use the value of 'i' as 'x' inside the call-back function
  (function (x) {
    document.querySelectorAll("td")[x].addEventListener("click", function () {
      //performs the operations only if the game is on and the spot is empty
      if (endGame === false && board[x] === x) {
        this.classList.add(huPlayer);
        board[x] = huPlayer;

        //checks if the human wins;
        //if yes, end the game, else, call for AI's turn
        if (isWinning(board, huPlayer)) {
          alert("Human wins");
          endGame = true;
        } else aiTurn();
      }
    });
  })(i); //calling the closure function
}

//function to simulate AI's turn
function aiTurn() {
  //available spots for AI's turn
  var availSpots = emptySpots(board);

  //if there's no available spot it means the human did not win in its previous turn and hence it's a tie
  if (availSpots.length === 0) {
    alert("Tie");
    endGame = true;
  }
  //if there is an available spot then AI makes its next move
  else {
    move = minimax(board, aiPlayer);
    document.querySelectorAll("td")[move.index].classList.add(aiPlayer);
    board[move.index] = aiPlayer;
  }

  //check if AI wins and if yes, end the game
  if (isWinning(board, aiPlayer)) {
    alert("Computer wins");
    endGame = true;
  }
}

//AI starts the game
aiTurn();
