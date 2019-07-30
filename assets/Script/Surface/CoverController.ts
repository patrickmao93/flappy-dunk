const { ccclass, property } = cc._decorator;

@ccclass
export default class CoverController extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    gameOver(score: number) {
        this.node.active = true;
        this.scoreLabel.enabled = true;
        this.scoreLabel.string = `SCORE\n${score}`;
    }
}
