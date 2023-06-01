import { GeneratePaymentLinkDto } from "../dtos";
import { PaymentProviderRepoInterface } from "./payment_provider_repo.interface";

export interface PaymentProviderServiceInterface {
    generatePaymentLink: (paymentData: GeneratePaymentLinkDto) => Promise<string>;
}

export interface PaymentProviderServiceDependenciesInterface {
    [key: string]: PaymentProviderRepoInterface;
}
