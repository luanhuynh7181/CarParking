import { _decorator, Component, director, Node, Vec3, screen } from 'cc';
import { Transition } from '../../utils/Transition';
const { ccclass, property } = _decorator;

@ccclass('SceneMainMenu')
export class SceneMainMenu extends Component {
    @property(Node)
    nodeGameName: Node = null!;

    @property(Node)
    nodePageView: Node = null!;

    @property(Node)
    nodeIcon: Node = null!;

    start() {
        screen.requestFullScreen();
        Transition.runIn(this.nodeGameName, new Vec3(0, 100, 0), 0.3);
        Transition.runIn(this.nodeIcon, new Vec3(0, -50, 0), 1);
        Transition.runIn(this.nodePageView, new Vec3(200, 0), 0.7);
    }

    onClickChooseMap(event: Event, mapIndex: string) {
        director.loadScene("SceneGame");
    }

}


