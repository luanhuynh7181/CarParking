import { _decorator, Component, director, Game, Label, Node, ParticleAsset, ParticleSystem2D, resources, tween, Vec2, screen, Mask, MaskType, Sprite, UITransform, SpriteFrame, Graphics, PhysicsSystem2D, EPhysics2DDrawFlags, Input, EventMouse, Camera, clamp, lerp, EventTouch, Vec3, PolygonCollider2D, view, Color } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('SceneGame')
export class SceneGame extends Component {
    gameManager: GameManager;

    lbScoreValue: Label;

    camera: Camera;

    NodeCameraAnchor: Node;

    isPinching: boolean = false;
    midPoint: Vec3 = new Vec3(0, 0, 0);
    baseDistance: number = 0;
    onLoad(): void {
        this.gameManager = GameManager.getInstance();
        this.gameManager.setSceneGame(this);
        this.lbScoreValue = this.node.getChildByName("NodeUI").getChildByName("NodeTopLeft").getChildByName("lbScoreValue").getComponent(Label);

        this.camera = this.node.getChildByName("Camera").getComponent(Camera);
        this.NodeCameraAnchor = this.node.getChildByName("NodeCameraAnchor");
        this.maskGround();
        // screen.requestFullScreen();
        this.node.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    setCameraOrthoHeight(height: number, pos?: Vec2) {
        this.camera.orthoHeight = clamp(height, 100, 360);
        if (pos) {
            this.moveCamera(pos.x, pos.y);
        } else {
            this.moveCamera(this.camera.node.position.x, this.camera.node.position.y);
        }
    }

    moveCamera(x: number, y: number) {
        this.camera.node.position = new Vec3(clamp(x, this.camera.orthoHeight * 640 / 360 - 640, 640 - this.camera.orthoHeight * 640 / 360), clamp(y, this.camera.orthoHeight - 360, 360 - this.camera.orthoHeight), 1000);
        this.NodeCameraAnchor.position = new Vec3(this.camera.node.position.x - this.camera.orthoHeight * 640 / 360, this.camera.node.position.y - this.camera.orthoHeight);
    }

    onMouseWheel(event: EventMouse) {
        const scrollSpeed = 10;
        this.setCameraOrthoHeight(this.camera.orthoHeight - event.getScrollY() / scrollSpeed);
    }
    onTouchStart(event: EventTouch) {
        var touches = event.getAllTouches();
        if (touches.length == 2) {
            var touch1 = touches[0], touch2 = touches[1];
            const anchorDelta = GameManager.getInstance().sceneGame.getCameraAnchorDelta();
            let touchPoint1 = touch1.getUILocation();
            touchPoint1.x = anchorDelta.x + touchPoint1.x * this.getCameraHeightRatio();
            touchPoint1.y = anchorDelta.y + touchPoint1.y * this.getCameraHeightRatio();
            touchPoint1.x += (- view.getVisibleSize().width / 2) * this.getCameraHeightRatio();
            touchPoint1.y -= view.getVisibleSize().height / 2;

            let touchPoint2 = touch2.getUILocation();
            touchPoint2.x = anchorDelta.x + touchPoint2.x * this.getCameraHeightRatio();
            touchPoint2.y = anchorDelta.y + touchPoint2.y * this.getCameraHeightRatio();
            touchPoint2.x += (- view.getVisibleSize().width / 2) * this.getCameraHeightRatio();
            touchPoint2.y -= view.getVisibleSize().height / 2;

            this.midPoint = new Vec3(touchPoint1.x/2 + touchPoint2.x / 2, touchPoint1.y / 2 + touchPoint2.y /2 , 0);

            this.isPinching = true;
            this.baseDistance = Vec2.distance(touchPoint1,touchPoint2);

            // DEBUG
            // this.getNodeMidPoint().position = this.midPoint;
            // const graphics = this.getNodeBaseDistance().getComponent(Graphics);
            // graphics.clear();
            // graphics.moveTo(touchPoint1.x, touchPoint1.y)
            // graphics.lineTo(touchPoint2.x, touchPoint2.y);
            // graphics.lineWidth = 4;
            // graphics.stroke();
            // this.getNodeTouchPoint1().position = touchPoint1.toVec3();
            // this.getNodeTouchPoint2().position = touchPoint2.toVec3();
            // DEBUG
        }
    }

    getNodeMidPoint() {
        if (!this.node.getChildByName("NodeMidPoint")) {
            const nodeMidPoint = new Node();
            this.node.addChild(nodeMidPoint);
            const uiTF = nodeMidPoint.addComponent(UITransform);
            uiTF.width = 100;
            uiTF.height = 100;
            const box = uiTF.getBoundingBox();
            const graphics = nodeMidPoint.addComponent(Graphics);
            graphics.rect(box.x, box.y, box.width, box.height);
            graphics.fill();
            nodeMidPoint.name = "NodeMidPoint";
        }
        return this.node.getChildByName("NodeMidPoint");
    }

    getNodeTouchPoint1() {
        if (!this.node.getChildByName("getNodeTouchPoint1")) {
            const nodeMidPoint = new Node();
            this.node.addChild(nodeMidPoint);
            const uiTF = nodeMidPoint.addComponent(UITransform);
            uiTF.width = 100;
            uiTF.height = 100;
            const box = uiTF.getBoundingBox();
            const graphics = nodeMidPoint.addComponent(Graphics);
            graphics.rect(box.x, box.y, box.width, box.height);
            graphics.fillColor = Color.BLACK;
            graphics.fill();
            nodeMidPoint.name = "getNodeTouchPoint1";
        }
        return this.node.getChildByName("getNodeTouchPoint1");
    }

    getNodeTouchPoint2() {
        if (!this.node.getChildByName("getNodeTouchPoint2")) {
            const nodeMidPoint = new Node();
            this.node.addChild(nodeMidPoint);
            const uiTF = nodeMidPoint.addComponent(UITransform);
            uiTF.width = 100;
            uiTF.height = 100;
            const box = uiTF.getBoundingBox();
            const graphics = nodeMidPoint.addComponent(Graphics);
            graphics.rect(box.x, box.y, box.width, box.height);
            graphics.fillColor = Color.YELLOW;
            graphics.fill();
            nodeMidPoint.name = "getNodeTouchPoint2";
        }
        return this.node.getChildByName("getNodeTouchPoint2");
    }

    onTouchMove(event: EventTouch) {
        var touches = event.getAllTouches();
        if (this.isPinching) {
            var touch1 = touches[0],
                touch2 = touches[1];
            const anchorDelta = GameManager.getInstance().sceneGame.getCameraAnchorDelta();
            let touchPoint1 = touch1.getUILocation();
            touchPoint1.x = anchorDelta.x + touchPoint1.x * this.getCameraHeightRatio();
            touchPoint1.y = anchorDelta.y + touchPoint1.y * this.getCameraHeightRatio();
            touchPoint1.x += (- view.getVisibleSize().width / 2) * this.getCameraHeightRatio();
            touchPoint1.y -= view.getVisibleSize().height / 2;

            let touchPoint2 = touch2.getUILocation();
            touchPoint2.x = anchorDelta.x + touchPoint2.x * this.getCameraHeightRatio();
            touchPoint2.y = anchorDelta.y + touchPoint2.y * this.getCameraHeightRatio();
            touchPoint2.x += (- view.getVisibleSize().width / 2) * this.getCameraHeightRatio();
            touchPoint2.y -= view.getVisibleSize().height / 2;

            let distance = Vec2.distance(touchPoint1, touchPoint2);
            let currentOrthoHeight = this.getCameraOrthoHeight();
            const speedPinching = 1;
            let posCam = new Vec2(lerp(this.camera.node.position.x, this.midPoint.x, 0.7), lerp(this.camera.node.position.y, this.midPoint.y, 0.7));
            if (distance > this.baseDistance) {
                // zoom in
                this.setCameraOrthoHeight(currentOrthoHeight - 5, posCam);
            } else {
                this.setCameraOrthoHeight(currentOrthoHeight + 5, posCam);
            }
        } else {
            console.log("Screen move: ", event.getUILocation());
            let currentPos = this.camera.node.position;
            const speed = 1.2;
            this.moveCamera(currentPos.x - event.getDeltaX() * speed, currentPos.y - event.getDeltaY() * speed);
        }
    }
    onTouchEnd(event: EventTouch) { 
        if (event.getAllTouches().length < 2) {
            this.isPinching = false;
            this.baseDistance = 0;
        }
    }
    onTouchCancel(event: EventTouch) {
        if (event.getAllTouches().length < 2) {
            this.isPinching = false;
            this.baseDistance = 0;
        }
    }

    async maskGround() {
        const nodeMap = this.node.getChildByName("NodeGame").getChildByName("NodeMap");
        for (let i = 0; i < nodeMap.children.length; ++i) {
            const child = nodeMap.children[i];
            if (child.name != "Ground")
                continue;
            const nodeMask = new Node();
            const mask = nodeMask.addComponent(Mask);
            mask.type = MaskType.SPRITE_STENCIL;
            const maskSprite = nodeMask.getComponent(Sprite);
            maskSprite.spriteFrame = child.getComponent(Sprite).spriteFrame;
            const maskUITransform = nodeMask.addComponent(UITransform);
            maskUITransform.width = child.getComponent(UITransform).width;
            maskUITransform.height = child.getComponent(UITransform).height;

            mask.inverted = false;

            const nodeColor = new Node();
            const colorUITransform = nodeColor.addComponent(UITransform);
            const colorSprite = nodeColor.addComponent(Sprite);
            resources.load("textures/road/pattern_ground/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error("Failed to load particle asset:", err);
                    return;
                }
                colorSprite.spriteFrame = spriteFrame;
                colorUITransform.width = 2000;
                colorUITransform.height = 2000;
            });
            nodeMask.addChild(nodeColor);
            child.addChild(nodeMask);

            // const nodeGraphic = new Node();
            // child.addChild(nodeGraphic);
            // const graphics = nodeGraphic.addComponent(Graphics);
            // const box = child.getComponent(UITransform).getBoundingBox();
            // graphics.rect(box.x, box.y, box.width, box.height);
            // graphics.fill();



            // child.getComponent(PolygonCollider2D).enabled = false;
        }
    }

    start() {
        this.setCameraOrthoHeight(180);
    }

    update(deltaTime: number) {
        this.gameManager.update(deltaTime);
    }

    setScore(score: number) {
        this.lbScoreValue.string = score + "";
    }

    setLife(life: number) {
        const nodeLive = this.node.getChildByName("NodeUI").getChildByName("NodeTopLeft").getChildByName("nodeLive");
        let child = nodeLive.children.forEach((node, index) => {
            if (index < life) {
                node.active = true;
            } else {
                node.active = false;
            }
        })
    }

    showBoom(pos: Vec2) {
        console.log("BOOM: ", pos);
        let node = new Node("effect");
        const particleSystem = node.addComponent(ParticleSystem2D);
        resources.load("particles/boom", ParticleAsset, (err, particleAsset) => {
            if (err) {
                console.error("Failed to load particle asset:", err);
                return;
            }
            particleSystem.file = particleAsset;
            particleSystem.playOnLoad = true; // Optionally, start playing immediately
        });

        particleSystem.autoRemoveOnFinish = true;
        particleSystem.duration = 1;

        const nodeEffect = this.node.getChildByName("NodeEffect");
        nodeEffect.addChild(node);
        node.setPosition(pos.toVec3());
        setTimeout(() => {
            node.removeFromParent();
        }, 1000);

        // const nodeBoom = this.node.getChildByName("NodeEffect").getChildByName("NodeBoom");
        // nodeBoom.setPosition(pos.toVec3());
        // nodeBoom.active = true;
        // setTimeout(() => {
        //     nodeBoom.active = false;
        // },500);
    }

    showGameOver(score: number) {
        const nodeGameOver = this.node.getChildByName("NodeUI").getChildByName("NodeGameOver");
        nodeGameOver.active = true;
        nodeGameOver.getChildByName("lbScore").getComponent(Label).string = score + "";
    }

    pauseGame() {
        console.log("Pause game");
    }

    playAgain() {
        console.log("Play Again");
        const nodeGameOver = this.node.getChildByName("NodeUI").getChildByName("NodeGameOver");
        nodeGameOver.active = false;
        // director.loadScene("SceneLobby");
        this.gameManager.startGame();
    }

    cheat() {
        PhysicsSystem2D.instance.debugDrawFlags = ((PhysicsSystem2D.instance.debugDrawFlags == EPhysics2DDrawFlags.All) ? EPhysics2DDrawFlags.None : EPhysics2DDrawFlags.All);
    }

    getNodeCameraAnchor() {
        return this.NodeCameraAnchor;
    }

    getCameraAnchorDelta() {
        const pos = this.getNodeCameraAnchor().getPosition();
        console.log("POIS: ", pos);
        return new Vec2(pos.x + 640, pos.y + 360);
    }

    getCameraOrthoHeight() {
        return this.camera.orthoHeight;
    }

    getCameraHeightRatio() {
        return this.getCameraOrthoHeight() / 360;
    }
}