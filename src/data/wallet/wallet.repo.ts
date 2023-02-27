import { CreateWalletDto, WalletModelInterface, WalletRepoInterface } from "@logic/wallet";
import { generateId } from "src/utils";
import { Wallet } from "./wallet.model";
import { Op, Transaction } from "sequelize";

export class WalletRepo implements WalletRepoInterface {
    constructor(private readonly _modelContext: typeof Wallet) {}

    create: WalletRepoInterface["create"] = async (createWalletDto, session) => {
        const wallet = await this._modelContext.create(
            { ...createWalletDto, id: generateId() },
            { transaction: session as Transaction }
        );
        return wallet.toJSON();
    };

    getById = async (id: WalletModelInterface["id"]) => {
        const wallet = await this._modelContext.findByPk(id);
        return wallet ? wallet.toJSON() : null;
    };

    getUnique: WalletRepoInterface["getUnique"] = async ({ businessId, email, currency }) => {
        const wallet = await this._modelContext.findOne({ where: { businessId, email, currency } });
        return wallet ? wallet.toJSON() : null;
    };

    getBusinessRootWallet: WalletRepoInterface["getBusinessRootWallet"] = async (
        businessId,
        currency
    ) => {
        const wallet = await this._modelContext.findOne({
            where: {
                [Op.and]: [{ businessId }, { currency }, { parentWalletId: { [Op.is]: null } }],
            },
        });
        return wallet ? wallet.toJSON() : null;
    };
}
