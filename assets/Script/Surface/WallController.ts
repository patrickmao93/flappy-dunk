const { ccclass, property } = cc._decorator;

@ccclass
export default class WallController extends cc.Component {
    onBeginContact() {
        cc.director.emit("player_died");
    }
}
