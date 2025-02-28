const Game = (() => {    
    
    function Gameboard () {
        const rows = 3;
        const columns = 3;
        let board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }  

        const printBoard = () => {
            const boardWithCellValues = board.map((row) => row.map((cell) => cell.getMarker()))
            console.table(boardWithCellValues);
        };

        function placeMarker(player, row, column) {
            if (board[row][column].getMarker() == "-") {
                console.log(board[row][column].getMarker() === "-")
                board[row][column].setMarker(player); 
                printBoard()
            } else {
                return;
            }
        }


        return { printBoard, placeMarker };
    };

    const board = Gameboard();

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

    return {board}
})()