import { CreateBusinessDto, CreateWalletDto } from "../../../contracts/dtos";
import {
    AccountModelInterface,
    BusinessCreatorDependencies,
    BusinessCreatorInterface,
    BusinessModelInterface,
    BusinessRepoInterface,
    CountryModelInterface,
    WalletModelInterface,
} from "../../../contracts/interfaces";

export class BusinessCreator implements BusinessCreatorInterface {
    private declare createBusinessDto: CreateBusinessDto;
    private _repo: BusinessRepoInterface;
    private declare country: CountryModelInterface;
    private declare business: BusinessModelInterface;
    private declare owner: AccountModelInterface;
    private declare wallet: WalletModelInterface;

    constructor(private readonly _dep: BusinessCreatorDependencies) {
        this._repo = this._dep.repo;
    }

    create = async (createBusinessDto: CreateBusinessDto) => {
        this.createBusinessDto = createBusinessDto;

        await this.checkOwner();
        await this.checkCountry();
        await this.persistBusiness();
        await this.createBusinessWallet();
        // add currency of the country to the business currencies
        return this.business;
    };

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
}
