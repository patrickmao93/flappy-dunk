const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {
    @property(cc.AudioClip)
    hop: cc.AudioClip;

    @property(cc.AudioClip)
    hit: cc.AudioClip;

    @property(cc.AudioClip)
    swish: cc.AudioClip;

    playHop() {
        cc.audioEngine.play(this.hop, false, 0.1);
    }
    playHit() {
        cc.audioEngine.play(this.hit, false, 0.5);
    }
    playSwish() {
        cc.audioEngine.play(this.swish, false, 0.5);
    }
}
