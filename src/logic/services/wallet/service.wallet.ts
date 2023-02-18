import { CreateWalletDto } from "../../../contracts/dtos";
import {
    WalletModelInterface,
    WalletRepoInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "../../../contracts/interfaces";
import { walletJson } from "../../../__tests__/samples";
import { WalletCreator } from "./creator.wallet";

export class WalletService implements WalletServiceInterface {
    private _repo: WalletRepoInterface;

    constructor(private readonly _dep: WalletServiceDependencies) {
        this._repo = this._dep.repo;
    }

    createWallet = async (createWalletDto: CreateWalletDto) => {
        const wallet = await new WalletCreator({ dto: createWalletDto, repo: this._repo }).create();
        return wallet;
    };
}
