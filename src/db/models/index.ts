import { Account } from "./account.model";
import { Business } from "./business.model";
import { Country } from "./country.model";
import { Currency } from "./currency.model";
import { BusinessCurrency } from "./business_currency.model";
import { Customer } from "./customer.model";

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
});
Currency.belongsToMany(Business, {
    through: BusinessCurrency,
    sourceKey: "isoCode",
    targetKey: "id",
});

export * from "./account.model";
export * from "./country.model";
export * from "./business.model";
export * from "./customer.model";
export * from "./currency.model";
