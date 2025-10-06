import { _decorator, Component, Node } from 'cc';
import { Car } from '../Car';
import { CarType } from './CarType';
const { ccclass, property } = _decorator;

@ccclass('Micro')
export class Micro extends Car {
    onLoad(): void {
        super.onLoad();
        this._type = CarType.MICRO;
    }
}


