import { CreateWalletDto, StandardWalletDto } from "@logic/wallet";
import { Wallet } from "@data/wallet";
import { Business } from "@data/business";
import { SeedingError } from "../test_utils";
import { Country } from "@data/country";
import { generateId } from "src/utils";
import { bwJson, bwSeeder } from "./business_wallet.samples";
import { BusinessWallet } from "@data/business_wallet";

export const walletData = new CreateWalletDto({
    businessId: 1234,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    bwId: bwJson.id,
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    waiveWalletInCharges: false,
    waiveWalletOutCharges: false,
});

export const walletObj = new Wallet({ ...walletData, id: "parentwallet" });
export const walletJson = walletObj.toJSON();

export const standardWallet = new StandardWalletDto(walletJson);

export const walletSeeder = async () => {
    await bwSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("business not found");
    const businessWallet = await BusinessWallet.findOne({ where: { businessId: business.id } });
    if (!businessWallet) throw new SeedingError("business wallet not found");
    const country = await Country.findByPk(business.countryCode);
    if (!country) throw new SeedingError("country not found");

    const data = new CreateWalletDto({
        businessId: business.id,
        currency: country.currencyCode,
        bwId: businessWallet.id,
        email: "sammygopeh@gmail.com",
        waiveFundingCharges: false,
        waiveWithdrawalCharges: false,
        waiveWalletInCharges: false,
        waiveWalletOutCharges: false,
    });

    await Wallet.create({ ...data, id: generateId(business.id) });
};

export const getAWallet = async () => {
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("Wallet not found");
    return wallet;
};
