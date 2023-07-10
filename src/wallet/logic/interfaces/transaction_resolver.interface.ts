import { PaymentProviderServiceInterface } from "@third_party/payment_providers/logic";
import { TransactionServiceInterface } from "@transaction/logic";
import { WalletServiceDependencies, WalletServiceInterface } from "./service.wallet.interface";
import { ChargesServiceInterface } from "@charges/logic";
import { ImdsInterface, SessionInterface } from "@bases/logic";
import { CustomerModelInterface, GetSingleBusinessCustomerDto } from "@customer/logic";

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
    getWalletById: WalletServiceInterface["getWalletById"];
    getBusinessWallet: WalletServiceInterface["getBusinessWalletByCurrency"];
    getCurrency: WalletServiceDependencies["getCurrency"];
    getWalletChargeStack: WalletServiceDependencies["getWalletChargeStack"];
    calculateCharges: ChargesServiceInterface["calculateTransactionCharges"];
    startSession: () => Promise<SessionInterface>;
    updateTransactionInfo: TransactionServiceInterface["updateTransactionInfo"];
    incrementWalletBalance: WalletServiceInterface["incrementBalance"];
}
