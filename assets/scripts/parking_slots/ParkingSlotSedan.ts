import { _decorator, Component, Node } from 'cc';
import { ParkingLot } from '../ParkingLot';
import { CarType } from '../cars/CarType';
const { ccclass, property } = _decorator;

@ccclass('ParkingSlotSedan')
export class ParkingSlotSedan extends ParkingLot {
    onLoad() {
        super.onLoad();
        this._type = CarType.SEDAN;
    }
}


