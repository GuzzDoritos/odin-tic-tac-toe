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
            cell = board[row][column];

            if (cell.getMarker() == "-") {
                cell.setMarker(player); 
                printBoard()
            } else {
                return;
            }
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

        return { printBoard, placeMarker };
    };

    const board = Gameboard();

    return {board}
})()