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
    payer: "sender",
    percentageCharge: 30,
    percentageChargeCap: 3000,
    transactionType: "funding",
};

export const chargeSchemeData = {
    senderFunding: new CreateChargeSchemeDto(data),
    senderWithdrawal: new CreateChargeSchemeDto({ ...data, transactionType: "withdrawal" }),
    receiverFunding: new CreateChargeSchemeDto({ ...data, payer: "receiver" }),
    receiverWithdrawal: new CreateChargeSchemeDto({
        ...data,
        payer: "receiver",
        transactionType: "withdrawal",
    }),
};

const id = "something";

export const chargeSchemeObj = {
    senderFunding: new ChargeScheme({ ...chargeSchemeData.senderFunding, id }),
    senderWithdrawal: new ChargeScheme({ ...chargeSchemeData.senderWithdrawal, id }),
    receiverFunding: new ChargeScheme({ ...chargeSchemeData.receiverFunding, id }),
    receiverWithdrawal: new ChargeScheme({ ...chargeSchemeData.receiverWithdrawal, id }),
};

export const chargeSchemeJson = {
    senderFunding: chargeSchemeObj.senderFunding.toJSON(),
    senderWithdrawal: chargeSchemeObj.senderWithdrawal.toJSON(),
    receiverFunding: chargeSchemeObj.receiverFunding.toJSON(),
    receiverWithdrawal: chargeSchemeObj.receiverWithdrawal.toJSON(),
};

export const standardChargeScheme = {
    senderFunding: new StandardChargeSchemeDto(chargeSchemeJson.senderFunding),
    senderWithdrawal: new StandardChargeSchemeDto(chargeSchemeJson.senderWithdrawal),
    receiverFunding: new StandardChargeSchemeDto(chargeSchemeJson.receiverFunding),
    receiverWithdrawal: new StandardChargeSchemeDto(chargeSchemeJson.receiverWithdrawal),
};
