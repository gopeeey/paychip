import { Account } from "./account";
import { Business } from "./business";
import { Country } from "./country";
import { Currency, BusinessCurrency } from "./currency";
import { Customer } from "./customer";
import { ChargeScheme } from "./charge_scheme";
import { Wallet } from "./wallet";

export const runAssociations = () => {
    // Associate

    // accounts and businesses
    Account.hasMany(Business, { sourceKey: "id", foreignKey: "ownerId", as: "businesses" });
    Business.belongsTo(Account, { targetKey: "id", foreignKey: "ownerId", as: "owner" });

    // businesses and countries
    Country.hasMany(Business, {
        sourceKey: "isoCode",
        foreignKey: "countryCode",
        as: "businesses",
    });
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
    BusinessCurrency.belongsTo(Business, {
        targetKey: "id",
        foreignKey: "businessId",
        as: "business",
    });
    BusinessCurrency.belongsTo(Currency, {
        targetKey: "isoCode",
        foreignKey: "currencyIsoCode",
        as: "currency",
    });

    // currencies and countries
    Currency.hasMany(Country, {
        sourceKey: "isoCode",
        foreignKey: "currencyCode",
        as: "countries",
    });
    Country.belongsTo(Currency, {
        targetKey: "isoCode",
        foreignKey: "currencyCode",
        as: "currency",
    });

    // businesses and wallets
    Business.hasMany(Wallet, { sourceKey: "id", foreignKey: "businessId", as: "wallets" });
    Wallet.belongsTo(Business, { targetKey: "id", foreignKey: "businessId", as: "business" });

    // charge schemes and businesses
    Business.hasMany(ChargeScheme, {
        sourceKey: "id",
        foreignKey: "businessId",
        as: "chargeSchemes",
    });
    ChargeScheme.belongsTo(Business, { targetKey: "id", foreignKey: "businessId", as: "business" });

    // charge schemes and currencies
    Currency.hasMany(ChargeScheme, { sourceKey: "isoCode", foreignKey: "currency", as: "charges" });
    ChargeScheme.belongsTo(Currency, {
        targetKey: "isoCode",
        foreignKey: "currency",
        as: "chargeCurrency",
    });

    // charge schemes and wallets
    ChargeScheme.hasMany(Wallet, {
        sourceKey: "id",
        foreignKey: "fundingChargeSchemeId",
        as: "fundingWallets",
    });
    ChargeScheme.hasMany(Wallet, {
        sourceKey: "id",
        foreignKey: "withdrawalChargeSchemeId",
        as: "withdrawalWallets",
    });
    ChargeScheme.hasMany(Wallet, {
        sourceKey: "id",
        foreignKey: "walletInChargeSchemeId",
        as: "walletInWallets",
    });
    ChargeScheme.hasMany(Wallet, {
        sourceKey: "id",
        foreignKey: "walletOutChargeSchemeId",
        as: "walletOutWallets",
    });
    Wallet.belongsTo(ChargeScheme, {
        targetKey: "id",
        foreignKey: "fundingChargeSchemeId",
        as: "fundingChargeScheme",
    });
    Wallet.belongsTo(ChargeScheme, {
        targetKey: "id",
        foreignKey: "withdrawalChargeSchemeId",
        as: "withdrawalChargeScheme",
    });
    Wallet.belongsTo(ChargeScheme, {
        targetKey: "id",
        foreignKey: "walletInChargeSchemeId",
        as: "walletInChargeScheme",
    });
    Wallet.belongsTo(ChargeScheme, {
        targetKey: "id",
        foreignKey: "walletOutChargeSchemeId",
        as: "walletOutChargeScheme",
    });

    // wallets and wallets
    Wallet.hasMany(Wallet, { sourceKey: "id", foreignKey: "parentWalletId", as: "childWallets" });
    Wallet.belongsTo(Wallet, { targetKey: "id", foreignKey: "parentWalletId", as: "parentWallet" });

    // wallets and currencies
    Currency.hasMany(Wallet, { sourceKey: "isoCode", foreignKey: "currency", as: "wallets" });
    Wallet.belongsTo(Currency, {
        targetKey: "isoCode",
        foreignKey: "currency",
        as: "walletCurrency",
    });

    console.log("Running associations...");
};
