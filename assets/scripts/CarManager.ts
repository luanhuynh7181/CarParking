import { _decorator, Component, instantiate, Node, Prefab, randomRange, randomRangeInt, resources, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Car } from './Car';
import { CarType } from './cars/CarType';
const { ccclass, property } = _decorator;

@ccclass('CarManager')
export class CarManager extends Component {
    prefabCar: Prefab = null;
    prefabCars: Map<string, Prefab> = new Map();
    cars: Car[] = [];
    pool: Car[] = [];
    numCarsGen: number = 2;
    timeGen: number = 0;
    onLoad(): void {
        GameManager.getInstance().setCarManager(this);
        this.loadResources();
    }

    loadResources() {
        resources.loadDir("prefabs/cars", Prefab, (err: Error, data) => {
            console.log("SADV");
            for (let prefab of data) {
                this.prefabCars[prefab.name] = prefab;
            }
            this.onFinishLoadResources();
        });

        resources.load("prefabs/PrefabCar", (err: Error, data: Prefab) => {
            this.prefabCar = data;
            // this.onFinishLoadResources();
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

    getNewCar(carType: CarType = CarType.SUV): Car {
        // if (this.pool.length > 0) {
        //     return this.pool.pop();
        // }
        console.log("New Car: ", carType);
        let prefab = this.prefabCars["PrefabCar"];
        switch (carType) {
            case CarType.SUV:
                prefab = this.prefabCars["PrefabCar"];
                break;
            case CarType.PICKUP_TRUCK:
                prefab = this.prefabCars["PrefabPickupTruck"];
                break;
            case CarType.TAXI:
                prefab = this.prefabCars["PrefabTaxi"];
                break;
                
            case CarType.SEDAN:
                prefab = this.prefabCars["PrefabSedan"];
                break;
                
            case CarType.MICRO:
                prefab = this.prefabCars["PrefabMicro"];
                break;
        }
        return instantiate(prefab).getComponent(Car);
    }

    genNewWave() {
        console.log("Gen new wave");
        let summonPos = [new Vec3(915, 25, 0), new Vec3(1150, 25, 0), new Vec3(246, 25, 0), new Vec3(430, 25, 0)];
        for (let i = 0; i < this.numCarsGen; ++i) {
            let carType = randomRangeInt(0,CarType.MICRO + 1);
            let car = this.getNewCar(carType);
            car.reset();
            car.node.position = summonPos[randomRangeInt(0, summonPos.length)];
            car.node.angle = 90;
            setTimeout(() => {
                this.node.addChild(car.node);
                car.readyToStart();
                this.cars.push(car);
            }, randomRangeInt(1000, 12000));
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
        }, randomRangeInt(22000, 30000));
    }

    clearCars() {
        this.cars.forEach(car => {
            car.node.removeFromParent();
        });
        this.cars = [];
    }
}