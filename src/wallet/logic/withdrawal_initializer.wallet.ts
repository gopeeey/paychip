import { BankDetails, PaymentProviderServiceInterface } from "@payment_providers/logic";
import { CreateTransactionDto, IncrementBalanceDto, InitializeWithdrawalDto } from "./dtos";
import {
    TransactionModelInterface,
    TransactionServiceInterface,
    WalletModelInterface,
    WalletRepoInterface,
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
import { CustomerServiceInterface } from "@customer/logic";
import { generateId } from "src/utils";
import { SessionInterface } from "@bases/logic";

export interface WithdrawalInitializerDependencies {
    getWalletByIdWithBusinessWallet: WalletServiceInterface["getWalletByIdWithBusinessWallet"];
    verifyBankDetails: PaymentProviderServiceInterface["verifyBankDetails"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    getWalletChargeStack: ChargesServiceInterface["getWalletChargeStack"];
    getCurrency: CurrencyServiceInterface["getCurrencyByIsoCode"];
    createTransaction: TransactionServiceInterface["createTransaction"];
    getOrCreateCustomer: CustomerServiceInterface["getOrCreateCustomer"];
    incrementWalletBalance: WalletServiceInterface["incrementBalance"];
    startSession: WalletRepoInterface["startSession"];
}

export class WithdrawalInitializer {
    declare wallet: WalletModelInterface;
    declare businessWallet?: WalletModelInterface | null;
    declare bankDetails: BankDetails;
    declare chargeStack?: ChargeStackModelInterface | null;
    declare currency?: CurrencyModelInterface | null;
    declare transaction: TransactionModelInterface;
    declare reference: string;
    declare session: SessionInterface;
    private declare chargesResult: ChargesCalculationResultDto;

    constructor(
        private readonly _dto: InitializeWithdrawalDto,
        private readonly _deps: WithdrawalInitializerDependencies
    ) {}

    async exec() {
        this.session = await this._deps.startSession();

        try {
            await this.fetchWallet();
            await this.verifyBankDetails();
            await this.fetchChargeStack();
            await this.fetchCurrencyIfNeeded();
            this.calculateCharges();
            this.checkWalletBalance();
            await this.createTransaction();
            await this.debitWallets();

            await this.session.commit();
            await this.session.end();
        } catch (err) {
            if (!this.session.ended) {
                await this.session.rollback();
                await this.session.end();
            }
            throw err;
        }
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
        if (this.wallet.balance < this.chargesResult.senderPaid)
            throw new InsufficientWalletBalanceError();

        if (
            this.wallet.parentWallet &&
            this.wallet.parentWallet.balance < this.chargesResult.businessPaid
        )
            throw new InsufficientWalletBalanceError();
    };

    private createTransaction = async () => {
        const customer = await this._deps.getOrCreateCustomer({
            businessId: this.wallet.businessId,
            email: this.wallet.email,
        });

        this.reference = generateId();

        const { amount } = this._dto;
        const {
            businessCharge,
            businessGot,
            businessPaid,
            platformCharge,
            platformGot,
            receiverPaid,
            senderPaid,
            settledAmount,
            businessChargesPaidBy,
            platformChargesPaidBy,
        } = this.chargesResult;
        const transactionData = new CreateTransactionDto({
            amount,
            businessCharge,
            businessChargePaidBy: businessChargesPaidBy,
            platformChargePaidBy: platformChargesPaidBy,
            businessGot,
            businessId: this.wallet.businessId,
            businessPaid,
            bwId: this.businessWallet?.id,
            channel: "bank",
            currency: this.wallet.currency,
            platformCharge,
            platformGot,
            receiverPaid,
            senderPaid,
            settledAmount,
            transactionType: "debit",
            customerId: customer.id,
            reference: this.reference,
            senderWalletId: this.wallet.id,
        });

        this.transaction = await this._deps.createTransaction(transactionData, this.session);
    };

    private debitWallets = async () => {
        await this._deps.incrementWalletBalance(
            new IncrementBalanceDto({
                walletId: this.wallet.id,
                amount: -this.chargesResult.senderPaid,
                session: this.session,
            })
        );

        if (this.wallet.parentWallet && this.chargesResult.businessPaid) {
            await this._deps.incrementWalletBalance(
                new IncrementBalanceDto({
                    walletId: this.wallet.parentWallet.id,
                    amount: -this.chargesResult.businessPaid,
                    session: this.session,
                })
            );
        }
    };
}
