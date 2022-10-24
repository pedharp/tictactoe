const playAgainContainer = document.querySelector(".play-again-container");
const resultDiv = document.querySelector(".results-message");
const resetBtn = document.querySelector(".restart");
const h3 = document.querySelector("h3");

// Used to get random tiles for the PC
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const Player = (name) => {
  name = name;
  let mark;
  function putMark(tile) {
    tile.textContent = this.mark;
  }
  // It filters blank tiles so that the computer won't pick an already used tile
  function placeComputerMark() {
    gameBoard.emptyTiles.row1 = gameBoard.tiles[0].filter(
      (t) => t.textContent === ""
    );
    gameBoard.emptyTiles.row2 = gameBoard.tiles[1].filter(
      (t) => t.textContent === ""
    );
    gameBoard.emptyTiles.row3 = gameBoard.tiles[2].filter(
      (t) => t.textContent === ""
    );

    // emptyline object will have its properties removed to avoid conflicts
    for (let r in gameBoard.emptyTiles) {
      if (gameBoard.emptyTiles[r].length === 0) {
        delete gameBoard.emptyTiles[r];
      }
    }

    let keys = Object.keys(gameBoard.emptyTiles);
    let vals = Object.values(gameBoard.emptyTiles);

    let rand = vals.sample();

    if (keys.length >= 1) {
      rand.sample().textContent = this.mark;
    }
  }
  return { name, mark, putMark, placeComputerMark };
};

const gameBoard = (() => {
  const boardContainer = document.querySelector(".game-board");
  const tiles = [[], [], []];
  const emptyTiles = {};

  for (let x = 0; x < 9; x++) {
    let tile = document.createElement("div");
    tile.setAttribute("num", `${x}`);
    tile.classList.add("tile");
    boardContainer.appendChild(tile);
    if (tiles[0].length < 3) {
      tiles[0].push(tile);
    } else if (tiles[1].length < 3) {
      tiles[1].push(tile);
    } else {
      tiles[2].push(tile);
    }
  }
  const tile = document.querySelectorAll(".tile");

  return { tile, tiles, emptyTiles };
})();

const displayController = (() => {
  const player = Player("player");
  const computer = Player("pc");
  const yesBtn = document.querySelector(".yes");
  const noBtn = document.querySelector(".no");

  const disableBtns = () => {
    xBtn.disabled = true;
    oBtn.disabled = true;
  };

  const disableBoard = () => {
    gameBoard.tile.forEach((t) => (t.style.pointerEvents = "none"));
  };

  const enableBoard = () => {
    gameBoard.tile.forEach((t) => (t.style.pointerEvents = "auto"));
  };

  const xBtn = document.querySelector(".x-button");
  const oBtn = document.querySelector(".o-button");
  xBtn.setAttribute("player", "");
  oBtn.setAttribute("player", "");

  gameBoard.tile.forEach((t) => (t.textContent = ""));
  resetBtn.addEventListener("click", () =>
    gameBoard.tile.forEach((t) => (t.textContent = ""))
  );

  yesBtn.addEventListener("click", () => {
    playAgainContainer.style.visibility = "hidden";
    gameBoard.tile.forEach((t) => (t.textContent = ""));
    enableBoard();
  });

  noBtn.addEventListener("click", () => location.reload(true));

  xBtn.addEventListener("click", () => {
    xBtn.setAttribute("player", "X");
    oBtn.setAttribute("player", "");
    xBtn.style.backgroundColor = "#9a5";
    xBtn.style.color = "#fff";
    h3.style.visibility = "hidden";
    player.mark = "X";
    computer.mark = "O";

    disableBtns();
  });

  oBtn.addEventListener("click", () => {
    oBtn.setAttribute("player", "O");
    xBtn.setAttribute("player", "");
    oBtn.style.backgroundColor = "#9a5";
    oBtn.style.color = "#fff";
    h3.style.visibility = "hidden";
    player.mark = "O";
    computer.mark = "X";

    disableBtns();
  });
  return { xBtn, oBtn, player, computer, disableBoard, enableBoard };
})();

const gameFlow = (() => {
  let victory = "You win!";
  let defeat = "You lose!";
  let draw = "Draw!";

  const winConditions = {
    horizontal: [
      [gameBoard.tiles[0][0], gameBoard.tiles[0][1], gameBoard.tiles[0][2]],
      [gameBoard.tiles[1][0], gameBoard.tiles[1][1], gameBoard.tiles[1][2]],
      [gameBoard.tiles[2][0], gameBoard.tiles[2][1], gameBoard.tiles[2][2]],
    ],
    vertical: [
      [gameBoard.tiles[0][0], gameBoard.tiles[1][0], gameBoard.tiles[2][0]],
      [gameBoard.tiles[0][1], gameBoard.tiles[1][1], gameBoard.tiles[2][1]],
      [gameBoard.tiles[0][2], gameBoard.tiles[1][2], gameBoard.tiles[2][2]],
    ],
    diagonal: [
      [gameBoard.tiles[0][0], gameBoard.tiles[1][1], gameBoard.tiles[2][2]],
      [gameBoard.tiles[0][2], gameBoard.tiles[1][1], gameBoard.tiles[2][0]],
    ],
    // loops through each win condition
    win: function (whoseMark) {
      for (let t of winConditions.horizontal) {
        if (t.every((e) => e.textContent === whoseMark.mark)) {
          return true;
        }
      }
      for (let t of winConditions.vertical) {
        if (t.every((e) => e.textContent === whoseMark.mark)) {
          return true;
        }
      }
      for (let t of winConditions.diagonal) {
        if (t.every((e) => e.textContent === whoseMark.mark)) {
          return true;
        }
      }
    },
  };

  const showResultsDiv = (result) => {
    if (result === "win") resultDiv.innerHTML = victory;
    else if (result === "lose") resultDiv.innerHTML = defeat;

    playAgainContainer.style.visibility = "visible";
    displayController.disableBoard();
  };

  function checkResults() {
    if (winConditions.win(displayController.player)) {
      displayController.disableBoard();
      showResultsDiv("win");
      return true;
    } else if (winConditions.win(displayController.computer)) {
      showResultsDiv("lose");
      displayController.disableBoard();
      return false;
    }
  }

  if (
    displayController.oBtn.getAttribute("player") === "O" ||
    displayController.xBtn.getAttribute("player") === "X"
  ) {
    displayController.oBtn.disabled = true;
    displayController.xBtn.disabled = true;
  } else {
    displayController.oBtn.disabled = false;
    displayController.xBtn.disabled = false;
  }

  gameBoard.tiles.forEach((t) => {
    t.forEach((e) => {
      e.addEventListener("click", () => {
        if (
          displayController.xBtn.getAttribute("player") === "X" &&
          e.textContent === ""
        ) {
          displayController.player.putMark(e);
          if (checkResults()) {
          } else {
            displayController.computer.placeComputerMark();
            checkResults();
          }

          if (Object.keys(gameBoard.emptyTiles).length === 0) {
            resultDiv.textContent = draw;
            playAgainContainer.style.visibility = "visible";
          }
        } else if (
          displayController.oBtn.getAttribute("player") === "O" &&
          e.textContent === ""
        ) {
          displayController.player.putMark(e);
          checkResults();
          displayController.computer.placeComputerMark();
          checkResults();

          if (Object.keys(gameBoard.emptyTiles).length === 0) {
            playAgainContainer.style.visibility = "visible";
          }
        }
      });
    });
  });
  return { checkResults };
})();
