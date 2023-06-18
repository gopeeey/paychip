import {
    BusinessWalletDto,
    BusinessWalletModelInterface,
    BusinessWalletModelInterfaceDef,
    BusinessWalletRepoInterface as BusinessWalletRepoInterface,
} from "@business_wallet/logic";
import { generateId } from "src/utils";
import { Pool } from "pg";
import { PgBaseRepo } from "@data/pg_base_repo";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";

export interface DbBusinessWallet
    extends Omit<
        BusinessWalletModelInterfaceDef,
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

export class BusinessWalletRepo extends PgBaseRepo implements BusinessWalletRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    parseBusinessWallet = (data: DbBusinessWallet) => {
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

        return new BusinessWalletDto({
            ...data,
            customFundingCs: customFundingCs ? JSON.parse(customFundingCs) : null,
            customWithdrawalCs: customWithdrawalCs ? JSON.parse(customWithdrawalCs) : null,
            customWalletInCs: customWalletInCs ? JSON.parse(customWalletInCs) : null,
            customWalletOutCs: customWalletOutCs ? JSON.parse(customWalletOutCs) : null,
            w_fundingCs: w_fundingCs ? JSON.parse(w_fundingCs) : null,
            w_withdrawalCs: w_withdrawalCs ? JSON.parse(w_withdrawalCs) : null,
            w_walletInCs: w_walletInCs ? JSON.parse(w_walletInCs) : null,
            w_walletOutCs: w_walletOutCs ? JSON.parse(w_walletOutCs) : null,
        });
    };

    create: BusinessWalletRepoInterface["create"] = async (createBusinessWalletDto, session) => {
        const data = {
            ...createBusinessWalletDto,
            id: generateId(createBusinessWalletDto.businessId),
        };

        const query = queries.createBusinessWalletQuery(data);
        const res = await runQuery<DbBusinessWallet>(
            query,
            this._pool,
            (session as PgSession)?.client
        );
        const businessWallet = res.rows[0];

        return this.parseBusinessWallet(businessWallet);
    };

    getByCurrency: BusinessWalletRepoInterface["getByCurrency"] = async (
        businessId,
        currencyCode
    ) => {
        const query = queries.getByCurrencyQuery(businessId, currencyCode);
        const res = await runQuery<DbBusinessWallet>(query, this._pool);
        const businessWallet = res.rows[0];

        return businessWallet ? this.parseBusinessWallet(businessWallet) : null;
    };
}
