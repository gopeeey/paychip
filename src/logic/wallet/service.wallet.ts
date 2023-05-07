import {
    WalletModelInterface,
    WalletRepoInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";
import { WalletCreator } from "./creator.wallet";
import { WalletNotFoundError } from "./errors";
import { GetUniqueWalletDto } from "./dtos";

export class WalletService implements WalletServiceInterface {
    private _repo: WalletRepoInterface;

    constructor(private readonly _dep: WalletServiceDependencies) {
        this._repo = this._dep.repo;
    }

    createWallet: WalletServiceInterface["createWallet"] = async (createWalletDto, session) => {
        const wallet = await new WalletCreator({
            dto: createWalletDto,
            repo: this._repo,
            getBusinessWallet: this._dep.getBusinessWallet,
            session,
        }).create();
        return wallet;
    };

    getWalletById: WalletServiceInterface["getWalletById"] = async (id) => {
        const wallet = await this._repo.getById(id);
        if (!wallet) throw new WalletNotFoundError(id);
        return wallet;
    };

    getUniqueWallet: WalletServiceInterface["getUniqueWallet"] = async (uniqueData) => {
        const wallet = await this._repo.getUnique(uniqueData);
        if (!wallet) throw new WalletNotFoundError(uniqueData);
        return wallet;
    };
}
