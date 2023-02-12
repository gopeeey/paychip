import { Account } from "./account.model";
import { Business } from "./business.model";
import { Country } from "./country.model";
import { Currency } from "./currency.model";
import { BusinessCurrency } from "./business_currency.model";
import { Customer } from "./customer.model";
import { ChargeScheme } from "./charge_scheme.model";

// Associate

// accounts and businesses
Account.hasMany(Business, { sourceKey: "id", foreignKey: "ownerId", as: "businesses" });
Business.belongsTo(Account, { targetKey: "id", foreignKey: "ownerId", as: "owner" });

// businesses and countries
Country.hasMany(Business, { sourceKey: "isoCode", foreignKey: "countryCode", as: "businesses" });
Business.belongsTo(Country, { targetKey: "isoCode", foreignKey: "countryCode", as: "country" });

// businesses and customers
Business.hasMany(Customer, { sourceKey: "id", foreignKey: "businessId", as: "customers" });
Customer.belongsTo(Business, { targetKey: "id", foreignKey: "businessId", as: "business" });

// businesses and currencies
Business.belongsToMany(Currency, {
    through: BusinessCurrency,
    sourceKey: "id",
    targetKey: "isoCode",
    as: "currencies",
});
Currency.belongsToMany(Business, {
    through: BusinessCurrency,
    sourceKey: "isoCode",
    targetKey: "id",
    as: "businesses",
});

// currencies and countries
Currency.hasMany(Country, { sourceKey: "isoCode", foreignKey: "currencyCode", as: "countries" });
Country.belongsTo(Currency, { targetKey: "isoCode", foreignKey: "currencyCode", as: "currency" });

// charge schemes and businesses
Business.hasMany(ChargeScheme, { sourceKey: "id", foreignKey: "businessId", as: "chargeSchemes" });
ChargeScheme.belongsTo(Business, { targetKey: "id", foreignKey: "businessId", as: "business" });

export * from "./account.model";
export * from "./country.model";
export * from "./business.model";
export * from "./customer.model";
export * from "./currency.model";
export * from "./business_currency.model";
export * from "./charge_scheme.model";
