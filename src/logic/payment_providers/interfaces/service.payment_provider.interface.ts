import { GeneratePaymentLinkDto, VerifyTransactionResponseDto } from "../dtos";
import { PaymentProviderRepoInterface } from "./payment_provider_repo.interface";

export interface PaymentProviderServiceInterface {
    generatePaymentLink: (paymentData: GeneratePaymentLinkDto) => Promise<string>;
    verifyTransaction: (
        reference: string,
        provider: string
    ) => Promise<VerifyTransactionResponseDto | null>;
}

export interface PaymentProviderServiceDependenciesInterface {
    [key: string]: PaymentProviderRepoInterface;
}
