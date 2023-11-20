
class Block {
    formats = {
        square: {
            color: 'blue',
            shape: [
                [1, 1],
                [1, 1],
            ],
        },
        line: {
            color: 'red',
            shape: [
                [1, 1, 1, 1],
            ],
        },
        l: {
            color: 'green',
            shape: [
                [1, 0],
                [1, 0],
                [1, 1],
            ],
        },
        t: {
            color: 'orange',
            shape: [
                [1, 1, 1],
                [0, 1, 0],
            ],
        },
    }

    drawBlock(color, ctx, x, y) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 30, 30);

        ctx.fillStyle = 'black';
        ctx.strokeRect(x, y, 30, 30);
    }

    drawShape(type, ctx, x, y) {
        const format = this.formats[type];

        ctx.fillStyle = format.color;

        for (let i = 0; i < format.shape.length; i++) {
            for (let j = 0; j < format.shape[i].length; j++) {
                if (format.shape[i][j]) {
                    this.drawBlock(format.color, ctx, x + j * 30, y + i * 30);
                }
            }
        }
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.x = 0;
        this.speed = 5;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) {
            return;
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the block
        const block = new Block();
        block.drawShape('t', this.ctx, 100, 0);

        // Request the next animation frame
        requestAnimationFrame(() => this.gameLoop());
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