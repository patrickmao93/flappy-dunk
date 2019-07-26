import BallController from "../Ball/BallController";
import CameraFollowController from "./CameraFollowController";

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

    onLoad() {
        this.initPlayer();
        this.initCameraFollow();
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
}
