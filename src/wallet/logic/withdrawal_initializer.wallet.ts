import { BankDetails, PaymentProviderServiceInterface } from "@payment_providers/logic";
import { InitializeWithdrawalDto } from "./dtos";
import {
    WalletModelInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";

export interface WithdrawalInitializerDependencies {
    getWalletByIdWithBusinessWallet: WalletServiceInterface["getWalletByIdWithBusinessWallet"];
    verifyBankDetails: PaymentProviderServiceInterface["verifyBankDetails"];
}

export class WithdrawalInitializer {
    declare wallet: WalletModelInterface;
    declare businessWallet?: WalletModelInterface | null;
    declare bankDetails: BankDetails;

    constructor(
        private readonly _dto: InitializeWithdrawalDto,
        private readonly _deps: WithdrawalInitializerDependencies
    ) {}

    async exec() {
        await this.fetchWallet();
        await this.verifyBankDetails();
    }

    private fetchWallet = async () => {
        this.wallet = await this._deps.getWalletByIdWithBusinessWallet(this._dto.walletId);
        this.businessWallet = this.wallet.parentWallet;
    };

    private verifyBankDetails = async () => {
        const { accountNumber, bankCode } = this._dto;
        this.bankDetails = await this._deps.verifyBankDetails(
            new BankDetails({
                accountNumber,
                bankCode,
            })
        );
    };
}
