import { js, _decorator, Button, Component, EventHandler, lerp, Node, random, randomRange, Vec2, Event, EventTouch, Input, Graphics, Color, Sprite, UITransform, randomRangeInt, UIOpacity, tween, BoxCollider2D, Contact2DType, PhysicsSystem2D, RigidBody2D, ProgressBar, director, view } from 'cc';
import { Path } from './Path';
import { PathManager } from './PathManager';
import { GameManager } from './GameManager';
const { IDGenerator } = js;
const { ccclass, property } = _decorator;

export enum CarState {
    UNDEFINED = -1,
    MOVE_IN = 0,
    PARKING = 1,
    PARKED = 2,
    MOVE_OUT = 3,
}

@ccclass('Car')
export class Car extends Component {
    sprCar: Sprite;
    sprCheck: Sprite;
    pbTimer: ProgressBar;

    path: Path;
    speed: number;
    angle: number;

    _isReverse: boolean = false;
    _isParked: boolean = false;
    _isDriverInside: boolean = true;
    _isGettingOut: boolean = false;
    _isOut: boolean = false;
    _isStart: boolean = true;
    _carId: string;

    boxCollider: BoxCollider2D;
    rigidBody: RigidBody2D;
    _lastTimeTurnAround: number = 0;

    _state: CarState = CarState.UNDEFINED;
    _timeParking: number;
    

    onLoad(): void {
        this.angle = randomRangeInt(0,359);
        this.speed = randomRangeInt(50,150);
        console.log("Car::onLoad", this.angle);
        this.node.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);

        this.sprCar = this.node.getChildByName("sprCar").getComponent(Sprite);  

        this.path = GameManager.getInstance().getPathManager().getPath();

        this._carId = IDGenerator.global.getNewId();

        this.boxCollider = this.node.getComponent(BoxCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);

        this._timeParking = randomRangeInt(10000,25000);

        this.pbTimer = this.node.getChildByName("pbTimer").getComponent(ProgressBar);
        this.sprCheck = this.node.getChildByName("sprCheck").getComponent(Sprite);
        this.sprCheck.node.active = false;
        this.pbTimer.node.active = false;
        this.pbTimer.progress = 0;
        // this.rigidBody.gravityScale = 0;
    }

    getCarId() {
        return this._carId;
    }

    getPath() {
        return this.path;
    }

    onTouchStart(event: EventTouch) {
        if (this._state === CarState.PARKING) {
            return;
        }

        if (!this._isDriverInside) {
            return;
        }
        if (this._isParked) {
            this._isGettingOut = true;
            this.path.setIsGettingOut(this._isGettingOut);
        }
        const target = event.target as Node;
        let startPos = event.getUILocation();
        this.path.onTouchStart(event);
        event.propagationStopped = true;
        // this.path.length = 0;
        // this.path.push(startPos);
        // this.graphics.clear();
        // this.graphics.strokeColor = Color.WHITE;
        // this.graphics.lineWidth = 5;
        // this.graphics.moveTo(startPos.x - this.node.x, startPos.y - this.node.y - this.node.getComponent(UITransform).height / 2);
    }

    onTouchMove(event: EventTouch) {
        this.path.onTouchMove(event);
        event.propagationStopped = true;
        // const minDelta = 5;
        // let lastPath = this.path[this.path.length - 1];
        // let currentPos = event.getUILocation();
        // if (Math.abs(currentPos.x - lastPath.x) > minDelta || Math.abs(currentPos.y - lastPath.y) > minDelta) {

        //     console.log("Move pos: ", currentPos);
        //     this.path.push(currentPos);
        //     this.graphics.lineTo(currentPos.x - this.node.x, currentPos.y - this.node.y - this.node.getComponent(UITransform).height / 2);
        // }
        // this.graphics.stroke();
    }

    onTouchEnd(event: EventTouch) {
        this.path.onTouchEnd(event);
        event.propagationStopped = true;
        // console.log("End pos: ", event.getUILocation());
        // this.path.push(event.getUILocation());
        // console.log("Current path: ", this.path);
    }

    onTouchCancel(event: EventTouch) {
        this.path.onTouchCancel(event);
        event.propagationStopped = true;
        // console.log("Cancel pos: ", event.getUILocation());
        // console.log("Current path: ", this.path);
    }

    start() {
    }

    setIsParked(isParked: boolean) {
        this._isParked = isParked;
    }

    update(deltaTime: number) {
        if (!this._isStart) {
            return;
        }
        if (this._isParked && !this._isGettingOut) {
            // dang dau xe
            return;
        }
        if (this._isOut) {
            return;
        }
        if (this.path.getPositions().length === 0) {
            // this.moveWithCurrentAngle(deltaTime);
            return;
        } else {
            this.moveWithPath(deltaTime);
        }
    }

    checkTurnAround() {
        let currentTime = new Date().getTime();
        if (currentTime - this._lastTimeTurnAround > 1500) {
            this._lastTimeTurnAround = currentTime;
            this.angle = this.angle < 180?this.angle + 180:this.angle -180;
        }
    }

    moveWithCurrentAngle(deltaTime: number) {
        if (this._isReverse) {
            this._isReverse = false;
            this.sprCar.node.angle = 0;
            this.angle = (this.angle + 180) % 360
        }
        let s = deltaTime * this.getSpeed();
        this.node.x = this.node.x + Math.sin(-this.angle / 180 * Math.PI) * s;
        this.node.y = this.node.y + Math.cos(-this.angle / 180 * Math.PI) * s;
        const deltaY = 200 / 2;
        const deltaX = 200 / 2;
        if (this.node.x < deltaX || this.node.x > 1280 - deltaX || this.node.y < deltaY || this.node.y > 720 - deltaY) {
            // this.angle = this.angle < 180?this.angle + 180:this.angle -180;
            this.checkTurnAround();
        }
        // this.node.angle = lerp(this.node.angle,this.angle,0.8);
        this.rigidBody.node.angle = lerp(this.rigidBody.node.angle, this.angle, 1);
        // this.node.angle = this.angle;
        // console.log("Hittt: ", this.node.angle - this.angle,this.node.angle, this.angle);
    }

    // moveWithPath(deltaTime: number) {
    //     let s = deltaTime * this.getSpeed();
    //     let move = 0;
    //     let moveIndex = -1;
    //     let positions = this.path.getPositions();
    //     while (move < s) {
    //         if (moveIndex < positions.length - 1) {
    //             moveIndex++;
    //             if (moveIndex === 0) {
    //                 move += Vec2.distance(this.node.position.toVec2(), positions[moveIndex]);
    //             } else {
    //                 move += Vec2.distance(positions[moveIndex], positions[moveIndex-1]);
    //             }
    //         }
    //         else {
    //             break;
    //         }
    //     }
    //     console.log("Move to: ", moveIndex, positions[moveIndex], positions);
    //     console.log("Move: ", move, "S: ", s);
    //     let moveVector = new Vec2(positions[moveIndex].x - this.node.position.x, positions[moveIndex].y - this.node.position.y);
    //     this.angle = Math.atan(moveVector.y/moveVector.x) * 180 / Math.PI - 90 + (moveVector.x <0?-180:0);

    //     this.node.x = positions[moveIndex].x;
    //     this.node.y = positions[moveIndex].y;
    //     this.sprCar.node.angle = lerp(this.sprCar.node.angle,this.angle,0.4);
    //     let target = new Vec2()
    //     if (s < move) {
    //         console.log("Move: ", move, "S: ", s, "moveIndex: ", moveIndex);
    //         this.path.slicePositions(moveIndex+1);
    //     } else {
            
    //     }
    // }

    getSpeed(): number {
        if (this._isReverse) {
            return this.speed / 2;
        }
        return this.speed;
    }

    moveWithPath(deltaTime: number) {
        let s = deltaTime * this.getSpeed();
        let move = 0;
        let moveIndex = -1;
        let positions = this.path.getPositions();
        while (move < s) {
            if (moveIndex < positions.length - 1) {
                moveIndex++;
                if (moveIndex === 0) {
                    move += Vec2.distance(this.node.position.toVec2(), positions[moveIndex]);
                } else {
                    move += Vec2.distance(positions[moveIndex], positions[moveIndex-1]);
                }
            }
            else {
                break;
            }
        }
    
        let targetPos = new Vec2(positions[moveIndex].x, positions[moveIndex].y)
        let moveVector = new Vec2(positions[moveIndex].x - this.node.position.x, positions[moveIndex].y - this.node.position.y);
        let targetAngle = Math.atan(moveVector.y/moveVector.x) * 180 / Math.PI - 90 + (moveVector.x <0?-180:0); 

        if (s < move) {
            // di chuyen 1 phan tren path di toi moveIndex
            let retainPath = move - s;
            let lastPathLength = 0;
            let lastPos = this.node.position.toVec2();
            if (moveIndex === 0) {
                lastPathLength = Vec2.distance(positions[moveIndex],lastPos);
            } else {
                lastPos = positions[moveIndex-1]
                lastPathLength = Vec2.distance(positions[moveIndex],lastPos);
            }
            if (lastPathLength === 0) {
                // targetPos = lastPos; // todo check
                targetPos = positions[moveIndex];
            } else {
                let rate = (lastPathLength - retainPath) / lastPathLength;
                targetPos.x = lastPos.x + (positions[moveIndex].x - lastPos.x) * rate;
                targetPos.y = lastPos.y + (positions[moveIndex].y - lastPos.y) * rate;
            }
            moveVector = new Vec2(positions[moveIndex].x - lastPos.x, positions[moveIndex].y - lastPos.y);
            targetAngle = (Math.atan(moveVector.y/moveVector.x) * 180 / Math.PI - 90 + (moveVector.x <0?-180:0)) % 360; 
            // targetAngle = Math.atan(moveVector.y/moveVector.x) * 180 / Math.PI - 90; 
            if (Math.abs(targetAngle - this.angle) > 150 && Math.abs(targetAngle - this.angle) < 300) {
                console.log("EEEEEE", Math.abs(targetAngle - this.angle) % 360);
                this._isReverse = !this._isReverse;
                this.sprCar.node.angle = this._isReverse?180:0;
            }
            this.path.slicePositions(moveIndex);
        } else {
            // di chuyen het path
            moveVector = new Vec2(positions[moveIndex].x - this.node.position.x, positions[moveIndex].y - this.node.position.y);
            this.path.slicePositions(positions.length);
            this.onFinishPath();
        }


        // final move
        this.angle = targetAngle;
        this.node.x = targetPos.x;
        this.node.y = targetPos.y;
        this.rigidBody.angularVelocity = 0;
        this.rigidBody.angularDamping = 0;
        this.node.angle = lerp(this.node.angle,this.angle,1);
        // this.node.angle = this.angle;
        // console.log("Hi: ", this.node.angle - this.angle,this.node.angle, this.angle);
    }

    doParking() {
        this._state = CarState.PARKING;
        this._isParked = true;
        this.pbTimer.node.active = true;
        console.log("Do parking: ", this._timeParking);
        tween(this.pbTimer)
        .to((this._timeParking / 1000), {progress: 1})
        .call(() => {
            this.onFinishParking();
        })
        .start();
    }

    onFinishParking() {
        console.log("onFinishParking");
        this._state = CarState.PARKED;
        this._isParked = true;
        this.sprCheck.node.active = true;
        this.pbTimer.node.active = false;
    }

    onFinishPath() {
        if (this.path.isMatchPark()) {
            this.doParking();
        }
        if (this.path.isMatchOut()) {
            this.moveOut();
        }
        this.path.reset();
    }

    moveOut() {
        this._isOut = true;
        GameManager.getInstance().incScore();
        tween(this.node.getComponent(UIOpacity))
        .to(0.3, {
            opacity: 0,
        })
        .call(() => {
            this.onFinishMoveOut();
        }).start();
    }

    onFinishMoveOut() {
        this.node.active = false;
        this.node.removeFromParent();
        GameManager.getInstance().getCarManager().pushToPool(this);
    }

    reset() {
        this.node.active = true;
        this.node.getComponent(UIOpacity).opacity = 255;
        this._isOut = false;
        this._isParked = false;
        this._isDriverInside = true;
        this._isGettingOut = false;
    }

    readyToStart() {
        this._isStart = false;
        // this.rigidBody.enabledContactListener = false;
        this.rigidBody.enabled = false;
        this.node.getComponent(UIOpacity).opacity = 200;
        tween(this.node.getComponent(UIOpacity))
        .to(0.4, {opacity: 100})
        .to(0.4, {opacity: 200})
        .to(0.4, {opacity: 100})
        .to(0.4, {opacity: 200})
        .to(0.4, {opacity: 100})
        .call(() => {
            this._isStart = true;
            this.rigidBody.enabled = true;
            this.ignoreCollider(2);
        })
        // .to(0.5, {opacity: 200})
        // .to(0.5, {opacity: 100})
        // .to(0.5, {opacity: 200})
        // .to(0.5, {opacity: 255})
        // .call(() => {
        //     // this.rigidBody.enabledContactListener = true;
        // })
        .start();
    }

    ignoreCollider(timeOut: number = 3) {
        if (this.rigidBody) {
            this.rigidBody.enabledContactListener = false;
        }
        tween(this.node.getComponent(UIOpacity))
        .to(timeOut/4, {opacity: 100})
        .to(timeOut/4, {opacity: 200})
        .to(timeOut/8, {opacity: 100})
        .to(timeOut/8, {opacity: 200})
        .to(timeOut/8, {opacity: 100})
        .to(timeOut/8, {opacity: 255})
        .call(() => {
            if (this.rigidBody)
                this.rigidBody.enabledContactListener = true;
        })
        .start();
    }
}