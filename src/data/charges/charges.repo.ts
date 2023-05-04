import { ChargeStackModelInterface } from "@logic/charges";
import { ChargesRepoInterface } from "@logic/charges/interfaces/charges_repo.interface";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@data/pg_base_repo";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";

export class ChargesRepo extends PgBaseRepo implements ChargesRepoInterface {
    constructor(private readonly __pool: Pool) {
        super(__pool);
    }

    createChargeStack: ChargesRepoInterface["createChargeStack"] = async (
        createChargeStackDto,
        session
    ) => {
        const res = await runQuery<ChargeStackModelInterface>(
            queries.createChargeStackQuery({
                ...createChargeStackDto,
                id: generateId(createChargeStackDto.businessId),
            }),
            this.__pool,
            (session as PgSession)?.client
        );

        return res.rows[0];
    };

    addStackToWallet: ChargesRepoInterface["addStackToWallet"] = async (addStackDto) => {
        await runQuery(queries.addStackToWalletQuery(addStackDto), this.__pool);
    };

    getStackById: ChargesRepoInterface["getStackById"] = async (stackId) => {
        const res = await runQuery<ChargeStackModelInterface>(
            queries.getStackByIdQuery(stackId),
            this.__pool
        );
        return res.rows[0] || null;
    };
}
