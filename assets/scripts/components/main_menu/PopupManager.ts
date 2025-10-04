import { _decorator, Component, instantiate, Node, Prefab, Size, tween, UIOpacity, Vec3, view } from 'cc';
import { Transition } from './Transition';
const { ccclass, property } = _decorator;

@ccclass('PopupManager')
export class PopupManager extends Component {
    @property(Node)
    private nodePopups: Node = null!;

    @property(Prefab)
    popupSettingPrefab: Prefab = null!;
    private nodePopupSetting: Node | null = null;

    @property(Prefab)
    popupLeaderboardPrefab: Prefab = null!;
    private nodePopupLeaderboard: Node | null = null;

    @property(Prefab)
    popupTutorialPrefab: Prefab = null!;
    private nodePopupTutorial: Node | null = null;

    @property(Node)
    private btnBack: Node = null!;

    private currentPopup: Node | null = null;
    start() {
        this.btnBack.active = false;
        Transition.updateOrgPos(this.btnBack);
    }


    onScreenResize(designResolution: Size, screenResolution: Size) {
        Transition.updateOrgPos(this.btnBack);
    }

    hideCurrentPopup() {
        if (this.currentPopup) {
            this.currentPopup.active = false;
        }
        this.currentPopup = null;
    }

    onShowPopup(popup: Node) {
        this.currentPopup = popup;
        popup.active = true;
        Transition.runIn(this.btnBack, new Vec3(-100, 0, 0));
        Transition.runIn(popup, new Vec3(0, 200, 0));
        const imgFog = this.nodePopups.getChildByName("btn_fog");
        if (imgFog) {
            imgFog.active = true;
            let opacity = imgFog.getComponent(UIOpacity);
            opacity.opacity = 0;
            tween(opacity)
                .to(0.2, { opacity: 100 })
                .start();
        }
    }

    onClickBack() {
        Transition.runOut(this.btnBack, new Vec3(-100, 0, 0));
        const imgFog = this.nodePopups.getChildByName("btn_fog");
        if (imgFog) {
            const opacity = imgFog.getComponent(UIOpacity);
            tween(opacity)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    imgFog.active = false;
                })
                .start();
        }
        if (this.currentPopup) {
            Transition.runOut(this.currentPopup, new Vec3(0, 200, 0), 0.5);
        }
    }

    onClickSetting() {
        this.hideCurrentPopup();
        if (!this.nodePopupSetting) {
            this.nodePopupSetting = instantiate(this.popupSettingPrefab);
            this.nodePopups.addChild(this.nodePopupSetting);
            this.nodePopupSetting.setPosition(0, 0, 0);
        }
        this.onShowPopup(this.nodePopupSetting);
    }

    onClickLeaderboard() {
        this.hideCurrentPopup();
        if (!this.nodePopupLeaderboard) {
            this.nodePopupLeaderboard = instantiate(this.popupLeaderboardPrefab);
            this.nodePopups.addChild(this.nodePopupLeaderboard);
            this.nodePopupLeaderboard.setPosition(0, 0, 0);
        }
        this.onShowPopup(this.nodePopupLeaderboard);
    }

    onClickTutorial() {
        this.hideCurrentPopup();
        if (!this.nodePopupTutorial) {
            this.nodePopupTutorial = instantiate(this.popupTutorialPrefab);
            this.nodePopups.addChild(this.nodePopupTutorial);
            this.nodePopupTutorial.setPosition(0, 0, 0);
        }
        this.onShowPopup(this.nodePopupTutorial);
    }
}
