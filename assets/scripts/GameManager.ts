import { _decorator, Collider2D, Contact2DType, director, EPhysics2DDrawFlags, IPhysics2DContact, Node, PhysicsSystem2D, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
import { ParkingLotManager } from './ParkingLotManager';
import { PathManager } from './PathManager';
import { CarManager } from './CarManager';
import { SceneGame } from './SceneGame';
import { Car } from './Car';
const { ccclass, property } = _decorator;



export class GameManager {
    static _instance: GameManager;

    parkingLotManager: ParkingLotManager;
    pathManager: PathManager;
    carManager: CarManager;
    gameTime: number = 0;
    gameTick: number = 0;

    score: number = 0;
    life: number = 3;

    sceneGame: SceneGame;

    public static getInstance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    /**
     *
     */
    constructor() {
        const physic_manager = PhysicsSystem2D.instance;
        physic_manager.enable = true;
        physic_manager.fixedTimeStep = 1/60;
        physic_manager.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        physic_manager.on(Contact2DType.END_CONTACT, this.onEndContact, this);

        // physic_manager.debugDrawFlags = EPhysics2DDrawFlags.All;
    }
    
    subLife() {
        console.log("subLife")
        this.life--;
        this.sceneGame.setLife(this.life);
        if (this.life == 0) {
            console.log("End game");
            this.endGame();
        }
    }

    startGame() {
        director.resume();
        this.carManager.clearCars();
        this.pathManager.clearPaths();
        this.gameTime = 0;
        this.life = 3;
        this.score = 0;
        this.sceneGame.setLife(this.life);
        this.sceneGame.setScore(this.score);
    }

    endGame() {
        director.pause();
        this.sceneGame.showGameOver(this.score);
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let x, y = 0;
        let nodeCar = selfCollider.node.getComponent(Car);
        let nodeOtherCar = otherCollider.node.getComponent(Car);
        nodeCar && nodeCar.ignoreCollider(3);
        nodeOtherCar && nodeOtherCar.ignoreCollider(3);
        const point = selfCollider.worldAABB.center;

        x = selfCollider.node.position.x;

        x = point.x;
        y = point.y;


        console.log("VSC: ", x, y);

        // otherCollider.node.scale = new Vec3(2,2,2);
        // selfCollider.node.scale = new Vec3(3,3,3);

        this.sceneGame.showBoom(new Vec2(x , y));
        this.subLife();
    }
    
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    }

    setParkingLotManager(parkLotManager: ParkingLotManager) {
        this.parkingLotManager = parkLotManager;
    }

    getParkingLotManager(): ParkingLotManager {
        return this.parkingLotManager
    }

    setPathManager(pathManager: PathManager) {
        this.pathManager = pathManager;
    }

    getPathManager(): PathManager {
        return this.pathManager;
    }

    setCarManager(carManager: CarManager) {
        this.carManager = carManager;
    }
    
    getCarManager(): CarManager {
        return this.carManager;
    }

    update(deltaTime: number) {
        this.gameTime += deltaTime;
        this.gameTick++;
    }

    setSceneGame(sceneGame: SceneGame) {
        this.sceneGame = sceneGame;
    }

    incScore() {
        this.score++;
        this.sceneGame.setScore(this.score);
    }

    reset() {
        this.life = 3;
        this.score = 0;
    }
}

