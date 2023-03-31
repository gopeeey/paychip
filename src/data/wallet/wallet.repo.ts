import { WalletModelInterface, WalletRepoInterface } from "@logic/wallet";
import { generateId } from "src/utils";
import { Wallet } from "./wallet.model";
import { Op, Transaction } from "sequelize";
import { walletJson } from "src/__tests__/samples";

export class WalletRepo implements WalletRepoInterface {
    constructor(private readonly _modelContext: typeof Wallet) {}

    create: WalletRepoInterface["create"] = async (createWalletDto, session) => {
        const wallet = await this._modelContext.create(
            { ...createWalletDto, id: generateId(createWalletDto.businessId) },
            { transaction: session as Transaction }
        );
        return wallet.toJSON();
    };

    getById = async (id: WalletModelInterface["id"]) => {
        const wallet = await this._modelContext.findByPk(id);
        return wallet ? wallet.toJSON() : null;
    };

    getUnique: WalletRepoInterface["getUnique"] = async (getUniqueDto) => {
        const wallet = await this._modelContext.findOne({ where: { ...getUniqueDto } });
        return wallet ? wallet.toJSON() : null;
    };

    incrementBalance: WalletRepoInterface["incrementBalance"] = async (incrementBalanceDto) => {
        await Wallet.increment("balance", {
            by: Math.round(incrementBalanceDto.amount),
            where: { id: incrementBalanceDto.walletId },
            transaction: incrementBalanceDto.session as Transaction,
        });
    };
}
