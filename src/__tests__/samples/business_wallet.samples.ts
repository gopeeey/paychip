import { Business } from "@data/business";
import { BusinessWallet } from "@data/business_wallet";
import { Country } from "@data/country";
import { Currency } from "@data/currency";
import { CreateBusinessWalletDto } from "@logic/business_wallet";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { businessJson, businessSeeder } from "./business.samples";
import { currencyJson } from "./currency.samples";

export const bwData = new CreateBusinessWalletDto({
    businessId: businessJson.id,
    currencyCode: currencyJson.isoCode,
});

export const bwObj = new BusinessWallet({
    ...bwData,
    id: "something",
    balance: 0,
    customFundingCs: "[]",
    customWithdrawalCs: "[]",
    customWalletInCs: "[]",
    customWalletOutCs: "[]",
    fundingChargesPaidBy: "wallet",
    withdrawalChargesPaidBy: "wallet",
    w_fundingCs: "[]",
    w_withdrawalCs: "[]",
    w_walletInCs: "[]",
    w_walletOutCs: "[]",
    w_fundingChargesPaidBy: "wallet",
    w_withdrawalChargesPaidBy: "wallet",
});

export const bwJson = bwObj.toJSON();

export const bwSeeder = async () => {
    await businessSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("Business not found");
    const country = await Country.findByPk(business.countryCode);
    if (!country) throw new SeedingError("Country not found");
    const currency = await Currency.findByPk(country.currencyCode);
    if (!currency) throw new SeedingError("Currency not found");

    await BusinessWallet.create({
        businessId: business.id,
        currencyCode: currency.isoCode,
        id: generateId(business.id),
    });
};
