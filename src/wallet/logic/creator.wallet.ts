import { CreateWalletDto } from "./dtos";
import {
    WalletCreatorDependencies,
    WalletCreatorInterface,
    WalletModelInterface,
    WalletRepoInterface,
} from "./interfaces";
import { DuplicateWalletError } from "./errors";
import { SessionInterface } from "@bases/logic";

export class WalletCreator implements WalletCreatorInterface {
    private declare createWalletDto: CreateWalletDto;
    private declare _repo: WalletRepoInterface;
    private declare session?: SessionInterface;
    private declare wallet: WalletModelInterface;
    private businessWallet?: WalletModelInterface;

    constructor(private readonly _dep: WalletCreatorDependencies) {
        this.createWalletDto = this._dep.dto;
        this._repo = this._dep.repo;
        this.session = this._dep.session;
    }

    async create() {
        await this.checkExists();
        await this.fetchBusinessWallet();
        await this.persistWallet();
        return this.wallet;
    }

    private checkExists = async () => {
        const { businessId, email, currency, isBusinessWallet } = this.createWalletDto;
        const existing = await this._repo.getUnique({
            businessId,
            email,
            currency,
            isBusinessWallet,
        });
        if (existing)
            throw new DuplicateWalletError({ businessId, email, currency, isBusinessWallet });
    };

    private fetchBusinessWallet = async () => {
        if (this.createWalletDto.isBusinessWallet) return;
        const { businessId, currency } = this.createWalletDto;
        this.businessWallet = await this._dep.getBusinessWallet(businessId, currency);
    };

    private persistWallet = async () => {
        this.wallet = await this._repo.create(
            { ...this.createWalletDto, businessWalletId: this.businessWallet?.id },
            this.session
        );
    };
}
