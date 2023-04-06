import { BusinessWalletRepoInterface as BwRepoInterface } from "@logic/business_wallet";
import { Op, Transaction } from "sequelize";
import { generateId } from "src/utils";
import { bwJson } from "src/__tests__/samples/business_wallet.samples";
import { BusinessWallet } from "./business_wallet.model";

export class BusinessWalletRepo implements BwRepoInterface {
    create: BwRepoInterface["create"] = async (createBusinessWalletDto, session) => {
        const bw = await BusinessWallet.create(
            {
                ...createBusinessWalletDto,
                id: generateId(createBusinessWalletDto.businessId),
            },
            { transaction: session as Transaction }
        );

        return bw.toJSON();
    };

    getByCurrency: BwRepoInterface["getByCurrency"] = async (businessId, currencyCode) => {
        const bw = await BusinessWallet.findOne({ where: { businessId, currencyCode } });
        return bw ? bw.toJSON() : null;
    };
}
