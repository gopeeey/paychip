import { CreateCurrencyDto, StandardCurrencyDto } from "@logic/currency";
import { Currency, BusinessCurrency } from "@data/currency";
import { Business } from "@data/business";
import { Country } from "@data/country";
import { Account } from "@data/account";
import { ChargeDto } from "@logic/charges";

export const currencyData: CreateCurrencyDto = new CreateCurrencyDto({
    name: "Nigerian Naira",
    isoCode: "NGN",
    fundingCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 1000,
            minimumPrincipalAmount: 0,
            percentageCharge: 2,
            percentageChargeCap: 400000,
        })
    ),
    withdrawalCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 500,
            minimumPrincipalAmount: 0,
            percentageCharge: 1,
            percentageChargeCap: 400000,
        })
    ),
    walletInCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 0,
            minimumPrincipalAmount: 0,
            percentageCharge: 0,
            percentageChargeCap: 0,
        })
    ),
    walletOutCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 0,
            minimumPrincipalAmount: 0,
            percentageCharge: 0,
            percentageChargeCap: 0,
        })
    ),
});

export const currencyObj = new Currency(currencyData);

export const currencyObjArr = [currencyObj];

export const currencyJson = currencyObj.toJSON();

export const currencyJsonArr = [currencyJson];

export const standardCurrency = new StandardCurrencyDto(currencyJson);
export const standardCurrencyArr = [standardCurrency];

export const currencySeeder = async () => {
    await Currency.create(currencyData);
    // await Currency.create({
    //     name: "Nigerian Naira",
    //     isoCode: "NGN",
    //     fundingCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 1000,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 2,
    //             percentageChargeCap: 400000,
    //         })
    //     ),
    //     withdrawalCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 500,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 1,
    //             percentageChargeCap: 400000,
    //         })
    //     ),
    //     walletInCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 0,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 0,
    //             percentageChargeCap: 0,
    //         })
    //     ),
    //     walletOutCs: JSON.stringify(
    //         new ChargeDto({
    //             flatCharge: 0,
    //             minimumPrincipalAmount: 0,
    //             percentageCharge: 0,
    //             percentageChargeCap: 0,
    //         })
    //     ),
    // });
};
