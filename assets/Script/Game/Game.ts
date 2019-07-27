import BallController from "../Ball/BallController";
import CameraFollowController from "./CameraFollowController";
import HoopGenerator from "./HoopGenerator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    BallPrefab: cc.Prefab;

    @property(cc.Vec2)
    playerSpawnPosition: cc.Vec2 = cc.v2(-200, 0);

    private cameraCtrl: CameraFollowController;

    private ball: cc.Node;
    private ballCtrl: BallController;

    private hoopGenerator: HoopGenerator;

    onLoad() {
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
        // ball hit hoop and scored
        cc.director.on("hit", () => {
            console.log("hit");
        });
        // ball swooshed hoop
        cc.director.on("swooshed", () => {
            console.log("swooshed");
        });
        // ball missed hoop
        cc.director.on("player_died", () => {
            console.log("player_died");
        });
    }
}
