import { SessionInterface } from "@bases/logic";
import { CreateWalletDto, InitializeFundingDto, GetUniqueWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";
import { WalletRepoInterface } from "./wallet.repo.interface";
import { BusinessWalletModelInterface as BwModelInterface } from "@logic/business_wallet";
import { CurrencyModelInterface } from "@logic/currency";
import {
    ChargeStackModelInterface,
    ChargesServiceInterface,
    WalletChargeStackModelInterface,
} from "@logic/charges";
import { TransactionServiceInterface } from "@logic/transaction";
import { PaymentProviderService } from "@logic/payment_providers";
import { CustomerServiceInterface } from "@logic/customer";

export interface WalletServiceInterface {
    createWallet: (
        createWalletDto: CreateWalletDto,
        session?: SessionInterface
    ) => Promise<WalletModelInterface>;

    getWalletById: (id: WalletModelInterface["id"]) => Promise<WalletModelInterface>;
    getUniqueWallet: (uniqueData: GetUniqueWalletDto) => Promise<WalletModelInterface>;
    initializeFunding: (fundingDto: InitializeFundingDto) => Promise<string>;
}

export interface WalletServiceDependencies {
    repo: WalletRepoInterface;
    getBusinessWallet: (
        businessId: BwModelInterface["businessId"],
        currencyCode: BwModelInterface["currencyCode"]
    ) => Promise<BwModelInterface>;
    getCurrency: (
        currencyCode: WalletModelInterface["currency"]
    ) => Promise<CurrencyModelInterface>;
    getWalletChargeStack: (
        walletId: WalletModelInterface["id"],
        chargeType: WalletChargeStackModelInterface["chargeType"]
    ) => Promise<ChargeStackModelInterface | null>;
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    createTransaction: TransactionServiceInterface["createTransaction"];
    generatePaymentLink: PaymentProviderService["generatePaymentLink"];
    getOrCreateCustomer: CustomerServiceInterface["getOrCreateCustomer"];
}
