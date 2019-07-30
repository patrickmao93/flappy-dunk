const { ccclass, property } = cc._decorator;

@ccclass
export default class BackgroundController extends cc.Component {
    init(x: number) {
        this.node.x = x;
    }
}
