import { CreateWalletDto } from "../../contracts/dtos";
import { Wallet } from "../../db/models";

export const walletData = new CreateWalletDto({
    businessId: 1234,
    chargeSchemeId: null,
    currency: "NGN",
    email: "sammygopeh@gmail.com",
    parentWalletId: null,
    waiveFundingCharges: false,
    waiveWithdrawalCharges: false,
    walletType: "personal",
});

export const walletObj = new Wallet(walletData);
export const walletJson = walletObj.toJSON();
