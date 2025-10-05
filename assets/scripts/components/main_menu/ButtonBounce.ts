import { _decorator, Button, Component, Node, Tween, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonBounce')
export class ButtonBounce extends Component {
    private scaleTo: number = 1.1;
    private scaleTime: number = 0.07;
    private scaleOrg: number = 1;
    start() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseCancel, this);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchEnd, this);
        this.scaleOrg = this.node.scale.x;
        this.scaleTo = this.scaleOrg * 1.1;
    }

    onMouseEnter() {
        const node = this.node;
        tween(node).to(this.scaleTime, { scale: v3(this.scaleTo, this.scaleTo, this.scaleTo) }).
            tag(1).
            start()
    }

    onMouseCancel() {
        const node = this.node;
        tween(node).to(this.scaleTime, { scale: v3(this.scaleOrg, this.scaleOrg, this.scaleOrg) }).
            tag(1).
            start()
    }

    onTouchEnd() {
        // BackgroundSound.instance.playClickButton();
    }
}


