import BackgroundController from "../Background/BackgroundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollController extends cc.Component {
    @property(cc.Prefab)
    BackgroundPrefab: cc.Prefab;

    @property
    defaultScrollSpeed: number = 100;

    @property(cc.Node)
    bgContainer: cc.Node;

    private bg1: cc.Node;
    private bg1Ctrl: BackgroundController;
    private bg2: cc.Node;
    private bg2Ctrl: BackgroundController;

    private currentScrollSpeed: number = 0;

    onLoad() {
        this.bg1 = cc.instantiate(this.BackgroundPrefab);
        this.bg1Ctrl = this.bg1.getComponent("BackgroundController");

        this.bg2 = cc.instantiate(this.BackgroundPrefab);
        this.bg2Ctrl = this.bg2.getComponent("BackgroundController");

        this.bgContainer.addChild(this.bg1);
        this.bg1.setPosition(cc.v2(0, 0));

        this.bgContainer.addChild(this.bg2);
        this.bg2.setPosition(cc.v2(this.node.width, 0));
    }

    init(defaultScrollSpeed?: number) {
        if (defaultScrollSpeed) {
            this.defaultScrollSpeed = defaultScrollSpeed;
        }
    }

    startScrolling() {
        this.currentScrollSpeed = this.defaultScrollSpeed;
    }

    stopScrolling() {
        this.currentScrollSpeed = 0;
    }

    update(dt: number) {
        if (!this.bg1 || !this.bg2) return;

        if (this.bg1.x < -this.node.width) {
            this.bg1.x = this.node.width;
        }
        if (this.bg2.x < -this.node.width) {
            this.bg2.x = this.node.width;
        }
        this.bg1.x -= this.currentScrollSpeed * dt;
        this.bg2.x -= this.currentScrollSpeed * dt;
    }
}
