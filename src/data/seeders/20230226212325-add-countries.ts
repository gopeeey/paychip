import { QueryInterface, Sequelize, Op } from "sequelize";
import { Country } from "../country";

module.exports = {
    up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.bulkInsert(Country.tableName, [
            {
                name: "Nigeria",
                isoCode: "NGA",
                currencyCode: "NGN",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "United States Of America",
                isoCode: "USA",
                currencyCode: "USD",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.bulkDelete(Country.tableName, {
            [Op.or]: [{ isoCode: "NGA" }, { isoCode: "USA" }],
        });
    },
};
