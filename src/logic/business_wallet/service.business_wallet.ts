import {
    BusinessWalletServiceDeps,
    BusinessWalletServiceInterface,
} from "./interfaces/service.business_wallet.interface";

export class BusinessWalletService implements BusinessWalletServiceInterface {
    private readonly _repo: BusinessWalletServiceDeps["repo"];

    constructor(private readonly _deps: BusinessWalletServiceDeps) {
        this._repo = this._deps.repo;
    }

    createBusinessWallet: BusinessWalletServiceInterface["createBusinessWallet"] = async (
        createBusinessWalletDto,
        session
    ) => {
        const businessWallet = await this._repo.create(createBusinessWalletDto, session);
        return businessWallet;
    };
}
