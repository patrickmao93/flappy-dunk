import HoopController from "./HoopController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SliderHoopController extends HoopController {
    sliderLength: number = 0;
    sliderSpeed: number = 0;

    init(x: number, hoopCount: number, recycle: Function) {
        super.init(x, hoopCount, recycle);

        let sliderLength =
            this.hoop.sliderDifficultyFactor * Math.floor(hoopCount / this.hoop.sliderN);

        console.log("sliderLength", sliderLength);
    }
}
