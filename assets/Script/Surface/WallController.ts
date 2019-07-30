const { ccclass, property } = cc._decorator;

@ccclass
export default class WallController extends cc.Component {
    update() {
        this.node.x = 0;
    }

    onBeginContact() {
        cc.director.emit("game_over");
    }
}
