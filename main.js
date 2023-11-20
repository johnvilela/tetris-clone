

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

        // Update the game state
        this.x += this.speed;

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the game elements
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, 50, 50, 50);

        // Request the next animation frame
        requestAnimationFrame(() => this.gameLoop());
    }
}

function startAndStopGame() {
    const game = new Game('game');

    game.start();

    setTimeout(() => {
        game.stop();
    }, 15000);
}