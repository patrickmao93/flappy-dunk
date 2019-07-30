import BallController from "../Ball/BallController";
import CameraFollowController from "./CameraFollowController";
import HoopGenerator from "./HoopGenerator";
import GameModel from "./GameModel";
import AudioController from "../Audio/AudioController";
import ComboLabelController from "./ComboLabelController";
import CoverController from "../Surface/CoverController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    BallPrefab: cc.Prefab;

    @property(cc.Node)
    score: cc.Node;

    @property(cc.Node)
    cover: cc.Node;

    @property(cc.Vec2)
    playerSpawnPosition: cc.Vec2 = cc.v2(-200, 0);

    private cameraCtrl: CameraFollowController;
    private ball: cc.Node;
    private ballCtrl: BallController;
    private surface: cc.Node;
    private hoopGenerator: HoopGenerator;
    private game: GameModel;
    private audioCtrl: AudioController;
    private comboCtrl: ComboLabelController;
    private coverCtrl: CoverController;
    private inputCatcher: cc.Node;

    onLoad() {
        this.game = new GameModel();
        this.surface = this.node.getChildByName("Surface");
        this.coverCtrl = this.cover.getComponent(CoverController);
        this.inputCatcher = this.surface.getChildByName("InputCatcher");
        this.score = this.surface.getChildByName("Score");
        this.audioCtrl = this.getComponent(AudioController);
        this.comboCtrl = this.surface.getChildByName("Combo").getComponent(ComboLabelController);
        this.game.pause();
        cc.debug.setDisplayStats(false);
        this.inputCatcher.active = true;

        this.initPlayer();
        this.initCameraFollow();
        this.initHoopGenerator();
        this.initEvents();
    }

    initPlayer() {
        this.ball = cc.instantiate(this.BallPrefab);
        this.ballCtrl = this.ball.getComponent("BallController");
        this.node.addChild(this.ball);
        this.ballCtrl.init(this.game);
        this.game.setPlayerAlive(true);
    }

    initCameraFollow() {
        this.cameraCtrl = this.getComponent("CameraFollowController");
        this.cameraCtrl.init(this.ball);
    }

    initHoopGenerator() {
        this.hoopGenerator = this.getComponent(HoopGenerator);
        this.hoopGenerator.init(this.game);
    }

    initEvents() {
        this.registerInputEvents();
        // ball hit hoop and scored
        cc.director.on(
            "hit",
            () => {
                this.game.increaseScore("hit");
                // this.audioCtrl.playHit();
                this.comboCtrl.updateComboText(this.game.getCombo());
                this.score.getComponent(cc.Label).string = this.game.getScore().toString();
            },
            this
        );
        // ball bounce against surface
        cc.director.on(
            "bounce",
            () => {
                // this.audioCtrl.play("bounce");
            },
            this
        );
        // ball swished hoop
        cc.director.on(
            "swish",
            () => {
                this.game.increaseScore("swish");
                this.comboCtrl.updateComboText(this.game.getCombo());
                this.audioCtrl.play("swish");
                this.score.getComponent(cc.Label).string = this.game.getScore().toString();
            },
            this
        );
        // ball missed hoop
        cc.director.on(
            "game_over",
            () => {
                this.inputCatcher.active = false;
                this.game.gameOver();
                setTimeout(() => {
                    this.coverCtrl.gameOver(this.game.getScore());
                }, 2000);
            },
            this
        );
    }

    registerInputEvents() {
        // init input events
        this.inputCatcher.on(cc.Node.EventType.TOUCH_START, () => {
            this.ballCtrl.hop();
            this.audioCtrl.play("hop");
            this.game.resume();
        });

        this.cover.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.game.getIsGameOver()) return;
            this.cover.active = false;
            cc.director.emit("game_start");
            this.audioCtrl.play("whistle");
        });
    }
}
