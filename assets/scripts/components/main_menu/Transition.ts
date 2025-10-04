
import { Node, Tween, tween, UIOpacity, v3, Vec3 } from 'cc';

export class Transition {
    constructor() {
    }


    private static ensureOpacity(node: Node): UIOpacity {
        let opacity = node.getComponent(UIOpacity);
        if (!opacity) {
            opacity = node.addComponent(UIOpacity);
        }
        return opacity;
    }

    public static updateOrgPos(node: any) {
        node.orgPos = node.getPosition().clone();
    }


    public static runIn(node: any, direction: Vec3, duration: number = 0.3) {
        Tween.stopAllByTarget(node);
        if (!node.orgPos) Transition.updateOrgPos(node);
        const newPos = new Vec3();
        Vec3.add(newPos, node.orgPos, direction);
        node.setPosition(newPos);
        node.active = true;
        const opacity = Transition.ensureOpacity(node);
        opacity.opacity = 0;

        tween(node)
            .to(duration, { position: node.orgPos }, { easing: "backIn" })
            .start();

        tween(opacity).to(duration, { opacity: 255 }).start();
    }

    public static runOut(node: any, direction: Vec3, duration: number = 0.3) {
        Tween.stopAllByTarget(node);
        if (!node.orgPos) Transition.updateOrgPos(node);
        const newPos = new Vec3();
        Vec3.add(newPos, node.orgPos, direction);
        const opacity = Transition.ensureOpacity(node);
        tween(node)
            .to(duration, { position: newPos }, { easing: "backOut" })
            .call(() => {
                node.active = false;
            })
            .start();

        tween(opacity).to(duration * 0.75, { opacity: 0 }).start();
    }
}


