import {
    AddChargeStackToWalletDto,
    ChargeStackModelInterface,
    ChargeStackModelInterfaceDef,
} from "@logic/charges";
import SQL from "sql-template-strings";

export const createChargeStackQuery = (chargeStack: ChargeStackModelInterface) => {
    return SQL`
        INSERT INTO "chargeStacks" 
        ("id", "businessId", "name", "description", "paidBy", "charges") VALUES
        (
            ${chargeStack.id}, 
            ${chargeStack.businessId}, 
            ${chargeStack.name}, 
            ${chargeStack.description}, 
            ${chargeStack.paidBy},
            ${JSON.stringify(chargeStack.charges)}
        ) RETURNING *;
    `;
};

export const addStackToWalletQuery = (addDto: AddChargeStackToWalletDto) => {
    return SQL`
        INSERT INTO "walletChargeStacks"
        ("chargeStackId", "walletId", "chargeType")
        VALUES (${addDto.chargeStackId}, ${addDto.walletId}, ${addDto.chargeType}) 
        ON CONFLICT ("walletId", "chargeType")
        DO UPDATE SET "chargeStackId" = ${addDto.chargeStackId};
    `;
};

export const getStackByIdQuery = (id: ChargeStackModelInterfaceDef["id"]) => {
    return SQL`SELECT * FROM "chargeStacks" WHERE "id" = ${id};`;
};
