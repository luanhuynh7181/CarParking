import { _decorator, Component, instantiate, Node, Prefab, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneMainMenu')
export class SceneMainMenu extends Component {
    @property(Prefab)
    popupSettingPrefab: Prefab = null!;
    private popupInstance: Node | null = null;
    @property(Node)
    private nodePopups: Node = null!;
    start() {

    }

    onClickLeaderboard() {
    }

    onClickSetting() {
        console.log(":popupsetting")
        if (!this.popupInstance) {
            this.popupInstance = instantiate(this.popupSettingPrefab);
            console.log(this.popupInstance);
            this.nodePopups.addChild(this.popupInstance);
            this.popupInstance.setPosition(0, 0, 0);
        } else {
            this.popupInstance.active = true;
        }
        console.log("onClickSetting");
    }

}


