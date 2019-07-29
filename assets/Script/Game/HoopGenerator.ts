import HoopController from "../Hoop/HoopController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopGenerator extends cc.Component {
    @property(cc.Prefab)
    HoopPrefab: cc.Prefab = null;

    @property
    distanceBetweenHoops = 700;

    private hoopsContainer: cc.Node = null;
    private hoopsPool: cc.NodePool = null;
    private camera: cc.Node = null;
    private cooldown = false;
    private hoopCount = 0;

    onLoad() {
        this.hoopsContainer = this.node.getChildByName("Hoops");
        this.camera = this.node.getChildByName("Main Camera");
        this.hoopsPool = new cc.NodePool();
        for (let i = 0; i < 3; i++) {
            const newHoop = cc.instantiate(this.HoopPrefab);
            this.hoopsPool.put(newHoop);
        }
    }

    init(ball: cc.Node) {}

    update(dt: number) {
        const self = this;
        // generate a hoop
        if (this.camera.x % this.distanceBetweenHoops < 5 && !this.cooldown) {
            this.cooldown = true;
            setTimeout(() => {
                self.cooldown = false;
            }, 1000);

            const hoop = this.hoopsPool.get();
            const hoopCtrl = hoop.getComponent(HoopController);

            this.hoopsContainer.addChild(hoop);
            hoopCtrl.init(this.camera.x + this.distanceBetweenHoops, this.hoopCount, () => {
                this.hoopsPool.put(hoop);
            });

            this.hoopCount += 1;
        }
    }
}
