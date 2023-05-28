import { InternalError } from "@logic/base_errors";
import { FundWalletDto, GetUniqueWalletDto } from "./dtos";
import { InvalidFundingData } from "./errors";
import {
    WalletModelInterface,
    WalletServiceDependencies,
    WalletServiceInterface,
} from "./interfaces";
import { CustomerModelInterface, GetSingleBusinessCustomerDto } from "@logic/customer";
import { BusinessWalletModelInterface } from "@logic/business_wallet";
import { CurrencyModelInterface } from "@logic/currency";
import {
    ChargeStackModelInterface,
    ChargesCalculationResultDto,
    ChargesServiceInterface,
} from "@logic/charges";
import {
    CreateTransactionDto,
    PaymentProviderType,
    TransactionServiceInterface,
} from "@logic/transaction";
import config from "src/config";

export interface WalletFunderDependencies {
    getWalletById: WalletServiceInterface["getWalletById"];
    getUniqueWallet: WalletServiceInterface["getUniqueWallet"];
    getOrCreateCustomer: (data: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
    getBusinessWallet: WalletServiceDependencies["getBusinessWallet"];
    getCurrency: WalletServiceDependencies["getCurrency"];
    getWalletChargeStack: WalletServiceDependencies["getWalletChargeStack"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    createTransaction: TransactionServiceInterface["createTransaction"];
}

export class WalletFunder {
    private declare wallet: WalletModelInterface;
    private declare customer: CustomerModelInterface;
    private declare businessWallet: BusinessWalletModelInterface;
    private currency?: CurrencyModelInterface;
    private chargeStack?: ChargeStackModelInterface;
    private declare chargesResult: ChargesCalculationResultDto;
    private provider: PaymentProviderType = config.payment.currentPaymentProvider;

    constructor(
        private readonly __dto: FundWalletDto,
        private readonly __deps: WalletFunderDependencies
    ) {}

    async exec() {
        await this.fetchWallet();
        await this.fetchCustomer();
        await this.fetchBusinessWallet();
        await this.fetchCurrencyIfNeeded();
        await this.fetchChargeStackIfNeeded();
        this.calculateChargesAndAmounts();
        await this.createTransaction();
        // generate payment link
    }

    private async fetchWallet() {
        const { walletId, email, currency, businessId } = this.__dto;
        if (!walletId && (!email || !currency)) {
            throw new InvalidFundingData();
        }

        if (walletId) {
            this.wallet = await this.__deps.getWalletById(walletId);
        } else {
            if (email && currency) {
                const uniqueData = new GetUniqueWalletDto({ businessId, email, currency });
                this.wallet = await this.__deps.getUniqueWallet(uniqueData);
            } else {
                throw new InternalError("Wallet funding data not properly passed", this.__dto);
            }
        }
    }

    private async fetchCustomer() {
        const data = new GetSingleBusinessCustomerDto({
            businessId: this.__dto.businessId,
            email: this.wallet.email,
        });

        this.customer = await this.__deps.getOrCreateCustomer(data);
    }

    private async fetchBusinessWallet() {
        this.businessWallet = await this.__deps.getBusinessWallet(
            this.wallet.businessId,
            this.wallet.currency
        );
    }

    private async fetchCurrencyIfNeeded() {
        if (this.businessWallet.customFundingCs) return;
        this.currency = await this.__deps.getCurrency(this.businessWallet.currencyCode);
    }

    private async fetchChargeStackIfNeeded() {
        this.chargeStack = await this.__deps.getWalletChargeStack(this.wallet.id, "funding");
    }

    private calculateChargesAndAmounts() {
        const { amount } = this.__dto;
        this.chargesResult = this.__deps.calculateCharges({
            amount,
            businessChargesPaidBy:
                this.chargeStack?.paidBy || this.businessWallet.w_fundingChargesPaidBy,
            businessChargeStack: this.businessWallet.w_fundingCs || [],
            customWalletChargeStack: this.chargeStack?.charges || null,
            platformChargesPaidBy: this.businessWallet.fundingChargesPaidBy,
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
        const { amount, businessId, callbackUrl } = this.__dto;

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
            provider: this.provider,
        });

        const transaction = await this.__deps.createTransaction(transactionData);
    }
}
