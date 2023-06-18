import { CreateWalletDto } from "./dtos";
import {
    WalletCreatorDependencies,
    WalletCreatorInterface,
    WalletModelInterface,
    WalletRepoInterface,
} from "./interfaces";
import { DuplicateWalletError } from "./errors";
import { SessionInterface } from "../../base_interfaces/session_interface";
import { BusinessWalletModelInterface } from "@business_wallet/logic";

export class WalletCreator implements WalletCreatorInterface {
    private declare createWalletDto: CreateWalletDto;
    private declare _repo: WalletRepoInterface;
    private declare session?: SessionInterface;
    private declare wallet: WalletModelInterface;
    private declare businessWallet: BusinessWalletModelInterface;

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
        const { businessId, email, currency } = this.createWalletDto;
        const existing = await this._repo.getUnique({ businessId, email, currency });
        if (existing) throw new DuplicateWalletError({ businessId, email, currency });
    };

    private fetchBusinessWallet = async () => {
        const { businessId, currency } = this.createWalletDto;
        this.businessWallet = await this._dep.getBusinessWallet(businessId, currency);
    };

    private persistWallet = async () => {
        this.wallet = await this._repo.create(
            { ...this.createWalletDto, businessWalletId: this.businessWallet.id },
            this.session
        );
    };
}
