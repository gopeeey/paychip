import { AccountServiceInterface } from "@accounts/logic";
import { BusinessServiceInterface } from "@business/logic";
import { ChargesServiceInterface } from "@charges/logic";
import { CountryServiceInterface } from "@country/logic";
import { WalletServiceInterface } from "@wallet/logic";
import { AuthMiddlewareInterface } from "@bases/web";
import { PaymentProviderServiceInterface } from "@payment_providers/logic";
import { TransactionQueueInterface } from "@queues/transactions";

export interface DependencyContainerInterface {
    accountService: AccountServiceInterface;
    businessService: BusinessServiceInterface;
    chargesService: ChargesServiceInterface;
    countryService: CountryServiceInterface;
    walletService: WalletServiceInterface;
    authMiddleware: AuthMiddlewareInterface;
    paymentProviderService: PaymentProviderServiceInterface;
    publishTransactionTask: TransactionQueueInterface["publish"];
}
