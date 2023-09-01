import { AccountServiceInterface } from "@accounts/logic";
import { BusinessServiceInterface } from "@business/logic";
import { ChargesServiceInterface } from "@charges/logic";
import { CountryServiceInterface } from "@country/logic";
import { TransactionServiceInterface, WalletServiceInterface } from "@wallet/logic";
import { AuthMiddlewareInterface } from "@bases/web";
import { PaymentProviderServiceInterface } from "@payment_providers/logic";
import { TransactionQueueInterface } from "@queues/transactions";
import { VerifyTransferQueueInterface } from "@queues/transfers";
import { ImdsInterface } from "@bases/logic";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    chargesService: ChargesServiceInterface;
    countryService: CountryServiceInterface;
    transactionService: TransactionServiceInterface;
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
    imdsService: ImdsInterface;
    paymentProviderService: PaymentProviderServiceInterface;
    publishTransactionTask: TransactionQueueInterface["publish"];
    publishTransferVerificationTask: VerifyTransferQueueInterface["publish"];
}
