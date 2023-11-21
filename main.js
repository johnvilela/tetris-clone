const unit = 30;
const colorDictionary = {
    r: 'red',
    g: 'green',
    b: 'blue',
    y: 'yellow',
}
const shapesDictionary = {
    square: 'square',
    line: 'line',
    l: 'l',
    t: 't',
};
const formats = {
    square: [
        ['b', 'b'],
        ['b', 'b'],
    ],
    line: [
        ['r', 'r', 'r', 'r'],
    ],
    l: [
        ['y', ''],
        ['y', ''],
        ['y', 'y'],
    ],
    t: [
        ['g', 'g', 'g'],
        ['', 'g', ''],
    ],
}
let board = [];
const nextShapes = [];


class Block {
    draw(color, ctx, x, y) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, unit, unit);

        ctx.fillStyle = 'black';
        ctx.strokeRect(x, y, unit, unit);
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.fallSpeed = 2;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    setNextShapes() {
        const shapes = Object.keys(shapesDictionary);

        for (let i = 0; i <= 5; i++) {
            const randomIndex = Math.floor(Math.random() * shapes.length);
            nextShapes.push(Object.keys(shapesDictionary)[randomIndex]);
        }
    }

    createBoard() {
        board = [];
        for (let i = 0; i < this.canvas.height; i += unit) {
            const row = [];

            for (let j = 0; j < this.canvas.width; j += unit) {
                row.push('');
            }

            board.push(row);
        }
    }

    setShapeIntoBoard() {
        const nextShape = nextShapes.pop();
        const format = formats[nextShape];
        const randomInitialPosition = Math.floor(Math.random() * 6);

        for (let i = 0; i < format.length; i++) {
            for (let j = 0; j < format[i].length; j++) {
                const value = format[i][j];

                if (value) {
                    board[i][j + randomInitialPosition] = `f:${value}`;
                }
            }
        }

        if(nextShapes.length < 5) {
            const randomIndex = Math.floor(Math.random() * Object.keys(shapesDictionary).length);
            nextShapes.push(Object.keys(shapesDictionary)[randomIndex]);
        }
    }

    drawBoard() {
        const block = new Block();
        const cleanedBoard = board.map(val => {
            return val.map(v => {
                if (v.includes('f:')) {
                    return v.split('f:')[1];
                }

                if (v.includes('s:')) {
                    return v.split('s:')[1];
                }

                return v;
            })
        })

        for (let i = 0; i < cleanedBoard.length; i++) {
            const row = cleanedBoard[i];

            for (let j = 0; j < row.length; j++) {
                const value = row[j];

                if (value) {
                    const color = colorDictionary[value];
                    block.draw(color, this.ctx, j * unit, i * unit);
                }
            }
        }
    }

    makePieceFall() {
        for (let i = board.length - 1; i >= 0; i--) {
            const row = board[i];

            for (let j = 0; j < 10; j++) {
                const value = row[j];

                if (value.includes('f:')) {
                    if (i === board.length - 1) {
                        // is last row
                        board[i][j] = `s:${value.split('f:')[1]}`;
                    } else if (!board[i + 1][j].includes('s:')) {
                        // is not last row and next row is empty
                        board[i + 1][j] = value;
                        board[i][j] = '';
                    } else {
                        // is not last row and next row is not empty
                        board[i][j] = `s:${value.split('f:')[1]}`;
                    }
                }
            }
        }
    }

    moveShapeLeft() {
        for (let i = 0; i < board.length; i++) {
            const row = board[i];

            for (let j = 1; j < row.length; j++) {
                const value = row[j];

                if (value.includes('f:') && row[j - 1] === '') {
                    // Move the falling piece to the left
                    board[i][j - 1] = value;
                    board[i][j] = '';
                }
            }
        }
    }

    moveShapeRight() {
        for (let i = 0; i < board.length; i++) {
            const row = board[i];

            for (let j = row.length - 2; j >= 0; j--) {
                const value = row[j];

                if (value.includes('f:') && row[j + 1] === '') {
                    // Move the falling piece to the right
                    board[i][j + 1] = value;
                    board[i][j] = '';
                }
            }
        }
    }

    moveDownFaster() {
        this.fallSpeed = this.fallSpeed * 1.25;
    }

    stopMoveDownFaster() {
        this.fallSpeed = this.fallSpeed / 1.25;
    }

    checkIfHasFallingPiece() {
        for (let i = 0; i < board.length; i++) {
            const row = board[i];

            for (let j = 0; j < row.length; j++) {
                const value = row[j];

                if (value.includes('f:')) {
                    return true;
                }
            }
        }

        return false;
    }

    gameLoop() {
        if (!this.isRunning) {
            return;
        }

        console.log(nextShapes);

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (board.length === 0) {
            this.createBoard();
            this.setNextShapes();
            this.setShapeIntoBoard();
        }

        if (!this.checkIfHasFallingPiece()) {
            this.setShapeIntoBoard();
        }

        this.drawBoard();

        this.makePieceFall();

        // Set wait time
        setTimeout(() => {
            requestAnimationFrame(() => this.gameLoop());
        }, 1000 / this.fallSpeed);
    }
}

const game = new Game('game');

function startGame() {
    game.start();

    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('start-btn').classList.remove('block');

    document.getElementById('stop-btn').classList.add('block');
    document.getElementById('stop-btn').classList.remove('hidden');

    window.addEventListener('keydown', handleKeydown);
    // window.addEventListener('keyup', handleKeyup);
}

function stopGame() {
    game.stop();

    document.getElementById('stop-btn').classList.add('hidden');
    document.getElementById('stop-btn').classList.remove('block');

    document.getElementById('start-btn').classList.add('block');
    document.getElementById('start-btn').classList.remove('hidden');

    window.removeEventListener('keydown', handleKeydown);
    // window.removeEventListener('keyup', handleKeyup);
}

function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            game.moveShapeLeft();
            break;
        case 'ArrowRight':
            game.moveShapeRight();
            break;
        // case 'ArrowDown':
        //     game.moveDownFaster();
        //     break;
    }
}

// function handleKeyup(event) {
//     switch (event.key) {
//         case 'ArrowDown':
//             game.stopMoveDownFaster();
//             break;
//     }
// }