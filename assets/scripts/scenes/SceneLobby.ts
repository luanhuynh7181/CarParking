import { _decorator, Component, director, Node , screen} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneLobby')
export class SceneLobby extends Component {
    start() {
        screen.requestFullScreen();
    }

    update(deltaTime: number) {
        
    }

    startGane() {
        director.loadScene("SceneGame");
    }
}


