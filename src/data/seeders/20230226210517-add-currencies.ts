import { CurrencyModelInterface } from "@logic/currency";
import { ChargeDto } from "@logic/charges";
import { QueryInterface, Sequelize, Op } from "sequelize";
import { Currency } from "../currency";

const naira: CurrencyModelInterface = {
    name: "Nigerian Naira",
    isoCode: "NGN",
    createdAt: new Date(),
    updatedAt: new Date(),
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
};

const dollar: CurrencyModelInterface = {
    name: "United States Dollar",
    isoCode: "USD",
    createdAt: new Date(),
    updatedAt: new Date(),
    fundingCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 1200,
            minimumPrincipalAmount: 0,
            percentageCharge: 3,
            percentageChargeCap: 400000,
        })
    ),
    withdrawalCs: JSON.stringify(
        new ChargeDto({
            flatCharge: 600,
            minimumPrincipalAmount: 0,
            percentageCharge: 1.5,
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
};

module.exports = {
    up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.bulkInsert(Currency.tableName, [naira, dollar]);
    },

    down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.bulkDelete(Currency.tableName, {
            [Op.or]: [{ isoCode: "NGN" }, { isoCode: "USD" }],
        });
    },
};
