const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {
    @property(cc.AudioClip)
    hop: cc.AudioClip = null;

    @property(cc.AudioClip)
    bounce: cc.AudioClip = null;

    @property(cc.AudioClip)
    swish: cc.AudioClip = null;

    @property(cc.AudioClip)
    whistle: cc.AudioClip = null;

    @property(cc.AudioClip)
    buzzer: cc.AudioClip = null;

    play(name: string) {
        const audioClipName = name.toLowerCase();
        if (!this[audioClipName]) {
            throw Error(`audio clip name ${name} not found!!`);
        }
        cc.audioEngine.play(this[audioClipName], false, 0.1);
    }
}
