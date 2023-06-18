import { ChargeDto, PaidByType } from "@charges/logic";
import { TransactionType } from "@transaction/logic";

type ArgsType = {
    amount: number;
    transactionType: TransactionType;
    waiveBusinessCharges: boolean;
    businessChargesPaidBy: PaidByType;
    customWalletChargeStack: ChargeDto[] | null;
    businessChargeStack: ChargeDto[];
    platformChargesPaidBy: PaidByType;
    platformChargeStack: ChargeDto[];
};

export class CalculateTransactionChargesDto implements ArgsType {
    amount: ArgsType["amount"];
    transactionType: ArgsType["transactionType"];
    waiveBusinessCharges: ArgsType["waiveBusinessCharges"];
    businessChargesPaidBy: ArgsType["businessChargesPaidBy"];
    customWalletChargeStack: ArgsType["customWalletChargeStack"];
    businessChargeStack: ArgsType["businessChargeStack"];
    platformChargesPaidBy: ArgsType["platformChargesPaidBy"];
    platformChargeStack: ArgsType["platformChargeStack"];

    constructor(body: ArgsType) {
        this.amount = body.amount;
        this.transactionType = body.transactionType;
        this.waiveBusinessCharges = body.waiveBusinessCharges;
        this.businessChargesPaidBy = body.businessChargesPaidBy;
        this.customWalletChargeStack = body.customWalletChargeStack;
        this.businessChargeStack = body.businessChargeStack;
        this.platformChargesPaidBy = body.platformChargesPaidBy;
        this.platformChargeStack = body.platformChargeStack;
    }
}
