import { _decorator, Component, Node, Size, tween, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundMovement')
export class BackgroundMovement extends Component {

    @property(Node)
    private nodeBackgroundParallax: Node = null;

    @property
    public parallaxDistance: number = 251;
    private direction: Vec3 = new Vec3(-0.2, -1, 0);
    private nodesBackground: Node[] = [];

    start() {
        this.nodesBackground = this.nodeBackgroundParallax.children;
        this.runActionBackgroundMovement();
    }

    onScreenResize(designResolution: Size, screenResolution: Size) {
        const ratio = screenResolution.width / designResolution.width;
        this.nodeBackgroundParallax.setScale(ratio, ratio);
    }

    runActionBackgroundMovement() {
        const screenSize: Size = view.getVisibleSize();
        const height = screenSize.height;
        const time = 60;
        const posTo = this.getTargetPositionByHeight(-height / 2 - this.parallaxDistance);
        const posFrom = this.getTargetPositionByHeight(-height / 2 - this.parallaxDistance + this.parallaxDistance * this.nodesBackground.length);
        const moveNode = (node: Node) => {
            tween(node)
                .call(() => {
                    node.setPosition(posFrom);
                })
                .to(time, { position: posTo })
                .union()
                .repeatForever()
                .start();
        }

        for (let i = 0; i < this.nodesBackground.length; i++) {
            const node = this.nodesBackground[i];
            const start = (-height / 2 - this.parallaxDistance) + this.parallaxDistance * i;
            node.setPosition(this.getTargetPositionByHeight(start));
            tween(node)
                .to(time / this.nodesBackground.length * i, { position: posTo })
                .call(() => {
                    moveNode(node);
                })
                .start();
        }

    }

    getTargetPositionByHeight(height: number): Vec3 {
        const dirNormalized = this.direction.normalize();
        const t = height / Math.abs(dirNormalized.y);
        return new Vec3(t, height, 0);
    }

}


