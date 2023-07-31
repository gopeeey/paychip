import {
    BankDetails,
    GeneratePaymentLinkDto,
    SendMoneyDto,
    VerifyTransactionResponseDto,
    VerifyTransferDto,
    VerifyTransferResponseDto,
} from "../dtos";
import { PaymentProviderRepoInterface } from "./payment_provider_repo.interface";

export interface PaymentProviderServiceInterface {
    generatePaymentLink: (paymentData: GeneratePaymentLinkDto) => Promise<string>;
    verifyTransaction: (
        reference: string,
        provider: string
    ) => Promise<VerifyTransactionResponseDto | null>;
    verifyBankDetails: (details: BankDetails) => Promise<BankDetails>;
    sendMoney: (data: SendMoneyDto) => Promise<string>;
    verifyTransfer: (dto: VerifyTransferDto) => Promise<VerifyTransferResponseDto>;
}

export interface PaymentProviderServiceDependenciesInterface {
    [key: string]: PaymentProviderRepoInterface;
}
