import { SessionInterface } from "@logic/session_interface";
import { CreateBusinessWalletDto } from "../dtos";
import { BusinessWalletModelInterface } from "./business_wallet.model.interface";

export interface BusinessWalletRepoInterface {
    create: (
        createBusinessWalletDto: CreateBusinessWalletDto,
        session?: SessionInterface
    ) => Promise<BusinessWalletModelInterface>;
}
