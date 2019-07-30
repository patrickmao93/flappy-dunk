const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {
    @property(cc.AudioClip)
    hop: cc.AudioClip;

    @property(cc.AudioClip)
    bounce: cc.AudioClip;

    @property(cc.AudioClip)
    swish: cc.AudioClip;

    @property(cc.AudioClip)
    whistle: cc.AudioClip;

    play(name: string) {
        const audioClipName = name.toLowerCase();
        if (!this[audioClipName]) {
            throw Error(`audio clip name ${name} not found!!`);
        }
        cc.audioEngine.play(this[audioClipName], false, 0.1);
    }
}
