import { SessionInterface } from "@logic/session_interface";
import { CreateBusinessWalletDto } from "../dtos";
import { BusinessWalletModelInterface as BwModelInterface } from "./business_wallet.model.interface";

export interface BusinessWalletRepoInterface {
    create: (
        createBusinessWalletDto: CreateBusinessWalletDto,
        session?: SessionInterface
    ) => Promise<BwModelInterface>;

    getByCurrency: (
        businessId: BwModelInterface["businessId"],
        currencyCode: BwModelInterface["currencyCode"]
    ) => Promise<BwModelInterface | null>;
}
