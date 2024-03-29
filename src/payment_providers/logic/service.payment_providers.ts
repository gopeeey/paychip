import config from "src/config";
import {
    PaymentProviderRepoInterface,
    PaymentProviderServiceDependenciesInterface,
    PaymentProviderServiceInterface,
} from "./interfaces";

export class PaymentProviderService implements PaymentProviderServiceInterface {
    private readonly _currents: {
        transfer: PaymentProviderRepoInterface;
        payment: PaymentProviderRepoInterface;
        bankVerification: PaymentProviderRepoInterface;
    };

    constructor(private readonly _providers: PaymentProviderServiceDependenciesInterface) {
        const { payment, transfer, bankVerification } = config.payment.currentProviders;
        this._currents = {
            transfer: _providers[transfer],
            payment: _providers[payment],
            bankVerification: _providers[bankVerification],
        };
    }

    generatePaymentLink: PaymentProviderServiceInterface["generatePaymentLink"] = async (data) => {
        const link = await this._currents.payment.generatePaymentLink(data);
        return link;
    };

    verifyTransaction: PaymentProviderServiceInterface["verifyTransaction"] = async (
        reference,
        provider
    ) => {
        const transactionDetails = await this._providers[provider].verifyTransaction(reference);
        return transactionDetails;
    };

    verifyBankDetails: PaymentProviderServiceInterface["verifyBankDetails"] = async (details) => {
        const verifiedDetails = await this._currents.bankVerification.verifyBankDetails(details);
        return verifiedDetails;
    };

    sendMoney: PaymentProviderServiceInterface["sendMoney"] = async (data) => {
        const ref = await this._providers[data.provider].sendMoney(data);
        return ref;
    };

    verifyTransfer: PaymentProviderServiceInterface["verifyTransfer"] = async (dto) => {
        const res = await this._providers[dto.provider].verifyTransfer(dto);
        return res;
    };
}
