import { _decorator, Component, Node } from 'cc';
import { ParkingLot } from '../ParkingLot';
import { CarType } from '../cars/CarType';
const { ccclass, property } = _decorator;

@ccclass('ParkingSlotMicro')
export class ParkingSlotMicro extends ParkingLot {
    onLoad() {
        super.onLoad();
        this._type = CarType.MICRO;
    }
}


