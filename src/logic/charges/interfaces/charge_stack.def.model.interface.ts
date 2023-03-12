import { BusinessModelInterfaceDef } from "@logic/business";
import { BaseModelInterface } from "@logic/types";
import { number } from "joi";

export const allowedPaidBy = ["sender", "receiver"] as const;
export type PaidByType = typeof allowedPaidBy[number];

export interface ChargeStackModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    name: string;
    description: string | null;
    paidBy: PaidByType;
}
