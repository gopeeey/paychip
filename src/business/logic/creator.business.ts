import { CreateBusinessDto } from "./dtos";
import {
    BusinessCreatorDependencies,
    BusinessCreatorInterface,
    BusinessModelInterface,
    BusinessRepoInterface,
} from "./interfaces";
import { AccountModelInterface } from "@accounts/logic";
import { CountryModelInterface } from "@country/logic";
import { CurrencyModelInterface } from "@currency/logic";
import { SessionInterface } from "@bases/logic";
import { CreateWalletDto, WalletModelInterface } from "@wallet/logic";

export class BusinessCreator implements BusinessCreatorInterface {
    private declare createBusinessDto: CreateBusinessDto;
    private _repo: BusinessRepoInterface;
    private session: SessionInterface;
    private declare country: CountryModelInterface;
    private declare business: BusinessModelInterface;
    private declare owner: AccountModelInterface;
    private declare wallet: WalletModelInterface;
    private declare currencies: CurrencyModelInterface[];

    constructor(private readonly _dep: BusinessCreatorDependencies) {
        this._repo = this._dep.repo;
        this.createBusinessDto = this._dep.dto;
        this.session = this._dep.session;
    }

    async create() {
        await this.checkOwner();
        await this.checkCountry();
        await this.persistBusiness();
        await this.createBusinessWallet();
        // add currency of the country to the business currencies
        // await this.addFirstCurrency();
        return this.business;
    }

    private checkOwner = async () => {
        this.owner = await this._dep.getOwner(this.createBusinessDto.ownerId);
    };

    private checkCountry = async () => {
        this.country = await this._dep.getCountry(this.createBusinessDto.countryCode);
    };

    private persistBusiness = async () => {
        this.business = await this._repo.create(this.createBusinessDto, this.session);
    };

    private createBusinessWallet = async () => {
        const createBusinessWalletDto = new CreateWalletDto({
            businessId: this.business.id,
            currency: this.country.currencyCode,
            email: this.owner.email,
            isBusinessWallet: true,
        });
        this.wallet = await this._dep.createBusinessWallet(createBusinessWalletDto, this.session);
    };
}
