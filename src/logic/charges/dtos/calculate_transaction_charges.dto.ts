import { ChargeDto, ChargeType, PaidByType } from "@logic/charges";

type ArgsType = {
    amount: number;
    chargeType: ChargeType;
    waiveBusinessCharges: boolean;
    businessChargesPaidBy: PaidByType;
    customWalletChargeStack: ChargeDto[];
    businessChargeStack: ChargeDto[];
    platformChargesPaidBy: PaidByType;
    platformChargeStack: ChargeDto[];
};

export class CalculateTransactionChargesDto implements ArgsType {
    amount: ArgsType["amount"];
    chargeType: ArgsType["chargeType"];
    waiveBusinessCharges: ArgsType["waiveBusinessCharges"];
    businessChargesPaidBy: ArgsType["businessChargesPaidBy"];
    customWalletChargeStack: ArgsType["customWalletChargeStack"];
    businessChargeStack: ArgsType["businessChargeStack"];
    platformChargesPaidBy: ArgsType["platformChargesPaidBy"];
    platformChargeStack: ArgsType["platformChargeStack"];

    constructor(body: ArgsType) {
        this.amount = body.amount;
        this.chargeType = body.chargeType;
        this.waiveBusinessCharges = body.waiveBusinessCharges;
        this.businessChargesPaidBy = body.businessChargesPaidBy;
        this.customWalletChargeStack = body.customWalletChargeStack;
        this.businessChargeStack = body.businessChargeStack;
        this.platformChargesPaidBy = body.platformChargesPaidBy;
        this.platformChargeStack = body.platformChargeStack;
    }
}
