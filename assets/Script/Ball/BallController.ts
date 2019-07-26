const { ccclass, property } = cc._decorator;

@ccclass
export default class BallController extends cc.Component {
    @property(cc.Vec2)
    hopForce: cc.Vec2 = cc.v2(0, 20000);

    @property(cc.Vec2)
    defaultPosition: cc.Vec2 = cc.v2(-200, 0);

    rigidbody: cc.RigidBody;

    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, -2400);

        this.rigidbody = this.getComponent(cc.RigidBody);
    }

    init(playerSpawnPosition: cc.Vec2) {
        this.node.setPosition(playerSpawnPosition);
    }

    hop() {
        this.rigidbody.linearVelocity = cc.v2(0, 800);
    }

    update() {
        this.rigidbody.linearVelocity.x = 0;
    }
}
