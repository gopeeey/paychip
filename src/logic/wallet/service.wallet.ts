import {
    WalletRepoInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";
import { WalletCreator } from "./creator.wallet";
import { WalletFunder } from "./funder.wallet";
import { WalletNotFoundError } from "./errors";

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

    generateFundingLink: WalletServiceInterface["generateFundingLink"] = async (fundingDto) => {
        const link = await new WalletFunder(fundingDto, {
            calculateCharges: this._dep.calculateCharges,
            createTransaction: this._dep.createTransaction,
            generatePaymentLink: this._dep.generatePaymentLink,
            getBusinessWallet: this._dep.getBusinessWallet,
            getCurrency: this._dep.getCurrency,
            getOrCreateCustomer: this._dep.getOrCreateCustomer,
            getUniqueWallet: this.getUniqueWallet,
            getWalletById: this.getWalletById,
            getWalletChargeStack: this._dep.getWalletChargeStack,
            startSession: this._dep.repo.startSession,
        }).exec();

        // TO DO: pass a startSession function to wallet funder so
        // you can use the session for persisting transactions only if the
        // link was successfully generated

        return link;
    };
}
