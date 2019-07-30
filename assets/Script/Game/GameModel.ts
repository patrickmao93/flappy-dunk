export default class GameModel {
    public playerSpawnPosition: cc.Vec2 = cc.v2(-200, 0);

    private score: number = 0;
    private comboCount: number = 1;
    private playerAlive: boolean = false;
    private isGameOver: boolean = false;
    private paused: boolean = true;

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    isPaused() {
        return this.paused;
    }

    combo() {
        this.comboCount += 1;
    }

    getIsGameOver() {
        return this.isGameOver;
    }

    gameOver() {
        this.comboCount = 1;
        this.isGameOver = true;
        this.playerAlive = false;
    }

    getCombo() {
        return this.comboCount;
    }

    resetCombo() {
        this.comboCount = 1;
    }

    increaseScore(scoreType: "hit" | "swish") {
        if (scoreType === "hit") {
            this.resetCombo();
        } else if (scoreType === "swish") {
            this.combo();
        }
        this.score += this.comboCount;
    }

    getScore() {
        return this.score;
    }

    setPlayerAlive(alive: boolean) {
        if (alive === this.playerAlive) {
            return;
        }
        this.playerAlive = alive;
    }

    isPlayerAlive() {
        return this.playerAlive;
    }
}
