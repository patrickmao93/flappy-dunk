import HoopModel from "./HoopModel";

const { ccclass, property } = cc._decorator;

type HoopState = "contacted" | "missed";
type HoopType = "static" | "slider";

interface HoopOptions {
    x: number;
    hoopCount: number;
    recycle: () => void;
}

@ccclass
export default class HoopController extends cc.Component {
    protected hoop: HoopModel = null;
    private hoopState: HoopState;
    private recycle: Function;
    private camera: cc.Node;
    private animation: cc.Animation;
    private hitCollider: cc.BoxCollider;
    private swishAnimation: cc.Animation;
    private canvas: cc.Node;

    onLoad() {
        this.camera = this.node.parent.parent.getChildByName("Main Camera");
        this.canvas = this.node.parent.parent;
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.hoop = this.getComponent(HoopModel);
        this.animation = this.getComponent(cc.Animation);
        this.hitCollider = this.getComponents(cc.BoxCollider).filter(
            collider => collider.tag === 1
        )[0];
        this.swishAnimation = this.node.getChildByName("SwishEffect").getComponent(cc.Animation);
    }

    init(type: HoopType, options: HoopOptions) {
        this.recycle = options.recycle;
        const hoopPosition = cc.v2(
            options.x,
            (this.canvas.height / 2 - this.canvas.height * Math.random()) * 0.4
        );
        this.node.setPosition(hoopPosition);

        this.calculateScale(options.hoopCount);
        this.calculateAngle(options.hoopCount);

        this.hitCollider.enabled = true;
        this.node.opacity = 255;
        this.togglePhysics(true);
        this.hoopState = null;
    }

    initSliderHoop() {
        // TODO
    }

    update() {
        if (this.node.x < this.camera.x - this.camera.width) {
            this.recycle();
        }
    }

    onBeginContact() {
        this.hoopState = "contacted";
        cc.director.emit("contact");
    }

    onCollisionEnter(other: cc.Collider & { world: any }, self: cc.Collider & { world: any }) {
        const otherPreAabb = other.world.preAabb;

        // if ball was not entring from above then it doesn't count
        if (otherPreAabb.yMin <= self.world.aabb.yMin) {
            return;
        }

        // 1 = touching hoop center, 2 = touching miss line
        if (self.tag === 1) {
            if (this.hoopState === "contacted") {
                cc.director.emit("hit");
            } else {
                cc.director.emit("swish");
                this.swishAnimation.play("swish_spark");
            }
            this.animation.play("hoop_zoom_out");
            this.node.runAction(cc.scaleBy(0.2, 1.2, 1.2));
            this.togglePhysics(false);
        } else if (self.tag === 0) {
            cc.director.emit("game_over");
        }
        this.hitCollider.enabled = false;
    }

    onAnimationComplete() {
        this.recycle();
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
        let minAngle = 0;
        let maxAngle = 0;

        this.node.rotation = 0;

        angleFactor = this.hoop.angleDifficultyFactor * Math.floor(hoopCount / this.hoop.angleN);
        angleFactor = angleFactor > 1 ? 1 : angleFactor;
        maxAngle = this.hoop.maxAngle * angleFactor;
        minAngle = this.hoop.minAngle * angleFactor;

        if (Math.random() < angleFactor) {
            this.node.rotation = maxAngle - (maxAngle - minAngle) * Math.random();
        }
    }
}
