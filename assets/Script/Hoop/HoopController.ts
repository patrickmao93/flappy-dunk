import HoopModel from "./HoopModel";
import HoopBodyController from "./HoopBodyController";

const { ccclass, property } = cc._decorator;

type HoopType = "static" | "slider";

export interface HoopOptions {
    x: number;
    hoopCount: number;
    recycle: () => void;
}

@ccclass
export default class HoopController extends cc.Component {
    @property(cc.Node)
    hoopBody: cc.Node = null;

    private recycle: Function;
    private camera: cc.Node;
    private animation: cc.Animation;
    private hoopBodyCtrl: HoopBodyController;
    private isHoopHit = false;

    onLoad() {
        this.hoopBodyCtrl = this.hoopBody.getComponent(HoopBodyController);
        this.camera = this.node.parent.parent.getChildByName("Main Camera");
        cc.director.getCollisionManager().enabled = true;
        this.animation = this.node.getChildByName("Effect").getComponent(cc.Animation);
        this.initEvents();
    }

    update() {
        if (this.node.x < this.camera.x - this.camera.width) {
            this.recycle();
        }
    }

    // touching miss line
    onCollisionEnter() {
        if (this.isHoopHit) return;
        cc.director.emit("game_over");
    }

    init(type: HoopType, options: HoopOptions) {
        this.recycle = options.recycle;
        this.initPosition(options);
        this.isHoopHit = false;

        // init hoop body
        this.hoopBodyCtrl.init(options);

        if (type === "slider") {
            // TODO
        }
    }

    private initPosition(options: HoopOptions) {
        const hoopPosition = cc.v2(options.x, (1280 / 2 - 720 * Math.random()) * 0.4);
        this.node.setPosition(hoopPosition);
    }

    private initEvents() {
        this.node.on("swish", (e: cc.Event) => {
            e.stopPropagation();
            cc.director.emit("swish");
            this.animation.play("swish_spark");
            this.isHoopHit = true;
        });

        this.node.on("hit", (e: cc.Event) => {
            e.stopPropagation();
            cc.director.emit("hit");
            this.isHoopHit = true;
        });
    }
}
