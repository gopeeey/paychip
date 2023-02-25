import { CreateCurrencyDto, StandardCurrencyDto } from "@logic/currency";
import { Currency, BusinessCurrency } from "@data/currency";

export const currencyData = new CreateCurrencyDto({ name: "Nigerian Naira", isoCode: "NGN" });

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
