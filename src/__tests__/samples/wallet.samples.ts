import { CreateWalletDto, StandardWalletDto } from "@logic/wallet";
import { Wallet } from "@data/wallet";

export const walletData = new CreateWalletDto({
    businessId: 1234,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    walletType: "commercial",
    parentWalletId: null,
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletInCharges: false,
    waiveWalletOutCharges: false,
    fundingChargeSchemeId: null,
    withdrawalChargeSchemeId: null,
    walletInChargeSchemeId: null,
    walletOutChargeSchemeId: null,
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

export const walletSeeder = async () => {};
