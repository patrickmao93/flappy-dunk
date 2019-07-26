import HoopController from "../Hoop/HoopController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BackgroundController extends cc.Component {
    // private hoop: cc.Node;
    // private hoopCtrl: HoopController;

    // onLoad() {
    //     this.hoop = cc.instantiate(this.HoopPrefab);
    //     this.hoopCtrl = this.hoop.getComponent("HoopController");
    //     this.node.addChild(this.hoop);
    // }

    init(x: number, y: number) {
        this.node.x = x;
        // this.hoop.setPosition(cc.v2(0, y));
        // this.hoopCtrl.init(cc.v2(0, y));
    }
}
