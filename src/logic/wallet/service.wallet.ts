import {
    WalletRepoInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";
import { WalletCreator } from "./creator.wallet";

export class WalletService implements WalletServiceInterface {
    private _repo: WalletRepoInterface;

    constructor(private readonly _dep: WalletServiceDependencies) {
        this._repo = this._dep.repo;
    }

    createWallet: WalletServiceInterface["createWallet"] = async (createWalletDto, session) => {
        const wallet = await new WalletCreator({
            dto: createWalletDto,
            repo: this._repo,
            session,
        }).create();
        return wallet;
    };
}
