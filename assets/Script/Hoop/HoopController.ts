import HoopModel from "./HoopModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopController extends cc.Component {
    @property
    startingScale: number = 1.6;

    @property
    minScale: number = 1.15;

    private rigidbody: cc.RigidBody = null;
    private model: HoopModel = null;
    private onOutOfBound: Function;
    private camera: cc.Node = null;

    onLoad() {
        this.camera = this.node.parent.parent.getChildByName("Main Camera");
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        this.rigidbody = this.getComponent(cc.RigidBody);

        this.model = this.getComponent(HoopModel);
    }

    init(x: number, difficulty: number, onOutOfBound: Function) {
        this.onOutOfBound = onOutOfBound;
        const hoopPosition = cc.v2(x, 100 - 200 * Math.random());
        this.node.setPosition(hoopPosition);
        difficulty = difficulty > 0 ? difficulty : 0;
        this.node.scale =
            this.startingScale - difficulty > this.minScale
                ? this.startingScale - difficulty
                : this.minScale;
    }

    update() {
        if (this.node.x < this.camera.x - this.camera.width) {
            this.onOutOfBound();
        }
    }
}
