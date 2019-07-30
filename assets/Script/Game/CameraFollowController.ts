const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollowController extends cc.Component {
    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Node)
    camera2: cc.Node = null;

    @property(cc.Node)
    camera3: cc.Node = null;

    @property(cc.Node)
    surface: cc.Node = null;

    @property
    offsetX: number = 200;

    private ball: cc.Node = null;

    init(ball: cc.Node) {
        this.ball = ball;
    }

    lateUpdate() {
        this.camera.x = this.ball.x + this.offsetX;
        this.camera2.x = this.camera.x;
        this.camera3.x = this.camera.x;
        this.surface.x = this.camera.x;
    }
}
