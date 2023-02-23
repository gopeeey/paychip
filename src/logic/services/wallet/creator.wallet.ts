import { CreateCustomerDto, CreateWalletDto } from "../../../contracts/dtos";
import {
    WalletCreatorDependencies,
    WalletCreatorInterface,
    WalletModelInterface,
    WalletRepoInterface,
} from "../../../contracts/interfaces";
import { DuplicateWalletError } from "../../errors";

export class WalletCreator implements WalletCreatorInterface {
    private declare createWalletDto: CreateWalletDto;
    private declare _repo: WalletRepoInterface;
    private declare wallet: WalletModelInterface;

    constructor(private readonly _dep: WalletCreatorDependencies) {
        this.createWalletDto = this._dep.dto;
        this._repo = this._dep.repo;
    }

    async create() {
        await this.checkExists();
        await this.persistWallet();
        // await this.createCustomer();
        return this.wallet;
    }

    private checkExists = async () => {
        const { businessId, email, currency } = this.createWalletDto;
        const existing = await this._repo.getUnique({ businessId, email, currency });
        if (existing) throw new DuplicateWalletError({ businessId, email, currency });
    };

    private persistWallet = async () => {
        this.wallet = await this._repo.create(this.createWalletDto);
    };

    // private createCustomer = async () => {
    //     const { businessId, email } = this.createWalletDto;
    //     const customerDto = new CreateCustomerDto({ email, businessId });
    //     await this._dep.createCustomer(customerDto);
    // };
}
