import { _decorator, Component, Label, Node, Size, Sprite, Vec3 } from 'cc';
import { AudioManager } from '../../../managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('PopupSetting')
export class PopupSetting extends Component {

    @property(Node)

    @property(Node)
    btnMusic: Node = null!;

    @property(Node)
    btnSound: Node = null!;

    start() {
        this.updateStatus(this.btnMusic, AudioManager.instance.isMusicOn);
        this.updateStatus(this.btnSound, AudioManager.instance.isSoundOn);
    }

    onScreenResize(designResolution: Size, screenResolution: Size) {
    }

    updateStatus(btn: Node, isOn: boolean) {
        btn.getComponent(Sprite).grayscale = !isOn;
        btn.children[0].getComponent(Label).string = isOn ? 'ON' : 'OFF';

    }

    switchMusic() {
        AudioManager.instance.toggleMusic();
        this.updateStatus(this.btnMusic, AudioManager.instance.isMusicOn);
    }

    switchSound() {
        AudioManager.instance.toggleSound();
        this.updateStatus(this.btnSound, AudioManager.instance.isSoundOn);
    }

}


