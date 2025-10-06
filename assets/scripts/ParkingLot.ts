import { _decorator, Component, Input, Node } from 'cc';
import { CarType } from './cars/CarType';
const { ccclass, property } = _decorator;

@ccclass('ParkingLot')
export class ParkingLot extends Component {
    _type: CarType = CarType.SUV;

    onLoad(): void {
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    getCarType() {
        return this._type;
    }
}


