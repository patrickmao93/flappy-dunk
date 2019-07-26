const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopController extends cc.Component {
    private rigidbody: cc.RigidBody = null;
    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        this.rigidbody = this.getComponent(cc.RigidBody);
    }

    init(pos: cc.Vec2) {
        // this.node.setPosition(pos);
        this.node.setPosition(cc.v2(0, 0));
    }
}
