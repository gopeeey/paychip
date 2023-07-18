import { InternalError } from "@bases/logic";
import { InitializeFundingDto, GetUniqueWalletDto, CreateTransactionDto } from "./dtos";
import { InvalidFundingData } from "./errors";
import {
    WalletModelInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
    TransactionModelInterface,
    TransactionServiceInterface,
} from "./interfaces";
import { CustomerModelInterface, GetSingleBusinessCustomerDto } from "@customer/logic";
import { CurrencyModelInterface } from "@currency/logic";
import {
    ChargeStackModelInterface,
    ChargesCalculationResultDto,
    ChargesServiceInterface,
} from "@charges/logic";
import config from "src/config";
import { PaymentProviderServiceInterface } from "@payment_providers/logic/interfaces/service.payment_provider.interface";
import { SessionInterface } from "@bases/logic";
import * as utils from "src/utils";

export interface FundingInitializerDependencies {
    getWalletById: WalletServiceInterface["getWalletById"];
    getUniqueWallet: WalletServiceInterface["getUniqueWallet"];
    getOrCreateCustomer: (data: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
    getBusinessWallet: WalletServiceInterface["getBusinessWalletByCurrency"];
    getCurrency: WalletServiceDependencies["getCurrency"];
    getWalletChargeStack: WalletServiceDependencies["getWalletChargeStack"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    createTransaction: TransactionServiceInterface["createTransaction"];
    generatePaymentLink: PaymentProviderServiceInterface["generatePaymentLink"];
    startSession: () => Promise<SessionInterface>;
}

export class FundingInitializer {
    private declare wallet: WalletModelInterface;
    private declare customer: CustomerModelInterface;
    private declare businessWallet: WalletModelInterface;
    private currency?: CurrencyModelInterface;
    private chargeStack?: ChargeStackModelInterface | null;
    private declare chargesResult: ChargesCalculationResultDto;
    private provider: TransactionModelInterface["provider"] = config.payment.currentPaymentProvider;
    private declare transaction: TransactionModelInterface;
    private declare paymentLink: string;
    private declare session: SessionInterface;

    constructor(
        private readonly _dto: InitializeFundingDto,
        private readonly _deps: FundingInitializerDependencies
    ) {}

    async exec() {
        this.session = await this._deps.startSession();
        try {
            await this.fetchWallet();
            await this.fetchCustomer();
            await this.fetchBusinessWallet();
            await this.fetchCurrencyIfNeeded();
            await this.fetchChargeStackIfNeeded();
            this.calculateChargesAndAmounts();
            await this.createTransaction();
            await this.generatePaymentLink();
            await this.session.commit();
            await this.session.end();
            return this.paymentLink;
        } catch (err) {
            if (!this.session.ended) {
                await this.session.rollback();
                await this.session.end();
            }
            throw err;
        }
    }

    private async fetchWallet() {
        const { walletId, email, currency, businessId } = this._dto;
        if (!walletId && (!email || !currency)) {
            throw new InvalidFundingData();
        }

        if (walletId) {
            this.wallet = await this._deps.getWalletById(walletId);
        } else {
            if (email && currency) {
                const uniqueData = new GetUniqueWalletDto({ businessId, email, currency });
                this.wallet = await this._deps.getUniqueWallet(uniqueData);
            } else {
                throw new InternalError("Wallet funding data not properly passed", this._dto);
            }
        }
    }

    private async fetchCustomer() {
        const data = new GetSingleBusinessCustomerDto({
            businessId: this._dto.businessId,
            email: this.wallet.email,
        });

        this.customer = await this._deps.getOrCreateCustomer(data);
    }

    private async fetchBusinessWallet() {
        this.businessWallet = await this._deps.getBusinessWallet(
            this.wallet.businessId,
            this.wallet.currency
        );
    }

    private async fetchCurrencyIfNeeded() {
        if (this.businessWallet.customFundingCs) return;
        this.currency = await this._deps.getCurrency(this.businessWallet.currency);
    }

    private async fetchChargeStackIfNeeded() {
        this.chargeStack = await this._deps.getWalletChargeStack(this.wallet.id, "funding");
    }

    private calculateChargesAndAmounts() {
        const { amount } = this._dto;
        this.chargesResult = this._deps.calculateCharges({
            amount,
            // businessChargesPaidBy:
            //     this.chargeStack?.paidBy || this.businessWallet.w_fundingChargesPaidBy,
            businessChargesPaidBy: "wallet",
            businessChargeStack: this.businessWallet.w_fundingCs || [],
            customWalletChargeStack: this.chargeStack?.charges || null,
            // platformChargesPaidBy: this.businessWallet.fundingChargesPaidBy,
            platformChargesPaidBy: "wallet",
            platformChargeStack:
                this.businessWallet.customFundingCs || this.currency?.fundingCs || [],
            transactionType: "credit",
            waiveBusinessCharges: this.wallet.waiveFundingCharges,
        });
    }

    private async createTransaction() {
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
        const { amount, businessId, callbackUrl } = this._dto;
        const reference = utils.generateId();
        const transactionData = new CreateTransactionDto({
            amount,
            businessCharge,
            businessChargePaidBy: businessChargesPaidBy,
            platformChargePaidBy: platformChargesPaidBy,
            businessGot,
            businessId,
            businessPaid,
            bwId: this.businessWallet.id,
            channel: null,
            currency: this.wallet.currency,
            platformCharge,
            platformGot,
            receiverPaid,
            senderPaid,
            settledAmount,
            transactionType: "credit",
            customerId: this.customer.id,
            callbackUrl,
            reference,
            provider: this.provider,
            senderWalletId: this.wallet.id,
            receiverWalletId: this.wallet.id,
        });

        this.transaction = await this._deps.createTransaction(transactionData, this.session);
    }

    private async generatePaymentLink() {
        const { amount, currency, reference } = this.transaction;
        this.paymentLink = await this._deps.generatePaymentLink({
            amount,
            allowedChannels: ["bank", "card"],
            currency,
            reference,
            walletId: this.wallet.id,
        });
    }
}
