import { BusinessModelInterfaceDef } from "@logic/business";
import { BaseModelInterface } from "@logic/types";

export const allowedPaidBy = ["wallet", "customer"] as const;
export type PaidByType = typeof allowedPaidBy[number];

export interface ChargeStackModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
    paidBy: PaidByType | null;
}
