import { _decorator, Component, Node, ResolutionPolicy, Size, Vec3, view } from 'cc';
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

    onLoad() {
        window.addEventListener('resize', this.onResize.bind(this));
        // this.onResize();
    }

    onResize() {
        // view.setCanvasSize(window.innerWidth, window.innerHeight);
        // const designSize = view.getDesignResolutionSize();
        // view.setDesignResolutionSize(window.innerWidth, window.innerHeight, ResolutionPolicy.FIXED_HEIGHT);
        // console.log('onResize', window.innerWidth, window.innerHeight);
        // const designSize = new Size(1280, 720);
        // const viewSize = view.getVisibleSize();
        // this.popupManager.onScreenResize(designSize, viewSize);
    }

    start() {
        Transition.runIn(this.nodeGameName, new Vec3(0, 100, 0), 0.3);
        Transition.runIn(this.nodeIcon, new Vec3(0, -50, 0), 1);
        Transition.runIn(this.nodePageView, new Vec3(200, 0), 0.7);
    }

    onClickChooseMap(event: Event, mapIndex: string) {
    }

}


