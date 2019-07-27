const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopModel extends cc.Component {
    @property
    startingScale: number = 1.6;

    @property
    minScale: number = 1.15;
}
