import { _decorator, Component, Node } from 'cc';
import { Car } from '../Car';
import { CarType } from './CarType';
const { ccclass, property } = _decorator;

@ccclass('PickupTruck')
export class PickupTruck extends Car {
    onLoad(): void {
        super.onLoad();
        this._type = CarType.PICKUP_TRUCK;
    }
}