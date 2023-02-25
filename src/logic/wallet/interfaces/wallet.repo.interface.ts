import { CreateWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";

export interface WalletRepoInterface {
    create: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
    getById: (id: WalletModelInterface["id"]) => Promise<WalletModelInterface | null>;

    getUnique: ({
        businessId,
        email,
        currency,
    }: Pick<
        WalletModelInterface,
        "businessId" | "email" | "currency"
    >) => Promise<WalletModelInterface | null>;

    getBusinessRootWallet: (
        businessId: WalletModelInterface["businessId"],
        currency: WalletModelInterface["currency"]
    ) => Promise<WalletModelInterface | null>;
}
