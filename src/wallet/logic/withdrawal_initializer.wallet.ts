import { InitializeWithdrawalDto } from "./dtos";
import {
    WalletModelInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";

export interface WithdrawalInitializerDependencies {
    getWalletByIdWithBusinessWallet: WalletServiceInterface["getWalletByIdWithBusinessWallet"];
}

export class WithdrawalInitializer {
    declare wallet: WalletModelInterface;
    declare businessWallet?: WalletModelInterface | null;

    constructor(
        private readonly _dto: InitializeWithdrawalDto,
        private readonly _deps: WithdrawalInitializerDependencies
    ) {}

    async exec() {
        await this.fetchWallet();
    }

    fetchWallet = async () => {
        this.wallet = await this._deps.getWalletByIdWithBusinessWallet(this._dto.walletId);
        this.businessWallet = this.wallet.parentWallet;
    };
}
