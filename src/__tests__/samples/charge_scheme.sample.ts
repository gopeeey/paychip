import { CreateChargeSchemeDto, StandardChargeSchemeDto } from "@logic/charge_scheme";
import { ChargeScheme } from "@data/charge_scheme";
import { currencyJson } from "./currency.samples";
import { businessSeeder } from "./business.samples";
import { Business } from "@data/business";
import { SeedingError } from "../test_utils";
import { Country } from "@data/country";
import { generateId } from "src/utils";

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

export const chargeSchemeSeeder = async () => {
    await businessSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("business not found");
    const country = await Country.findByPk(business.countryCode);
    if (!country) throw new SeedingError("country not found");

    await ChargeScheme.create({
        ...chargeSchemeData.senderFunding,
        businessId: business.id,
        currency: country.currencyCode,
        id: generateId(),
    });
};
