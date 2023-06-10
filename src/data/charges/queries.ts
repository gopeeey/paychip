import {
    AddChargeStackToWalletDto,
    ChargeStackModelInterface,
    ChargeStackModelInterfaceDef,
    GetWalletChargeStackDto,
    WalletChargeStackModelInterface,
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

export const geWalletChargeStackObjectQuery = (dto: GetWalletChargeStackDto) => {
    return SQL`
        SELECT * FROM "walletChargeStacks" 
        WHERE "walletId" = ${dto.walletId} 
        AND "chargeStackId" = ${dto.chargeStackId}
        AND "chargeType" = ${dto.chargeType};
    `;
};

export const getWalletChargeStackQuery = (
    walletId: WalletChargeStackModelInterface["walletId"],
    chargeType: WalletChargeStackModelInterface["chargeType"]
) => {
    return SQL`
        SELECT cs."id", cs."businessId", cs."name", 
        cs."description", cs."charges", cs."paidBy"
        FROM "walletChargeStacks" wcs 
        JOIN "chargeStacks" cs ON wcs."chargeStackId" = cs."id"
        WHERE wcs."walletId" = ${walletId} 
        AND wcs."chargeType" = ${chargeType};
    `;
};
