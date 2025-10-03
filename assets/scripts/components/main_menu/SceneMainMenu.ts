import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneMainMenu')
export class SceneMainMenu extends Component {
    //  node parallax background
    @property(Node)
    private bgParallax: Node = null;
    private moveDir: Vec2 = new Vec2(-0.2, -1);
    start() {

    }

    update(deltaTime: number) {

    }
}


