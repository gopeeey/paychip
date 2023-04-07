import { QueryInterface, Sequelize, DataTypes, UUIDV4 } from "sequelize";
import { Account } from "../accountss";

module.exports = {
    up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.createTable<Account>(Account.tableName, {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: UUIDV4,
            },
            name: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(300),
                allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        });
    },

    down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
        return await queryInterface.dropTable(Account.tableName);
    },
};
