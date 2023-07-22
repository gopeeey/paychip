import { BankDetails, PaymentProviderServiceInterface } from "@payment_providers/logic";
import { InitializeWithdrawalDto } from "./dtos";
import {
    WalletModelInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";
import {
    CalculateTransactionChargesDto,
    ChargeStackModelInterface,
    ChargesCalculationResultDto,
    ChargesServiceInterface,
} from "@charges/logic";
import { CurrencyModelInterface, CurrencyServiceInterface } from "@currency/logic";
import { InsufficientWalletBalanceError } from "./errors";

export interface WithdrawalInitializerDependencies {
    getWalletByIdWithBusinessWallet: WalletServiceInterface["getWalletByIdWithBusinessWallet"];
    verifyBankDetails: PaymentProviderServiceInterface["verifyBankDetails"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    getWalletChargeStack: ChargesServiceInterface["getWalletChargeStack"];
    getCurrency: CurrencyServiceInterface["getCurrencyByIsoCode"];
}

export class WithdrawalInitializer {
    declare wallet: WalletModelInterface;
    declare businessWallet?: WalletModelInterface | null;
    declare bankDetails: BankDetails;
    declare chargeStack?: ChargeStackModelInterface | null;
    declare currency?: CurrencyModelInterface | null;
    private declare chargesResult: ChargesCalculationResultDto;

    constructor(
        private readonly _dto: InitializeWithdrawalDto,
        private readonly _deps: WithdrawalInitializerDependencies
    ) {}

    async exec() {
        await this.fetchWallet();
        await this.verifyBankDetails();
        await this.fetchChargeStack();
        await this.fetchCurrencyIfNeeded();
        this.calculateCharges();
        this.checkWalletBalance();
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

    private fetchChargeStack = async () => {
        this.chargeStack = await this._deps.getWalletChargeStack(this.wallet.id, "withdrawal");
    };

    private async fetchCurrencyIfNeeded() {
        if (!this.businessWallet || this.businessWallet.customFundingCs) return;
        this.currency = await this._deps.getCurrency(this.businessWallet.currency);
    }

    private calculateCharges = () => {
        this.chargesResult = this._deps.calculateCharges(
            new CalculateTransactionChargesDto({
                amount: this._dto.amount,
                businessChargesPaidBy: "wallet",
                businessChargeStack: this.wallet.parentWallet?.w_withdrawalCs || [],
                customWalletChargeStack: this.chargeStack?.charges || null,
                platformChargesPaidBy: "wallet",
                platformChargeStack:
                    this.wallet.parentWallet?.customFundingCs || this.currency?.fundingCs || [],
                transactionType: "debit",
                waiveBusinessCharges: this.wallet.waiveWithdrawalCharges,
            })
        );
    };

    private checkWalletBalance = () => {
        console.log("\n\n\nTHE WALLET", this.chargesResult.senderPaid);
        if (this.wallet.balance < this.chargesResult.senderPaid)
            throw new InsufficientWalletBalanceError();

        if (
            this.wallet.parentWallet &&
            this.wallet.parentWallet.balance < this.chargesResult.businessPaid
        )
            throw new InsufficientWalletBalanceError();
    };
}
