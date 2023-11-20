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

        for (let i = 0; i <= 3; i++) {
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

    gameLoop() {
        if (!this.isRunning) {
            return;
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (board.length === 0) {
            this.createBoard();
            this.setNextShapes();
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
}

function stopGame() {
    game.stop();

    document.getElementById('stop-btn').classList.add('hidden');
    document.getElementById('stop-btn').classList.remove('block');

    document.getElementById('start-btn').classList.add('block');
    document.getElementById('start-btn').classList.remove('hidden');
}