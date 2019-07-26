const { ccclass, property } = cc._decorator;

@ccclass
export default class BallController extends cc.Component {
    @property
    hopSpeed: number = 600;

    @property
    gravity: number = -1000;

    @property(cc.Vec2)
    defaultPosition: cc.Vec2 = cc.v2(-200, 0);

    @property
    acceleration: number = 1000;

    @property
    speed: number = 300;

    private rigidbody: cc.RigidBody;

    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);

        this.rigidbody = this.getComponent(cc.RigidBody);
        this.rigidbody.enabledContactListener = true;
    }

    update(dt: number) {
        if (this.rigidbody.linearVelocity.x > this.speed) {
            this.rigidbody.linearVelocity = cc.v2(this.speed, this.rigidbody.linearVelocity.y);
            return;
        } else if (this.rigidbody.linearVelocity.x < 0) {
            this.rigidbody.linearVelocity = cc.v2(
                this.rigidbody.linearVelocity.x / 10,
                this.rigidbody.linearVelocity.y
            );
        }
        this.rigidbody.linearVelocity = cc.v2(
            this.rigidbody.linearVelocity.x + this.acceleration * dt,
            this.rigidbody.linearVelocity.y
        );
    }

    init(playerSpawnPosition: cc.Vec2) {
        this.node.setPosition(playerSpawnPosition);
        this.rigidbody.linearVelocity = cc.v2(this.speed, 0);
    }

    hop() {
        this.rigidbody.linearVelocity = cc.v2(this.rigidbody.linearVelocity.x, this.hopSpeed);
    }
}
