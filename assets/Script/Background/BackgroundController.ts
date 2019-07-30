const { ccclass, property } = cc._decorator;

@ccclass
export default class BackgroundController extends cc.Component {
    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;

    private starPool: cc.NodePool = null;

    onLoad() {
        this.starPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            this.starPool.put(cc.instantiate(this.starPrefab));
        }

        setInterval(() => {
            const star = this.starPool.get();
            star.setPosition(-360 + 720 * Math.random(), -500 + 1000 * Math.random());
            this.node.addChild(star);
            star.getComponent(cc.Animation).play("star");
            star.rotation = Math.random() * 90;

            setTimeout(() => {
                this.starPool.put(star);
            }, 600);
        }, 300);
    }

    init(x: number) {
        this.node.x = x;
    }
}
