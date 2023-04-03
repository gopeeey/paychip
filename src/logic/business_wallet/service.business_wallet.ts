import { bwJson } from "src/__tests__/samples";
import { BusinessWalletNotFoundError } from "./errors";
import {
    BusinessWalletServiceDeps,
    BusinessWalletServiceInterface as BwServiceInterface,
} from "./interfaces/service.business_wallet.interface";

export class BusinessWalletService implements BwServiceInterface {
    private readonly _repo: BusinessWalletServiceDeps["repo"];

    constructor(private readonly _deps: BusinessWalletServiceDeps) {
        this._repo = this._deps.repo;
    }

    createBusinessWallet: BwServiceInterface["createBusinessWallet"] = async (
        createBusinessWalletDto,
        session
    ) => {
        await this._deps.validateCurrencySupported(createBusinessWalletDto.currencyCode);

        const businessWallet = await this._repo.create(createBusinessWalletDto, session);
        return businessWallet;
    };

    getBusinessWalletByCurrency: BwServiceInterface["getBusinessWalletByCurrency"] = async (
        businessId,
        currencyCode
    ) => {
        const bw = await this._repo.getByCurrency(businessId, currencyCode);
        if (!bw) throw new BusinessWalletNotFoundError(currencyCode);
        return bw;
    };
}
