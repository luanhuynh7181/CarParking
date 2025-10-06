import { _decorator, Component, instantiate, Node, Prefab, resources, Vec3 } from 'cc';
import { ParkingLot } from './ParkingLot';
import { GameManager } from './GameManager';
import { GateOut } from './GateOut';
const { ccclass, property } = _decorator;

@ccclass('ParkingLotManager')
export class ParkingLotManager extends Component {
    prefabParkingLot: Prefab = null;
    parkingLots: ParkingLot[] = [];
    gateOuts: GateOut[] = [];
    onLoad(): void {
        GameManager.getInstance().setParkingLotManager(this);
        this.loadResources();
        this.gateOuts.push(this.node.getChildByName("NodeGateOut").getComponent(GateOut));
        this.gateOuts.push(this.node.getChildByName("NodeGateOut1").getComponent(GateOut));
    }

    loadResources() {
        resources.load("prefabs/PrefabParkingLot", (err: Error, data: Prefab) => {
            this.prefabParkingLot = data;
            this.onFinishLoadResources();
        });
    }

    getParkingLots(): ParkingLot[] {
        return this.parkingLots;
    }

    getGateOuts(): GateOut[] {
        return this.gateOuts;
    }

    initParkingLot() {
        // for (let i = 0; i < 5; ++i) {
        //     let nodeParkingLot = instantiate(this.prefabParkingLot);
        //     this.node.addChild(nodeParkingLot);
        //     nodeParkingLot.position = new Vec3(200 + i * 120, 220, i);
        //     this.parkingLots.push(nodeParkingLot.getComponent(ParkingLot));
        // }
        this.addParkingLotInNode(this.node);
    }

    addParkingLotInNode(node: Node) {
        if (node.getComponent(ParkingLot)) {
            this.parkingLots.push(node.getComponent(ParkingLot));
            console.log("add Parking Slot: ", this.parkingLots.length);
            return;
        }
        for (let child of node.children) {
            this.addParkingLotInNode(child);
        }
    }

    onFinishLoadResources() {
        this.initParkingLot()
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


