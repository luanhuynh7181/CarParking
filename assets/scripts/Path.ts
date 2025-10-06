import { _decorator, Color, Component, EventTouch, Game, Graphics, Input, Mat4, Node, Sprite, UITransform, Vec2, Vec3, view } from 'cc';
import { ParkingLotManager } from './ParkingLotManager';
import { GameManager } from './GameManager';
import { Car } from './Car';
const { ccclass, property } = _decorator;

@ccclass('Path')
export class Path extends Component {
    positions: Vec2[] = [];
    sprHead: Sprite;
    @property(Graphics)
    graphics: Graphics | null = null;

    parkingLotManager: ParkingLotManager = null;
    _isMatchPark: boolean;
    _isGettingOut: boolean = false;
    _isMatchOut: boolean = false;
    _isDrawing: boolean = false;

    _deltaX: number = 0;
    _car: Car;

    onLoad(): void {
        this.sprHead = this.node.getChildByName("sprHead").getComponent(Sprite);
        this.sprHead.node.on(Input.EventType.TOUCH_START,this.onTouchHeadStart,this);
        this.sprHead.node.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.sprHead.node.on(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        this.sprHead.node.on(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
        this.graphics = this.node.getChildByName("nodeGraphics").getComponent(Graphics);
        this.reset();
        this._deltaX = - view.getVisibleSize().width / 2 + view.getDesignResolutionSize().width / 2; // chech lech X giua world position va design position khi choi tren screen != design size tai diem (0,0) cua root scene va (0,0) cua windows screen
    }

    reset() {
        this.graphics.clear();
        this.sprHead.node.position = new Vec3(0,0,0);
        this.sprHead.node.active = false;
        this._isMatchPark = false;
    }

    getPositions() {
        return this.positions;
    }

    slicePositions(moveIndex:number) {
        this.positions = this.positions.slice(moveIndex);
        this.reDrawPath();
    }

    reDrawPath() {
        if (this.positions.length === 0) {
            return;
        }
        this.graphics.clear();
        this.graphics.moveTo(this.positions[0].x, this.positions[0].y)
        for (let i = 1; i < this.positions.length; ++i) {
            this.graphics.lineTo(this.positions[i].x, this.positions[i].y);
        }
        this.graphics.stroke();
    }

    onTouchHeadStart(event: EventTouch) {
        this._isMatchPark = false;
        this._isMatchOut = false;
        this._isDrawing = true;
        event.propagationStopped = true;
    }

    onTouchStart(event: EventTouch) {
        this._isDrawing = true;
        this._isMatchPark = false;
        this._isMatchOut = false;
        this.sprHead.node.active = true;
        let startPos = event.getUILocation();
        const anchorDelta = GameManager.getInstance().sceneGame.getCameraAnchorDelta();
        startPos.x = anchorDelta.x + startPos.x * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        startPos.y = anchorDelta.y + startPos.y * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        startPos.x += this._deltaX * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        // startPos = event.getLocationInView();
        this.positions.length = 0;
        this.positions.push(startPos);
        this.graphics.clear();
        this.graphics.strokeColor = Color.WHITE;
        this.graphics.lineWidth = 5;
        this.graphics.moveTo(startPos.x, startPos.y);
        event.propagationStopped = true;
    }

    onTouchMove(event: EventTouch) {
        if (!this._isDrawing) {
            return;
        }
        const minDelta = 5;
        let currentPos = event.getUILocation();
        const anchorDelta = GameManager.getInstance().sceneGame.getCameraAnchorDelta();
        currentPos.x = anchorDelta.x + currentPos.x * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        currentPos.y = anchorDelta.y + currentPos.y * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        currentPos.x += this._deltaX * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        // currentPos = event.getLocationInView();

        if (this.positions.length === 0) {
            this.positions.push(currentPos);
                this.sprHead.node.position = currentPos.toVec3();
                this.graphics.moveTo(currentPos.x, currentPos.y); // todo check move or line
        } else {
            let lastPath = this.positions[this.positions.length - 1];
            if (Math.abs(currentPos.x - lastPath.x) > minDelta || Math.abs(currentPos.y - lastPath.y) > minDelta) {
                this.positions.push(currentPos);
                this.sprHead.node.position = currentPos.toVec3();
                this.sprHead.node.active = true;
                this.graphics.lineTo(currentPos.x, currentPos.y);
            }
        }
        let parkingLots = GameManager.getInstance().getParkingLotManager().getParkingLots();

        if (!this._isGettingOut) {
            parkingLots.forEach(parkingLot => {
                if (this._car.getCarType() !== parkingLot.getCarType()) {
                    return;
                }
                // return;
                let rectEntry = parkingLot.node.getChildByName("sprEntry").getComponent(UITransform).getBoundingBoxToWorld();
                rectEntry.x += this._deltaX;
                // let drawRect = parkingLot.node.getChildByName("sprEntry").getComponent(UITransform).getBoundingBox();
                // let nodeGraphics = parkingLot.node.getChildByName("nodeGraphics");
                // if (!nodeGraphics) {
                //     nodeGraphics = new Node();
                //     nodeGraphics.name = "nodeGraphics";
                //     parkingLot.node.addChild(nodeGraphics);
                // }
                // let graphics = nodeGraphics.getComponent(Graphics);
                // if (!graphics) {
                //     graphics = nodeGraphics.addComponent(Graphics);
                // }
                // graphics.rect(rectEntry.x,rectEntry.y,rectEntry.width,rectEntry.height);
                // graphics.fill();
                if (rectEntry.contains(currentPos)) {
                    const centerParkingLot = parkingLot.node.getComponent(UITransform).getBoundingBoxToWorld().center;
                    centerParkingLot.x += this._deltaX;
                    console.log("Hey hey", centerParkingLot, rectEntry.center, parkingLot.node.getChildByName("sprEntry").getComponent(UITransform).getBoundingBoxTo(new Mat4()).center);
                    this._isMatchPark = true;
                    this._isDrawing = false;
                    this.positions.push(centerParkingLot);  
                    this.graphics.lineTo(centerParkingLot.x, centerParkingLot.y);
                    this.sprHead.node.position = centerParkingLot.toVec3();
                }
            });
        }

        if (this._isGettingOut) {
            let gateOuts = GameManager.getInstance().getParkingLotManager().getGateOuts();
            gateOuts.forEach(gate => {
                let rectGate = gate.node.getComponent(UITransform).getBoundingBoxToWorld();
                rectGate.x += this._deltaX;
                if (rectGate.contains(currentPos)) {
                    this._isDrawing = false;
                    this._isMatchOut = true;
                    this.positions.push(rectGate.center);  
                    this.graphics.lineTo(rectGate.center.x, rectGate.center.y);
                    this.sprHead.node.position = rectGate.center.toVec3();
                }
            })
        }
        this.graphics.stroke();
        event.propagationStopped = true;
    }

    onTouchEnd(event: EventTouch) {
        if (!this._isDrawing)
            return;
        let endPos = event.getUILocation();
        const anchorDelta = GameManager.getInstance().sceneGame.getCameraAnchorDelta();
        endPos.x = anchorDelta.x + endPos.x * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        endPos.y = anchorDelta.y + endPos.y * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        endPos.x += this._deltaX * GameManager.getInstance().sceneGame.getCameraHeightRatio();
        console.log("End pos: ", endPos);
        this.positions.push(endPos);
        console.log("Current positions: ", this.positions);
        event.propagationStopped = true;
    }

    onTouchCancel(event: EventTouch) {
        if (!this._isDrawing)
            return;
        console.log("Cancel pos: ", event.getUILocation());
        console.log("Current positions: ", this.positions);
        event.propagationStopped = true;
    }

    start() {

    }

    update(deltaTime: number) {

    }

    isMatchPark() {
        return this._isMatchPark;
    }

    isMatchOut() {
        return this._isMatchOut;
    }

    isGettingOut() {
        return this._isGettingOut;
    }

    setIsGettingOut(b: boolean) {
        this._isGettingOut = b;
        if (this._isGettingOut) {
            this._isMatchPark = false;
        }
    }

    setCar(c: Car) {
        this._car = c;
    }
}