import { PaidByType } from "../interfaces";

interface ArgsInterface {
    platformCharge: number;
    platformGot: number;
    businessCharge: number;
    businessGot: number;
    businessPaid: number;
    senderPaid: number;
    receiverPaid: number;
    settledAmount: number;
    businessChargesPaidBy: PaidByType | null;
    platformChargesPaidBy: PaidByType;
}

export class ChargesCalculationResultDto implements ArgsInterface {
    platformCharge: ArgsInterface["platformCharge"];
    platformGot: ArgsInterface["platformGot"];
    businessCharge: ArgsInterface["businessCharge"];
    businessGot: ArgsInterface["businessGot"];
    businessPaid: ArgsInterface["businessPaid"];
    senderPaid: ArgsInterface["senderPaid"];
    receiverPaid: ArgsInterface["receiverPaid"];
    settledAmount: ArgsInterface["settledAmount"];
    businessChargesPaidBy: ArgsInterface["businessChargesPaidBy"];
    platformChargesPaidBy: ArgsInterface["platformChargesPaidBy"];

    constructor(body: ArgsInterface) {
        this.platformCharge = body.platformCharge;
        this.platformGot = body.platformGot;
        this.businessCharge = body.businessCharge;
        this.businessGot = body.businessGot;
        this.businessPaid = body.businessPaid;
        this.senderPaid = body.senderPaid;
        this.receiverPaid = body.receiverPaid;
        this.settledAmount = body.settledAmount;
        this.businessChargesPaidBy = body.businessChargesPaidBy;
        this.platformChargesPaidBy = body.platformChargesPaidBy;
    }
}
