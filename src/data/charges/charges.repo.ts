import { ChargeStackDto, ChargeStackModelInterface } from "@logic/charges";
import { ChargesRepoInterface } from "@logic/charges/interfaces/charges_repo.interface";
import { generateId } from "src/utils";
import { PgBaseRepo } from "@data/pg_base_repo";
import { Pool } from "pg";
import { runQuery } from "@data/db";
import * as queries from "./queries";
import { PgSession } from "@data/pg_session";

export interface DbChargeStack extends Omit<ChargeStackModelInterface, "charges"> {
    charges: string;
}

export class ChargesRepo extends PgBaseRepo implements ChargesRepoInterface {
    constructor(private readonly _pool: Pool) {
        super(_pool);
    }

    parseChargeStack = (rawData: DbChargeStack) => {
        const parsedCharges = JSON.parse(rawData.charges);
        return new ChargeStackDto({ ...rawData, charges: parsedCharges });
    };

    createChargeStack: ChargesRepoInterface["createChargeStack"] = async (
        createChargeStackDto,
        session
    ) => {
        const res = await runQuery<DbChargeStack>(
            queries.createChargeStackQuery({
                ...createChargeStackDto,
                id: generateId(createChargeStackDto.businessId),
            }),
            this._pool,
            (session as PgSession)?.client
        );

        return this.parseChargeStack(res.rows[0]);
    };

    addStackToWallet: ChargesRepoInterface["addStackToWallet"] = async (addStackDto) => {
        await runQuery(queries.addStackToWalletQuery(addStackDto), this._pool);
    };

    getStackById: ChargesRepoInterface["getStackById"] = async (stackId) => {
        const res = await runQuery<DbChargeStack>(queries.getStackByIdQuery(stackId), this._pool);
        const row = res.rows[0];
        return row ? this.parseChargeStack(row) : null;
    };

    getWalletChargeStack: ChargesRepoInterface["getWalletChargeStack"] = async (
        walletId,
        chargeType
    ) => {
        const query = queries.getWalletChargeStackQuery(walletId, chargeType);
        const res = await runQuery<DbChargeStack>(query, this._pool);
        const chargeStack = res.rows[0];
        return chargeStack ? this.parseChargeStack(chargeStack) : null;
    };
}
