import config from "src/config";
import {
    PaymentProviderRepoInterface,
    PaymentProviderServiceDependenciesInterface,
    PaymentProviderServiceInterface,
} from "./interfaces";

export class PaymentProviderService implements PaymentProviderServiceInterface {
    private readonly currentTransferProviderKey: string = config.payment.currentTransferProvider;
    private readonly currentPaymentProviderKey: string = config.payment.currentPaymentProvider;
    private readonly currentPaymentProvider: PaymentProviderRepoInterface;
    private readonly currentTransferProvider: PaymentProviderRepoInterface;

    constructor(private readonly _providers: PaymentProviderServiceDependenciesInterface) {
        this.currentPaymentProvider = _providers[this.currentPaymentProviderKey];
        this.currentTransferProvider = _providers[this.currentTransferProviderKey];
    }

    generatePaymentLink: PaymentProviderServiceInterface["generatePaymentLink"] = async (data) => {
        const link = await this.currentPaymentProvider.generatePaymentLink(data);
        return link;
    };
}
