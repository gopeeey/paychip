import { CurrencyModelInterface } from "../interfaces";

type RequiredProps = Pick<
    CurrencyModelInterface,
    "name" | "isoCode" | "fundingCs" | "withdrawalCs" | "walletInCs" | "walletOutCs"
>;

export class CreateCurrencyDto implements RequiredProps {
    name: CurrencyModelInterface["name"];
    isoCode: CurrencyModelInterface["isoCode"];
    fundingCs: CurrencyModelInterface["fundingCs"];
    withdrawalCs: CurrencyModelInterface["withdrawalCs"];
    walletInCs: CurrencyModelInterface["walletInCs"];
    walletOutCs: CurrencyModelInterface["walletOutCs"];

    constructor(body: RequiredProps) {
        this.name = body.name;
        this.isoCode = body.isoCode;
        this.fundingCs = body.fundingCs;
        this.withdrawalCs = body.withdrawalCs;
        this.walletInCs = body.walletInCs;
        this.walletOutCs = body.walletOutCs;
    }
}
