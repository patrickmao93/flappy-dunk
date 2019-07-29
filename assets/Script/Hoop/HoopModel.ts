const { ccclass, property } = cc._decorator;

@ccclass
export default class HoopModel extends cc.Component {
    @property
    startingScale: number = 1.6;

    @property
    minScale: number = 1.15;

    @property
    minAngle: number = -70;

    @property
    maxAngle: number = 15;

    @property
    scaleN: number = 12; // increase scale difficulty every N hoops

    @property
    scaleDifficultyFactor: number = 0.1; // decrease scale by 0.1 every time

    @property
    angleN: number = 4;

    @property
    angleDifficultyFactor: number = 0.1; // increase angle odds by 0.1 every time
}
