import { _decorator, Component, Node, Size, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundMovement')
export class BackgroundMovement extends Component {
    @property(Node)
    private nodeBackgroundParallax: Node = null;

    private direction: Vec3 = new Vec3(-0.2, -1, 0);
    private nodesBackground: Node[] = [];

    start() {
        this.nodesBackground = this.nodeBackgroundParallax.children;
        this.setupBackground();
    }

    setupBackground() {
        const screenSize: Size = view.getVisibleSize();
        const start = 0.25;
        for (let i = 0; i < this.nodesBackground.length; i++) {
            const node = this.nodesBackground[i];
            const target = this.getTargetPoint((start - i) * screenSize.height / 2);
            node.setPosition(target);
            return;
        }
    }

    getTargetPoint(height: number): Vec3 {
        const dirNormalized = this.direction.normalize();
        const t = height / Math.abs(dirNormalized.y);
        const target = dirNormalized.multiplyScalar(t);
        return target;
    }

}


