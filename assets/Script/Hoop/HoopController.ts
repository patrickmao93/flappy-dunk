import HoopModel from "./HoopModel";
import GameModel from "../Game/GameModel";

const { ccclass, property } = cc._decorator;

type HoopState = "contacted" | "missed";

@ccclass
export default class HoopController extends cc.Component {
    private game: GameModel = null;
    private hoop: HoopModel = null;
    private hoopState: HoopState;
    private recycle: Function;
    private camera: cc.Node = null;
    private scored: boolean = false;
    private animation: cc.Animation;
    private hitCollider: cc.BoxCollider;
    private swishAnimation: cc.Animation;

    onLoad() {
        this.camera = this.node.parent.parent.getChildByName("Main Camera");
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

    init(x: number, hoopCount: number, game: GameModel, recycle: Function) {
        this.game = game;
        this.recycle = recycle;
        const canvas = this.node.parent.parent;
        const hoopPosition = cc.v2(x, (canvas.height / 2 - canvas.height * Math.random()) * 0.4);
        this.node.setPosition(hoopPosition);

        this.calculateScale(hoopCount);
        this.calculateAngle(hoopCount);

        this.hitCollider.enabled = true;
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

    calculateScale(hoopCount: number) {
        // decrease sclae by [scaleDifficultyFactor] every [scaleN] hoops
        const newScale =
            this.hoop.startingScale -
            this.hoop.scaleDifficultyFactor * Math.floor(hoopCount / this.hoop.scaleN);
        this.node.scale = newScale < this.hoop.minScale ? this.hoop.minScale : newScale;
    }

    calculateAngle(hoopCount: number) {
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
            this.scored = true;
        } else if (self.tag === 0) {
            cc.director.emit("game_over");
        }
        this.hitCollider.enabled = false;
    }

    togglePhysics(state: boolean) {
        this.getComponent(cc.RigidBody).active = state;
    }

    onAnimationComplete() {
        this.recycle();
    }
}
