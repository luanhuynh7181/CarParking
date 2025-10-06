import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Path } from './Path';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PathManager')
export class PathManager extends Component {
    @property(Prefab)
    prefabPath: Prefab = null;

    pool: Path[] = [];
    nodeCameraAnchor: Node;
        
    onLoad(): void {
        GameManager.getInstance().setPathManager(this);
        this.pool = [];
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    getPath(): Path {
        let nodePath = instantiate(this.prefabPath);
        this.node.addChild(nodePath);
        return nodePath.getComponent(Path);
    }

    clearPaths() {
        this.node.removeAllChildren();
    }
}


