import HoopController from "../Hoop/HoopController";
import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopGenerator extends cc.Component {
    @property(cc.Prefab)
    HoopPrefab: cc.Prefab = null;

    @property
    distanceBetweenHoops = 700;

    private game: GameModel = null;
    private hoopsContainer: cc.Node = null;
    private hoopsPool: cc.NodePool = null;
    private camera: cc.Node = null;
    private cooldown = false;

    onLoad() {
        this.hoopsContainer = this.node.getChildByName("Hoops");
        this.camera = this.node.getChildByName("Main Camera");
        this.hoopsPool = new cc.NodePool();
        for (let i = 0; i < 3; i++) {
            const newHoop = cc.instantiate(this.HoopPrefab);
            this.hoopsPool.put(newHoop);
        }
    }

    init(game: GameModel) {
        this.game = game;
    }

    update() {
        if (this.game && this.game.isPaused()) {
            return;
        }
        const self = this;
        // generate a hoop
        if (this.camera.x % this.distanceBetweenHoops < 5 && !this.cooldown) {
            this.cooldown = true;
            setTimeout(() => {
                self.cooldown = false;
            }, 1000);

            const hoop = this.hoopsPool.get();
            const hoopCtrl = hoop.getComponent(HoopController);

            // Hack! Removing this line will cause hoop to show for 1 frame at the beginning
            if (this.game.getHoopCount() < 1) {
                hoop.getChildByName("HoopBody").setPosition(1000, 0);
            }
            this.hoopsContainer.addChild(hoop);

            hoopCtrl.init("static", {
                x: this.camera.x + this.distanceBetweenHoops,
                hoopCount: this.game.getHoopCount(),
                recycle: () => {
                    this.hoopsPool.put(hoop);
                }
            });

            this.game.incHoopCount();
        }
    }
}
