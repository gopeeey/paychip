import { CreateWalletDto } from "../../../../dtos";
import { WalletModelInterface } from "../../../db";

export interface WalletCreatorInterface {
    create: (createWalletDto: CreateWalletDto) => Promise<WalletModelInterface>;
}
