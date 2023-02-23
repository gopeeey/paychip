import { CreateWalletDto } from "../../contracts/dtos";
import { WalletModelInterface, WalletRepoInterface } from "../../contracts/interfaces";
import { generateId } from "../../utils";
import { Wallet } from "../models";
import { Op } from "sequelize";

export class WalletRepo implements WalletRepoInterface {
    constructor(private readonly _modelContext: typeof Wallet) {}

    create = async (createWalletDto: CreateWalletDto) => {
        const wallet = await this._modelContext.create({ ...createWalletDto, id: generateId() });
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
