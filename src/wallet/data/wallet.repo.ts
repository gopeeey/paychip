import { WalletModelInterface, WalletModelInterfaceDef, WalletRepoInterface } from "@wallet/logic";
import { generateId } from "src/utils";
import { Pool } from "pg";
import { PgBaseRepo } from "@db/postgres";
import * as queries from "./queries";
import { runQuery } from "@db/postgres";
import { PgSession } from "@db/postgres";

export interface DbWallet
    extends Omit<
        WalletModelInterfaceDef,
        | "customFundingCs"
        | "customWithdrawalCs"
        | "customWalletInCs"
        | "customWalletOutCs"
        | "w_fundingCs"
        | "w_withdrawalCs"
        | "w_walletInCs"
        | "w_walletOutCs"
    > {
    customFundingCs: string | null;
    customWithdrawalCs: string | null;
    customWalletInCs: string | null;
    customWalletOutCs: string | null;
    w_fundingCs: string | null;
    w_withdrawalCs: string | null;
    w_walletInCs: string | null;
    w_walletOutCs: string | null;
}

export class WalletRepo extends PgBaseRepo implements WalletRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    parseWallet = (data: DbWallet) => {
        const {
            customFundingCs,
            customWithdrawalCs,
            customWalletInCs,
            customWalletOutCs,
            w_fundingCs,
            w_withdrawalCs,
            w_walletInCs,
            w_walletOutCs,
        } = data;

        const wallet: WalletModelInterface = {
            ...data,
            customFundingCs: customFundingCs ? JSON.parse(customFundingCs) : null,
            customWithdrawalCs: customWithdrawalCs ? JSON.parse(customWithdrawalCs) : null,
            customWalletInCs: customWalletInCs ? JSON.parse(customWalletInCs) : null,
            customWalletOutCs: customWalletOutCs ? JSON.parse(customWalletOutCs) : null,
            w_fundingCs: w_fundingCs ? JSON.parse(w_fundingCs) : null,
            w_withdrawalCs: w_withdrawalCs ? JSON.parse(w_withdrawalCs) : null,
            w_walletInCs: w_walletInCs ? JSON.parse(w_walletInCs) : null,
            w_walletOutCs: w_walletOutCs ? JSON.parse(w_walletOutCs) : null,
        };
        return wallet;
    };

    create: WalletRepoInterface["create"] = async (createWalletDto, session) => {
        const query = queries.createWalletQuery({
            ...createWalletDto,
            id: generateId(createWalletDto.businessId),
        });

        const res = await runQuery<WalletModelInterface>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const wallet = res.rows[0];
        return wallet;
    };

    getById = async (id: WalletModelInterface["id"]) => {
        const res = await runQuery<DbWallet>(queries.getByIdQuery(id), this._pool);
        const wallet = res.rows[0];
        return wallet ? this.parseWallet(wallet) : null;
    };

    getUnique: WalletRepoInterface["getUnique"] = async (getUniqueDto) => {
        const res = await runQuery<DbWallet>(queries.getUniqueQuery(getUniqueDto), this._pool);
        const wallet = res.rows[0];
        return wallet ? this.parseWallet(wallet) : null;
    };

    getBusinessWalletByCurrency: WalletRepoInterface["getBusinessWalletByCurrency"] = async (
        businessId,
        currency
    ) => {
        const query = queries.getBusinessWalletByCurrencyQuery(businessId, currency);
        const res = await runQuery<DbWallet>(query, this._pool);
        const businessWallet = res.rows[0];

        return businessWallet ? this.parseWallet(businessWallet) : null;
    };

    incrementBalance: WalletRepoInterface["incrementBalance"] = async (incrementBalanceDto) => {
        await runQuery<DbWallet>(
            queries.incrementBalanceQuery(incrementBalanceDto),
            this._pool,
            (incrementBalanceDto.session as PgSession)?.client
        );
    };
}
