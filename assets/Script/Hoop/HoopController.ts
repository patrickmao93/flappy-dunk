import HoopModel from "./HoopModel";

const { ccclass, property } = cc._decorator;

type HoopState = "contacted" | "missed";

@ccclass
export default class HoopController extends cc.Component {
    private model: HoopModel = null;
    private onOutOfBound: Function;
    private camera: cc.Node = null;

    private hoopState: HoopState;
    private scored: boolean = false;

    onLoad() {
        this.camera = this.node.parent.parent.getChildByName("Main Camera");
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        cc.director.getCollisionManager().enabled = true;

        this.model = this.getComponent(HoopModel);
    }

    init(x: number, difficulty: number, onOutOfBound: Function) {
        this.onOutOfBound = onOutOfBound;
        const hoopPosition = cc.v2(x, 100 - 200 * Math.random());
        this.node.setPosition(hoopPosition);
        difficulty = difficulty > 0 ? difficulty : 0;
        this.node.scale =
            this.model.startingScale - difficulty > this.model.minScale
                ? this.model.startingScale - difficulty
                : this.model.minScale;

        this.scored = false;
        this.hoopState = null;
    }

    update() {
        if (this.node.x < this.camera.x - this.camera.width) {
            this.onOutOfBound();
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
                cc.director.emit("swooshed");
            }
            this.scored = true;
        } else if (self.tag === 0) {
            if (!this.scored) {
                cc.director.emit("missed");
            }
        }
    }
}
