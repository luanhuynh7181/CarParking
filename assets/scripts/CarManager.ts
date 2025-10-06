import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, resources, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Car } from './Car';
const { ccclass, property } = _decorator;

@ccclass('CarManager')
export class CarManager extends Component {
    prefabCar: Prefab = null;
    cars: Car[] = [];
    pool: Car[] = [];
    numCarsGen: number = 2;
    timeGen: number = 0;
    onLoad(): void {
        GameManager.getInstance().setCarManager(this);
        this.loadResources();
    }

    loadResources() {
        resources.load("prefabs/PrefabCar", (err: Error, data: Prefab) => {
            this.prefabCar = data;
            this.onFinishLoadResources();
        });
    }

    getCars(): Car[] {
        return this.cars;
    }

    initSomeCar() {
        // for (let i = 0; i < 4; ++i) {
        //     let carComp = this.getNewCar();
        //     carComp.reset();
        //     let nodeCar = carComp.node;
        //     this.node.addChild(nodeCar);
        //     nodeCar.position = new Vec3(randomRangeInt(50,1000), randomRangeInt(50, 600), 0);
        //     this.cars.push(nodeCar.getComponent(Car));
        // }
        this.genNewWave();
    }

    onFinishLoadResources() {
        this.initSomeCar();
    }

    start() {
    }

    update(deltaTime: number) {
        
    }

    pushToPool(car: Car) {
        this.cars = this.cars.filter((car) => car.getCarId() === car.getCarId());
        this.pool.push(car);
    }

    getNewCar(): Car {
        // if (this.pool.length > 0) {
        //     return this.pool.pop();
        // }
        return instantiate(this.prefabCar).getComponent(Car);
    }

    genNewWave() {
        console.log("Gen new wave");
        let summonPos = [new Vec3(915,25,0), new Vec3(1255,50,0)];
        for (let i = 0; i < this.numCarsGen; ++i) {
            let car = this.getNewCar();
            car.reset();
            car.node.position = summonPos[randomRangeInt(0,summonPos.length)];
            car.node.angle = 90;
            setTimeout(() => {
                this.node.addChild(car.node);
                car.readyToStart();
                this.cars.push(car);
            }, randomRangeInt(1000,12000));
        }
        this.timeGen++;
        if (this.timeGen % 4 == 0) {
            this.numCarsGen++;
        }
        this.timeOutGenNewWave();
    }

    timeOutGenNewWave() {
        setTimeout(() => {
            this.genNewWave();
        }, randomRangeInt(22000,30000));
    }

    clearCars() {
        this.cars.forEach(car => {
            car.node.removeFromParent();
        });
        this.cars = [];
    }
}