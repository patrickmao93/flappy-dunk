import HoopModel from "./HoopModel";

const { ccclass, property } = cc._decorator;

type HoopState = "contacted" | "missed";

@ccclass
export default class HoopController extends cc.Component {
    @property(cc.Prefab)
    swishEffectPrefab: cc.Prefab;

    private hoop: HoopModel = null;
    private recycle: Function;
    private camera: cc.Node = null;

    private hoopState: HoopState;
    private scored: boolean = false;

    private animation: cc.Animation;

    onLoad() {
        this.camera = this.node.parent.parent.getChildByName("Main Camera");
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        cc.director.getCollisionManager().enabled = true;

        this.hoop = this.getComponent(HoopModel);

        this.animation = this.getComponent(cc.Animation);
    }

    init(x: number, difficulty: number, recycle: Function) {
        this.recycle = recycle;
        const hoopPosition = cc.v2(x, 100 - 200 * Math.random());
        this.node.setPosition(hoopPosition);
        difficulty = difficulty > 0 ? difficulty : 0;
        this.node.scale =
            this.hoop.startingScale - difficulty > this.hoop.minScale
                ? this.hoop.startingScale - difficulty
                : this.hoop.minScale;
        this.node.opacity = 255;
        this.scored = false;
        this.togglePhysics(true);
        this.hoopState = null;
    }

    update() {
        if (this.node.x < this.camera.x - this.camera.width) {
            this.recycle();
        }
    }

    onBeginContact() {
        this.hoopState = "contacted";
    }

    onCollisionEnter(other: cc.Collider & { world: any }, self: cc.Collider & { world: any }) {
        const otherPreAabb = other.world.preAabb;

        // if ball was not entring from above then it doesn't count
        if (otherPreAabb.yMin < self.world.aabb.yMax) {
            return;
        }

        // 1 = touching hoop center, 2 = touching miss line
        if (self.tag === 1) {
            if (this.hoopState === "contacted") {
                cc.director.emit("hit");
            } else {
                cc.director.emit("swish");
            }
            this.animation.play("hoop_zoom_out");
            this.node.runAction(cc.scaleBy(0.2, 1.2, 1.2));
            this.togglePhysics(false);
            this.scored = true;
        } else if (self.tag === 0) {
            if (!this.scored) {
                cc.director.emit("player_died");
            }
        }
    }

    togglePhysics(state: boolean) {
        this.getComponent(cc.RigidBody).active = state;
    }

    onAnimationComplete() {
        this.recycle();
    }
}
