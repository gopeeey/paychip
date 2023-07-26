import {
    BankDetails,
    GeneratePaymentLinkDto,
    SendMoneyDto,
    VerifyTransactionResponseDto,
} from "../dtos";

export interface PaymentProviderRepoInterface {
    generatePaymentLink: (paymentData: GeneratePaymentLinkDto) => Promise<string>;
    verifyTransaction: (reference: string) => Promise<VerifyTransactionResponseDto | null>;
    verifyBankDetails: (details: BankDetails) => Promise<BankDetails>;
    sendMoney: (sendMoneyDto: SendMoneyDto) => Promise<string>;
}
