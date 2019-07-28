export default class GameModel {
    private score: number = 0;
    private comboCount: number = 1;
    private playerAlive: boolean = false;

    combo() {
        this.comboCount += 1;
    }

    resetCombo() {
        this.comboCount = 1;
    }

    increaseScore(scoreType: "hit" | "swooshed") {
        if (scoreType === "hit") {
            this.resetCombo();
        } else if (scoreType === "swooshed") {
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
