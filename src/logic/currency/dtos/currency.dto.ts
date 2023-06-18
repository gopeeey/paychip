import { CurrencyModelInterfaceDef } from "../interfaces";

export class CurrencyDto implements CurrencyModelInterfaceDef {
    isoCode: CurrencyModelInterfaceDef["isoCode"];
    name: CurrencyModelInterfaceDef["name"];
    active: CurrencyModelInterfaceDef["active"];
    fundingCs: CurrencyModelInterfaceDef["fundingCs"];
    withdrawalCs: CurrencyModelInterfaceDef["withdrawalCs"];
    walletInCs: CurrencyModelInterfaceDef["walletInCs"];
    walletOutCs: CurrencyModelInterfaceDef["walletOutCs"];

    constructor(body: CurrencyModelInterfaceDef) {
        this.isoCode = body.isoCode;
        this.name = body.name;
        this.active = body.active;
        this.fundingCs = body.fundingCs;
        this.withdrawalCs = body.withdrawalCs;
        this.walletInCs = body.walletInCs;
        this.walletOutCs = body.walletOutCs;
    }
}
