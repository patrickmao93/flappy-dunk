const { ccclass, property } = cc._decorator;

@ccclass
export default class BallController extends cc.Component {
    @property(cc.Vec2)
    hopForce: cc.Vec2 = cc.v2(0, 20000);

    @property(cc.Vec2)
    defaultPosition: cc.Vec2 = cc.v2(-200, 0);

    @property
    acceleration: number = 5000;

    @property
    defaultSpeed: number = 100;

    @property
    maxSpeed: number = 200;

    private rigidbody: cc.RigidBody;

    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, -1600);

        this.rigidbody = this.getComponent(cc.RigidBody);
    }

    init(playerSpawnPosition: cc.Vec2) {
        this.node.setPosition(playerSpawnPosition);
        this.rigidbody.linearVelocity = cc.v2(this.defaultSpeed, 0);
    }

    hop() {
        this.rigidbody.linearVelocity = cc.v2(this.rigidbody.linearVelocity.x, 800);
    }

    update(dt: number) {
        if (this.rigidbody.linearVelocity.x > this.maxSpeed) {
            this.rigidbody.linearVelocity = cc.v2(this.maxSpeed, this.rigidbody.linearVelocity.y);
            return;
        } else if (this.rigidbody.linearVelocity.x < 0) {
            this.rigidbody.linearVelocity = cc.v2(0, this.rigidbody.linearVelocity.y);
        }
        this.rigidbody.linearVelocity = cc.v2(
            this.rigidbody.linearVelocity.x + this.acceleration * dt,
            this.rigidbody.linearVelocity.y
        );
    }
}
