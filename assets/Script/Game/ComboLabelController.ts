const { ccclass, property } = cc._decorator;

@ccclass
export default class ComboLabelController extends cc.Component {
    animation: cc.Animation;
    label: cc.Label;

    onLoad() {
        this.node.active = false;
        this.animation = this.getComponent(cc.Animation);
        this.label = this.getComponent(cc.Label);
    }

    updateComboText(count: number) {
        if (count < 2) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        this.label.string = `SWISH!\nx${count}`;
        this.animation.play("appear_from_bottom");
    }
}
