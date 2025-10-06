import { _decorator, Component, Layout, Node, ResolutionPolicy, Size, UITransform, Vec3, view } from 'cc';
import { Transition } from '../../utils/Transition';
import { PopupManager } from './PopupManager';
const { ccclass, property } = _decorator;

@ccclass('SceneMainMenu')
export class SceneMainMenu extends Component {
    @property(Node)
    nodeGameName: Node = null!;

    @property(Node)
    nodePageView: Node = null!;

    @property(Node)
    nodeIcon: Node = null!;

    @property(PopupManager)
    popupManager: PopupManager = null!;

    @property(Node)
    private background: Node = null!;

    @property(Node)
    private nodeContent: Node = null!;

    start() {
        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
        Transition.runIn(this.nodeGameName, new Vec3(0, 100, 0), 0.3);
        Transition.runIn(this.nodeIcon, new Vec3(0, -50, 0), 1);
        Transition.runIn(this.nodePageView, new Vec3(200, 0), 0.7);
    }

    onResize() {
        view.setCanvasSize(window.innerWidth, window.innerHeight);
        const viewSize = view.getVisibleSize();
        this.background.getComponent(UITransform).setContentSize(viewSize.width, viewSize.height);
        this.popupManager.onScreenResize();

        const pageViewSize = new Size(viewSize.width, this.nodePageView.getComponent(UITransform).height);
        this.nodePageView.getComponent(UITransform).setContentSize(pageViewSize);
        this.nodeContent.getComponent(UITransform).setContentSize(pageViewSize);
    }

    onClickChooseMap(event: Event, mapIndex: string) {
    }

}


