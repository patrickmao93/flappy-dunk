const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopController extends cc.Component {
    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
    }
}
