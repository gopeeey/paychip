import { CreateWalletDto } from "../../../dtos";
import { WalletModelInterface } from "../models";

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
}
