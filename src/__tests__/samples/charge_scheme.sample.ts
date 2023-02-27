import { CreateChargeSchemeDto, StandardChargeSchemeDto } from "@logic/charge_scheme";
import { ChargeScheme } from "@data/charge_scheme";
import { currencyJson } from "./currency.samples";

const data: CreateChargeSchemeDto = {
    businessId: 1234,
    currency: currencyJson.isoCode,
    description: "This is a charge scheme",
    name: "Test charge scheme",
    flatCharge: 100,
    minimumPrincipalAmount: 0,
    payer: "customer",
    percentageCharge: 30,
    percentageChargeCap: 3000,
    transactionType: "funding",
};

export const chargeSchemeData = {
    customerFunding: new CreateChargeSchemeDto(data),
    customerWithdrawal: new CreateChargeSchemeDto({ ...data, transactionType: "withdrawal" }),
    walletFunding: new CreateChargeSchemeDto({ ...data, payer: "wallet" }),
    walletWithdrawal: new CreateChargeSchemeDto({
        ...data,
        payer: "wallet",
        transactionType: "withdrawal",
    }),
};

const id = "something";

export const chargeSchemeObj = {
    customerFunding: new ChargeScheme({ ...chargeSchemeData.customerFunding, id }),
    customerWithdrawal: new ChargeScheme({ ...chargeSchemeData.customerWithdrawal, id }),
    walletFunding: new ChargeScheme({ ...chargeSchemeData.walletFunding, id }),
    walletWithdrawal: new ChargeScheme({ ...chargeSchemeData.walletWithdrawal, id }),
};

export const chargeSchemeJson = {
    customerFunding: chargeSchemeObj.customerFunding.toJSON(),
    customerWithdrawal: chargeSchemeObj.customerWithdrawal.toJSON(),
    walletFunding: chargeSchemeObj.walletFunding.toJSON(),
    walletWithdrawal: chargeSchemeObj.walletWithdrawal.toJSON(),
};

export const standardChargeScheme = {
    customerFunding: new StandardChargeSchemeDto(chargeSchemeJson.customerFunding),
    customerWithdrawal: new StandardChargeSchemeDto(chargeSchemeJson.customerWithdrawal),
    walletFunding: new StandardChargeSchemeDto(chargeSchemeJson.walletFunding),
    walletWithdrawal: new StandardChargeSchemeDto(chargeSchemeJson.walletWithdrawal),
};
