import { BusinessWalletRepoInterface } from "@logic/business_wallet";
import { generateId } from "src/utils";
import { bwJson } from "src/__tests__/samples/business_wallet.samples";
import { BusinessWallet } from "./business_wallet.model";

export class BusinessWalletRepo implements BusinessWalletRepoInterface {
    create: BusinessWalletRepoInterface["create"] = async (createBusinessWalletDto, session) => {
        const bw = await BusinessWallet.create({
            ...createBusinessWalletDto,
            id: generateId(createBusinessWalletDto.businessId),
        });

        return bw.toJSON();
    };
}
