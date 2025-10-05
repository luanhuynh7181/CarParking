import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { ItemLeaderboard } from '../ItemLeaderboard';
const { ccclass, property } = _decorator;

@ccclass('PopupLeaderboard')
export class PopupLeaderboard extends Component {

    @property(Prefab)
    prefabItemLeaderboard: Prefab = null!;

    @property(Label)
    labelYouStar: Label = null!;

    @property(Node)
    nodeContent: Node = null!;

    // lbEmpty
    @property(Node)
    lbEmpty: Node = null!;

    start() {
        this.lbEmpty.active = false;
        this.labelYouStar.string = 'Your star: 100';
        for (let i = 0; i < 10; i++) {
            const item = instantiate(this.prefabItemLeaderboard);
            let itemScript = item.getComponent(ItemLeaderboard);
            itemScript.setData(i, 'Player ' + (i + 1), i * 100, 'https://avatar.iran.liara.run/public/44');
            this.nodeContent.addChild(item);
        }
    }
}


