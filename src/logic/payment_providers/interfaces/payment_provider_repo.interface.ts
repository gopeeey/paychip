import { GeneratePaymentLinkDto } from "../dtos";

export interface PaymentProviderRepoInterface {
    generatePaymentLink: (paymentData: GeneratePaymentLinkDto) => Promise<string>;
}
