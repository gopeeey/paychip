import { CreateBusinessDto } from "./dtos";
import { CreateWalletDto, WalletModelInterface } from "@logic/wallet";
import {
    BusinessCreatorDependencies,
    BusinessCreatorInterface,
    BusinessModelInterface,
    BusinessRepoInterface,
} from "./interfaces";
import { AccountModelInterface } from "@logic/account";
import { CountryModelInterface } from "@logic/country";
import { CurrencyModelInterface } from "@logic/currency";

export class BusinessCreator implements BusinessCreatorInterface {
    private declare createBusinessDto: CreateBusinessDto;
    private _repo: BusinessRepoInterface;
    private declare country: CountryModelInterface;
    private declare business: BusinessModelInterface;
    private declare owner: AccountModelInterface;
    private declare wallet: WalletModelInterface;
    private declare currencies: CurrencyModelInterface[];

    constructor(private readonly _dep: BusinessCreatorDependencies) {
        this._repo = this._dep.repo;
        this.createBusinessDto = this._dep.dto;
    }

    async create() {
        await this.checkOwner();
        await this.checkCountry();
        await this.persistBusiness();
        await this.createBusinessWallet();
        // add currency of the country to the business currencies
        await this.addFirstCurrency();
        return this.business;
    }

    private checkOwner = async () => {
        this.owner = await this._dep.getOwner(this.createBusinessDto.ownerId);
    };

    private checkCountry = async () => {
        this.country = await this._dep.getCountry(this.createBusinessDto.countryCode);
    };

    private persistBusiness = async () => {
        this.business = await this._repo.create(this.createBusinessDto);
    };

    private createBusinessWallet = async () => {
        this.wallet = await this._dep.createWallet(
            new CreateWalletDto({
                businessId: this.business.id,
                chargeSchemeId: null,
                currency: this.country.currencyCode,
                email: this.owner.email,
                parentWalletId: null,
                waiveFundingCharges: false,
                waiveWithdrawalCharges: false,
                walletType: "commercial",
            })
        );
    };

    private addFirstCurrency = async () => {
        this.currencies = await this._dep.updateCurrencies(this.business.id, [
            this.country.currencyCode,
        ]);
    };
}
