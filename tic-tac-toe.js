/* 
    Code structure based on Alex Younger's work @ https://replit.com/@40percentzinc/ConnectFourConsole#script.js
    from the article https://www.ayweb.dev/blog/building-a-house-from-the-inside-out
*/

const Game = (() => {    
    
    const cacheDOM = {
        boardDisplay: document.querySelector(".game-container"),
        messageDisplay: document.querySelector("#output"),
        startButton: document.querySelector("#start-button"),
        inputDiv: document.querySelector(".input-div"),
        playerOneInput: document.querySelector("#player-1"),
        playerTwoInput: document.querySelector("#player-2")
    }

    function Gameboard() {
        const rows = 3;
        const columns = 3;
        let board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }  

        function printBoard() {
            const boardWithCellValues = board.map((row) => row.map((cell) => cell.getMarker()))
            console.table(boardWithCellValues);
        };
        
        function placeMarker(player, row, column) {
            let cell = board[row][column];

            cell.setMarker(player);
        }

        const clearBoard = () => {
            board.forEach(row => row.forEach(col => col.setMarker("-")))
        }

        const getBoard = () => board;

        function isPlaceValid(row, column) {
            let cell = board[row][column];
            return cell.getMarker() == "-";
        }
        
        function Cell() {
            let marker = "-";
    
            const setMarker = (player) => {
                marker = player;
            }
    
            const getMarker = () => marker;

            return {
                setMarker,
                getMarker
            }
        }

        const checkWinner = (currentBoard, player) => {
            let gameWon = false;
            let winner;

            // check rows
            for (let i = 0; i < rows; i++) {
                if (currentBoard[i].every(cell => cell.getMarker() == player.marker)) {
                    gameWon = true;
                    winner = player;
                }
            }

            // check columns
            for (let i = 0; i < columns; i++) {
                let analyzedCol = [];
                for (let j = 0; j < rows; j++) {
                    analyzedCol.push(currentBoard[j][i].getMarker());
                }
                if (analyzedCol.every(cell => cell == player.marker)) {
                    gameWon = true;
                    winner = player;               
                } else {
                    continue;
                }
            }

            // check diagonals
            let fromLeftIndex = 0;
            let fromRightIndex = 2;
            let fromLeftColArr = [];
            let fromRightColArr = [];
            
            for (let i = 0; i < rows; i++) {
                fromLeftColArr.push(currentBoard[i][fromLeftIndex].getMarker());
                fromRightColArr.push(currentBoard[i][fromRightIndex].getMarker());
                fromLeftIndex++;
                fromRightIndex--;
            }

            if (
                fromLeftColArr.every(el => el == player.marker) || 
                fromRightColArr.every(el => el == player.marker)
            ) {
                gameWon = true;
                winner = player;   
            }

            // check tie

            let isTie = false;

            let verifyTieArr = [];
            currentBoard.forEach(row => row.forEach(cell => verifyTieArr.push(cell.getMarker())));
            if (verifyTieArr.every(cell => cell !== "-")) {
                gameWon = true;
                isTie = true;
            }

            const checkTie = () => isTie;
            const getWinner = () => winner;
            const gameFinished = () => gameWon;

            return {
                getWinner, 
                gameFinished, 
                checkTie
            };
        }

        return { 
            printBoard, 
            placeMarker, 
            isPlaceValid, 
            checkWinner, 
            getBoard, 
            clearBoard 
        };
    };

    function GameController (
        playerOneName = "Player One",
        playerTwoName = "Player Two"
    ) {
        const board = Gameboard();
        let msg = ``;
        
        const states = ["running", "finished"];
        let currentState = states[0];
        const getCurrentState = () => states.indexOf(currentState);

        const players = [
            {
                name: playerOneName,
                marker: "X"
            },
            {
                name: playerTwoName,
                marker: "O"
            }
        ]

        let currentPlayer = players[0];

        const getCurrentPlayer = () => currentPlayer;
        
        const switchCurrentPlayer = () => {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0]; 
        }

        const printNewRound = () => {
            board.printBoard()
            msg = `${getCurrentPlayer().name}'s turn...`;
            print()
            console.log(`${getCurrentPlayer().name}'s turn`);
        }

        const playRound = (row, column) => {
            if (currentState == states[1]) return;

            if (board.isPlaceValid(row, column)) {
                console.log(`${getCurrentPlayer().name} places marker in row ${row}, ${column}...`)
                board.placeMarker(getCurrentPlayer().marker, row, column);
            } else {
                msg = "There's already a marker in that position.";
                print();
                console.log("There's already a marker in that position.")
                return;
            }

            const isGameDone = board.checkWinner(board.getBoard(), getCurrentPlayer());

            if (isGameDone.gameFinished()) {
                if (isGameDone.checkTie()) {
                    msg = "It's a tie!";
                    console.log("It's a tie!")
                } else {
                    msg = `Game is over! ${isGameDone.getWinner().name} won.`;
                    console.log(`Game is over! ${isGameDone.getWinner().name} won.`)
                }
                currentState = states[1];

                print()
                return;
            }

            switchCurrentPlayer();
            printNewRound();
        }

        print()
        printNewRound()

        const resetGame = () => {
            board.clearBoard();
            console.log("Game reset!");
            currentPlayer = players[0];
            currentState = states[0];
            printNewRound();
        }

        function print() {
            renderDOM().update(board, msg, getCurrentState());
        }

        return {
            playRound,
            getCurrentPlayer,
            getCurrentState,
            resetGame
        }

    }

    let run = null;

    function renderDOM() {
        const update = (board, msg, state) => {
            cacheDOM.boardDisplay.replaceChildren();
            cacheDOM.messageDisplay.textContent = msg;

            if (state) {
                const btn = document.createElement("button");
                btn.textContent = "Reset";
                btn.addEventListener("click", () => {
                    run = null; 
                    document.querySelector(".btn-div").replaceChildren();
                    cacheDOM.boardDisplay.replaceChildren();
                    cacheDOM.messageDisplay.textContent = "";

                    cacheDOM.inputDiv.classList.toggle("hidden");
                    createStartButton();                    
                })
                document.querySelector(".btn-div").appendChild(btn)
            }

            board.getBoard().forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
                const marker = cell.getMarker();

                const cellDisplay = document.createElement("div");
                cellDisplay.textContent = marker == "-" ? "": marker;
                cellDisplay.className = "cell";
                cellDisplay.addEventListener("click", () => {run.playRound(rowIndex, cellIndex)})

                cacheDOM.boardDisplay.appendChild(cellDisplay); 
            }))
        }

        return { update }
    }

    function startGame() {
        const playerOneName = cacheDOM.playerOneInput.value.trim() == "" ? undefined : cacheDOM.playerOneInput.value.trim();
        const playerTwoName = cacheDOM.playerTwoInput.value.trim() == "" ? undefined : cacheDOM.playerTwoInput.value.trim();

        run = GameController(playerOneName, playerTwoName);

        cacheDOM.inputDiv.classList.toggle("hidden");    

        return { createButton }
    }

    const createStartButton = () => {
        startBtn = document.createElement("button");
        startBtn.id = "start-button";
        startBtn.textContent = "Start";
        cacheDOM.boardDisplay.appendChild(startBtn);
        startBtn.addEventListener("click", () => startGame())
    }

    createStartButton();

    return { startGame }
})()
