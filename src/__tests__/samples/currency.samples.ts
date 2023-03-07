import { CreateCurrencyDto, StandardCurrencyDto } from "@logic/currency";
import { Currency, BusinessCurrency } from "@data/currency";
import { Business } from "@data/business";
import { Country } from "@data/country";
import { Account } from "@data/account";

export const currencyData: CreateCurrencyDto = new CreateCurrencyDto({
    name: "Nigerian Naira",
    isoCode: "NGN",
});

export const currencyObj = new Currency(currencyData);
export const businessCurrencyObj = new BusinessCurrency({
    businessId: 1234,
    currencyIsoCode: currencyObj.isoCode,
});

export const currencyObjArr = [currencyObj];
export const businessCurrencyObjArr = [businessCurrencyObj];

export const currencyJson = currencyObj.toJSON();
export const businessCurrencyJson = businessCurrencyObj.toJSON();

export const businessCurrencyObjWithCurrency = { ...businessCurrencyObj, currency: currencyJson };

export const currencyJsonArr = [currencyJson];
export const businessCurrencyJsonArr = [businessCurrencyJson];
export const businessCurrencyObjWithCurrencyArr = [businessCurrencyObjWithCurrency];

export const standardCurrency = new StandardCurrencyDto(currencyJson);
export const standardCurrencyArr = [standardCurrency];

export const currencySeeder = async () => {
    const currency = await Currency.create(currencyData);
    await Currency.create({ isoCode: "USD", name: "United States Dollar" });
    const country = await Country.create({
        currencyCode: currency.isoCode,
        isoCode: "NGA",
        name: "Nigeria",
    });
    const account = await Account.create({ email: "mail@mail.com", name: "Sam", password: "hash" });
    const business = await Business.create({
        countryCode: country.isoCode,
        name: "New Business",
        ownerId: account.id,
    });

    await BusinessCurrency.create({ businessId: business.id, currencyIsoCode: currency.isoCode });
};
