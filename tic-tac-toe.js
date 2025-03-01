/* 
    Code structure based on Alex Younger's work @ https://replit.com/@40percentzinc/ConnectFourConsole#script.js
    from the article https://www.ayweb.dev/blog/building-a-house-from-the-inside-out
*/

const Game = (() => {    
    
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
            printBoard()
        }

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

        return { printBoard, placeMarker, isPlaceValid };
    };

    function GameController (
        playerOneName = "Player One",
        playerTwoName = "Player Two"
    ) {
        const board = Gameboard();

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
            console.log(`${getCurrentPlayer().name}'s turn`);
        }

        const playRound = (row, column) => {
            if (board.isPlaceValid(row, column)) {
                console.log(`${getCurrentPlayer().name} places marker in row ${row}, ${column}...`)
                board.placeMarker(getCurrentPlayer().marker, row, column);
            } else {
                console.log("There's already a marker in that position.")
                return;
            }

            switchCurrentPlayer();
            printNewRound();
        }

        printNewRound()

        return {
            playRound,
            getCurrentPlayer
        }

    }

    const run = GameController();

    return { run }
})()
