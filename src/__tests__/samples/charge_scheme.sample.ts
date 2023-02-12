import { CreateChargeSchemeDto } from "../../contracts/dtos";
import { ChargeScheme } from "../../db/models";
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
    primary: false,
    transactionType: "credit",
};

export const chargeSchemeData = {
    customerCredit: new CreateChargeSchemeDto(data),
    customerDebit: new CreateChargeSchemeDto({ ...data, transactionType: "debit" }),
    walletCredit: new CreateChargeSchemeDto({ ...data, payer: "wallet" }),
    walletDebit: new CreateChargeSchemeDto({
        ...data,
        payer: "wallet",
        transactionType: "debit",
    }),
};

export const chargeSchemeObj = {
    customerCredit: new ChargeScheme(chargeSchemeData.customerCredit),
    customerDebit: new ChargeScheme(chargeSchemeData.customerDebit),
    walletCredit: new ChargeScheme(chargeSchemeData.walletCredit),
    walletDebit: new ChargeScheme(chargeSchemeData.walletDebit),
};

export const chargeSchemeJson = {
    customerCredit: chargeSchemeObj.customerCredit.toJSON(),
    customerDebit: chargeSchemeObj.customerDebit.toJSON(),
    walletCredit: chargeSchemeObj.walletCredit.toJSON(),
    walletDebit: chargeSchemeObj.walletDebit.toJSON(),
};
