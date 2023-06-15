import { GeneratePaymentLinkDto, VerifyTransactionResponseDto } from "../dtos";

export interface PaymentProviderRepoInterface {
    generatePaymentLink: (paymentData: GeneratePaymentLinkDto) => Promise<string>;
    verifyTransaction: (reference: string) => Promise<VerifyTransactionResponseDto | null>;
}
