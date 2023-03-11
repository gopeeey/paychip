import { CreateChargeStackDto, StandardChargeStackDto } from "@logic/charges";
import { ChargeStack } from "@data/charges";
import { currencyJson } from "./currency.samples";
import { businessSeeder } from "./business.samples";
import { Business } from "@data/business";
import { SeedingError } from "../test_utils";
import { Country } from "@data/country";
import { generateId } from "src/utils";

const data: CreateChargeStackDto = {
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

export const chargeStackData = {
    senderFunding: new CreateChargeStackDto(data),
    senderWithdrawal: new CreateChargeStackDto({ ...data, transactionType: "withdrawal" }),
    receiverFunding: new CreateChargeStackDto({ ...data, payer: "receiver" }),
    receiverWithdrawal: new CreateChargeStackDto({
        ...data,
        payer: "receiver",
        transactionType: "withdrawal",
    }),
};

const id = "something";

export const chargeStackObj = {
    senderFunding: new ChargeStack({ ...chargeStackData.senderFunding, id }),
    senderWithdrawal: new ChargeStack({ ...chargeStackData.senderWithdrawal, id }),
    receiverFunding: new ChargeStack({ ...chargeStackData.receiverFunding, id }),
    receiverWithdrawal: new ChargeStack({ ...chargeStackData.receiverWithdrawal, id }),
};

export const chargeStackJson = {
    senderFunding: chargeStackObj.senderFunding.toJSON(),
    senderWithdrawal: chargeStackObj.senderWithdrawal.toJSON(),
    receiverFunding: chargeStackObj.receiverFunding.toJSON(),
    receiverWithdrawal: chargeStackObj.receiverWithdrawal.toJSON(),
};

export const standardChargeStack = {
    senderFunding: new StandardChargeStackDto(chargeStackJson.senderFunding),
    senderWithdrawal: new StandardChargeStackDto(chargeStackJson.senderWithdrawal),
    receiverFunding: new StandardChargeStackDto(chargeStackJson.receiverFunding),
    receiverWithdrawal: new StandardChargeStackDto(chargeStackJson.receiverWithdrawal),
};

export const chargeStackSeeder = async () => {
    await businessSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("business not found");
    const country = await Country.findByPk(business.countryCode);
    if (!country) throw new SeedingError("country not found");

    await ChargeStack.create({
        ...chargeStackData.senderFunding,
        businessId: business.id,
        currency: country.currencyCode,
        id: generateId(),
    });
};
