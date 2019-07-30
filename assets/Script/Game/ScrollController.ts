import BackgroundController from "../Background/BackgroundController";
import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollController extends cc.Component {
    @property(cc.Prefab)
    BackgroundPrefab: cc.Prefab = null;

    @property(cc.Node)
    bgContainer: cc.Node = null;

    private game: GameModel = null;
    private camera: cc.Node = null;
    private bg1: cc.Node = null;
    private bg1Ctrl: BackgroundController = null;
    private bg2: cc.Node = null;
    private bg2Ctrl: BackgroundController = null;

    onLoad() {
        this.camera = this.node.getChildByName("Main Camera");

        this.bg1 = cc.instantiate(this.BackgroundPrefab);
        this.bg1Ctrl = this.bg1.getComponent("BackgroundController");

        this.bg2 = cc.instantiate(this.BackgroundPrefab);
        this.bg2Ctrl = this.bg2.getComponent("BackgroundController");

        this.bgContainer.addChild(this.bg1);
        this.bg1Ctrl.init(0);

        this.bgContainer.addChild(this.bg2);
        this.bg2Ctrl.init(this.node.width);
    }

    init(game: GameModel) {
        this.game = game;
    }

    update() {
        if (this.game && this.game.isPaused()) {
            return;
        }
        if (this.bg1.x < this.camera.x - this.node.width) {
            this.bg1Ctrl.init(this.camera.x + this.node.width);
        }
        if (this.bg2.x < this.camera.x - this.node.width) {
            this.bg2Ctrl.init(this.camera.x + this.node.width);
        }
    }
}
