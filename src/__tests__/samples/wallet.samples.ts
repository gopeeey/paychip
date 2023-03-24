import { CreateWalletDto, StandardWalletDto } from "@logic/wallet";
import { Wallet } from "@data/wallet";
import { Business } from "@data/business";
import { SeedingError } from "../test_utils";
import { Country } from "@data/country";
import { generateId } from "src/utils";
import { businessSeeder } from "./business.samples";

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

export const walletSeeder = async () => {
    await businessSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("business not found");
    const country = await Country.findByPk(business.countryCode);
    if (!country) throw new SeedingError("country not found");

    const data: CreateWalletDto = {
        businessId: business.id,
        currency: country.currencyCode,
        email: "sammygopeh@gmail.com",
        walletType: "commercial",
        parentWalletId: null,
        waiveFundingCharges: false,
        waiveWithdrawalCharges: false,
        waiveWalletInCharges: false,
        waiveWalletOutCharges: false,
    };

    await Wallet.create({ ...data, id: generateId(business.id) });
};

export const getAWallet = async () => {
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("Wallet not found");
    return wallet;
};
