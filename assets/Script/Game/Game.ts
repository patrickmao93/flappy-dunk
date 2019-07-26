import BallController from "../Ball/BallController";
import ScrollController from "./ScrollController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    BallPrefab: cc.Prefab;

    @property(cc.Vec2)
    playerSpawnPosition: cc.Vec2 = cc.v2(-200, 0);

    private scrollCtrl: ScrollController;

    private ball: cc.Node;
    private ballCtrl: BallController;

    onLoad() {
        this.initPlayer();
        this.initScrolling();
        this.registerInputEvents();
    }

    initPlayer() {
        this.ball = cc.instantiate(this.BallPrefab);
        this.ballCtrl = this.ball.getComponent("BallController");
        this.node.addChild(this.ball);
        this.ballCtrl.init(this.playerSpawnPosition);
    }

    initScrolling() {
        this.scrollCtrl = this.getComponent("ScrollController");
        this.scrollCtrl.init();
        this.scrollCtrl.startScrolling();
    }

    registerInputEvents() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.ballCtrl.hop();
        });
    }
}
