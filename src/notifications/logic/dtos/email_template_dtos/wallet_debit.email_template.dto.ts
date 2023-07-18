type Props = { amount: number; name: string; via: string };

export class WalletDebitEmailTemplateDto implements Props {
    amount: Props["amount"];
    name: Props["name"];
    via: Props["via"];

    constructor({ amount, name, via }: Props) {
        this.amount = amount;
        this.name = name;
        this.via = via;
    }
}
