import BallController from "../Ball/BallController";
import CameraFollowController from "./CameraFollowController";
import HoopGenerator from "./HoopGenerator";
import GameModel from "./GameModel";
import AudioController from "../Audio/AudioController";
import ComboLabelController from "./ComboLabelController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    BallPrefab: cc.Prefab;

    @property(cc.Node)
    surface: cc.Node;

    @property(cc.Node)
    score: cc.Node;

    @property(cc.Vec2)
    playerSpawnPosition: cc.Vec2 = cc.v2(-200, 0);

    private cameraCtrl: CameraFollowController;
    private ball: cc.Node;
    private ballCtrl: BallController;
    private hoopGenerator: HoopGenerator;
    private game: GameModel;
    private audioCtrl: AudioController;
    private comboCtrl: ComboLabelController;

    onLoad() {
        this.game = new GameModel();
        this.audioCtrl = this.getComponent(AudioController);
        this.comboCtrl = this.surface.getChildByName("Combo").getComponent(ComboLabelController);

        this.initPlayer();
        this.initCameraFollow();
        this.initHoopGenerator();
        this.initEvents();
    }

    initPlayer() {
        this.ball = cc.instantiate(this.BallPrefab);
        this.ballCtrl = this.ball.getComponent("BallController");
        this.node.addChild(this.ball);
        this.ballCtrl.init(this.playerSpawnPosition);
        this.game.setPlayerAlive(true);
    }

    initCameraFollow() {
        this.cameraCtrl = this.getComponent("CameraFollowController");
        this.cameraCtrl.init(this.ball);
    }

    initHoopGenerator() {
        this.hoopGenerator = this.getComponent(HoopGenerator);
        this.hoopGenerator.init(this.ball);
    }

    initEvents() {
        // init input events
        this.surface.on(cc.Node.EventType.TOUCH_START, () => {
            this.ballCtrl.hop();
            this.audioCtrl.playHop();
        });

        // ball hit hoop and scored
        cc.director.on("hit", () => {
            this.game.increaseScore("hit");
            // this.audioCtrl.playHit();
            this.comboCtrl.updateComboText(this.game.getCombo());
            this.score.getComponent(cc.Label).string = this.game.getScore().toString();
        });
        // ball swished hoop
        cc.director.on("swish", () => {
            this.game.increaseScore("swish");
            this.comboCtrl.updateComboText(this.game.getCombo());
            this.audioCtrl.playSwish();
            this.score.getComponent(cc.Label).string = this.game.getScore().toString();
        });
        // ball missed hoop
        cc.director.on("player_died", () => {
            this.game.setPlayerAlive(false);
        });
    }
}
