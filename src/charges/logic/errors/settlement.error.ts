import { ValidationError } from "@bases/logic";

type SettlementErrorDataType = {
    settlement: number;
    charge: number;
};

export class SettlementError extends ValidationError<
    SettlementErrorDataType,
    SettlementErrorDataType
> {
    constructor(data: SettlementErrorDataType) {
        super("Charge exceeded settled amount", data, data);
    }
}
