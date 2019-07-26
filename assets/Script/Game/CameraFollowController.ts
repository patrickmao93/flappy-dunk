import BallController from "../Ball/BallController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollowController extends cc.Component {
    @property(cc.Node)
    camera: cc.Node;

    @property(cc.Node)
    surface: cc.Node;

    @property
    offsetX: number = 200;

    private ball: cc.Node;
    private ballCtrl: BallController;

    init(ball: cc.Node) {
        this.ball = ball;
        this.ballCtrl = this.ball.getComponent("BallController");
        this.registerInputEvents();
    }

    lateUpdate() {
        this.camera.x = this.ball.x + this.offsetX;
        this.surface.x = this.camera.x;
    }

    registerInputEvents() {
        this.surface.on(cc.Node.EventType.TOUCH_START, () => {
            this.ballCtrl.hop();
        });
    }
}
