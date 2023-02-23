import { CreateWalletDto } from "../../../contracts/dtos";
import {
    WalletModelInterface,
    WalletRepoInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "../../../contracts/interfaces";
import { walletJson } from "../../../__tests__/samples";
import { BusinessCurrencyNotSupportedError, BusinessRootWalletNotFoundError } from "../../errors";
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

    createBusinessWallet: WalletServiceInterface["createBusinessWallet"] = async (
        createWalletDto
    ) => {
        // checks if the business has a parent wallet for the new wallet
        const parentWallet = await this._repo.getBusinessRootWallet(
            createWalletDto.businessId,
            createWalletDto.currency
        );
        if (!parentWallet)
            throw new BusinessRootWalletNotFoundError(
                createWalletDto.businessId,
                createWalletDto.currency
            );

        // checks if the currency for the new wallet is among the business'
        // supported currencies
        const currencySupported = await this._dep.isSupportedBusinessCurrency(
            createWalletDto.businessId,
            createWalletDto.currency
        );
        if (!currencySupported)
            throw new BusinessCurrencyNotSupportedError(createWalletDto.currency);

        createWalletDto.parentWalletId = parentWallet.id;
        const wallet = await this.createWallet(createWalletDto);
        return wallet;
    };
}
