import { QueryInterface, Sequelize, Op } from "sequelize";
import { Currency } from "../currency";

module.exports = {
    up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.bulkInsert(Currency.tableName, [
            {
                name: "Nigerian Naira",
                isoCode: "NGN",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "United States Dollar",
                isoCode: "USD",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.bulkDelete(Currency.tableName, {
            [Op.or]: [{ isoCode: "NGN" }, { isoCode: "USD" }],
        });
    },
};
