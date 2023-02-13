import { CreateWalletDto } from "../../../dtos";
import { WalletModelInterface } from "../models";

export interface WalletRepoInterface {
    create: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
    getById: (id: WalletModelInterface["id"]) => Promise<WalletModelInterface | null>;
}
