import { _decorator, Component, Node } from 'cc';
import { Car } from '../Car';
import { CarType } from './CarType';
const { ccclass, property } = _decorator;

@ccclass('Taxi')
export class Taxi extends Car {
    onLoad(): void {
        super.onLoad();
        this._type = CarType.TAXI;
    }
}


