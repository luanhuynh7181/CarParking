import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupSetting')
export class PopupSetting extends Component {

    @property(Node)

    @property(Node)
    btnMusic: Node = null!;

    @property(Node)
    btnSound: Node = null!;

    start() {
        this.updateStatus(this.btnMusic, 'isOffMusic');
        this.updateStatus(this.btnSound, 'isOffSound');
    }

    switchStatus(btn: Node, key: string) {
        localStorage.setItem(key, localStorage.getItem(key) === 'true' ? 'false' : 'true');
        this.updateStatus(btn, key);
    }

    updateStatus(btn: Node, key: string) {
        const isOff = localStorage.getItem(key) === 'true';
        btn.getComponent(Sprite).grayscale = isOff;
        btn.children[0].getComponent(Label).string = isOff ? 'OFF' : 'ON';

    }

    switchMusic() {
        this.switchStatus(this.btnMusic, 'isOffMusic');
    }

    switchSound() {
        this.switchStatus(this.btnSound, 'isOffSound');
    }

}


