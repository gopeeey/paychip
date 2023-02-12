import { CreateWalletDto } from "../../contracts/dtos";
import { WalletModelInterface, WalletRepoInterface } from "../../contracts/interfaces";
import { Wallet } from "../models";

export class WalletRepo implements WalletRepoInterface {
    constructor(private readonly _modelContext: typeof Wallet) {}

    create = async (createWalletDto: CreateWalletDto) => {
        const wallet = await this._modelContext.create(createWalletDto);
        return wallet.toJSON();
    };
}
