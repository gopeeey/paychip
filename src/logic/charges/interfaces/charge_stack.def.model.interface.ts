import { BusinessModelInterfaceDef } from "@logic/business";
import { BaseModelInterface } from "@bases/logic";
import { ChargeInterface } from "./charge.interface";

export const allowedPaidBy = ["wallet", "customer"] as const;
export type PaidByType = (typeof allowedPaidBy)[number];

export interface ChargeStackModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
    charges: ChargeInterface[];
    paidBy: PaidByType;
}
