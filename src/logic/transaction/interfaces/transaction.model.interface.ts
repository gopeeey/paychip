import { ChargeSchemeModelInterfaceDef } from "@logic/charge_scheme";
import { CustomerModelInterfaceDef } from "@logic/customer";
import { TransactionModelInterfaceDef } from "./transaction.def.model.interface";

export interface TransactionModelInterface extends TransactionModelInterfaceDef {
    customer?: CustomerModelInterfaceDef;
    chargePaidBy: ChargeSchemeModelInterfaceDef["payer"];
}
