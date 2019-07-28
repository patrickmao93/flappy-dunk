import BallController from "../Ball/BallController";
import CameraFollowController from "./CameraFollowController";
import HoopGenerator from "./HoopGenerator";
import GameModel from "./GameModel";

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

    onLoad() {
        this.game = new GameModel();
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
        });

        // ball hit hoop and scored
        cc.director.on("hit", () => {
            this.game.increaseScore("hit");
            this.score.getComponent(cc.Label).string = this.game.getScore().toString();
        });
        // ball swooshed hoop
        cc.director.on("swooshed", () => {
            this.game.increaseScore("swooshed");
            this.score.getComponent(cc.Label).string = this.game.getScore().toString();
        });
        // ball missed hoop
        cc.director.on("player_died", () => {
            this.game.setPlayerAlive(false);
        });
    }
}
