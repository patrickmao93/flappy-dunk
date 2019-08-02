import { HoopOptions } from "./HoopController";
import HoopModel from "./HoopModel";

const { ccclass, property } = cc._decorator;

type HoopState = "contacted" | "missed";

@ccclass
export default class HoopBodyController extends cc.Component {
    private hoop: HoopModel = null;
    private animation: cc.Animation;
    private hitCollider: cc.BoxCollider;
    private hoopState: HoopState;
    private recycle: Function;

    onLoad() {
        this.animation = this.getComponent(cc.Animation);

        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.hoop = this.getComponent(HoopModel);

        this.hitCollider = this.getComponent(cc.BoxCollider);
    }

    update() {
        this.node.setPosition(0, 0);
    }

    onCollisionEnter(other: cc.Collider & { world: any }, self: cc.Collider & { world: any }) {
        const otherPreAabb = other.world.preAabb;

        // if ball was not entring from above then it doesn't count
        if (otherPreAabb.yMin <= self.world.aabb.yMin) {
            return;
        }

        if (this.hoopState === "contacted") {
            this.node.dispatchEvent(new cc.Event.EventCustom("hit", true));
        } else {
            this.node.dispatchEvent(new cc.Event.EventCustom("swish", true));
        }
        this.animation.play("hoop_zoom_out");
        this.node.runAction(cc.scaleBy(0.2, 1.2, 1.2));
        this.togglePhysics(false);

        this.hitCollider.enabled = false;
    }

    onAnimationComplete() {
        this.recycle();
    }

    onBeginContact() {
        this.hoopState = "contacted";
        cc.director.emit("contact");
    }

    init(options: HoopOptions) {
        this.recycle = options.recycle;

        this.calculateScale(options.hoopCount);
        this.calculateAngle(options.hoopCount);

        this.hitCollider.enabled = true;
        this.node.opacity = 255;
        this.togglePhysics(true);
        this.hoopState = null;
    }

    private togglePhysics(state: boolean) {
        this.getComponent(cc.RigidBody).active = state;
    }

    private calculateScale(hoopCount: number) {
        // decrease sclae by [scaleDifficultyFactor] every [scaleN] hoops
        const newScale =
            this.hoop.startingScale -
            this.hoop.scaleDifficultyFactor * Math.floor(hoopCount / this.hoop.scaleN);
        this.node.scale = newScale < this.hoop.minScale ? this.hoop.minScale : newScale;
    }

    private calculateAngle(hoopCount: number) {
        let angleFactor = 0; // range 0 ~ 1

        this.node.rotation = 0;

        angleFactor = this.hoop.angleDifficultyFactor * Math.floor(hoopCount / this.hoop.angleN);
        angleFactor = angleFactor > 1 ? 1 : angleFactor;

        if (Math.random() < angleFactor) {
            const maxAngle = this.hoop.maxAngle * angleFactor;
            const minAngle = this.hoop.minAngle * angleFactor;
            this.node.rotation = maxAngle - (maxAngle - minAngle) * Math.random();
        }
    }
}
