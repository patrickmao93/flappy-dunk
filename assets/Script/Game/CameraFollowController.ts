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

    init(ball: cc.Node) {
        this.ball = ball;
    }

    lateUpdate() {
        this.camera.x = this.ball.x + this.offsetX;
        this.surface.x = this.camera.x;
    }
}
