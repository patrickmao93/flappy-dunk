const { ccclass, property } = cc._decorator;

@ccclass
export default class WallController extends cc.Component {
    rigidbody: cc.RigidBody;

    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, -2400);

        this.rigidbody = this.getComponent(cc.RigidBody);
    }
}
