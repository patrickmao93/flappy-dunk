import BackgroundController from "../Background/BackgroundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollController extends cc.Component {
    @property(cc.Prefab)
    BackgroundPrefab: cc.Prefab;

    @property(cc.Node)
    bgContainer: cc.Node;

    private camera: cc.Node = null;

    private bg1: cc.Node;
    private bg1Ctrl: BackgroundController;
    private bg2: cc.Node;
    private bg2Ctrl: BackgroundController;

    onLoad() {
        this.camera = this.node.getChildByName("Main Camera");

        this.bg1 = cc.instantiate(this.BackgroundPrefab);
        this.bg1Ctrl = this.bg1.getComponent("BackgroundController");

        this.bg2 = cc.instantiate(this.BackgroundPrefab);
        this.bg2Ctrl = this.bg2.getComponent("BackgroundController");

        this.bgContainer.addChild(this.bg1);
        this.bg1Ctrl.init(0, 12);

        this.bgContainer.addChild(this.bg2);
        this.bg2Ctrl.init(this.node.width, -50);
    }

    init() {}

    update(dt: number) {
        if (this.bg1.x < this.camera.x - this.node.width) {
            this.bg1Ctrl.init(this.camera.x + this.node.width, 50 - 100 * Math.random());
        }
        if (this.bg2.x < this.camera.x - this.node.width) {
            this.bg2Ctrl.init(this.camera.x + this.node.width, 50 - 100 * Math.random());
        }
    }
}
