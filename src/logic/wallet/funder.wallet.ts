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
import { ChargeStackModelInterface } from "@logic/charges";

export interface WalletFunderDependencies {
    getWalletById: WalletServiceInterface["getWalletById"];
    getUniqueWallet: WalletServiceInterface["getUniqueWallet"];
    getOrCreateCustomer: (data: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
    getBusinessWallet: WalletServiceDependencies["getBusinessWallet"];
    getCurrency: WalletServiceDependencies["getCurrency"];
    getWalletChargeStack: WalletServiceDependencies["getWalletChargeStack"];
}

export class WalletFunder {
    private declare wallet: WalletModelInterface;
    private declare customer: CustomerModelInterface;
    private declare businessWallet: BusinessWalletModelInterface;
    private currency?: CurrencyModelInterface;
    private chargeStack?: ChargeStackModelInterface;

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
        // calculate charges and amounts
        // create transaction
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
}
