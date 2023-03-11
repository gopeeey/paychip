import { BaseModelInterface } from "@logic/types";
import { BusinessModelInterfaceDef } from "@logic/business";
import { ChargeStackModelInterfaceDef } from "@logic/charges";
import { CurrencyModelInterfaceDef } from "@logic/currency";

export const allowedWalletTypes = ["personal", "commercial"] as const;

export interface WalletModelInterfaceDef extends BaseModelInterface {
    id: string;
    businessId: BusinessModelInterfaceDef["id"];
    parentWalletId: string | null;
    currency: CurrencyModelInterfaceDef["isoCode"];
    balance: number;
    email: string;
    waiveFundingCharges: boolean;
    waiveWithdrawalCharges: boolean;
    waiveWalletInCharges: boolean;
    waiveWalletOutCharges: boolean;
    fundingChargeStackId: ChargeStackModelInterfaceDef["id"] | null;
    withdrawalChargeStackId: ChargeStackModelInterfaceDef["id"] | null;
    walletInChargeStackId: ChargeStackModelInterfaceDef["id"] | null;
    walletOutChargeStackId: ChargeStackModelInterfaceDef["id"] | null;
    walletType: typeof allowedWalletTypes[number];
}
