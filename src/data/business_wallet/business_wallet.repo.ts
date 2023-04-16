import {
    BusinessWalletModelInterface,
    BusinessWalletRepoInterface as BusinessWalletRepoInterface,
} from "@logic/business_wallet";
import { Op, Transaction } from "sequelize";
import { generateId } from "src/utils";
import { bwJson } from "src/__tests__/samples/business_wallet.samples";
import { BusinessWallet } from "./business_wallet.model";
import { Pool } from "pg";
import { PgBaseRepo } from "@data/pg_base_repo";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";

export class BusinessWalletRepo extends PgBaseRepo implements BusinessWalletRepoInterface {
    constructor(private readonly __pool: Pool) {
        super(__pool);
    }

    create: BusinessWalletRepoInterface["create"] = async (createBusinessWalletDto, session) => {
        const data = {
            ...createBusinessWalletDto,
            id: generateId(createBusinessWalletDto.businessId),
        };
        console.log("\n\n\nDATA POINT 1: ", data);
        const query = queries.createBusinessWalletQuery(data);
        const res = await runQuery<BusinessWalletModelInterface>(
            query,
            this.__pool,
            (session as PgSession)?.client
        );
        const businessWallet = res.rows[0];

        return businessWallet;
    };

    getByCurrency: BusinessWalletRepoInterface["getByCurrency"] = async (
        businessId,
        currencyCode
    ) => {
        const query = queries.getByCurrencyQuery(businessId, currencyCode);
        const res = await runQuery<BusinessWalletModelInterface>(query, this.__pool);
        const businessWallet = res.rows[0];

        return businessWallet || null;
    };
}
