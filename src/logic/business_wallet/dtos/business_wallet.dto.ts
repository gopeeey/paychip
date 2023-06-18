import { BusinessWalletModelInterfaceDef } from "../interfaces";

export class BusinessWalletDto implements BusinessWalletModelInterfaceDef {
    id: BusinessWalletModelInterfaceDef["id"];
    businessId: BusinessWalletModelInterfaceDef["businessId"];
    currencyCode: BusinessWalletModelInterfaceDef["currencyCode"];
    balance: BusinessWalletModelInterfaceDef["balance"];
    customFundingCs: BusinessWalletModelInterfaceDef["customFundingCs"];
    customWithdrawalCs: BusinessWalletModelInterfaceDef["customWithdrawalCs"];
    customWalletInCs: BusinessWalletModelInterfaceDef["customWalletInCs"];
    customWalletOutCs: BusinessWalletModelInterfaceDef["customWalletOutCs"];
    fundingChargesPaidBy: BusinessWalletModelInterfaceDef["fundingChargesPaidBy"];
    withdrawalChargesPaidBy: BusinessWalletModelInterfaceDef["withdrawalChargesPaidBy"];
    w_fundingCs: BusinessWalletModelInterfaceDef["w_fundingCs"];
    w_withdrawalCs: BusinessWalletModelInterfaceDef["w_withdrawalCs"];
    w_walletInCs: BusinessWalletModelInterfaceDef["w_walletInCs"];
    w_walletOutCs: BusinessWalletModelInterfaceDef["w_walletOutCs"];
    w_fundingChargesPaidBy: BusinessWalletModelInterfaceDef["w_fundingChargesPaidBy"];
    w_withdrawalChargesPaidBy: BusinessWalletModelInterfaceDef["w_withdrawalChargesPaidBy"];

    constructor(body: BusinessWalletModelInterfaceDef) {
        this.id = body.id;
        this.businessId = body.businessId;
        this.currencyCode = body.currencyCode;
        this.balance = body.balance;
        this.customFundingCs = body.customFundingCs;
        this.customWithdrawalCs = body.customWithdrawalCs;
        this.customWalletInCs = body.customWalletInCs;
        this.customWalletOutCs = body.customWalletOutCs;
        this.fundingChargesPaidBy = body.fundingChargesPaidBy;
        this.withdrawalChargesPaidBy = body.withdrawalChargesPaidBy;
        this.w_fundingCs = body.w_fundingCs;
        this.w_withdrawalCs = body.w_withdrawalCs;
        this.w_walletInCs = body.w_walletInCs;
        this.w_walletOutCs = body.w_walletOutCs;
        this.w_fundingChargesPaidBy = body.w_fundingChargesPaidBy;
        this.w_withdrawalChargesPaidBy = body.w_withdrawalChargesPaidBy;
    }
}
