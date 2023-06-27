import { PaymentProviderServiceInterface } from "@third_party/payment_providers/logic";
import { TransactionServiceInterface } from "@transaction/logic";
import { WalletServiceDependencies, WalletServiceInterface } from "./service.wallet.interface";
import { ChargesServiceInterface } from "@charges/logic";
import { SessionInterface } from "@bases/logic";
import { CustomerModelInterface, GetSingleBusinessCustomerDto } from "@customer/logic";

export interface PaymentResolverInterface {
    exec: () => Promise<void>;
}

export interface PaymentResolverDependencies {
    reference: string;
    provider: string;
    verifyTransactionFromProvider: PaymentProviderServiceInterface["verifyTransaction"];
    createTransaction: TransactionServiceInterface["createTransaction"];
    getOrCreateCustomer: (data: GetSingleBusinessCustomerDto) => Promise<CustomerModelInterface>;
    findTransactionByReference: TransactionServiceInterface["findTransactionByReference"];
    getWalletById: WalletServiceInterface["getWalletById"];
    getBusinessWallet: WalletServiceDependencies["getBusinessWallet"];
    getCurrency: WalletServiceDependencies["getCurrency"];
    getWalletChargeStack: WalletServiceDependencies["getWalletChargeStack"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    startSession: () => Promise<SessionInterface>;
    updateTransactionStatus: TransactionServiceInterface["updateTransactionStatus"];
    incrementWalletBalance: WalletServiceInterface["incrementBalance"];
}
