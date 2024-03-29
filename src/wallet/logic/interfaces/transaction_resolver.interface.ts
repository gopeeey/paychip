import { PaymentProviderServiceInterface } from "@payment_providers/logic";
import { TransactionServiceInterface } from "@wallet/logic";
import { WalletServiceDependencies, WalletServiceInterface } from "./service.wallet.interface";
import { ChargesServiceInterface } from "@charges/logic";
import { ImdsInterface, SessionInterface } from "@bases/logic";
import {
    CustomerModelInterface,
    CustomerServiceInterface,
    GetSingleBusinessCustomerDto,
} from "@customer/logic";
import { NotificationServiceInterface } from "@notifications/logic";

export interface TransactionResolverInterface {
    exec: () => Promise<void>;
}

export interface TransactionResolverDependencies {
    reference: string;
    provider: string;
    imdsService: ImdsInterface;
    verifyTransactionFromProvider: PaymentProviderServiceInterface["verifyTransaction"];
    createTransaction: TransactionServiceInterface["createTransaction"];
    getOrCreateCustomer: (data: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
    findTransactionByReference: TransactionServiceInterface["findTransactionByReference"];
    getWalletByIdWithBusinessWallet: WalletServiceInterface["getWalletByIdWithBusinessWallet"];
    getBusinessWallet: WalletServiceInterface["getBusinessWalletByCurrency"];
    getCurrency: WalletServiceDependencies["getCurrency"];
    getWalletChargeStack: WalletServiceDependencies["getWalletChargeStack"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    startSession: () => Promise<SessionInterface>;
    updateTransactionInfo: TransactionServiceInterface["updateTransactionInfo"];
    incrementWalletBalance: WalletServiceInterface["incrementBalance"];
    updateCustomer: CustomerServiceInterface["updateCustomer"];
    sendEmail: NotificationServiceInterface["sendEmail"];
}
