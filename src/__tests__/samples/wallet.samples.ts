import { CreateWalletDto, StandardWalletDto } from "../../contracts/dtos";
import { Wallet } from "../../db/models";

export const walletData = new CreateWalletDto({
    businessId: 1234,
    chargeSchemeId: null,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    parentWalletId: null,
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    walletType: "commercial",
});

export const walletObj = new Wallet({ ...walletData, id: "parentwallet" });
export const walletJson = walletObj.toJSON();

export const walletSampleData = {
    noParent: walletData,
    withParent: new CreateWalletDto({ ...walletData, parentWalletId: "parentwallet" }),
};

export const walletObjs = {
    noParent: walletObj,
    withParent: new Wallet(walletSampleData.withParent),
};

export const walletJsons = {
    noParent: walletJson,
    withParent: walletObjs.withParent.toJSON(),
};

export const standardWallet = {
    noParent: new StandardWalletDto(walletJsons.noParent),
    withParent: new StandardWalletDto(walletJsons.withParent),
};
