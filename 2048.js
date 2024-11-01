// TODO: Set reset button
// TODO: Update GUI
// TODO: Create logic for player losing
// TODO: Create logic for player winning
// TODO: Create continue logic for player reaching 2048 tile
// TODO: Create logic for tile sliding animations
// TODO: Create logic for tile merging animations

/* Global Variables */
let board;
let score = 0;
let rows = 4;
let columns = 4;

/* Load initial board on page load */
window.onload = function () {
    setGame();
}

/* Function to set initial state of game */
function setGame() {
    // initial board state
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // loop through board
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        for (let colIdx = 0; colIdx < columns; colIdx++) {

            // create div for each coordinate on board (i.e. <div id="0-0"></div>)
            let tile = document.createElement("div");
            tile.id = rowIdx.toString() + "-" + colIdx.toString();

            // get number from coordinate and update tile class accordingly
            let num = board[rowIdx][colIdx];
            updateTile(tile, num);

            // add tile to board
            document.getElementById("board").append(tile);
        }
    }

    // set initial tiles
    setTwo();
    setTwo();
}

/* Function to check for an empty tile */
function hasEmptyTile() {
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        for (let colIdx = 0; colIdx < columns; colIdx++) {
            if (board[rowIdx][colIdx] === 0) {
                return true; // found empty tile
            }
        }
    }
    return false;
}

/* Function to randomly set 2 initial tiles on the board */
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        // pick random row, col
        let randomRow = Math.floor(Math.random() * rows);
        let randomCol = Math.floor(Math.random() * columns);

        // check tile is empty
        if (board[randomRow][randomCol] === 0) {
            board[randomRow][randomCol] = 2; // set tile value to 2
            let tile = document.getElementById(randomRow.toString() + "-" + randomCol.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true; // update found flag
        }
    }
}


/* Function to update the class of a tile */
function updateTile(tile, num) {
    tile.innerText = ""; // initialize tile text
    tile.classList.value = ""; // clear class list (prevents "tile x2 x4 x8 ...")
    tile.classList.add("tile"); // set base class for tile

    // set tile class based on number in tile
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else { // set base class for any # > 4096
            tile.classList.add("x8192");
        }
    }
    else {
        tile.classList.add("empty-tile");
    }
}


/* 
***********************************
*    Key Press Event Listener     *
***********************************
*/
document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (event.code === "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (event.code === "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (event.code === "ArrowDown") {
        slideDown();
        setTwo();
    }
    // update score
    document.getElementById("score").innerText = score;
})



/* 
***********************************
*     Sliding Helper Functions    *
***********************************
*/
function filterZero(row) {
    // return array without zeroes
    return row.filter(num => num != 0);
}

function slide(row) {
    // i.e. [0, 2, 2, 2]
    row = filterZero(row); // get rid of zeroes -> [2, 2, 2]

    // slide
    for (let idx = 0; idx < row.length - 1; idx++) {
        // check by pairs moving up one at a time
        if (row[idx] === row[idx + 1]) { // match found
            row[idx] *= 2; // double value of tile
            row[idx + 1] = 0; // clear following tile
            score += row[idx]; // increase score
        } // [2, 2, 2] -> [4, 0, 2]
    }

    // get rid of zeroes
    row = filterZero(row); // [4, 2]

    // add zeroes to end of row
    while (row.length < columns) {
        row.push(0);
    } // [4, 2, 0, 0 ]

    return row;
}



/* 
***********************************
*    Direction Slide Functions    *
***********************************
*/
function slideLeft() {
    // loop through rows
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        let row = board[rowIdx]; // get each row
        row = slide(row); // slide the row
        board[rowIdx] = row; // update row on board

        // update live board
        for (let colIdx = 0; colIdx < columns; colIdx++) {
            let tile = document.getElementById(rowIdx.toString() + "-" + colIdx.toString());
            let num = board[rowIdx][colIdx];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    // loop through rows
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
        let row = board[rowIdx]; // get each row
        row.reverse(); // reverse the row
        row = slide(row); // slide the row
        row.reverse(); // reverse the row again
        board[rowIdx] = row; // update row on board

        // update live board
        for (let colIdx = 0; colIdx < columns; colIdx++) {
            let tile = document.getElementById(rowIdx.toString() + "-" + colIdx.toString());
            let num = board[rowIdx][colIdx];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    // loop through columns
    for (let colIdx = 0; colIdx < columns; colIdx++) {
        // get column values and slide them
        let row = [board[0][colIdx], board[1][colIdx], board[2][colIdx], board[3][colIdx]];
        row = slide(row);

        // update live board
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            // reassign board values
            board[rowIdx][colIdx] = row[rowIdx]; // reassign board values
            let tile = document.getElementById(rowIdx.toString() + "-" + colIdx.toString());
            let num = board[rowIdx][colIdx];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    // loop through columns
    for (let colIdx = 0; colIdx < columns; colIdx++) {
        // get column values and slide them
        let row = [board[0][colIdx], board[1][colIdx], board[2][colIdx], board[3][colIdx]];
        row.reverse();
        row = slide(row);
        row.reverse();

        // update live board
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
            // reassign board values
            board[rowIdx][colIdx] = row[rowIdx]; // reassign board values
            let tile = document.getElementById(rowIdx.toString() + "-" + colIdx.toString());
            let num = board[rowIdx][colIdx];
            updateTile(tile, num);
        }
    }
}


