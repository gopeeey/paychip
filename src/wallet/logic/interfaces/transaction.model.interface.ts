import { CustomerModelInterfaceDef } from "@customer/logic";
import { TransactionModelInterfaceDef } from "./transaction.def.model.interface";

export interface TransactionModelInterface extends TransactionModelInterfaceDef {
    customer?: CustomerModelInterfaceDef;
}
